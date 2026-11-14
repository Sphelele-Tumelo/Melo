import asyncio
from types import SimpleNamespace
from uuid import uuid4
from unittest.mock import AsyncMock, Mock

from app.core.enum import MeloModel
from app.services import chatservice
from schemas.chat import MessageCreate


class FakeChat:
    def __init__(self, **kwargs):
        self.id = uuid4()
        self.kwargs = kwargs


class FakeProvider:
    def __init__(self, streams):
        self.streams = iter(streams)

    def stream_chat(self, _messages):
        return next(self.streams)


def _async_stream(*chunks):
    async def stream():
        for chunk in chunks:
            yield chunk

    return stream()


def _test_dependencies(monkeypatch, provider):
    conversation_id = uuid4()
    user_id = uuid4()
    db = SimpleNamespace(
        add=Mock(),
        commit=AsyncMock(),
        refresh=AsyncMock(),
        rollback=AsyncMock(),
    )
    monkeypatch.setattr(
        chatservice,
        "_prepare_turn",
        AsyncMock(return_value=([{"role": "user", "content": "hello"}], [])),
    )
    monkeypatch.setattr(chatservice, "get_model_provider", Mock(return_value=provider))
    monkeypatch.setattr(chatservice, "Chat", FakeChat)
    return db, conversation_id, user_id


def _run_stream(db, conversation_id, user_id):
    async def collect():
        return [
            event
            async for event in chatservice.create_message_stream(
                db=db,
                conversation_id=conversation_id,
                user_id=user_id,
                message_data=MessageCreate(content="hello"),
                model=MeloModel.SWIFT,
            )
        ]

    return asyncio.run(collect())


def test_stream_success(monkeypatch):
    provider = FakeProvider([_async_stream("hello", " world")])
    db, conversation_id, user_id = _test_dependencies(monkeypatch, provider)

    events = _run_stream(db, conversation_id, user_id)

    assert any('"content": "hello"' in event for event in events)
    assert any("event: done" in event and '"message_id"' in event for event in events)
    db.commit.assert_awaited_once()


def test_stream_timeout_sends_error_and_terminal(monkeypatch):
    async def never_finishes():
        await asyncio.Event().wait()
        yield "unreachable"

    monkeypatch.setattr(chatservice, "FIRST_TOKEN_TIMEOUT_SECONDS", 0.01)
    monkeypatch.setattr(chatservice, "TOTAL_STREAM_TIMEOUT_SECONDS", 0.1)
    provider = FakeProvider([never_finishes()])
    db, conversation_id, user_id = _test_dependencies(monkeypatch, provider)

    events = _run_stream(db, conversation_id, user_id)

    assert any('"code": "timeout"' in event for event in events)
    assert events[-1].startswith("event: done")
    db.commit.assert_not_awaited()


def test_stream_retries_rate_limit_once_before_token(monkeypatch):
    class FakeRateLimitError(Exception):
        pass

    monkeypatch.setattr(chatservice, "RateLimitError", FakeRateLimitError)
    monkeypatch.setattr(chatservice, "RATE_LIMIT_RETRY_BACKOFF_SECONDS", 0)

    async def rate_limited():
        raise FakeRateLimitError("provider raw rate limit")
        yield "unreachable"

    provider = FakeProvider([rate_limited(), _async_stream("recovered")])
    db, conversation_id, user_id = _test_dependencies(monkeypatch, provider)

    events = _run_stream(db, conversation_id, user_id)

    assert any('"content": "recovered"' in event for event in events)
    assert any("event: done" in event and '"message_id"' in event for event in events)


def test_provider_error_is_sanitized_and_terminated(monkeypatch):
    async def broken():
        raise RuntimeError("sensitive provider response")
        yield "unreachable"

    provider = FakeProvider([broken()])
    db, conversation_id, user_id = _test_dependencies(monkeypatch, provider)

    events = _run_stream(db, conversation_id, user_id)
    response = "".join(events)

    assert '"code": "internal"' in response
    assert "sensitive provider response" not in response
    assert "event: done" in events[-1]
    db.commit.assert_not_awaited()

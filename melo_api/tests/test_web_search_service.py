import asyncio

import httpx

from app.services import web_search_service


class MockResponse:
    def __init__(self, status_code, data=None):
        self.status_code = status_code
        self._data = data or {}

    def raise_for_status(self):
        if self.status_code >= 400:
            request = httpx.Request("GET", "http://localhost:8000/tools/search")
            response = httpx.Response(self.status_code, request=request)
            raise httpx.HTTPStatusError(
                f"HTTP {self.status_code}",
                request=request,
                response=response,
            )

    def json(self):
        return self._data


class MockAsyncClient:
    def __init__(self, response=None, error=None):
        self.response = response
        self.error = error

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        return False

    async def get(self, url, params):
        assert url == "http://localhost:8000/tools/search"
        assert params["q"] == "private search query"
        if self.error:
            raise self.error
        return self.response


def _fetch(monkeypatch, response=None, error=None):
    monkeypatch.setattr(web_search_service, "TOOLS_URL", "http://localhost:8000/")
    monkeypatch.setattr(
        web_search_service.httpx,
        "AsyncClient",
        lambda **kwargs: MockAsyncClient(response=response, error=error),
    )
    return asyncio.run(
        web_search_service.fetch_web_context("private search query")
    )


def test_http_404_returns_unavailable_note(monkeypatch, caplog):
    context, sources = _fetch(monkeypatch, response=MockResponse(404))

    assert context == web_search_service.SEARCH_UNAVAILABLE_NOTE
    assert sources == []
    assert "status_code=404" in caplog.text
    assert "http://localhost:8000/tools/search" in caplog.text
    assert "private search query" not in caplog.text


def test_timeout_returns_unavailable_note(monkeypatch, caplog):
    context, sources = _fetch(
        monkeypatch,
        error=httpx.TimeoutException("timed out"),
    )

    assert context == web_search_service.SEARCH_UNAVAILABLE_NOTE
    assert sources == []
    assert "status_code=timeout" in caplog.text


def test_empty_results_returns_unavailable_note(monkeypatch):
    context, sources = _fetch(
        monkeypatch,
        response=MockResponse(200, {"results": []}),
    )

    assert context == web_search_service.SEARCH_UNAVAILABLE_NOTE
    assert sources == []


def test_search_results_return_context_without_unavailable_note(monkeypatch):
    context, sources = _fetch(
        monkeypatch,
        response=MockResponse(
            200,
            {
                "results": [
                    {
                        "title": "Example result",
                        "url": "https://example.com/article",
                        "snippet": "Current information",
                    }
                ]
            },
        ),
    )

    assert "WEB SEARCH RESULTS" in context
    assert web_search_service.SEARCH_UNAVAILABLE_NOTE not in context
    assert len(sources) == 1

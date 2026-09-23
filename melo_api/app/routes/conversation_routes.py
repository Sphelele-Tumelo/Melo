from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from schemas.conversation import ConversationCreate
from sqlalchemy.ext.asyncio import AsyncSession

from ..controllers.conversation_controller import (
    create_conversation_controller,
    delete_conversation_controller,
    get_conversation_controller,
    get_conversations_controller,
    update_conversation_controller,
)
from ..core.dependencies import get_current_user
from ..data.database import get_db
from ..models.user import User

router = APIRouter(prefix="/conversation", tags=["Conversation"])

DB_DEPENDENCY = Depends(get_db)
CURRENT_USER = Depends(get_current_user)


@router.post("/create_conversation", status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_data: ConversationCreate | None = None,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        new_conversation = await create_conversation_controller(
            db=db,
            user_id=current_user.id,
            conversation_data=conversation_data or ConversationCreate(),
        )

        return {
            "message": "Conversation created successfully",
            "conversation_id": str(new_conversation.id),
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/get_conversations", status_code=status.HTTP_200_OK)
async def get_conversations(
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        conversations = await get_conversations_controller(
            db=db,
            user_id=current_user.id,
        )

        return {
            "message": "Conversations retrieved successfully",
            "conversations": conversations,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/get_conversation/{conversation_id}", status_code=status.HTTP_200_OK)
async def get_conversation(
    conversation_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        conversation = await get_conversation_controller(
            db=db,
            user_id=current_user.id,
            conversation_id=conversation_id,
        )

        if conversation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )

        return {
            "message": "Conversation retrieved successfully",
            "conversation": conversation,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )



@router.delete(
    "/delete_conversation/{conversation_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_conversation(
    conversation_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        await delete_conversation_controller(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )

        return {
            "message": "Conversation deleted successfully",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )



@router.put("/update_conversation", status_code=status.HTTP_200_OK)
async def update_conversation(
    conversation_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        conversation = await update_conversation_controller(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )

        return {
            "message": "Conversation updated successfully",
            "conversation": conversation,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

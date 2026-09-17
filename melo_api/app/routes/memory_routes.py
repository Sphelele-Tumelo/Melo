from uuid import UUID

from app.controllers.memory_controller import (
    create_memory_controller,
    delete_memory_controller,
    get_memories_controller,
    get_memory_controller,
    update_memory_controller,
)
from app.core.dependencies import get_current_user
from app.data.database import get_db
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.memory import (
    MemoryCreate,
    MemoryResponse,
    MemoryUpdate,
)
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Memory"])

# Every memory request must include: Authorization: Bearer <raw JWT>
# Do not wrap the JWT in quotes. Create-memory JSON body: {"content": "...", "memory_type": "general"}
DB_DEPENDENCY = Depends(get_db)
CURRENT_USER = Depends(get_current_user)


@router.post(
    "/create_memory",
    response_model=MemoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_memory(
    memory_data: MemoryCreate,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        memory = await create_memory_controller(
            db=db,
            user_id=current_user.id,
            memory_data=memory_data,
        )

        return memory

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/get_memories",
    response_model=list[MemoryResponse],
    status_code=status.HTTP_200_OK,
)
async def get_memories(
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        memories = await get_memories_controller(
            db=db,
            user_id=current_user.id,
        )

        return memories

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/get_memory/{memory_id}",
    response_model=MemoryResponse,
    status_code=status.HTTP_200_OK,
)
async def get_memory(
    memory_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        memory = await get_memory_controller(
            db=db,
            memory_id=memory_id,
            user_id=current_user.id,
        )

        if memory is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Memory not found",
            )

        return memory

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put(
    "/update_memory/{memory_id}",
    response_model=MemoryResponse,
    status_code=status.HTTP_200_OK,
)
async def update_memory(
    memory_id: UUID,
    memory_data: MemoryUpdate,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        memory = await update_memory_controller(
            db=db,
            memory_id=memory_id,
            user_id=current_user.id,
            memory_data=memory_data,
        )

        return memory

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/delete_memory/{memory_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_memory(
    memory_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        await delete_memory_controller(
            db=db,
            memory_id=memory_id,
            user_id=current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
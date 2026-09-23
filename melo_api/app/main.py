

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.chat_routes import router as chat_router
from .routes.conversation_routes import router as conversation_router
from .routes.memory_routes import router as memory_router
from .routes.user_routes import router as user_router

app = FastAPI()

#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",  # add this too, in case Vite ever serves on 127.0.0.1 instead of localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(conversation_router)
app.include_router(memory_router)
app.include_router(chat_router)
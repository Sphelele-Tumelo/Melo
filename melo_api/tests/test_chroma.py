from app.data.chroma import ChromaDatabase
from app.services.embeddings_service import EmbeddingService

chroma = ChromaDatabase()
embedding_service = EmbeddingService()


memories = [
    {
        "id": "test-memory-2",
        "content": "Melo is building NeoMind, an AI software company.",
        "type": "general",
    },
    {
        "id": "test-memory-3",
        "content": "Melo prefers backend development with Python and .NET.",
        "type": "preference",
    },
    {
        "id": "test-memory-4",
        "content": "Melo is learning machine learning and neural networks.",
        "type": "learning",
    },
]


for memory in memories:
    embedding = embedding_service.generate_embedding(memory["content"])

    chroma.add_memory(
        memory_id=memory["id"],
        user_id="test-user-1",
        content=memory["content"],
        embedding=embedding,
        memory_type=memory["type"],
    )


query = "What kind of company am I building?"

query_embedding = embedding_service.generate_embedding(query)

results = chroma.search_memories(
    embedding=query_embedding,
    user_id="test-user-1",
    limit=3,
)


print(results)
import os

import chromadb


class ChromaDatabase:
    def __init__(self):
        # Uses Railway's mounted volume path in production;
        # falls back to a local folder when running locally
        # (RAILWAY_VOLUME_MOUNT_PATH won't exist outside Railway).
        chroma_path = os.getenv("RAILWAY_VOLUME_MOUNT_PATH", "./chroma_data")

        self.client = chromadb.PersistentClient(path=chroma_path)

        self.memory_collection = self.client.get_or_create_collection(
            name="memories"
        )

    def add_memory(
        self,
        memory_id: str,
        user_id: str,
        content: str,
        embedding: list[float],
        memory_type: str,
    ):
        self.memory_collection.add(
            ids=[memory_id],
            embeddings=[embedding],
            documents=[content],
            metadatas=[
                {
                    "user_id": user_id,
                    "memory_type": memory_type,
                }
            ],
        )

    def update_memory(
        self,
        memory_id: str,
        user_id: str,
        content: str,
        embedding: list[float],
        memory_type: str,
    ):
        self.memory_collection.update(
            ids=[memory_id],
            embeddings=[embedding],
            documents=[content],
            metadatas=[
                {
                    "user_id": user_id,
                    "memory_type": memory_type,
                }
            ],
        )

    def delete_memory(self, memory_id: str):
        self.memory_collection.delete(ids=[memory_id])

    def search_memories(
        self,
        embedding: list[float],
        user_id: str,
        limit: int = 5,
    ):
        results = self.memory_collection.query(
            query_embeddings=[embedding],
            n_results=limit,
            where={"user_id": user_id},
        )

        return results
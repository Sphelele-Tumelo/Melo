import chromadb


class ChromaDatabase:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./chroma_data")

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
        # Chroma's .update() replaces the record in place for a given id —
        # no need to delete first. If the id doesn't exist yet, this is a no-op,
        # so create_memory must always run before update_memory for a given id.
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
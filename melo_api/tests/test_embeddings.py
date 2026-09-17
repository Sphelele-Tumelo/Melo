from app.services.embeddings_service import EmbeddingService

embedding_service = EmbeddingService()

vector = embedding_service.generate_embedding(
    "My name is Melo and I'm building NeoMind."
)

print(type(vector))
print(len(vector))
print(vector[:5])
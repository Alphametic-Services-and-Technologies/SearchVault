import logging
import os
import uuid

from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance, Filter, FieldCondition, MatchValue, FilterSelector

logging.basicConfig(level=logging.INFO)

QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

VECTOR_SIZE = 768  # For BGE-base

def ensure_collection(tenant_id: str):
    collection_name = f"tenant_{tenant_id}"
    if not client.collection_exists(collection_name):
        client.create_collection(collection_name=collection_name,
                                 vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE))
    return collection_name


def upsert(vectors: list[dict], tenant_id: str, doc_title: str, middleware_id: str):
    collection = ensure_collection(tenant_id)

    logging.info("upsert in qdrant")

    points = []
    for item in vectors:
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=item["vector"],
            payload={
                "text": item["text"],
                "tenant_id": tenant_id,
                "doc_title": doc_title,
                "middleware_id": middleware_id
            }
        )
        points.append(point)

    client.upsert(collection_name=collection, points=points)


def delete_document(tenant_id: str, middleware_id: str):
    """
    Delete all points in a tenant collection matching a middleware_id.
    """
    collection = ensure_collection(tenant_id)

    doc_filter = Filter(
        must=[
            FieldCondition(key="middleware_id", match=MatchValue(value=middleware_id)),
            FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id)),
        ]
    )

    result = client.delete(
        collection_name=collection,
        points_selector=FilterSelector(filter=doc_filter),
        wait=True
    )

    logging.info(f"Deleted document with middleware_id={middleware_id} in {collection}")
    return result


def search_similar_chunks(tenant: str, query_vector: list[float], top_k: int = 4):
    collection_name = f"tenant_{tenant}"

    search_result = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        limit=top_k,
        with_payload=True,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="tenant_id",
                    match=MatchValue(value=tenant)
                )
            ]
        )
    )

    return search_result

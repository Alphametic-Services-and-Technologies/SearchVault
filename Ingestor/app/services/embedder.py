import logging
from typing import List, Literal
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO)

MODEL_ID = "mixedbread-ai/mxbai-embed-large-v1"
_model = SentenceTransformer(MODEL_ID)

def _apply_instruction(texts: List[str], kind: Literal["document","query"]) -> List[str]:
    """
    Add instruction prefixes recommended for instruction-tuned embedding models.
    """
    if kind == "document":
        prefix = "Represent the document for retrieval: "
    else:  # "query"
        prefix = "Represent this sentence for searching relevant passages: "
    return [prefix + t for t in texts]

def embed(chunks: list[str]) -> list[dict]:
    """
        Embeds each chunk using BGE model.
        Returns a list of dicts with 'text' and 'vector'.
    """

    embeddings = []

    for chunk in chunks:
        # Add BGE prompt (recommended)
        prompt = "Represent this document for retrieval: " + chunk

        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
        outputs = model(**inputs)

        cls_embedding = outputs.last_hidden_state[:, 0]
        norm_vector = torch.nn.functional.normalize(cls_embedding, p=2, dim=1).squeeze().tolist()

        logging.info(f"embed in embedder: {type(norm_vector)} - {type(norm_vector[0])} - {len(norm_vector)}")

        embeddings.append({
            "text": chunk,
            "vector": norm_vector
        })

    return embeddings
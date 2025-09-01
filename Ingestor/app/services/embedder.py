import logging
from transformers import AutoTokenizer
from typing import List, Literal
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO)

MODEL_ID = "mixedbread-ai/mxbai-embed-large-v1"
tok = AutoTokenizer.from_pretrained(MODEL_ID)
_model = SentenceTransformer(MODEL_ID)

def _apply_instruction(text: str, kind: Literal["document","query"]) -> List[str]:
    """
    Add instruction prefixes recommended for instruction-tuned embedding models.
    """
    if kind == "document":
        prefix = "Represent the document for retrieval: "
    else:  # "query"
        prefix = "Represent this sentence for searching relevant passages: "
    return prefix + text

def embed(texts: List[str], kind: Literal["document","query"]="document") -> List[dict]:
    """
    Returns list of dicts: {"text": <original>, "vector": List[float]}
    - kind="document" for ingestion
    - kind="query" for user question
    """
    assert len(texts) > 0
    safe_texts = []
    for i, t in enumerate(texts):
        ids = tok.encode(t, add_special_tokens=False)
        if len(ids) > 512:
            logging.warning(f"[embed] chunk {i} has {len(ids)} tokens > 512; truncating")
            t = tok.decode(ids[:512], skip_special_tokens=True)
        safe_texts.append(t)
    vecs = _model.encode(safe_texts, normalize_embeddings=True).tolist()
    return [{"text": t, "vector": v} for t, v in zip(safe_texts, vecs)]
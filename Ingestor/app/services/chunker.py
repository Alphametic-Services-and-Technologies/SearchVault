from transformers import AutoTokenizer
import logging

logging.basicConfig(level=logging.INFO)

MODEL_NAME = "BAAI/bge-base-en"  # it is purpose-built for document-level retrieval, often used in real RAG systems.
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


def chunk_text(
        text: str,
        max_tokens: int = 256,
        overlap: int = 64) -> list[str]:
    tokens = tokenizer.encode(text, add_special_tokens=False)
    chunks = []

    logging.info(f"Token count: {len(tokens)}")

    start = 0
    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk_tokens = tokens[start:end]

        if not chunk_tokens:
            break  # Prevent empty chunk errors

        chunk_token = tokenizer.decode(chunk_tokens).strip()

        if chunk_token:
            logging.info(f"Chunk {len(chunks) + 1} [{start}:{end}]: {repr(chunk_token[:80])}...")
            chunks.append(chunk_token)

        start += max_tokens - overlap

    return chunks

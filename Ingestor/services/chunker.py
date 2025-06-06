from transformers import AutoTokenizer

MODEL_NAME = "BAAI/bge-base-en" # it is purpose-built for document-level retrieval, often used in real RAG systems.
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def check_text(
        text: str,
        max_tokens: int = 300,
        overlap: int = 50) -> list[str]:

    tokens = tokenizer.encode(text, add_special_tokens=False)
    chunks = []

    start = 0
    while start < len(text):
        end = min(start + max_tokens, len(tokens))
        chunk_tokens = text[start:end]
        chunk_text = tokenizer.decode(chunk_tokens)
        chunks.append(chunk_text)
        start += max_tokens - overlap

    return chunks
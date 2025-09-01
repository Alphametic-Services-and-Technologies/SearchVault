from transformers import AutoTokenizer
import logging

logging.basicConfig(level=logging.INFO)

MODEL_NAME = "mixedbread-ai/mxbai-embed-large-v1"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


def chunk_text(
    text: str,
    max_tokens: int = 256,
    overlap: int = 64
) -> list[str]:
    # Clamp to model max (BGE is 512)
    model_max = getattr(tokenizer, "model_max_length", 512) or 512
    if max_tokens > model_max:
        max_tokens = model_max

    # Prevent infinite loop / negative advance
    if overlap >= max_tokens:
        logging.warning(f"overlap ({overlap}) >= max_tokens ({max_tokens}); adjusting overlap to {max_tokens - 1}")
        overlap = max_tokens - 1
    if overlap < 0:
        logging.warning(f"overlap ({overlap}) < 0; setting to 0")
        overlap = 0

    tokens = tokenizer.encode(text, add_special_tokens=False)
    logging.info(f"Token count: {len(tokens)}")

    chunks: list[str] = []
    start = 0
    step = max_tokens - overlap

    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk_tokens = tokens[start:end]
        if not chunk_tokens:
            break

        chunked_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True).strip()
        if chunked_text:
            chunks.append(chunked_text)
            logging.info(f"Chunk {len(chunks)} [{start}:{end}] "
                         f"({len(chunk_tokens)} tok): {repr(chunked_text[:80])}...")
        else:
            logging.debug(f"Empty/whitespace chunk at [{start}:{end}] skipped.")

        start += step

    return chunks

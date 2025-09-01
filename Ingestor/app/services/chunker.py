from langchain_text_splitters import RecursiveCharacterTextSplitter
import logging
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("mixedbread-ai/mxbai-embed-large-v1")  # or your model

logging.basicConfig(level=logging.INFO)

def chunk_text(
    text: str,
    max_tokens: int = 256,
    overlap: int = 64
) -> list[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=max_tokens,
        chunk_overlap=overlap,
        separators=["\n\n", "\n", ".", "?", "!", " ", ""],
        length_function=lambda s: len(tokenizer.encode(s, add_special_tokens=False)),
    )
    logging.info("In the chunker now")
    return text_splitter.split_text(text)

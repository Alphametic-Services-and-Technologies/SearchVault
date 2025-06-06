from transformers import AutoTokenizer, AutoModel
import torch

MODEL_NAME = "BAAI/bge-base-en"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
model.eval() # This tells PyTorch: “I’m not training — just give me stable, clean outputs.”

@torch.no_grad() # torch.no_grad() is a PyTorch decorator that disables gradient tracking. Normally, PyTorch tracks all operations to compute gradients for training. But during inference (prediction), you don’t need gradients

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

        embeddings.append({
            "text": chunk,
            "vector": norm_vector
        })

    return embeddings
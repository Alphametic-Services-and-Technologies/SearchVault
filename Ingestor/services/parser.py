from fastapi import UploadFile
import fitz
import io
import docx
import pandas as pd

async def extract_text(file: UploadFile) -> str:
    content = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_dpf(content)
    elif filename.endswith(".docx"):
        return extract_docx(content)
    elif filename.endswith(".xlsx"):
        return extract_excel(content)
    elif filename.endswith(".txt"):
        return content.encode("utf-8")
    else:
        raise Exception(f"Unsupported file type: {filename}")

def extract_dpf(content: bytes) -> str:
    text = ""
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text += page.getText()
    return text

def extract_docx(content: bytes) -> str:
    doc = docx.Document(io.BytesIO(content))
    return "\n".join([p.text for p in doc.paragraphs])

def extract_excel(content: bytes) -> str:
    df = pd.read_excel(io.BytesIO(content), sheet_name=None)
    combined = []
    for sheet_name, sheet_df in df.items():
        combined.append(f"--- Sheet {sheet_name} ---")
        combined.append(sheet_df.to_string(index=False))
    return "\n\n".join(combined)
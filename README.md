# 🚀 SearchVault

**SearchVault** is a modular, multi-tenant AI system that empowers companies with a secure, private, and chat-based interface to search internal documents and knowledge — powered by **local LLMs**, **vector embeddings**, and **RAG (Retrieval-Augmented Generation)**.

> 🎯 Ideal for organizations looking to own their internal AI tools without sacrificing privacy.

<img width="462" alt="SearchVault_Systemdesign" src="https://github.com/user-attachments/assets/da81b3ef-1a95-4e43-8590-102111de7d05" />

---

## 🔧 Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Mistral](https://img.shields.io/badge/Mistral-000000?logo=data:image/svg+xml;base64,...&labelColor=black&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-6F4E7C?logo=data:image/svg+xml;base64,...&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

---

## 🔍 1. Overview: Core Features

- ✅ **Local LLM** (Mistral via Ollama)
- ✅ **Admin Panel** to upload & manage documents (PDFs, docs)
- ✅ **ChatGPT-like Interface** for internal Q&A
- ✅ **Multilingual**
- ✅ **Multi-tenant support**
- ✅ **Secure and private** (runs fully on-premise)

---

## 🧩 2. Key Components

### 🖥️ Frontend (React)
- Chat UI (ChatGPT-style)
- Admin panel for document upload
- Language toggle (i18n)
- Tenant-scoped views

### 🔗 API Gateway (.NET)
- Auth (JWT)
- Routes chat/doc actions to Python backend
- Manages tenants and permissions
- Serves user/session isolation

### 🧠 RAG Backend (Python)
- Chunking & embedding via models like `all-MiniLM-L6-v2`
- Stores vectors in Qdrant
- Queries Mistral for answers with retrieved context
- Future: Hybrid SQL-RAG answering

### 🗂️ Qdrant (Vector DB)
- Tenant-specific vector storage
- Rich metadata (e.g., title, language)
- Fast ANN search with filtering

### 🧠 Mistral (Local LLM)
- Hosted locally via [Ollama](https://ollama.com/)
- Lightweight and performant
- Can be wrapped for template-based prompting
- Streams responses token-by-token

---

## 🔐 3. Security & Multi-Tenant Support

- 🔒 **JWT Auth** + role separation (Admin vs User)
- 🏢 Each tenant has isolated:
  - Vector space in Qdrant
  - File system (PDFs, docs)
  - Audit trail
- 🧾 Per-request logging and traceability

---

## 🚧 Roadmap

- [ ] SQL Data Connectors (Structured + Semantic Q&A)
- [ ] Voice-to-text upload
- [ ] Feedback & Retraining UI
- [ ] Analytics & usage reporting

---

## 📦 Deployment

- All components are containerized (Docker)
- Can run fully offline on your own infrastructure
- No data leaves your system

---

## 🙌 Credits

Built with ❤️ by AST for internal AI enablement — made for privacy, control, and real-world AI adoption.

---

# System Design
<img width="862" alt="SearchVault_Systemdesign" src="https://github.com/user-attachments/assets/8f037ce1-8263-45cd-bdfa-b1529dd26c04" />


# System overview
<img width="563" alt="SearchVault_Componenets" src="https://github.com/user-attachments/assets/1a79f808-fdb8-4e4b-9562-a64255ebd059" />

---

# 📥 Ingestor (Python, FastAPI) Setup

The Ingestor is a FastAPI-based microservice responsible for:
- Parsing documents (PDF, DOCX, TXT, etc.)
- Chunking and embedding content using a local model
- Storing vector embeddings in Qdrant for RAG-based retrieval

## 🔧 Setup Instructions

### 1. If you are running Qdrant in a separate docker container then create Docker Network

```bash
docker network create searchvault-net
````

### 2. Pull & Run Qdrant

```bash
docker pull qdrant/qdrant
docker run -d \
  --name qdrant \
  --network searchvault-net \
  -p 6333:6333 \
  qdrant/qdrant
````

### 3. Install Dependencies (Make sure requirements.txt file is complete)

pip install -r requirements.txt

### 4. Run Ingestor

```bash
docker compose up --build
````

### 5. Access API Docs

Swagger UI: http://localhost:8000/docs - it may take some time for the app to start, so wait until you see in the logs:

<img width="403" alt="image" src="https://github.com/user-attachments/assets/3bccd1b2-221d-466e-9b5b-486637099846" />

### 6. Test in Postman

<img width="1309" alt="image" src="https://github.com/user-attachments/assets/26fae912-20da-4b75-bf12-751a89e53295" />

---

# Phi-2 Ollama Deployment on Kubernetes

This repository deploys the [Phi-2](https://huggingface.co/microsoft/phi-2) language model using [Ollama](https://ollama.com) into a Kubernetes cluster.

## ✅ Features

- CPU-only model inference
- Internal-only access (via ClusterIP)
- Model preloading on startup (via Init Job)
- GitHub Actions CI/CD deployment

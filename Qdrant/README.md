# Qdrant Deployment for SearchVault (Internal-Only)

This deployment sets up **Qdrant**, an open-source vector search engine, inside a Kubernetes cluster with:

- Internal-only access (ClusterIP)
- Persistent storage via PVC
- Namespace-scoped (`staging`)
- Ready for use by Ingestor or Middleware services

---

## 📦 Files

| File | Description |
|------|-------------|
| `40-qdrant-deployment.yaml` | Qdrant Deployment (1 replica, persistent storage) |
| `41-qdrant-service.yaml`    | ClusterIP Service to expose Qdrant internally |
| `42-qdrant-pvc.yaml`        | PersistentVolumeClaim for Qdrant data |

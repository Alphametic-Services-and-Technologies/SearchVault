from fastapi import APIRouter, Query
from services import qdrant
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()


@router.delete("/document")
async def delete(tenant_id: str = Query(...), middleware_id: str = Query(...)):
    try:
        res = qdrant.delete_document(tenant_id, middleware_id)
        return {"status": "ok", "result": str(res)}
    except Exception as e:
        logging.exception("Delete document failed")
        return {"status": "error", "detail": str(e)}

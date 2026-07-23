from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError
from app.core.security import decode_token
from app.core.ws_manager import manager
from app.database import SessionLocal
from app.models.user import User

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/notifications")
async def notifications_socket(websocket: WebSocket, token: str = Query(...)):
    # WebSocket connections can't send an Authorization header the normal
    # way browsers do for fetch/axios, so the access token is passed as a
    # query param instead — same JWT, just a different transport.
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            await websocket.close(code=4001)
            return
        user_id = payload["sub"]
    except JWTError:
        await websocket.close(code=4001)
        return

    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    if user is None or user.status == "disabled":
        await websocket.close(code=4001)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            # We don't expect the client to send anything meaningful — this
            # just keeps the connection open and lets us detect disconnects.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
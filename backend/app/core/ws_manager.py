from fastapi import WebSocket
from collections import defaultdict


class ConnectionManager:
    """
    Tracks live WebSocket connections per user_id. A user can have more
    than one open tab/device, so each user_id maps to a LIST of sockets —
    a push goes out to all of them at once.
    """
    def __init__(self):
        self.active: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active[user_id].append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket):
        if websocket in self.active[user_id]:
            self.active[user_id].remove(websocket)
        if not self.active[user_id]:
            del self.active[user_id]

    async def push_to_user(self, user_id: str, payload: dict):
        for ws in list(self.active.get(user_id, [])):
            try:
                await ws.send_json(payload)
            except Exception:
                # Connection went stale (closed without a clean disconnect) —
                # drop it silently rather than letting one dead socket break
                # notifications for everyone else.
                self.disconnect(user_id, ws)


manager = ConnectionManager()
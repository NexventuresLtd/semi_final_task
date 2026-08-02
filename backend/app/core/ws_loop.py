# Holds a reference to the uvicorn event loop, set once at startup by main.py.
# This lets sync route handlers (which run in a threadpool) schedule async
# WebSocket pushes onto the correct loop via asyncio.run_coroutine_threadsafe.
loop = None

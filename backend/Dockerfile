FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create and switch to a non-root user — addresses Celery's superuser
# warning and is standard container security practice regardless.
RUN useradd --create-home appuser
USER appuser

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
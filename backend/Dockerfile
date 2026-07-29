FROM python:3.12-slim

WORKDIR /app

# System deps needed for some Python packages (cryptography, psycopg2, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Render sets $PORT dynamically — don't hardcode 8000 in production
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
# Dockerfile
FROM python:3.10-slim

# install system deps
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy source
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY example_agent.py .

# drop to non-root user (optional but recommended)
RUN useradd -m agno && chown -R agno:agno /app
USER agno

# runtime (expects OPENAI_API_KEY in env)
CMD ["python", "example_agent.py"]

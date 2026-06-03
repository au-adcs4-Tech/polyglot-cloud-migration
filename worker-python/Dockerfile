FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV POLL_INTERVAL=5

CMD ["python", "src/worker.py"]

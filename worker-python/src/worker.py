import os
import time
import json
import logging
import redis

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

REDIS_HOST = os.environ.get("REDIS_HOST", "redis")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
QUEUE_NAME = "task_queue"
POLL_INTERVAL = int(os.environ.get("POLL_INTERVAL", 5))


def connect_redis(retries: int = 10) -> redis.Redis:
    for attempt in range(retries):
        try:
            client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
            client.ping()
            logger.info("Connected to Redis at %s:%d", REDIS_HOST, REDIS_PORT)
            return client
        except redis.exceptions.ConnectionError:
            logger.warning("Redis not ready (attempt %d/%d), retrying in 3s...", attempt + 1, retries)
            time.sleep(3)
    raise RuntimeError("Could not connect to Redis after multiple attempts.")


def process_task(task_data: str) -> None:
    try:
        task = json.loads(task_data)
        logger.info("Processing task id=%s title='%s'", task.get("Id"), task.get("Title"))
        # Simulate work
        time.sleep(1)
        logger.info("Task id=%s completed successfully.", task.get("Id"))
    except json.JSONDecodeError:
        logger.error("Invalid JSON in task: %s", task_data)


def run_worker() -> None:
    logger.info("Python worker starting...")
    r = connect_redis()

    while True:
        try:
            # Blocking pop with 5s timeout
            result = r.blpop(QUEUE_NAME, timeout=POLL_INTERVAL)
            if result:
                _, task_data = result
                process_task(task_data)
            else:
                logger.debug("No tasks in queue, waiting...")
        except redis.exceptions.RedisError as e:
            logger.error("Redis error: %s. Reconnecting...", e)
            time.sleep(3)
            r = connect_redis()


if __name__ == "__main__":
    run_worker()

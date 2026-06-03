import json
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../src"))

from unittest.mock import patch, MagicMock
from worker import process_task


def test_process_task_valid_json():
    task = {"Id": 1, "Title": "Test Task", "Status": "pending"}
    # Should not raise
    with patch("worker.time.sleep"):
        process_task(json.dumps(task))


def test_process_task_invalid_json():
    # Should handle gracefully without raising
    with patch("worker.time.sleep"):
        process_task("not-valid-json")


def test_process_task_missing_fields():
    task = {}
    with patch("worker.time.sleep"):
        process_task(json.dumps(task))

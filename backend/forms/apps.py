import os
import requests

from django.utils import timezone
from django.apps import AppConfig

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger


def call_backup_api():
    """Called backup feature to keep system awake."""
    try:
        response = requests.post("https://ku-vein.onrender.com/api/backup")
        print(f"[{timezone.localtime()}] Backup API called. Response: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"[{timezone.localtime()}] Error calling Backup API: {e}")


class FormsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'forms'

    def ready(self):
        print("Are you still there?")
        if os.environ.get("RUN_MAIN") == "true":
            scheduler = BackgroundScheduler()
            scheduler.add_job(call_backup_api, IntervalTrigger(minutes=14))
            scheduler.start()

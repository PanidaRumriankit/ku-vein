import os
import sys
import django

from django.db.models import F
from backend.forms.models import CourseReview
from .schemas import CourseReviewSchema
from abc import ABC, abstractmethod

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()


class PostStrategy(ABC):
    """Abstract base class for update the database."""

    @abstractmethod
    def post_data(self, data):
        """Update the data to the database."""
        pass

class ReviewPost(PostStrategy):

    def post_data(self, data):
        CourseReview.objects.create(**data)
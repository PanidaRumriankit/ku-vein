import os
import sys
import django

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()  # Initialize Django

from django.db.models import F
from backend.forms.models import Inter



class DatabaseQuery:
    """Main class for handle the request from frontend"""
    def __init__(self):
        self.data = None

    @staticmethod
    def send_all_course_data():
        """Send the course_id, course_name, and faculty to frontend."""
        course_data = Inter.objects.select_related('course').values(
            courses_id=F('course__course_id'),
            courses_name=F('course__course_name'),
            faculty=F('course__faculty')
        )

        return list(course_data)


if __name__ == "__main__":
    d = DatabaseQuery()
    print(d.send_all_course_data())


import os
import sys
import django

# Add the parent directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()  # Initialize Django

from backend.forms.models import CourseData



class DatabaseQuery:
    """Main class for handle the request from frontend"""
    def __init__(self):
        self.data = None

    @staticmethod
    def send_all_course_data():
        """Send the course_id, course_name, and faculty to frontend."""
        return CourseData.objects.all()


if __name__ == "__main__":
    d = DatabaseQuery()
    print(d.send_all_course_data())


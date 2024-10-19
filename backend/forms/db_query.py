from backend.forms.models import CourseData


class DatabaseQuery:
    """Main class for handle the request from frontend"""
    def __init__(self):
        self.data = None

    @staticmethod
    def send_all_course_data():
        """Send the course_id, course_name, and faculty to frontend."""
        return CourseData.objects.all()


d = DatabaseQuery()
print(d.send_all_course_data())
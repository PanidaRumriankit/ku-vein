from ..models import CourseData, UserData, CourseReview
from ..db_query import EarliestReview
from ..db_post import UserDataPost, ReviewPost
from django.test import TestCase
from .test_course_data import course_set_up

def review_set_up():
    """Set Up function for review data."""

    review = []

    review_data = [
        {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 2024,
            "pen_name": "Solaire of Astora",
            "grade": "A"
        },
        {
            "email": "logan@gmail.com",
            "course_id": "2",
            "course_type": "Sorcerer",
            "faculty": "Sorcery",
            "reviews": "The depth of knowledge on sorceries is incredible, far beyond expectations.",
            "rating": 4.8,
            "academic_year": 2024,
            "pen_name": "Big Hat Logan",
            "grade": "A"
        },
        {
            "email": "laurentius@gmail.com",
            "course_id": "3",
            "course_type": "Pyromancer",
            "faculty": "Pyromancy",
            "reviews": "A thorough and blazing introduction to pyromancy. Great for those who crave fire mastery.",
            "rating": 4.2,
            "academic_year": 2024,
            "pen_name": "Laurentius",
            "grade": "B+"
        },
        {
            "email": "aslatiel@gmail.com",
            "course_id": "4",
            "course_type": "Hexer",
            "faculty": "Hexes",
            "reviews": "An illuminating course on hexes, albeit with a dark twist. Not for the faint-hearted.",
            "rating": 4.6,
            "academic_year": 2024,
            "pen_name": "Lucatiel of Mirrah",
            "grade": "B"
        },
        {
            "email": "siegmeyer@gmail.com",
            "course_id": "5",
            "course_type": "Knight",
            "faculty": "Faith",
            "reviews": "An honorable journey through sacred oaths and valorous teachings.",
            "rating": 4.3,
            "academic_year": 2024,
            "pen_name": "Siegmeyer of Catarina",
            "grade": "B"
        }
    ]

    for add_user in review_data:
        review.append(CourseReview.objects.create(**add_user))

    return review


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.earliest_review = EarliestReview()

        data = {}
        # CourseData.objects.create(**data)


    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertEqual(self.earliest_review.get_data(), [])

    def test_order_by_earliest(self):
        pass
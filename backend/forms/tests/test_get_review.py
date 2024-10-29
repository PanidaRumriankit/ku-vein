"""Module for test everything that relate to Review feature."""

from .test_user_data import user_set_up
from ..db_query import EarliestReview, LatestReview, UpvoteReview
from datetime import datetime
from django.test import TestCase
from .test_course_data import course_set_up
from ..models import CourseData, UserData, CourseReview, ReviewStat


def review_set_up():
    """Set Up function for review data."""
    review = []

    review_data = [
        {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings on"
                       " miracles here are both uplifting and inspiring.",
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
            "reviews": "The depth of knowledge on sorceries"
                       " is incredible, far beyond expectations.",
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
            "reviews": "A thorough and blazing introduction to pyromancy."
                       " Great for those who crave fire mastery.",
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
            "reviews": "An illuminating course on hexes,"
                       " albeit with a dark twist. Not for the faint-hearted.",
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
            "reviews": "An honorable journey through sacred"
                       " oaths and valorous teachings.",
            "rating": 4.3,
            "academic_year": 2024,
            "pen_name": "Siegmeyer of Catarina",
            "grade": "B"
        }
    ]

    for add_user in review_data:
        user = UserData.objects.filter(email=add_user['email']).first()
        course = CourseData.objects.filter(course_id=add_user['course_id'],
                                           faculty=add_user['faculty'],
                                           course_type=add_user['course_type']
                                           ).first()

        review_instance = CourseReview.objects.create(user=user,
                                                      course=course,
                                                      reviews=add_user['re'
                                                                       'views']
                                                      )

        review.append(ReviewStat.objects.
                      create(review=review_instance, rating=add_user['rating'],
                             academic_year=add_user['academic_year'],
                             pen_name=add_user['pen_name'],
                             date_data=datetime.now().date(),
                             grade=add_user['grade'], up_votes=0))

    return review, review_data


class EarliestReviewTests(TestCase):
    """Test cases for EarliestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.earliest = EarliestReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.earliest.get_data(), list)

    def test_order_by_earliest(self):
        """Data should order by first to last."""
        expected_values = [item['course_id'] for item in self.data]
        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.earliest.get_data()])


class LatestReviewTests(TestCase):
    """Test cases for LatestReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.latest = LatestReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.latest.get_data(), list)

    def test_order_by_latest(self):
        """Data should order by last to first."""
        expected_values = [item['course_id'] for item in self.data]
        expected_values.reverse()

        self.assertEqual(expected_values,
                         [item['courses_id']
                          for item in self.latest.get_data()])


class UpvoteReviewTests(TestCase):
    """Test cases for UpvoteReview."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.upvote = UpvoteReview()
        course_set_up()
        user_set_up()
        self.review, self.data = review_set_up()
        self.up_vote_list = [8, 9, 5, 6, 7]

    def test_correct_data_format(self):
        """Data should return as a list."""
        self.assertIsInstance(self.upvote.get_data(), list)

    def test_order_by_upvote(self):
        """Data should order by highest to lowest."""
        for i, update_review in enumerate(self.review):
            update_review.up_votes = self.up_vote_list[i]
            update_review.save()
        self.assertEqual(sorted(self.up_vote_list, reverse=True),
                         [item['upvote']
                          for item in self.upvote.get_data()])

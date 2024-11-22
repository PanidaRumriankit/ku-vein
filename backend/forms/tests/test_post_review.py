"""Module for test update and create data for the Review feature."""

import json
from datetime import datetime

from django.test import TestCase

from .set_up import course_set_up, user_set_up
from ..db_post import ReviewPost
from ..models import CourseReview, ReviewStat


class ReviewPostTests(TestCase):
    """Test cases for ReviewPost."""

    def setUp(self):
        """Set up reusable instances for tests."""
        self.review_post = ReviewPost()
        self.user = user_set_up()
        course_set_up()

    def test_error_response_from_missing_user_data(self):
        """Missing email key."""
        review_data = {
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings "
                       "on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 2024,
            "pen_name": "Solaire of Astora",
            "grade": "A",
            "instructor": None,
            "effort": 4,
            "attendance": 3,
            "scoring_criteria": "work-base",
            "class_type": "hybrid",
        }

        response = self.review_post.post_data(review_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'error': 'User data or Course Data'
                                   ' are missing from the response body.'})

    def test_error_response_from_missing_course_data(self):
        """Missing course_id, course_type and faculty key."""
        review_data = {
            "email": "solaire@gmail.com",
            "reviews": "Praise the Sun! The teachings"
                       " on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 2024,
            "pen_name": "Solaire of Astora",
            "grade": "A",
            "instructor": None,
            "effort": 3,
            "attendance": 1,
            "scoring_criteria": "exam-base",
            "class_type": "onsite",
        }

        response = self.review_post.post_data(review_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {'error': 'User data or Course Data'
                                   ' are missing from the response body.'})

    def test_error_response_from_missing_pen_name(self):
        """Missing pen_name key."""
        review_data = {
            "email": "aslatiel@gmail.com",
            "course_id": "4",
            "course_type": "Hexer",
            "faculty": "Hexes",
            "reviews": "An illuminating course on hexes,"
                       " albeit with a dark twist. Not for the faint-hearted.",
            "rating": 4.6,
            "academic_year": 2024,
            "grade": "B",
            "instructor": None,
            "effort": 4,
            "attendance": 2,
            "scoring_criteria": "exam-base",
            "class_type": "onsite",
        }

        response = self.review_post.post_data(review_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "pen_name or academic_year are missing"})

    def test_error_response_from_missing_academic_year(self):
        """Missing academic_year key."""
        review_data = {
            "email": "aslatiel@gmail.com",
            "course_id": "4",
            "course_type": "Hexer",
            "faculty": "Hexes",
            "reviews": "An illuminating course on hexes,"
                       " albeit with a dark twist. Not for the faint-hearted.",
            "rating": 4.6,
            "pen_name": "Lucatiel of Mirrah",
            "grade": "B",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "onsite-base",
            "class_type": "hybrid",
        }

        response = self.review_post.post_data(review_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content),
                         {"error": "pen_name or academic_year are missing"})

    def test_user_does_not_in_the_database(self):
        """Test User data doesn't in the database."""
        test_data = {
            "email": "sif@gmail.com",
            "course_id": "3",
            "course_type": "Wolf",
            "faculty": "Faith",
            "reviews": "Woof Woof!",
            "rating": 4.8,
            "academic_year": 2024,
            "pen_name": "Artorias",
            "grade": "A",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "exam-base",
            "class_type": "hybrid",
        }
        response = self.review_post.post_data(test_data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {'error': "This user isn't"
                                   " in the database."})

    def test_course_does_not_in_the_database(self):
        """Test User data doesn't in the database."""
        test_data = {
            "email": "aslatiel@gmail.com",
            "course_id": "6",
            "course_type": "Wolf",
            "faculty": "Faith",
            "reviews": "Woof Woof!",
            "rating": 4.8,
            "academic_year": 2024,
            "pen_name": "Artorias",
            "grade": "A",
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "exam-base",
            "class_type": "hybrid",
        }
        response = self.review_post.post_data(test_data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(json.loads(response.content),
                         {'error': "This course isn't"
                                   " in the database."})

    def test_response_success(self):
        """This code should successfully create a review."""
        test_data = {
            "email": "aslatiel@gmail.com",
            "course_id": "4",
            "course_type": "Hexer",
            "faculty": "Hexes",
            "reviews": "An illuminating course on hexes,"
                       " albeit with a dark twist. Not for the faint-hearted.",
            "rating": 4.6,
            "academic_year": 2024,
            "pen_name": "Lucatiel of Mirrah",
            "grade": "B",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "exam-base",
            "class_type": "onsite",
        }
        response = self.review_post.post_data(test_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {"success": "The Review is successfully created."})

    def test_default_pen_name(self):
        """User default user_name will be the user's user_name."""
        test_data = {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings"
                       " on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 2024,
            "pen_name": "",
            "grade": "A",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "work-base",
            "class_type": "onsite",
        }

        response = self.review_post.post_data(test_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {"success": "The Review is successfully created."})

        self.assertEqual("Solaire of Astora",
                         CourseReview.objects.first().user.user_name)

    def test_default_academic_year(self):
        """Default of academic_year will be current year."""
        test_data = {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings"
                       " on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 0,
            "pen_name": "Solaire of Astora",
            "grade": "A",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "work-base",
            "class_type": "online",
        }

        response = self.review_post.post_data(test_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content),
                         {"success": "The Review is successfully created."})

        self.assertEqual(datetime.now().year,
                         ReviewStat.objects.first().academic_year)

    def test_anonymous_true(self):
        """If there are pen_name anonymous should be true."""
        test_data = {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings"
                       " on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 0,
            "pen_name": "Yes",
            "grade": "A",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "work-base",
            "class_type": "online",
        }

        self.review_post.post_data(test_data)
        review = CourseReview.objects.first()

        self.assertTrue(review.anonymous)

    def test_anonymous_same_pen_name_user_name(self):
        """If pen_name same with user_name anonymous is false"""
        test_data = {
            "email": "solaire@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "Praise the Sun! The teachings"
                       " on miracles here are both uplifting and inspiring.",
            "rating": 4.5,
            "academic_year": 0,
            "pen_name": self.user[0].user_name,
            "grade": "A",
            "instructor": None,
            "effort": 4,
            "attendance": 4,
            "scoring_criteria": "work-base",
            "class_type": "online",
        }

        self.review_post.post_data(test_data)
        review = CourseReview.objects.first()

        self.assertFalse(review.anonymous)




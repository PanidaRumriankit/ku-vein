"""Set up function for every feature."""

import os

from django.conf import settings
from django.utils import timezone

from ..models import (CourseData, UserData,
                      CourseReview, ReviewStat,
                      UpvoteStat, FollowData,
                      Note,
                      QA_Question, QA_Answer, BookMark)
from django.contrib.contenttypes.models import ContentType


def course_set_up():
    """Set Up function for course data."""
    course = []

    test_data = [
        {"course_id": "1", "course_type": "Priest",
         "course_name": "Basic Miracle 1"},

        {"course_id": "2", "course_type": "Sorcerer",
         "course_name": "Soul Arrow Mastery"},

        {"course_id": "3", "course_type": "Pyromancer",
         "course_name": "Flame Manipulation"},

        {"course_id": "4", "course_type": "Hexer",
         "course_name": "Dark Orb Fundamentals"},

        {"course_id": "5", "course_type": "Knight",
         "course_name": "Sacred Oath"},
    ]

    for insert_data in test_data:
        course.append(CourseData.objects.create(**insert_data))

    return course, test_data


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
            "grade": "A",
            "effort": 2,
            "attendance": 4,
            "scoring_criteria": "work-base",
            "class_type": "onsite",
        },

        {
            "email": "logan@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "The teachings here have rekindled my faith. A truly divine experience, perfect for those seeking enlightenment.",
            "rating": 4.7,
            "academic_year": 2024,
            "pen_name": "Organ",
            "grade": "B",
            "effort": 3,
            "attendance": 4,
            "scoring_criteria": "project-base",
            "class_type": "online",
        },
        {
            "email": "laurentius@gmail.com",
            "course_id": "1",
            "course_type": "Priest",
            "faculty": "Miracle",
            "reviews": "A serene and impactful course. The knowledge shared here has strengthened my resolve and my bond with the Light.",
            "rating": 4.6,
            "academic_year": 2024,
            "pen_name": "lala",
            "grade": "B",
            "effort": 4,
            "attendance": 5,
            "scoring_criteria": "work-base",
            "class_type": "online",
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
            "grade": "A",
            "effort": 3,
            "attendance": 3,
            "scoring_criteria": "exam-base",
            "class_type": "online",
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
            "grade": "B+",
            "effort": 3,
            "attendance": 4,
            "scoring_criteria": "exam-base",
            "class_type": "hybrid",
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
            "grade": "B",
            "effort": 4,
            "attendance": 1,
            "scoring_criteria": "exam-base",
            "class_type": "onsite",
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
            "grade": "B",
            "effort": 4,
            "attendance": 3,
            "scoring_criteria": "work-base",
            "class_type": "online",
        }
    ]

    for add_user in review_data:
        user = UserData.objects.filter(email=add_user['email']).first()
        course = CourseData.objects.filter(course_id=add_user['course_id'],
                                           course_type=add_user['course_type']
                                           ).first()

        review_instance = CourseReview.objects.create(user=user,
                                                      course=course,
                                                      faculty=add_user['faculty'],
                                                      reviews=add_user['re'
                                                                       'views']
                                                      )

        review.append(ReviewStat.objects.
                      create(review=review_instance, rating=add_user['rating'],
                             academic_year=add_user['academic_year'],
                             pen_name=add_user['pen_name'],
                             date_data=timezone.now(),
                             grade=add_user['grade'],
                             effort=add_user['effort'],
                             attendance=add_user['attendance'],
                             scoring_criteria=add_user['scoring_criteria'],
                             class_type=add_user['class_type']
                      )
        )

    return review, review_data


def user_set_up():
    """Set Up function for user data."""
    user = []

    user_test_data = [
        {"user_name": "Solaire of Astora",
         "user_type": "Knight", "email": "solaire@gmail.com"},

        {"user_name": "Siegmeyer of Catarina",
         "user_type": "Knight", "email": "siegmeyer@gmail.com"},

        {"user_name": "Lucatiel of Mirrah",
         "user_type": "Knight", "email": "aslatiel@gmail.com"},

        {"user_name": "Big Hat Logan",
         "user_type": "Sorcerer", "email": "logan@gmail.com"},

        {"user_name": "Laurentius of the Great Swamp",
         "user_type": "Pyromancer", "email": "laurentius@gmail.com"}
    ]

    for add_user in user_test_data:
        user.append(UserData.objects.create(**add_user))

    return user


def upvote_set_up(review_stat, user_data):
    """Set Up function for Upvote data."""
    upvote = []

    upvote_data = [

        {"email": "solaire@gmail.com", "course_id": "1",
         "course_type": "Priest", "faculty": "Miracle"},

        {"email": "logan@gmail.com", "course_id": "2",
         "course_type": "Sorcerer", "faculty": "Sorcery"},

        {"email": "laurentius@gmail.com", "course_id": "3",
         "course_type": "Pyromancer", "faculty": "Pyromancy"},

        {"email": "aslatiel@gmail.com", "course_id": "4",
         "course_type": "Hexer", "faculty": "Hexes"},

        {"email": "siegmeyer@gmail.com", "course_id": "5",
         "course_type": "Knight", "faculty": "Faith"}
    ]

    for i, review_ins in enumerate(review_stat):
        for cur_user in range(len(user_data) - i):
            upvote.append(UpvoteStat.objects.create(
                review_stat=review_ins,
                user=user_data[cur_user])
            )
    return upvote, upvote_data


def follower_setup(user):
    """Set up function for follower feature."""
    follow = []

    for all_follow in user[1:]:
        follow.append(FollowData.objects.create(
            this_user=user[0],
            follow_by=all_follow
        ))
    return follow


def note_setup(course, user):
    """Set up function for Note feature using a generator."""
    path = os.path.join(settings.MEDIA_ROOT,
                 'note_files', 'yes_indeed.pdf')

    note = Note.objects.create(
        user=user[0],
        course=course[0],
        faculty="pyromancer",
        file_name='yes_indeed.pdf',
        note_file=path,
        date_data=timezone.now(),
        pen_name="Yes"
    )

    return note

def book_setup(review, user):
    """Set up function for BookMark feature using a generator."""
    table = {"review": CourseReview, "note": Note, "qa": None}

    content_type = ContentType.objects.get_for_model(table['review'])
    book = []
    for i in range(len(review)):
        book.append(BookMark.objects.create(
            content_type=content_type,
            object_id=review[i].review_id,
            data_type="review",
            user=user[0]
        ))

    return book


def get_time_data(q: QA_Question | QA_Answer):
    """This function is used to clean datetime formatting."""
    post_time = q.posted_time
    return (f'{post_time.day:02d} {post_time.month:02d} {post_time.year}',
            f'{post_time.hour:02d}:{post_time.minute:02d}')

def qa_setup():
    test_user = UserData.objects.create(**{
        "user_name": "Solaire of Astora",
        "user_type": "Knight",
        "email": "solaire@gmail.com"
        })
    questions = []
    answers = []
    qa_data = [
        {
            "question_text": "Test question",
            "faculty": None,
            "user": test_user
        }
    ]
    for i,q in enumerate(qa_data):
        _q = QA_Question.objects.create(**q)
        _a = {"question_id": _q.question_id,
              "user": test_user,
              "answer_text": f"Test answer {i}"}
        _a = QA_Answer.objects.create(**_a)
        q_date, q_time = get_time_data(_q)
        question = {
            "questions_id": _q.question_id,
            "questions_text": _q.question_text,
            "users": _q.user.user_id,
            "num_convo": _q.qa_answer_set.count(),
            "post_time": q_time,
            "post_date": q_date,
            }
        a_date, a_time = get_time_data(_a)
        answer = {
            "answers_id": _a.answer_id,
            "text": _a.answer_text,
            "users": _a.user.user_id,
            "post_time": a_time,
            "post_date": a_date,
            }
        questions += [question]
        answers += [answer]
    return questions, answers

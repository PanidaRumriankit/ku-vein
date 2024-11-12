const bacon = "Bacon ipsum dolor amet prosciutto buffalo corned beef beef ham " +
  "hock. Landjaeger sausage boudin bresaola andouille bacon turkey" +
  "pastrami buffalo short loin swine. Short ribs sirloin pork beef" +
  "cow pork chop bresaola swine. Swine sausage turducken hamburger" +
  "tongue shankle tenderloin porchetta picanha frankfurter short" +
  "ribs andouille ham hock bresaola alcatra."

const demoReview = [
  {
    "courses_id": "123132",
    "courses_name": "Bacon 101",
    "faculties": "engineering",
    "user_name": "John Doe",
    "review_text": "banana",
    "date": "2023-09-10",
    "grades": "A",
    "upvote": 15,
    "ratings": 1
  },
  {
    "courses_id": "456789",
    "courses_name": "Demo 101",
    "faculties": "science",
    "user_name": "Jane Smith",
    "review_text": "potato",
    "date": "2023-09-12",
    "grades": "B",
    "upvote": 20,
    "ratings": 1
  },
  {
    "courses_id": "789101",
    "courses_name": "Intro to Anything",
    "faculties": "arts",
    "user_name": "Alice Johnson",
    "review_text": "Noppo mham mham",
    "date": "2023-09-15",
    "grades": "C",
    "upvote": 5,
    "ratings": 1
  },
  {
    "courses_id": "234567",
    "courses_name": "Basics 101",
    "faculties": "business",
    "user_name": "Peter Pan",
    "review_text": "pizza stole Pete",
    "date": "2023-09-18",
    "grades": "B+",
    "upvote": 8,
    "ratings": 1
  },
  {
    "courses_id": "345678",
    "courses_name": "Fun Studies",
    "faculties": "law",
    "user_name": "Ichiro Suzuki",
    "review_text": "Ichi",
    "date": "2023-09-20",
    "grades": "A-",
    "upvote": 12,
    "ratings": 1
  }
]



const oldDemoReview = {
  "id": Math.floor(Math.random() * 100),
  "course": {
    "courses_id": "1346012",
    "courses_name": "Bacon Ipsum 101",
  },
  "review_text": bacon,
  "reviewer": "Ichi"
}

export {demoReview}
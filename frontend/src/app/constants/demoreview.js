const bacon = "Bacon ipsum dolor amet prosciutto buffalo corned beef beef ham " +
  "hock. Landjaeger sausage boudin bresaola andouille bacon turkey" +
  "pastrami buffalo short loin swine. Short ribs sirloin pork beef" +
  "cow pork chop bresaola swine. Swine sausage turducken hamburger" +
  "tongue shankle tenderloin porchetta picanha frankfurter short" +
  "ribs andouille ham hock bresaola alcatra."

const demoReview = [
  {
    "review_id": 1,
    "user_id": 1,
    "course_id": "123132",
    "faculty": "engineering",
    "reviews": "banana"
  },
  {
    "review_id": 2,
    "user_id": 2,
    "course_id": "456789",
    "faculty": "science",
    "reviews": "potato"
  },
  {
    "review_id": 3,
    "user_id": 3,
    "course_id": "789101",
    "faculty": "arts",
    "reviews": "Noppo mham mham"
  },
  {
    "review_id": 4,
    "user_id": 4,
    "course_id": "234567",
    "faculty": "business",
    "reviews": "pizza stole Pete"
  },
  {
    "review_id": 5,
    "user_id": 5,
    "course_id": "345678",
    "faculty": "law",
    "reviews": "Ichi"
  }
]

const oldDemoReview = {
  "id": Math.floor(Math.random() * 100),
  "course": {
    "course_id": "1346012",
    "course_name": "Bacon Ipsum 101",
  },
  "reviews": bacon,
  "reviewer": "Ichi"
}

export {demoReview}
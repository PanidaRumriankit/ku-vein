// localhost use http://127.0.0.1:8000/api
// deploy use https://ku-vein.onrender.com/api
// const backURL = 'http://127.0.0.1:8000/api';
const backURL = 'https://ku-vein.onrender.com/api';
const reviewURL = backURL + '/review';
const userURL = backURL + '/user';
const courseURL = backURL + '/course';
const upvoteURL = backURL + '/upvote';
const followURL = backURL + '/follow';
const noteURL = backURL + '/note';

export default backURL;
export {reviewURL, userURL, courseURL, upvoteURL, followURL, noteURL};

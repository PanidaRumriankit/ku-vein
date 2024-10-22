import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function AddReviews() {
  function addReview() {
    console.log("Add review");
  }
  return (
    <div className="fixed bottom-4 right-4">
      <Popup 
        trigger={
          <button
            className="bg-[#4ECDC4] p-4 rounded-full shadow-lg text-white hover:bg-[#44b3ab]"
          >
            <AddIcon />
          </button>
        } 
        modal
        nested
        contentStyle={{ border: 'none', padding: '0', background: 'none' }}
      >
        {close => (
          <div className="bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold">Add a Review</h2>
            <p>Here you can add a new review.</p>
            <button
              className="mt-4 bg-[#4ECDC4] p-2 rounded text-white hover:bg-[#44b3ab]"
              onClick={() => {
                addReview();
                close();
              }}
            >
              Submit Review
            </button>
          </div>
        )}
      </Popup>
    </div>
  );
}
const Popup = ({ setIsPopupOpen, buttonRef }) => {
  return (
    <div className="absolute z-10" style={{ top: buttonRef?.offsetTop + buttonRef?.offsetHeight, left: buttonRef?.offsetLeft }}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-l font-bold mb-4 text-black">Sorting Options</h2>
        {/* Add your sorting options here */}
      </div>
    </div>
  );
};

export default Popup;
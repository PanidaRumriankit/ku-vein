import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Search from './search';
import Rating from '@mui/material/Rating';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function AddReview() {
  const [value, setValue] = useState(3);
  const [hover, setHover] = useState(-1);

  const labels = {
    1: 'Very dissatisfied',
    2: 'Dissatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very satisfied',
  };

  function addReview() {
    console.log("Add review");
  }

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
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
          <div className="modal bg-white dark:bg-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold pb-2">เพิ่มรีวิว</h2>
            <Search />
            <textarea
              type="text"
              placeholder="ความคิดเห็นต่อรายวิชา"
              className="w-full h-48 px-4 py-2 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2"
              required
            />
            <div className="flex justify-start">
              <h3 className="mr-12 font-bold">ความพึงพอใจ</h3>
              <Rating
                value={value}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'gray' }} fontSize="inherit" />}
              />
              {value !== null && (
                <div className='ml-2'>{labels[hover !== -1 ? hover : value]}</div>
              )}
            </div>
            <div className="flex flex-wrap mt-4 font-bold">
              <h1 className="mr-12">เกรดที่ได้</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">A</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">B+</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">B</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">C+</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">C</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">D+</h1>
              <h1 className="ml-4 text-gray-400 text-lg hover:text-[#4ECDC4] hover:cursor-pointer">D</h1>
            </div>
            <div className='flex flex-wrap mt-4 font-bold'>
              <h1 className='mr-12'>ปีการศึกษา</h1>
              <input type='text' placeholder='พ.ศ.' className='w-20 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2' required />
            </div>
            <div className='flex flex-wrap mt-4 font-bold'>
              <h1 className='mr-12'>นามปากกา</h1>
              <input type='text' placeholder='นามปากกา' className='w-40 px-2 py-1 text-gray-700 dark:text-white rounded-md border border-gray-300 focus:outline-2' required />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#4ECDC4] px-4 py-2 rounded text-white hover:bg-[#44b3ab]"
                onClick={() => {
                  addReview();
                  close();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}
import React from 'react';

const CloseButton = ({onClick}) => {
  return (
    <button onClick={onClick} className="bg-white text-center w-32 rounded-2xl h-10 relative text-black text-md font-semibold group mt-5 cursor-pointer" type="button">
      <div className="bg-red-600 rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[120px] z-10 duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
          <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000" />
          <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000" />
        </svg>
      </div>
      <p className="translate-x-2">Close</p>
    </button>
  );
}

export default CloseButton;

import React, { useState } from "react";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import grids from '../assets/gridlines.svg';

export default function SnipCard({ post }) {
  const { title, description, codeSnipet, likeNumber } = post;
  const cleanSnipet = codeSnipet.replace(/`/g, '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likeNumber);

  const handleOpenModal = () => {
    setIsOpen(true);
  }

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  }

  return (
    <>
      <div className="bg-gray-900 hover:bg-[#112233] rounded-lg border border-gray-500 h-[200px] col-span-1 hover:scale-[1.03] flex flex-col" onClick={handleOpenModal}>
        <div className="w-full p-3 h-full">
          <div className="w-full rounded-md p-2 text-center h-1/2" style={{ backgroundImage: `url(${grids})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} >
            <h2 className="text-lg  text-slate-200" >{description}</h2>
          </div>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <span className="mr-1">Likes:</span>
            <span>{likes}</span>
          </div>
          <button onClick={handleLike} className="text-xl text-red-500 hover:text-red-700 focus:outline-none">
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed text-white inset-0 z-50 flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur"></div>
          <div className="relative w-[500px] bg-black  shadow-white p-3 rounded-lg">
            <button onClick={handleCloseModal} className="absolute -top-10 -right-10 p-2">
              <svg className="w-10 h-10 hover:scale-105 text-cyan-500 active:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-left border p-4 ">
              <pre className="te" >{cleanSnipet}</pre>
            </div>
            <div className="max-w-[500px] flex flex-col gap-5 items-center justify-center text-black  w-full h-[100px] p-1 my-4" >
              <button className="py-2 w-full transition-all duration-200 border hover:bg-cyan-400 hover:text-black hover:scale-[1.03] text-cyan-400 border-cyan-400" >Copy to ClipBoard</button>
              <div className="flex w-full gap-5 ">
                <button className="py-2 w-1/2 transition-all duration-200 border border-black bg-cyan-400 hover:text-cyan-400 hover:bg-black hover:scale-[1.03] hover:border-cyan-400" >Clean Code</button>
                <button className="py-2 w-1/2 transition-all duration-200 border border-black bg-cyan-400 hover:text-cyan-400 hover:bg-black hover:scale-[1.03] hover:border-cyan-400 " >Optimize Code</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

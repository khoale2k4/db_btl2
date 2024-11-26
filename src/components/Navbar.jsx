import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); 
  const haddleLogoClick = () => {
    navigate(`/vendor`);
  }

  return (
    <nav className="text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold flex items-center space-x-2">
        <div className="bg-white p-1 rounded-full">
          <img src="/images/shopee-logo.png" alt="Shopee" className="h-8" onClick={haddleLogoClick}/>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-gray-800 text-white w-10 h-10 flex justify-center items-center rounded-full border-2 border-white shadow-lg">
          K
        </div>
        <span className="text-black font-semibold">Khoa</span>
      </div>
    </nav>
  );
};

export default Navbar;

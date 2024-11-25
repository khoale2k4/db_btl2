import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold flex items-center space-x-2">
        <div className="bg-white p-1 rounded-full">
          <img src="/images/shopee-logo.png" alt="Shopee" className="h-8" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-gray text-black w-8 h-8 flex justify-center items-center rounded-full">
          K
        </div>
        <span>Khoa</span>
      </div>
    </nav>
  );
};

export default Navbar;

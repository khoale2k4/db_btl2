
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogoClick = () => {
    navigate(`/vendor`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleAccountClick = () => {
    navigate(`/account`);
  };

  const handleCartClick = () => {
    navigate(`/cart`);
  };

  return (
    <nav className="text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold flex items-center space-x-2">
        <div className="bg-white p-1 rounded-full cursor-pointer">
          <img
            src="/images/shopee-logo.png"
            alt="Shopee Logo"
            className="h-8"
            onClick={handleLogoClick}
          />
        </div>
      </div>
      <div className="relative flex items-center space-x-2">
        <div
          className="bg-gray-800 text-white w-10 h-10 flex justify-center items-center rounded-full border-2 border-white shadow-lg cursor-pointer"
          onClick={toggleDropdown}
        >
          K
        </div>
        <span
          className="text-white font-semibold cursor-pointer"
          onClick={toggleDropdown}
        >
          Khoa
        </span>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 bg-gray-900 text-white rounded-lg shadow-lg w-40 border border-gray-800">
            <ul className="flex flex-col">
              <li
                className="p-2 hover:bg-gray-800 cursor-pointer"
                onClick={handleAccountClick}
              >
                Tài khoản
              </li>
              <li
                className="p-2 hover:bg-gray-800 cursor-pointer"
                onClick={handleCartClick}
              >
                Giỏ hàng
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

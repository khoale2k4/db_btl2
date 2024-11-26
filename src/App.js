import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPages from './pages/Products';
import Home from './pages/Home';
import RatingProductsPages from './pages/RatingProducts';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor" element={<ProductsPages />} />
        <Route path="/vendor/rate" element={<RatingProductsPages />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default App;

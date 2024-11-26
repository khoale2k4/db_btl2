import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPages from './pages/Products';
import Home from './pages/Home';
import RatingAndCategoryProductsPages from './pages/RatingProductsAndCategories';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor" element={<ProductsPages />} />
        <Route path="/vendor/rate" element={<RatingAndCategoryProductsPages />} />
        <Route path="/vendor/rate/products/:name" element={<RatingAndCategoryProductsPages />} />
        <Route path="/vendor/rate/categories" element={<RatingAndCategoryProductsPages />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default App;

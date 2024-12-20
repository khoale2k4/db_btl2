import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPages from './pages/Products';
import Home from './pages/Home';
import RatingAndCategoryProductsPages from './pages/RatingProductsAndCategories';
import RatingProductsPages from './pages/RateProducts';
import RatingCategoriesPages from './pages/RateCategories';
import ProductReviewDetails from './pages/RateDetail';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor" element={<ProductsPages />} />
        <Route path="/vendor/rate" element={<RatingAndCategoryProductsPages />} />
        <Route path="/vendor/rate/products/:productName" element={<RatingProductsPages />} />
        <Route path="/vendor/rate/categories/:categoryName" element={<RatingCategoriesPages />} />
        <Route path="/vendor/rate/:reviewId" element={<ProductReviewDetails />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default App;

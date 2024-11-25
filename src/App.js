import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPages from './pages/ProductsPage';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendor" element={<ProductsPages />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
    </Router>
  );
};

export default App;

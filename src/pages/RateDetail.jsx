import React from 'react';

const ProductReviewDetails = ({ productName, reviewerName, rating, comment, productImage }) => {
  return (
    <div className="product-review-details">
      <div className="review-header">
        <img src={productImage} alt={productName} className="product-image" />
        <div>
          <h2 className="product-name">{productName}</h2>
          <p className="reviewer-name">Đánh giá bởi: {reviewerName}</p>
        </div>
      </div>
      <div className="review-content">
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={`star ${index < rating ? 'active' : ''}`}>
              &#9733;
            </span>
          ))}
          <span className="rating-value">{rating}/5</span>
        </div>
        <p className="review-comment">{comment}</p>
      </div>
      <div className="review-actions">
        <button className="btn btn-primary">Lưu</button>
        <button className="btn btn-secondary">Hủy</button>
      </div>
    </div>
  );
};

export default ProductReviewDetails;
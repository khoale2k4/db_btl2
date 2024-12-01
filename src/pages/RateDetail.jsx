import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const ProductReviewDetails = () => {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { reviewId } = useParams();  // Get reviewId from URL parameters

    useEffect(() => {
        const fetchReviewDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/api/getReviewDetails?reviewId=${reviewId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch review details');
                }
                const data = await response.json();
                setReview(data.data[0]); // Set the fetched data into state
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [reviewId]);  // Fetch the data whenever reviewId changes

    if (loading) return <div className="text-center py-8 text-xl">Đang tải...</div>;
    if (error) return <div className="text-center py-8 text-xl text-red-500">Lỗi: {error}</div>;
    if (!review) return <div className="text-center py-8 text-xl">Không tìm thấy đánh giá.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex mb-6">
                <img
                    src={review.ProductImage} 
                    alt={review.ProductName} 
                    className="w-32 h-32 object-cover rounded-lg mr-6" 
                />
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800">{review.ProductName}</h2>
                    <p className="text-gray-500 text-lg">Đánh giá bởi: {review.ReviewerName}</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, index) => (
                        <span 
                            key={index} 
                            className={`text-xl ${index < review.Rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                            &#9733;
                        </span>
                    ))}
                    <span className="ml-2 text-lg text-gray-700">{review.Rating}/5</span>
                </div>
                <p className="mt-4 text-gray-600 text-lg">{review.Comment}</p>
            </div>
        </div>
    );
};

export default ProductReviewDetails;

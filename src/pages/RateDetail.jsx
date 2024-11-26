import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const ProductReviewDetails = () => {
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { reviewId } = useParams();

    const sampleReviews = [
        {
            id: '1',
            productName: 'Sản phẩm 1',
            reviewerName: 'Người dùng A',
            rating: 4,
            comment: 'Sản phẩm rất tốt, tôi sẽ mua lại.',
            productImage: 'https://example.com/product-image-1.jpg',
        },
        {
            id: '2',
            productName: 'Sản phẩm 2',
            reviewerName: 'Người dùng B',
            rating: 5,
            comment: 'Chất lượng tuyệt vời! Hoàn toàn hài lòng.',
            productImage: 'https://example.com/product-image-2.jpg',
        },
        {
            id: '3',
            productName: 'Sản phẩm 3',
            reviewerName: 'Người dùng C',
            rating: 3,
            comment: 'Sản phẩm ổn nhưng có thể cải thiện.',
            productImage: 'https://example.com/product-image-3.jpg',
        },
        {
            id: '4',
            productName: 'Sản phẩm 4',
            reviewerName: 'Người dùng D',
            rating: 2,
            comment: 'Không như kỳ vọng, chất lượng không tốt.',
            productImage: 'https://example.com/product-image-4.jpg',
        },
        {
            id: '5',
            productName: 'Sản phẩm 5',
            reviewerName: 'Người dùng E',
            rating: 5,
            comment: 'Sản phẩm tuyệt vời, xứng đáng với giá tiền.',
            productImage: 'https://example.com/product-image-5.jpg',
        },
    ];

    useEffect(() => {
        const fetchReviewDetails = async () => {
            try {
                setLoading(true);
                setReview(sampleReviews[0]); // Lưu dữ liệu vào state
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Đã có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [reviewId]);

    if (loading) return <div className="text-center py-8 text-xl">Đang tải...</div>;
    if (error) return <div className="text-center py-8 text-xl text-red-500">Lỗi: {error}</div>;
    if (!review) return <div className="text-center py-8 text-xl">Không tìm thấy đánh giá.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex mb-6">
                <img src={review.productImage} alt={review.productName} className="w-32 h-32 object-cover rounded-lg mr-6" />
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800">{review.productName}</h2>
                    <p className="text-gray-500 text-lg">Đánh giá bởi: {review.reviewerName}</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className={`text-xl ${index < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                            &#9733;
                        </span>
                    ))}
                    <span className="ml-2 text-lg text-gray-700">{review.rating}/5</span>
                </div>
                <p className="mt-4 text-gray-600 text-lg">{review.comment}</p>
            </div>
        </div>
    );
};

export default ProductReviewDetails;

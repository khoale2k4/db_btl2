import React, { useEffect, useState } from "react";
import DataTable from '../components/DataTable.jsx';
import { useNavigate, useParams } from "react-router-dom";

const column = [
    { header: "Người đánh giá", accessor: "ReviewerName" },
    { header: "Số điểm", accessor: "Rating" },
    { header: "Bình luận", accessor: "ReviewComment" },
];

const RatingProductsPages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-10-01');
    const [reviews, setReviews] = useState([]); // State for reviews data
    const { productId } = useParams();
    const navigate = useNavigate();

    // Fetch data from the API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/getProductReviews?productId=${productId}`);
                const data = await response.json();
                setReviews(data.data); // Assuming the API returns an array of reviews
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, []);

    const handleSearch = () => {
        console.log(`Tìm kiếm: ${searchTerm}, từ ${startDate} đến ${endDate}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('2024-01-01');
        setEndDate('2024-10-01');
    };

    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleRowClick = (item) => {
        navigate(`/vendor/rate/${item.ReviewID}}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Đánh giá về sản phẩm</h1>
                <div className="bg-white p-4 rounded shadow">
                    {/* Search Form */}
                    <div className="flex space-x-4 mb-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 flex-1 rounded"
                        />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <span className="self-center">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <button onClick={handleSearch} className="bg-orange-500 text-white px-4 py-2 rounded">
                            Tìm
                        </button>
                        <button onClick={clearFilters} className="border px-4 py-2 rounded">
                            Dọn sạch
                        </button>
                    </div>

                    {/* Table */}
                    <div>
                        <div className="text-right mb-2">
                            <button className="border px-4 py-2 rounded">Tăng/Giảm</button>
                        </div>

                        <DataTable
                            data={reviews} // Use the fetched reviews
                            columns={column}
                            page={page}
                            totalPages={totalPages}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                            onClick={handleRowClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingProductsPages;

import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import { useNavigate, useParams } from "react-router-dom";

const column = [
    { header: "Người đánh giá", accessor: "ReviewerName" },
    { header: "Số điểm", accessor: "Rating" },
    { header: "Bình luận", accessor: "ReviewComment" },
];

const RatingProductsPages = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("ReviewerName"); // Trường lọc mặc định
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [isAscending, setIsAscending] = useState(true); // Toggle tăng/giảm
    const { productId } = useParams();
    const navigate = useNavigate();

    const itemsPerPage = 5;
    const [page, setPage] = useState(1);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/getProductReviews?productId=${productId}`
                );
                const data = await response.json();
                setReviews(data.data);
                setFilteredReviews(data.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [productId]);

    // Thực hiện tìm kiếm ngay khi nhập
    useEffect(() => {
        const filtered = reviews.filter((item) =>
            item[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReviews(filtered);
        setPage(1); // Reset về trang đầu
    }, [searchTerm, searchField, reviews]);

    // Xử lý sắp xếp
    const handleSort = () => {
        const sorted = [...filteredReviews].sort((a, b) => {
            const comparison =
                a[searchField] > b[searchField] ? 1 : a[searchField] < b[searchField] ? -1 : 0;
            return isAscending ? comparison : -comparison;
        });

        setFilteredReviews(sorted);
        setIsAscending(!isAscending); // Toggle thứ tự sắp xếp
    };

    // Phân trang
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Xử lý click vào dòng
    const handleRowClick = (item) => {
        navigate(`/vendor/rate/${item.ReviewID}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Đánh giá về sản phẩm</h1>
                <div className="bg-white p-4 rounded shadow">
                    {/* Form tìm kiếm */}
                    <div className="flex space-x-4 mb-4">
                        <input
                            type="text"
                            placeholder={`Tìm theo ${searchField}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 flex-1 rounded"
                        />
                        <select
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="ReviewerName">Người đánh giá</option>
                            <option value="Rating">Số điểm</option>
                            <option value="ReviewComment">Bình luận</option>
                        </select>
                        <button onClick={handleSort} className="bg-orange-500 text-white px-4 py-2 rounded">
                            {isAscending ? "Tăng dần" : "Giảm dần"}
                        </button>
                    </div>

                    {/* Bảng dữ liệu */}
                    {filteredReviews.length === 0 ? (
                        <p className="text-center text-gray-500">Không có dữ liệu.</p>
                    ) : (
                        <DataTable
                            data={filteredReviews.slice(
                                (page - 1) * itemsPerPage,
                                page * itemsPerPage
                            )}
                            columns={column}
                            page={page}
                            totalPages={totalPages}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                            onClick={handleRowClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RatingProductsPages;

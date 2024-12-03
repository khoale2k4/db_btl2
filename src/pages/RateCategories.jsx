import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable.jsx";
import { useNavigate, useParams } from "react-router-dom";

const column = [
    { header: "Người đánh giá", accessor: "ReviewerName" },
    { header: "Sản phẩm", accessor: "ProductName" },
    { header: "Số điểm", accessor: "RatingScore" },
    { header: "Bình luận", accessor: "ReviewComment" },
];

const RatingCategoriesPages = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("ReviewerName"); // Trường lọc mặc định
    const [ratingData, setRatingData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAscending, setIsAscending] = useState(true); // Toggle tăng/giảm
    const [page, setPage] = useState(1);
    const vendorId = 2;
    const itemsPerPage = 5;

    const { categoryId } = useParams();
    const navigate = useNavigate();

    // Fetch dữ liệu từ API
    const fetchRatingData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:3001/api/getReviewsByCategoryAndVendor?vendorId=${vendorId}&categoryId=${categoryId}`
            );
            const data = await response.json();
            if (data.success) {
                setRatingData(data.data);
                setFilteredData(data.data);
            } else {
                setError("Không thể lấy dữ liệu.");
            }
        } catch (err) {
            setError("Lỗi khi gọi API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatingData();
    }, []);

    // Thực hiện tìm kiếm ngay khi người dùng nhập
    useEffect(() => {
        const filtered = ratingData.filter((item) => {
            return (
                searchTerm === "" ||
                item[searchField]
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        });

        setFilteredData(filtered);
        setPage(1); // Reset về trang đầu
    }, [searchTerm, searchField, ratingData]);

    // Xử lý sắp xếp
    const handleSort = () => {
        const sorted = [...filteredData].sort((a, b) => {
            const comparison =
                a[searchField] > b[searchField] ? 1 : a[searchField] < b[searchField] ? -1 : 0;
            return isAscending ? comparison : -comparison;
        });

        setFilteredData(sorted);
        setIsAscending(!isAscending); // Toggle thứ tự sắp xếp
    };

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    // Xử lý khi click vào dòng
    const handleRowClick = (item) => {
        navigate(`/vendor/rate/${item.ReviewID}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Đánh giá của ngành hàng</h1>
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
                            <option value="ProductName">Sản phẩm</option>
                            <option value="RatingScore">Số điểm</option>
                            <option value="ReviewComment">Bình luận</option>
                        </select>
                        <button onClick={handleSort} className="bg-orange-500 text-white px-4 py-2 rounded">
                            {isAscending ? "Tăng dần" : "Giảm dần"}
                        </button>
                    </div>

                    {/* Hiển thị lỗi */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Hiển thị trạng thái tải */}
                    {loading ? (
                        <div className="text-center">Đang tải dữ liệu...</div>
                    ) : (
                        <DataTable
                            data={filteredData.slice(
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

export default RatingCategoriesPages;

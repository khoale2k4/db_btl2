import React from "react";
import DataTable from '../components/DataTable.jsx';
import { useNavigate, useParams } from "react-router-dom";

const column = [
    { header: "Người đánh giá", accessor: "ReviewerName" },
    { header: "Sản phẩm", accessor: "ProductName" },
    { header: "Số điểm", accessor: "RatingScore" },
    { header: "Bình luận", accessor: "ReviewComment" },
]

const RatingCategoriesPages = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [startDate, setStartDate] = React.useState('2024-01-01');
    const [endDate, setEndDate] = React.useState('2024-10-01');
    const { categoryId } = useParams();
    const navigate = useNavigate(); 
    const [ratingData, setRatingData] = React.useState([]); // Dữ liệu nhận từ API
    const [loading, setLoading] = React.useState(true); // Trạng thái loading
    const [error, setError] = React.useState(null); // Xử lý lỗi

    // Fetch dữ liệu từ API
    const fetchRatingData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getReviewsByCategoryAndVendor?vendorId=1&categoryId=${categoryId}`);
            const data = await response.json();
            if (data.success) {
                setRatingData(data.data); // Cập nhật dữ liệu vào state
            } else {
                setError("Không thể lấy dữ liệu.");
            }
        } catch (error) {
            setError("Lỗi khi gọi API.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRatingData(); // Gọi API khi component được render
    }, []);

    const handleSearch = () => {
        console.log(`Tìm kiếm: ${searchTerm}, từ ${startDate} đến ${endDate}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('2024-01-01');
        setEndDate('2024-10-01');
    };

    const [page, setPage] = React.useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(ratingData.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleRowClick = (item) => {
        navigate(`/vendor/rate/${item.ReviewID}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Đánh giá của ngành hàng</h1>
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

                    {/* Error message */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Loading state */}
                    {loading ? (
                        <div className="text-center">Đang tải dữ liệu...</div>
                    ) : (
                        <div>
                            <div className="text-right mb-2">
                                <button className="border px-4 py-2 rounded">Tăng/Giảm</button>
                            </div>

                            {/* Data Table */}
                            <DataTable
                                data={ratingData}
                                columns={column}
                                page={page}
                                totalPages={totalPages}
                                handlePreviousPage={handlePreviousPage}
                                handleNextPage={handleNextPage}
                                onClick={handleRowClick}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RatingCategoriesPages;

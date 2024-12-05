import React from "react";
import DataTable from '../components/DataTable.jsx';
import { useNavigate, useParams } from "react-router-dom";

const column = [
    { header: "Người đánh giá", accessor: "name" },
    { header: "Sản phẩm", accessor: "productName" },
    { header: "Số điểm", accessor: "rate" },
    { header: "Bình luận", accessor: "comment" },
]

const RatingCategoriesPages = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [startDate, setStartDate] = React.useState('2024-01-01');
    const [endDate, setEndDate] = React.useState('2024-10-01');
    const { categoryName } = useParams();
    const navigate = useNavigate(); 
    const sampleData = [
        {
            id: 1,
            name: "Người dùng A",
            productName: "Sản phẩm 1",
            rate: 4,
            comment: "Sản phẩm rất tốt, tôi sẽ mua lại."
        },
        {
            id: 1,
            name: "Người dùng B",
            productName: "Sản phẩm 2",
            rate: 5,
            comment: "Chất lượng tuyệt vời, rất hài lòng với sản phẩm này."
        },
        {
            id: 1,
            name: "Người dùng C",
            productName: "Sản phẩm 3",
            rate: 3,
            comment: "Sản phẩm ổn, nhưng tôi mong chờ nó tốt hơn."
        },
        {
            id: 1,
            name: "Người dùng D",
            productName: "Sản phẩm 4",
            rate: 2,
            comment: "Không như kỳ vọng, chất lượng không tốt."
        },
        {
            id: 1,
            name: "Người dùng E",
            productName: "Sản phẩm 5",
            rate: 4,
            comment: "Tốt, giá cả hợp lý, sẽ giới thiệu cho bạn bè."
        }
    ];

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
    const totalPages = Math.ceil(sampleData.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleRowClick = (item) => {
        navigate(`/vendor/rate/${item.id}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Đánh giá của ngành hàng {categoryName}</h1>
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
                            data={sampleData}
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

export default RatingCategoriesPages;

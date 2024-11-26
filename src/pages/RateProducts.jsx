import React from "react";
import DataTable from '../components/DataTable.jsx';
import { useNavigate, useParams } from "react-router-dom";

const column = [
    // { header: "Ngành hàng", accessor: "category" },
    { header: "Người đánh giá", accessor: "name" },
    { header: "Số điểm", accessor: "rate" },
    { header: "Bình luận", accessor: "comment" },
]

const RatingProductsPages = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [startDate, setStartDate] = React.useState('2024-01-01');
    const [endDate, setEndDate] = React.useState('2024-10-01');
    const { productName } = useParams();
    const navigate = useNavigate(); 
    const sampleData = [
        {
            name: "Nguyễn Văn A",
            category: "Ngành 1",
            rate: 5,
            comment: "Sản phẩm rất tốt, đáng mua!",
        },
        {
            name: "Trần Thị B",
            category: "Ngành 1",
            rate: 4,
            comment: "Chất lượng ổn nhưng giao hàng hơi chậm.",
        },
        {
            name: "Phạm Văn C",
            category: "Ngành 1",
            rate: 3,
            comment: "Giá hơi cao so với chất lượng.",
        },
        {
            name: "Lê Thị D",
            category: "Ngành 1",
            rate: 2,
            comment: "Sản phẩm không giống như hình ảnh.",
        },
        {
            name: "Hoàng Văn E",
            category: "Ngành 1",
            rate: 1,
            comment: "Rất thất vọng, sẽ không mua lần sau.",
        },
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
                <h1 className="text-2xl font-bold mb-4">Đánh giá về sản phẩm {productName}</h1>
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

export default RatingProductsPages;

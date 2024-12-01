import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from '../components/DataTable.jsx';

const columnProduct = [
    // { header: " ", accessor: "image" },
    { header: "Tên sản phẩm", accessor: "ProductName" },
    { header: "Doanh thu (nghìn VNĐ)", accessor: "TotalRevenue" },
    { header: "Đã bán", accessor: "Sold" },
    { header: "Đánh giá", accessor: "AverageRating" },
];

const columnCategory = [
    { header: "Tên ngành hàng", accessor: "Category_Name" },
    { header: "Doanh thu", accessor: "TotalRevenue" },
    { header: "Đánh giá trung bình", accessor: "AverageRating" },
];

const RatingAndCategoryProductsPages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('Ngành hàng');
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-10-01');
    const [categoryData, setCategoryData] = useState([]);
    const [products, setProducts] = React.useState([]);
    const vendorId = 1;
    const navigate = useNavigate();

    const fetchCategoryData = async () => {
        const response = await fetch(`http://localhost:3001/api/getCategoryAverageRatingAndRevenueByVendor?vendorId=${vendorId}`);
        const result = await response.json();
        if (result.success) {
            setCategoryData(result.data);
        } else {
            console.error("Error fetching category data:", result.message);
        }
    };
    const fetchProductData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getVendorProductStats?vendorId=${vendorId}`);
            const data = await response.json();
            if (data.success) {
                setProducts(data.data); // Cập nhật dữ liệu sản phẩm
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
        }
    };

    React.useEffect(() => {
        if (searchField === "Ngành hàng") {
            fetchCategoryData();
        } else if (searchField === "Sản phẩm") {
            fetchProductData();
        }
    }, [searchField]); // Gọi lại khi searchField thay đổi

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
    const totalPages = Math.ceil(categoryData.length / itemsPerPage);

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleToggleField = (e) => {
        if (e.target.value === "nganh-hang") setSearchField('Ngành hàng');
        else if (e.target.value === "san-pham") setSearchField('Sản phẩm');
    }

    const handleRowClick = (item) => {
        if(searchField === "Sản phẩm") navigate(`/vendor/rate/products/${item.ProductID}`);
        else navigate(`/vendor/rate/categories/${item.CategoryID}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Đánh giá</h1>
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
                        <select
                            className="border p-2 rounded"
                            onChange={handleToggleField} // Thay đổi hành động xử lý khi lựa chọn
                        >
                            <option value="nganh-hang">Ngành hàng</option>
                            <option value="san-pham">Sản phẩm</option>
                        </select>

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
                            data={searchField === "Ngành hàng" ? categoryData : products}
                            columns={searchField === "Ngành hàng" ? columnCategory : columnProduct}
                            page={page}
                            totalPages={totalPages}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                            onClick={handleRowClick} // Truyền hàm xử lý onClick
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingAndCategoryProductsPages;

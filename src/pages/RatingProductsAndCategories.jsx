import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from '../components/DataTable.jsx';

const columnProduct = [
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
    const [searchField, setSearchField] = useState('Tên');
    const [dataType, setDataType] = useState('Ngành hàng');
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-10-01');
    const [categoryData, setCategoryData] = useState([]);
    const [products, setProducts] = React.useState([]);
    const [selectedField, setSelectedField] = useState("TotalRevenue"); // Trường được chọn
    const [isAscending, setIsAscending] = useState(true); // Toggle tăng/giảm
    const vendorId = 1;
    const itemsPerPage = 5; // Số lượng mục mỗi trang
    const navigate = useNavigate();

    const fetchCategoryData = async () => {
        const response = await fetch(`http://localhost:3001/api/getCategoryAverageRatingAndRevenueByVendor?vendorId=${vendorId}`);
        const result = await response.json();
        console.log(result);
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
            console.log(data);
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
        }
    };

    useEffect(() => {
        if (dataType === "Ngành hàng") {
            fetchCategoryData();
        } else if (dataType === "Sản phẩm") {
            fetchProductData();
        }
    }, [dataType]);

    // Xử lý toggle sắp xếp
    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    };

    // Lọc và sắp xếp dữ liệu
    const sortedData = () => {
        const data = dataType === "Ngành hàng" ? [...categoryData] : [...products];
        return data
            .filter(item =>
                searchTerm === '' ||
                (item[selectedField] && item[selectedField].toString().toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                if (typeof a[selectedField] === "number" && typeof b[selectedField] === "number") {
                    return isAscending ? a[selectedField] - b[selectedField] : b[selectedField] - a[selectedField];
                } else if (typeof a[selectedField] === "string" && typeof b[selectedField] === "string") {
                    return isAscending
                        ? a[selectedField].localeCompare(b[selectedField])
                        : b[selectedField].localeCompare(a[selectedField]);
                }
                return 0;
            });
    };

    const [page, setPage] = useState(1); // Trang hiện tại
    const totalPages = Math.ceil(sortedData().length / itemsPerPage); // Tổng số trang

    // Hàm xử lý khi chuyển về trang trước
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    // Hàm xử lý khi chuyển đến trang tiếp theo
    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handleRowClick = (item) => {
        if (dataType === "Ngành hàng") navigate(`/vendor/rate/categories/${item.CategoryID}`);
        else navigate(`/vendor/rate/products/${item.ProductID}`);
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
                            placeholder={`Tìm theo ${searchField}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 flex-1 rounded"
                        />
                        <select
                            className="border p-2 rounded"
                            onChange={(e) => {
                                setSearchField(e.target.value);
                                setSelectedField(e.target.value); // Đồng bộ trường chọn với select
                            }}
                        >
                            <option value={dataType === "Ngành hàng" ? "Category_Name" : "ProductName"}>Tên</option>
                            <option value="TotalRevenue">Doanh thu</option>
                            {dataType !== "Ngành hàng" && <option value="Sold">Đã bán</option>}
                            <option value="AverageRating">Đánh giá</option>
                        </select>
                        <select
                            className="border p-2 rounded"
                            onChange={(e) => setDataType(e.target.value)}
                        >
                            <option value="Ngành hàng">Ngành hàng</option>
                            <option value="Sản phẩm">Sản phẩm</option>
                        </select>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={toggleSortOrder}>
                            {isAscending ? "Tăng dần" : "Giảm dần"}
                        </button>
                    </div>

                    {/* Table */}
                    <DataTable
                        data={sortedData()}
                        columns={dataType === "Ngành hàng" ? columnCategory : columnProduct}
                        page={page}
                        totalPages={totalPages}
                        handlePreviousPage={handlePreviousPage}
                        handleNextPage={handleNextPage}
                        onClick={handleRowClick}
                    />
                </div>
            </div>
        </div>
    );
};


export default RatingAndCategoryProductsPages;

import React from "react";
import { useNavigate } from "react-router-dom";
import DataTable from '../components/DataTable.jsx';

const columnProduct = [
    { header: " ", accessor: "image" },
    { header: "Tên sản phẩm", accessor: "name" },
    { header: "Giá bán", accessor: "price" },
    { header: "Đã bán", accessor: "sold" },
    { header: "Đánh giá", accessor: "rate" },
]

const columnCategory = [
    { header: "Tên ngành hàng", accessor: "name" },
    { header: "Doanh thu", accessor: "revenue" },
    { header: "Đánh giá trung bình", accessor: "rate" },
]

const RatingAndCategoryProductsPages = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchField, setSearchField] = React.useState('Ngành hàng');
    const [startDate, setStartDate] = React.useState('2024-01-01');
    const [endDate, setEndDate] = React.useState('2024-10-01');
    const navigate = useNavigate(); 

    const sampleProducts = [
        { name: 'Sản phẩm 1', price: '100.000 VNĐ', sold: 50, rate: 4.5, image: 'https://cdn.shopify.com/s/files/1/0070/7032/files/trending-products_c8d0d15c-9afc-47e3-9ba2-f7bad0505b9b.png?v=1614559651' },
        { name: 'Sản phẩm 2', price: '200.000 VNĐ', sold: 30, rate: 3.2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThuRLQ00PI01Wk9hq7N0HdhLaJgUw_e925CQ&s' },
        { name: 'Sản phẩm 3', price: '150.000 VNĐ', sold: 20, rate: 2.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSykUhFDLt30fbBfTxIm4h-tCKn8u9T-MKgQ&s' },
        { name: 'Sản phẩm 4', price: '300.000 VNĐ', sold: 10, rate: 4.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7YeQs9C83XEO8vD5CMxIpWgCpeRxGlVHxMQ&s' },
        { name: 'Sản phẩm 5', price: '250.000 VNĐ', sold: 5, rate: 2.3, image: 'https://thumbs.dreamstime.com/b/shopping-carte-groceries-cart-isolated-white-30481805.jpg' },
    ];

    const sampleCategory = [
        { name: 'Ngành 1', rate: 4.5, revenue: 1000000 },
        { name: 'Ngành 2', rate: 3.2, revenue: 500000 },
        { name: 'Ngành 3', rate: 2.9, revenue: 200000 },
        { name: 'Ngành 4', rate: 4.9, revenue: 300000 },
        { name: 'Ngành 5', rate: 2.3, revenue: 100000 },
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
    const totalPages = Math.ceil(sampleProducts.length / itemsPerPage);

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
        if(searchField==="Sản phẩm") navigate(`/vendor/rate/products/${item.name}`);
        else navigate(`/vendor/rate/categories/${item.name}`);
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
                        {searchField==="Sản phẩm"?<select
                            className="border p-2 rounded"
                            // onChange={handleToggleField} 
                        >
                            <option value="dien-tu">Điện tử</option>
                            <option value="noi-that">Nội thất</option>
                            <option value="san-pham">Nội thất</option>
                            <option value="san-pham">Nội thất</option>
                        </select>:<p></p>}
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
                            data={searchField === "Ngành hàng" ? sampleCategory : sampleProducts}
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

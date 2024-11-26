import React from "react";
import DataTable from '../components/DataTable.jsx';

const column = [
    { header: " ", accessor: "image" },
    { header: "Tên sản phẩm", accessor: "name" },
    { header: "Giá bán", accessor: "price" },
    { header: "Đã bán", accessor: "sold" },
]

const ProductsPages = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [startDate, setStartDate] = React.useState('2024-01-01');
    const [endDate, setEndDate] = React.useState('2024-10-01');

    const sampleProducts = [
        { name: 'Sản phẩm 1', price: '100.000 VNĐ', sold: 50, image: 'https://cdn.shopify.com/s/files/1/0070/7032/files/trending-products_c8d0d15c-9afc-47e3-9ba2-f7bad0505b9b.png?v=1614559651' },
        { name: 'Sản phẩm 2', price: '200.000 VNĐ', sold: 30, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThuRLQ00PI01Wk9hq7N0HdhLaJgUw_e925CQ&s' },
        { name: 'Sản phẩm 3', price: '150.000 VNĐ', sold: 20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSykUhFDLt30fbBfTxIm4h-tCKn8u9T-MKgQ&s' },
        { name: 'Sản phẩm 4', price: '300.000 VNĐ', sold: 10, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7YeQs9C83XEO8vD5CMxIpWgCpeRxGlVHxMQ&s' },
        { name: 'Sản phẩm 5', price: '250.000 VNĐ', sold: 5, image: 'https://thumbs.dreamstime.com/b/shopping-carte-groceries-cart-isolated-white-30481805.jpg' },
    ];

    const [products, setProducts] = React.useState(sampleProducts);

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

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Xu hướng</h1>
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
                            data={sampleProducts}
                            columns={column}
                            page={page}
                            totalPages={totalPages}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPages;

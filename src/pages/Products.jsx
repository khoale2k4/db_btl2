import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable.jsx';

const column = [
    // { header: " ", accessor: "ProductImage" },
    { header: "Tên sản phẩm", accessor: "ProductName" },
    { header: "Tổng doanh thu (nghìn VNĐ)", accessor: "TotalSalesAmount" },
    { header: "Đã bán", accessor: "TotalQuantitySold" },
]

const ProductsPages = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [startDate, setStartDate] = React.useState('2024-01-01');
    const [endDate, setEndDate] = React.useState('2024-12-31');
    const [data2, setData2] = React.useState([]);
    const vendorId = 2;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get(`http://localhost:3001/api/getProducts?vendorId=${vendorId}&start=${startDate}&end=${endDate}`)
            .then(response => {setData2(response.data.data); console.log(response);})
            .catch(error => console.error('Error fetching data:', error));
            console.log(data2);
    }

    const handleSearch = () => {
        console.log(`Tìm kiếm: ${searchTerm}, từ ${startDate} đến ${endDate}`);
        fetchProducts();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('2024-01-01');
        setEndDate('2024-10-01');
    };

    const [page, setPage] = React.useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(data2.length / itemsPerPage);

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
                        <DataTable
                            data={data2.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                                // 
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

import React from "react";

const DataTable = ({
  data,
  columns,
  page,
  totalPages,
  handlePreviousPage,
  handleNextPage,
  onClick, 
  children,
}) => {
  return (
    <div>
      {children}

      <table className="w-full text-left bg-white">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="border-b-2 p-4 font-bold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onClick && onClick(item)} // Gọi hàm onClick khi nhấn vào hàng
              className="cursor-pointer hover:bg-gray-100"
            >
              {columns.map((column) => (
                <td key={column.accessor} className="border-b p-4">
                  {column.accessor === "ProductImage" ? (
                    <img
                      src={item[column.accessor]}
                      alt={item.name || "Hình ảnh"}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    item[column.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded-lg"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Trang trước
          </button>
          <span className="font-medium">
            {page} / {totalPages}
          </span>
          <button
            className="bg-gray-200 px-4 py-2 rounded-lg"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

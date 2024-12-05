// import React, { useState } from "react";

// const Cart = () => {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: "Cà phê phố - cà phê rang xay",
//       price: 43000,
//       src: "https://via.placeholder.com/100", // Thêm URL ảnh cho sản phẩm
//     },
//     {
//       id: 2,
//       name: "Trà sữa - Trà đen sữa",
//       price: 25000,
//       src: "https://via.placeholder.com/100", // Thêm URL ảnh cho sản phẩm
//     },
//   ].map(product => ({ ...product, quantity: product.quantity || 1 }))); // Mặc định quantity là 1 nếu không có

//   const [isVoucherOpen, setIsVoucherOpen] = useState(false);
//   const [selectedVoucher, setSelectedVoucher] = useState(null);

//   const vouchers = [
//     { id: 1, name: "Giảm 10%", discount: 10 },
//     { id: 2, name: "Giảm 50.000 VND", discount: 50000 },
//     { id: 3, name: "Miễn phí vận chuyển", discount: 0 },
//   ];

//   const toggleVoucherList = () => {
//     setIsVoucherOpen((prev) => !prev);
//   };

//   const handleSelectVoucher = (voucherId) => {
//     setSelectedVoucher(voucherId);
//     setIsVoucherOpen(false); // Đóng danh sách sau khi chọn
//   };

//   const handleQuantityChange = (id, change) => {
//     setProducts((prevProducts) =>
//       prevProducts.map((product) =>
//         product.id === id
//           ? { ...product, quantity: Math.max(1, product.quantity + change) }
//           : product
//       )
//     );
//   };

//   const calculateTotal = () => {
//     return products.reduce(
//       (total, product) => total + product.price * product.quantity,
//       0
//     );
//   };

//   const orderTotal = calculateTotal();
//   const discount = selectedVoucher
//     ? vouchers.find((v) => v.id === selectedVoucher).discount
//     : 0;
//   const finalTotal = orderTotal - discount;

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
//       <div className="bg-white rounded-lg shadow-lg p-4">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="border-b">
//               <th className="p-4 font-semibold">Ảnh</th>
//               <th className="p-4 font-semibold">Tên sản phẩm</th>
//               <th className="p-4 font-semibold">Đơn giá</th>
//               <th className="p-4 font-semibold">Số lượng</th>
//               <th className="p-4 font-semibold">Số tiền</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product.id} className="border-b">
//                 <td className="p-4">
//                   <img
//                     src={product.src}
//                     alt={product.name}
//                     className="w-20 h-20 object-cover"
//                   />
//                 </td>
//                 <td className="p-4">{product.name}</td>
//                 <td className="p-4">{product.price.toLocaleString()} VNĐ</td>
//                 <td className="p-4 flex items-center space-x-2">
//                   <button
//                     className="px-3 py-1 border rounded-lg"
//                     onClick={() => handleQuantityChange(product.id, -1)}
//                     disabled={product.quantity === 1}
//                   >
//                     -
//                   </button>
//                   <span>{product.quantity}</span>
//                   <button
//                     className="px-3 py-1 border rounded-lg"
//                     onClick={() => handleQuantityChange(product.id, 1)}
//                   >
//                     +
//                   </button>
//                 </td>
//                 <td className="p-4">
//                   {(product.price * product.quantity).toLocaleString()} VNĐ
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Vùng Voucher */}
//       <div className="flex justify-between items-center mt-6">
//         <div>
//           <button
//             className="bg-gray-200 px-4 py-2 rounded-lg"
//             onClick={toggleVoucherList}
//           >
//             Voucher
//           </button>
//         </div>
//         <div className="text-xl font-semibold">
//           {selectedVoucher
//             ? vouchers.find((v) => v.id === selectedVoucher).name
//             : "Chưa chọn voucher"}
//         </div>
//       </div>

//       {/* Danh sách voucher */}
//       {isVoucherOpen && (
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-300 w-96 p-4">
//           <h2 className="text-xl font-bold mb-4">Chọn Voucher</h2>
//           <ul className="space-y-2">
//             {vouchers.map((voucher) => (
//               <li
//                 key={voucher.id}
//                 className={`p-2 border rounded-lg cursor-pointer ${
//                   selectedVoucher === voucher.id
//                     ? "bg-gray-100 border-blue-500"
//                     : "hover:bg-gray-50"
//                 }`}
//                 onClick={() => handleSelectVoucher(voucher.id)}
//               >
//                 {voucher.name}
//               </li>
//             ))}
//           </ul>
//           <button
//             className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
//             onClick={toggleVoucherList}
//           >
//             Đóng
//           </button>
//         </div>
//       )}

//       {/* Nút xác nhận mua */}
//       <div className="mt-6">
//         <div className="flex justify-between">
//           <div className="text-lg font-semibold">
//             Tổng tiền: {orderTotal.toLocaleString()} VNĐ
//           </div>
//           <div className="text-lg font-semibold">
//             Giảm giá: {discount.toLocaleString()} VNĐ
//           </div>
//         </div>
//         <div className="flex justify-between mt-2">
//           <div className="text-lg font-semibold">Tổng cộng:</div>
//           <div className="text-lg font-semibold">
//             {finalTotal.toLocaleString()} VNĐ
//           </div>
//         </div>
//         <div className="flex justify-end mt-6">
//           <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
//             Xác nhận mua
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);


  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data/products");
        const fetchedProducts = response.data.map(product => ({
          id: product.ProductID,
          name: product.ProductName,
          image: product.ProductImage,
          price: product.SalePrice,
          quantity: 1, // Mặc định số lượng mỗi sản phẩm là 1
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Lấy dữ liệu voucher
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data/vouchers");
        const fetchedVouchers = response.data.map(voucher => ({
          id: voucher.VouchersID,
          name: voucher.DiscountName,
          discount: voucher.DiscountValue,
        }));
        setVouchers(fetchedVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleSelectVoucher = (voucherId) => {
    setSelectedVoucher(voucherId);
  };

  const handleQuantityChange = (id, change) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + change) }
          : product
      )
    );
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const voucherPercent = selectedVoucher
        ? vouchers.find((v) => v.id === selectedVoucher).discount
        : 0;

      const orderData = {
        products: products.map((product) => ({
          Quantity: product.quantity,
          Price: product.price,
        })),
        voucherPercent, // Gửi voucherPercent cùng với dữ liệu sản phẩm
      };

      const response = await axios.post("http://localhost:3001/api/calculateOrderTotal", orderData);
      if (response.data.success) {
        setTotalAmount(response.data.totalAmount); // Cập nhật tổng tiền từ server

        // Tính tổng tiền không giảm giá
        const total = products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        );
        setTotalWithoutDiscount(total);
        await fetchPaymentMethods();
        setShowPaymentOptions(true);
      } else {
        console.error("Error calculating total:", response.data.message);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    } finally {
      setLoading(false);
    }
  };
  // Hàm gọi API lấy danh sách phương thức thanh toán
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/data/PaymentMethod");
      const fetchedMethods = response.data.map(method => ({
        id: method.PaymentMethodID,
        name: method.MethodName,
      }));
      setPaymentMethods(fetchedMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };
  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };
  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    console.log("Phương thức thanh toán đã chọn:", selectedPaymentMethod);
    // Thực hiện logic thanh toán tại đây (gửi API hoặc điều hướng)
  };
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4 font-semibold">Hình ảnh</th>
              <th className="p-4 font-semibold">Tên sản phẩm</th>
              <th className="p-4 font-semibold">Đơn giá</th>
              <th className="p-4 font-semibold">Số lượng</th>
              <th className="p-4 font-semibold">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.price.toLocaleString()} VNĐ</td>
                <td className="p-4 flex items-center space-x-2">
                  <button
                    className="px-3 py-1 border rounded-lg"
                    onClick={() => handleQuantityChange(product.id, -1)}
                    disabled={product.quantity === 1}
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    className="px-3 py-1 border rounded-lg"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </button>
                </td>
                <td className="p-4">
                  {(product.price * product.quantity).toLocaleString()} VNĐ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vùng Voucher */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Chọn Voucher</h2>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedVoucher || ""}
          onChange={(e) => handleSelectVoucher(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">-- Không áp dụng voucher --</option>
          {vouchers.map((voucher) => (
            <option key={voucher.id} value={voucher.id}>
              {voucher.name} - Giảm giá {voucher.discount}%
            </option>
          ))}
        </select>
      </div>

      {/* Xác nhận đơn hàng */}
      <div className="mt-6">
        <button
          className="w-full bg-orange-500 text-white py-2 rounded-lg"
          onClick={handleCreateOrder}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận tạo đơn hàng"}
        </button>
      </div>

      {/* Hiển thị tổng tiền */}
      {totalWithoutDiscount !== null && (
        <div className="mt-4">
          <h2 className="text-lg">
            Tổng thanh toán (không có voucher): {totalWithoutDiscount.toLocaleString()} VNĐ
          </h2>
        </div>
      )}
      {totalAmount !== null && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            Tổng thanh toán: {totalAmount.toLocaleString()} VNĐ
          </h2>
        </div>
      )}
      {/* Hiển thị danh sách phương thức thanh toán */}
      {showPaymentOptions && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Chọn phương thức thanh toán</h2>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedPaymentMethod || ""}
            onChange={(e) => handleSelectPaymentMethod(e.target.value)}
          >
            <option value="">-- Chọn phương thức thanh toán --</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>

          {/* Nút xác nhận thanh toán */}
          <button
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg"
            onClick={handleConfirmPayment}
          >
            Xác nhận thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

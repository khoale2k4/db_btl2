------------------------------------- 2.2.1 trigger cập nhật số lượng hàng trong kho sau khi mua (tạo order)
CREATE TRIGGER trg_update_stock_after_invoice_insert
ON Invoice
AFTER INSERT
AS
BEGIN
    UPDATE Products
    SET StockQuantity = StockQuantity - i.TotalQuantity
    FROM Products p
    INNER JOIN inserted i ON p.ProductID = i.ProductID;
END;

SELECT ProductID, ProductName, StockQuantity FROM Products WHERE ProductID = 1;
INSERT INTO Invoice (InvoiceID, OrderID, ProductID, TotalQuantity, IssueDate)
VALUES (7, 1, 1, 10, '2024-11-15');
SELECT ProductID, ProductName, StockQuantity FROM Products WHERE ProductID = 1;

GO;
------------------------------------- 2.2.2 trigger cập nhật rating của product sau khi có review mới
CREATE TRIGGER trg_UpdateAverageRatingOnReviewInsert
ON Review
AFTER INSERT
AS
BEGIN
    -- Cập nhật Rating trung bình của sản phẩm
    UPDATE Products
    SET Rating = (
        SELECT AVG(CAST(r.Rating AS DECIMAL(3, 2)))
        FROM Review r
        WHERE r.ProductID = i.ProductID
    )
    FROM Products p
    INNER JOIN inserted i ON p.ProductID = i.ProductID;
END;

SELECT ProductName, Rating FROM Products WHERE ProductID = 8;
INSERT INTO Review (ReviewID, ProductID, UserID, Rating, Comment, ReviewDate)
VALUES 
(16, 8, 1, 2, 'Great product, very useful!', '2024-11-05');
SELECT ProductName, Rating FROM Products WHERE ProductID = 8;
INSERT INTO Review (ReviewID, ProductID, UserID, Rating, Comment, ReviewDate)
VALUES 
(17, 8, 1, 5, 'Great product, very useful!', '2024-11-05');
SELECT ProductName, Rating FROM Products WHERE ProductID = 8;
------------------------------------- 2.3.1 Hàm lấy các sản phẩm của một vendor theo khoảng thời gian
SELECT VendorID, ProductName, ProductID FROM Products;
SELECT VendorID, VendorName FROM Vendor;
SELECT OrderId, ProductID, TotalQuantity FROM Invoice;
SELECT OrderID, VendorID, OrderStatus FROM Orders;
GO;

EXEC GetProductSalesByVendor 
    @p_VendorID = 2, 
    @startDate = '2024-01-01', 
    @endDate = '2024-12-31';

IF OBJECT_ID('GetProductSalesByVendor', 'P') IS NOT NULL
    DROP PROCEDURE GetProductSalesByVendor;
GO

CREATE PROCEDURE GetProductSalesByVendor
    @p_VendorID INT,
    @startDate DATE,
    @endDate DATE
AS
BEGIN
    SELECT 
        p.ProductName,
        SUM(i.TotalQuantity) AS TotalQuantitySold,
        SUM(i.TotalQuantity * p.SalePrice) AS TotalSalesAmount
    FROM 
        Products p
    INNER JOIN 
        Invoice i ON p.ProductID = i.ProductID
    INNER JOIN 
        Orders o ON i.OrderID = o.OrderID
    WHERE 
        p.VendorID = @p_VendorID
        AND o.OrderStatus = 'Completed'
        AND o.OrderDate BETWEEN @startDate AND @endDate
    GROUP BY 
        p.ProductName
    HAVING 
        SUM(i.TotalQuantity) > 0
    ORDER BY 
        TotalQuantitySold DESC;
END;
GO
------------------------------------- 2.3.2 Hàm lấy Tổng đánh giá theo phân mục của vendorId
SELECT * FROM Products;
SELECT * FROM Review;
EXEC GetCategoryAverageRatingAndRevenueByVendor @VendorID = 2;

IF OBJECT_ID('GetCategoryAverageRatingAndRevenueByVendor', 'P') IS NOT NULL
    DROP PROCEDURE GetCategoryAverageRatingAndRevenueByVendor;
GO

CREATE PROCEDURE GetCategoryAverageRatingAndRevenueByVendor
    @VendorID INT
AS
BEGIN
    SELECT 
        c.Category_ID AS CategoryID,
        c.Category_Name, -- Sử dụng tên sản phẩm đại diện trong phân mục
        COALESCE(SUM(i.TotalQuantity * p.SalePrice), 0) AS TotalRevenue,
        COALESCE(AVG(CAST(r.Rating AS DECIMAL(10, 2))), 0) AS AverageRating
    FROM Products p
    LEFT JOIN Invoice i ON p.ProductID = i.ProductID
    LEFT JOIN Review r ON p.ProductID = r.ProductID
    LEFT JOIN Category c ON p.CategoryID = c.Category_ID
    WHERE p.VendorID = @VendorID
    GROUP BY c.Category_ID, c.Category_Name;
END;
GO
------------------------------------- 2.3.3 Hàm lấy đánh giá products thuộc về một ngành hàng của vendor
SELECT ProductId, VendorId, ProductName, CategoryId FROM Products;
SELECT * FROM Review;

EXEC GetReviewsByCategoryAndVendor @CategoryID = 1, @VendorID = 2;

IF OBJECT_ID('GetReviewsByCategoryAndVendor', 'P') IS NOT NULL
    DROP PROCEDURE GetReviewsByCategoryAndVendor;
GO

CREATE PROCEDURE GetReviewsByCategoryAndVendor
    @CategoryID INT,  -- ID của ngành hàng
    @VendorID INT     -- ID của vendor
AS
BEGIN
    SELECT 
        r.ReviewID,
        p.ProductName AS ProductName,       -- Tên sản phẩm
        c.FullName AS ReviewerName,         -- Tên người đánh giá
        r.Rating AS RatingScore,            -- Điểm đánh giá
        r.Comment AS ReviewComment          -- Bình luận đánh giá
    FROM 
        Products p
    JOIN 
        Review r ON p.ProductID = r.ProductID  -- Liên kết với bảng đánh giá
    JOIN 
        Customer c ON r.UserID = c.UserID      -- Liên kết với bảng người dùng
    WHERE 
        p.CategoryID = @CategoryID            -- Lọc theo ngành hàng
        AND p.VendorID = @VendorID            -- Lọc theo vendor
    ORDER BY 
        p.ProductName ASC,                    -- Sắp xếp theo tên sản phẩm
        r.Rating DESC;                        -- Sắp xếp đánh giá theo điểm giảm dần
END;
GO
------------------------------------- 2.3.4 Hàm lấy Tổng đánh giá theo hàng của vendorId
SELECT ProductId, VendorId, ProductName, CategoryId FROM Products;
SELECT * FROM Review;

EXEC GetVendorProductStats @VendorID = 1;

IF OBJECT_ID('GetVendorProductStats', 'P') IS NOT NULL
    DROP PROCEDURE GetVendorProductStats;
GO

CREATE PROCEDURE GetVendorProductStats
    @VendorID INT -- ID của vendor
AS
BEGIN
    SELECT 
        p.ProductID,
        p.ProductName AS ProductName,    
        COALESCE(SUM(i.TotalQuantity * p.SalePrice), 0) AS TotalRevenue,
        COALESCE(AVG(CAST(r.Rating AS DECIMAL(10, 2))), 0) AS AverageRating,
        COALESCE(SUM(i.TotalQuantity), 0) AS Sold
    FROM Products p
    LEFT JOIN Invoice i ON p.ProductID = i.ProductID
    LEFT JOIN Review r ON p.ProductID = r.ProductID
    WHERE p.VendorID = @VendorID
    GROUP BY p.ProductID, p.ProductName;
END;
GO
------------------------------------- 2.3.5 Lấy các reviews của một sản phẩm
SELECT * FROM Review;

EXEC GetProductReviews @ProductID = 1;

IF OBJECT_ID('GetProductReviews', 'P') IS NOT NULL
    DROP PROCEDURE GetProductReviews;
GO

CREATE PROCEDURE GetProductReviews
    @ProductID INT -- ID của sản phẩm cần lấy đánh giá
AS
BEGIN
    SELECT 
        r.ReviewID,
        c.FullName AS ReviewerName,  -- Tên người đánh giá
        r.Rating AS Rating,          -- Số điểm đánh giá
        r.Comment AS ReviewComment   -- Bình luận đánh giá
    FROM 
        Review r
    JOIN 
        Customer c ON r.UserID = c.UserID -- Liên kết với bảng người dùng
    WHERE 
        r.ProductID = @ProductID        -- Lọc theo sản phẩm cụ thể
    ORDER BY 
        r.ReviewDate DESC;              -- Sắp xếp theo thời gian đánh giá mới nhất
END;
GO
------------------------------------- 2.3.6 Lấy review
SELECT * FROM Review;

EXEC GetReviewDetails @ReviewID = 3;

IF OBJECT_ID('GetReviewDetails', 'P') IS NOT NULL
    DROP PROCEDURE GetReviewDetails;
GO

CREATE PROCEDURE GetReviewDetails
    @ReviewID INT -- ID của đánh giá
AS
BEGIN
    SELECT 
        p.ProductName AS ProductName,
        p.ProductImage AS ProductImage,
        c.FullName AS ReviewerName,   -- Tên người đánh giá
        r.Rating AS Rating,           -- Số điểm đánh giá
        r.Comment AS Comment          -- Bình luận
    FROM 
        Review r
    JOIN 
        Customer c ON r.UserID = c.UserID
    JOIN 
        Products p ON p.ProductID = r.ProductID
    WHERE 
        r.ReviewID = @ReviewID;       -- Lọc theo reviewId
END;
GO

------------------------------------- Dữ liệu để test
SELECT * FROM Category;
SELECT * FROM Review;
SELECT * FROM Vendor;
SELECT * FROM Customer;

-- Insert dữ liệu cho bảng Products
INSERT INTO Products (ProductID, VendorID, ProductName, ProductDescription, PurchasePrice, SalePrice, StockQuantity, CategoryID, ProductImage, Rating)
VALUES
(7, 1, 'Laptop Dell XPS 13', 'Laptop Dell XPS 13 với màn hình 13 inch, bộ vi xử lý Intel Core i7', 1200.00, 1500.00, 50, 1, 'laptop-dell-xps13.jpg', 1),
(8, 1, 'iPhone 14 Pro', 'iPhone 14 Pro với màn hình OLED 6.1 inch', 950.00, 1200.00, 100, 2, 'iphone-14-pro.jpg', 1),
(9, 2, 'Samsung Galaxy S22', 'Điện thoại Samsung Galaxy S22 với màn hình 6.2 inch', 800.00, 950.00, 75, 2, 'samsung-galaxy-s22.jpg', 1),
(10, 3, 'Nồi cơm điện Panasonic', 'Nồi cơm điện Panasonic 1.8L', 50.00, 70.00, 200, 3, 'noi-com-dien-panasonic.jpg', 1),
(11, 2, 'Máy giặt LG', 'Máy giặt LG 9kg', 400.00, 550.00, 30, 1, 'may-giat-lg.jpg', 1),
(6, 3, 'Máy lọc không khí Sharp', 'Máy lọc không khí Sharp với công nghệ Plasmacluster', 100.00, 150.00, 120, 1, 'may-loc-khong-khi-sharp.jpg', 1);
-- Insert dữ liệu cho bảng Review
INSERT INTO Review (ReviewID, ProductID, UserID, Rating, Comment, ReviewDate)
VALUES
(8, 1, 1, 5, 'Sản phẩm tuyệt vời, rất mạnh mẽ và màn hình sắc nét.', '2024-01-10'),
(9, 1, 2, 4, 'Laptop nhẹ, tuy nhiên giá hơi cao so với hiệu suất.', '2024-02-12'),
(10, 2, 1, 5, 'Camera tuyệt vời, hiệu suất nhanh.', '2024-03-05'),
(11, 3, 2, 4, 'Sản phẩm ổn, nhưng có chút thiếu tính năng so với giá.', '2024-04-20'),
(5, 4, 1, 5, 'Rất dễ sử dụng, làm việc hiệu quả.', '2024-05-15'),
(6, 5, 2, 3, 'Máy giặt khá ồn, nhưng giặt sạch.', '2024-06-07'),
(7, 6, 1, 4, 'Máy lọc không khí chạy khá êm, không khí trong phòng sạch hơn.', '2024-07-10');


SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables
SELECT CONCAT('DROP TABLE IF EXISTS ', table_name, ';') 
FROM information_schema.tables 
WHERE table_schema = 'master';

-- Drop all triggers
SELECT CONCAT('DROP TRIGGER IF EXISTS ', trigger_name, ';')
FROM information_schema.triggers
WHERE trigger_schema = 'master';

-- Drop all procedures
SELECT CONCAT('DROP PROCEDURE IF EXISTS ', routine_name, ';')
FROM information_schema.routines
WHERE routine_schema = 'master' AND routine_type = 'PROCEDURE';

-- Drop all functions
SELECT CONCAT('DROP FUNCTION IF EXISTS ', routine_name, ';')
FROM information_schema.routines
WHERE routine_schema = 'master' AND routine_type = 'FUNCTION';

-- Drop all views
SELECT CONCAT('DROP VIEW IF EXISTS ', table_name, ';')
FROM information_schema.views
WHERE table_schema = 'master';

SET FOREIGN_KEY_CHECKS = 1;

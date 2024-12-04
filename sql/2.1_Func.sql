GO
/* Tạo hàm insert Product */
CREATE PROCEDURE InsertProduct 
@VendorID INT,
@ProductName VARCHAR(100), 
@ProductDescription TEXT, 
@PurchasePrice DECIMAL(10,2), 
@SalePrice DECIMAL(10,2), 
@StockQuantity INT,
@CategoryID INT,
@ProductImage VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra giá mua > 0
        IF @PurchasePrice < 0
            THROW 50001, 'Lỗi: Giá mua không hợp lệ.', 1;

        -- Kiểm tra số lượng hàng tồn kho phải lớn hơn hoặc bằng 0
        IF @StockQuantity  < 0
            THROW 50002, 'Lỗi: Số lượng hàng tồn kho không hợp lệ', 1;

        -- Kiểm tra giá bán phải cao hơn giá mua
        IF @PurchasePrice > @SalePrice
            THROW 50004, 'Lỗi: Giá bán của sản phẩm không hợp lệ.', 1;
		-- Kiểm tra nhà cung cấp thêm vào liệu có hợp lệ.
		IF NOT EXISTS (SELECT 1 FROM Vendor WHERE VendorID = @VendorID)
            THROW 50006, 'Lỗi: Không tìm thấy nhà cung cấp phù hợp với ID đã cung cấp.', 1;

        -- Thực hiện thêm dữ liệu
        INSERT INTO Products(VendorID, ProductName, ProductDescription, PurchasePrice, SalePrice, StockQuantity, CategoryID, ProductImage)
        VALUES (@VendorID, @ProductName, @ProductDescription, @PurchasePrice, @SalePrice, @StockQuantity, @CategoryID, @ProductImage);
        DECLARE @CateName VARCHAR(200) = (SELECT Category_Name FROM Category WHERE Category_ID = @CategoryID);
        DECLARE @NewProductID INT = SCOPE_IDENTITY();
        DECLARE @SQL NVARCHAR(MAX);
        SET @SQL = N'
        INSERT INTO ' + QUOTENAME(@CateName) + ' (ProductID)
        VALUES (@ProductID)';

        EXEC sp_executesql @SQL,
                       N'@ProductID INT',
                       @ProductID = @NewProductID;
                       
        PRINT 'Thêm sản phẩm thành công';
    END TRY
    BEGIN CATCH
        -- Bắt lỗi và xuất thông báo lỗi
        PRINT ERROR_MESSAGE();
    END CATCH
END;


/*Lời gọi tạo một sản phẩm thêm vào product sẽ đưa ra thông báo lỗi nếu như không hợp lệ.*/
EXEC InsertProduct 
    @VendorID = 2,
    @ProductName = 'Iphone12',
    @ProductDescription = 'Latest mopdl with 64Gb storage',
    @PurchasePrice  = 500.00,
    @SalePrice  = 600.00,
    @StockQuantity = 25,
    @CategoryID = 2,
    @ProductImage = 'Iphone12.jpg';

SELECT * FROM Products;

/*Thủ tục cập nhật sản phẩm*/
GO
CREATE PROCEDURE UpdateProduct 
@ProductID INT, 
@ProductName VARCHAR(100), 
@ProductDescription TEXT, 
@PurchasePrice DECIMAL(10,2), 
@SalePrice DECIMAL(10,2), 
@StockQuantity INT,
@CategoryID INT,
@ProductImage VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra sản phẩm có tồn tại
        IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
            THROW 50005, 'Lỗi: Không tìm thấy sản phẩm với ID đã cung cấp.', 1;

        -- Kiểm tra giá mua > 0
        IF @PurchasePrice < 0
            THROW 50001, 'Lỗi: Giá mua không hợp lệ.', 1;

        -- Kiểm tra số lượng hàng tồn kho phải lớn hơn hoặc bằng 0
        IF @StockQuantity  < 0
            THROW 50002, 'Lỗi: Số lượng hàng tồn kho không hợp lệ', 1;

        -- Kiểm tra giá bán phải cao hơn giá mua
        IF @PurchasePrice > @SalePrice
            THROW 50004, 'Lỗi: Giá bán của sản phẩm không hợp lệ.', 1;


        -- Thực hiện cập nhật dữ liệu
        UPDATE Products
        SET ProductName = @ProductName,
            ProductDescription = @ProductDescription,
            PurchasePrice = @PurchasePrice,
            SalePrice = @SalePrice,
            StockQuantity = @StockQuantity,
            CategoryID = @CategoryID,
            ProductImage = @ProductImage
        WHERE ProductID = @ProductID;

        PRINT 'Cập nhật sản phẩm thành công!';
    END TRY
    BEGIN CATCH
        PRINT ERROR_MESSAGE();
    END CATCH
END;

-- Cập nhật sản phẩm thành Iphone 13
EXEC UpdateProduct 
    @ProductID = 8,
    @ProductName = 'Iphone14',
    @ProductDescription = 'Latest mopdl with 64Gb storage',
    @PurchasePrice  = 500.00,
    @SalePrice  = 800.00,
    @StockQuantity = 25,
    @CategoryID = 2,
    @ProductImage = 'Iphone14.jpg';

SELECT * FROM Products;
		
/*Thủ tục xóa sản phẩm*/
GO
CREATE PROCEDURE DeleteProduct 
@Product_ID INT
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra nhân viên có tồn tại
        IF NOT EXISTS (SELECT 1 FROM Products WHERE ProductID = @Product_ID)
            THROW 50006, 'Lỗi: Không tìm thấy sản phẩm với ID đã cung cấp.', 1;
        -- Kiểm tra liệu đơn hàng có trong Order không 
        IF NOT EXISTS (SELECT 1 FROM Order_detail WHERE PRODUCT_ID = @Product_ID)
        BEGIN
            DELETE FROM Products
            WHERE ProductID = @Product_ID;
        END
        ELSE 
        BEGIN
            UPDATE Products
            SET Deleted = 1
            WHERE ProductID = @Product_ID;
        END
            
        PRINT 'Xóa sản phẩm thành công!';
    END TRY
    BEGIN CATCH
        PRINT ERROR_MESSAGE();
    END CATCH
END;

-- Thực hiện xóa sản phẩm đã thêm
EXEC DeleteProduct 
    @Product_ID = 2;

SELECT * FROM Products;
SELECT * FROM Order_detail;	

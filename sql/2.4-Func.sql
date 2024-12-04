CREATE FUNCTION GetComplaintsByVendor (@VendorID INT)
RETURNS @Result TABLE
(
    ProductName NVARCHAR(255),
    ComplaintCount INT
)
AS
BEGIN

    DECLARE @ProductID INT;
    DECLARE @ProductName NVARCHAR(255);
    DECLARE @ComplaintCount INT;

    DECLARE VendorCursor CURSOR FOR
        SELECT ProductID, ProductName
        FROM Products
        WHERE VendorID = @VendorID;

    OPEN VendorCursor;

    FETCH NEXT FROM VendorCursor INTO @ProductID, @ProductName;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        
        SELECT @ComplaintCount = COUNT(*)
        FROM Complaint
        WHERE ProductID = @ProductID
            AND ComplaintDate >= DATEADD(DAY, -30, GETDATE());

        INSERT INTO @Result (ProductName, ComplaintCount)
        VALUES (@ProductName, @ComplaintCount);

        FETCH NEXT FROM VendorCursor INTO @ProductID, @ProductName;
    END;

    CLOSE VendorCursor;
    DEALLOCATE VendorCursor;

    RETURN;
END;

GO

SELECT * 
FROM dbo.GetComplaintsByVendor(1);
GO
DROP FUNCTION GetComplaintsByVendor;

GO

CREATE FUNCTION CalculateOrderTotal(
    @Products NVARCHAR(MAX),@VoucherPercent DECIMAL(10, 2) )
RETURNS DECIMAL(10, 2)
AS
BEGIN

    DECLARE @TotalAmount DECIMAL(10, 2) = 0;
    DECLARE @Quantity INT;
    DECLARE @Price DECIMAL(10, 2);

    DECLARE product_cursor CURSOR FOR
        SELECT  Quantity, Price
        FROM OPENJSON(@Products)
        WITH (
            Quantity INT '$.Quantity',
            Price DECIMAL(10, 2) '$.Price'
        );

    OPEN product_cursor;

    FETCH NEXT FROM product_cursor INTO @Quantity, @Price;

    WHILE @@FETCH_STATUS = 0
    BEGIN

        SET @TotalAmount = @TotalAmount + (@Price * @Quantity);
        FETCH NEXT FROM product_cursor INTO @Quantity, @Price;
    END;

    CLOSE product_cursor;
    DEALLOCATE product_cursor;

    IF @VoucherPercent >= 10 AND @VoucherPercent <= 100
    BEGIN
        SET @TotalAmount = @TotalAmount - (@TotalAmount * @VoucherPercent / 100);
    END;

    IF @TotalAmount < 0
    BEGIN
        SET @TotalAmount = 0;
    END;

    RETURN @TotalAmount;
END;

GO


DROP FUNCTION CalculateOrderTotal;

GO 
DECLARE @Products NVARCHAR(MAX) = 
    '[ 
        { "Quantity": 2, "Price": 100.00 },
        { "Quantity": 1, "Price": 50.00 },
        { "Quantity": 5, "Price": 20.00 }
    ]';
SELECT dbo.CalculateOrderTotal(@Products, 10) AS TotalAmount;
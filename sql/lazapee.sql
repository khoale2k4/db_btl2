-- Tạo bảng Customer
CREATE TABLE Customer (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    FullName VARCHAR(100),
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15),
    Address VARCHAR(255),
    AccountStatus VARCHAR(20)
	CONSTRAINT acc_stat_ck CHECK (AccountStatus IN ('Pending', 'Warned', 'Locked', 'Active'))
);

INSERT INTO Customer (Username, FullName, PasswordHash, PhoneNumber, Address, AccountStatus)
VALUES 
('john_doe', 'John Doe', '$2y$05$/JPggpwz7CM9L6efkHMBnurax/hSl1Cfz.161zObV9./wwCs4spEW', '123456789', '123 Elm St', 'Active'),
('jane_smith', 'Jane Smith', '$2y$05$iF4ICn5oNn/7Zfc2Tp4wsewkHETAEFwx3v2GS095gom1qcXmfk8MK','987654321', '456 Oak St', 'Active');
SELECT * FROM Customer;
--DROP TABLE Customer;

CREATE TABLE EMAIL(
	UserID INT,
	Email_ID INT IDENTITY(1,1) PRIMARY KEY,
	Ename VARCHAR(100),
	Email_type VARCHAR(20) CHECK (Email_type IN ('Primary','Secondary')),
	IsVerified VARCHAR(20) CHECK (IsVerified  IN ('Approved','Unapproved')),
	CONSTRAINT fk_user_id FOREIGN KEY (UserID) REFERENCES Customer(UserID)
);
INSERT INTO EMAIL (UserID,Ename,Email_type,IsVerified)
VALUES 
(1,'john@example','Primary','Approved'),
(1,'john2@example','Secondary','Approved'),
(1,'jane@example','Primary','Approved');
SELECT * FROM EMAIL;
--DROP TABLE EMAIL;


--Tạo bảng Vendor 
CREATE TABLE Vendor (
    VendorID INT IDENTITY(1,1) PRIMARY KEY,
    VendorName VARCHAR(100) NOT NULL,
    VendorAddress VARCHAR(255),
    Email VARCHAR(100) UNIQUE NOT NULL,
    AccountStatus VARCHAR(20) CHECK (AccountStatus IN ('Pending', 'Approved' ,'Blacklisted'))
);

INSERT INTO Vendor (VendorName, VendorAddress, Email, AccountStatus)
VALUES 
('Tech Solutions', '789 Maple St', 'contact@techsolutions.com', 'Pending'),
('Home Goods', '101 Birch St', 'support@homegoods.com', 'Approved'),
('Clothes Island', '105 Birch St', 'callme@clothesisland.com', 'Approved'),
('Acessories Heaven', '999 Birch St', 'callme@acessoriesheaven.com', 'Approved');
SELECT * FROM Vendor;
--DROP TABLE Vendor;

-- Bảng Danh Mục 
CREATE TABLE Category(
		Category_ID INT PRIMARY KEY,
		Category_Name VARCHAR(200),
);
INSERT INTO Category (Category_ID, Category_Name)
VALUES 
(1, 'Electronic Application'),
(2, 'Accessories'),
(3, 'Clothes');
SELECT * FROM Category;
--DROP TABLE Category;

--Bảng Sán phẩm
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
	VendorID INT,
    ProductName VARCHAR(100) NOT NULL,
    ProductDescription TEXT,
    PurchasePrice DECIMAL(10, 2) CHECK (PurchasePrice >= 0),
    Rating DECIMAL(10, 2) DEFAULT 0 CHECK(Rating <= 5 AND Rating >= 0),
    SalePrice DECIMAL(10, 2),
    StockQuantity INT CHECK (StockQuantity >= 0),
    CategoryID INT,
    ProductImage VARCHAR(255),
	CONSTRAINT sale_price_ck CHECK (SalePrice >= PurchasePrice),
	CONSTRAINT fk_Vendor_ID FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID),
	CONSTRAINT fk_Category_ID FOREIGN KEY (CategoryID) REFERENCES Category(Category_ID)
);
INSERT INTO Products (VendorID, ProductName, ProductDescription, PurchasePrice, SalePrice, StockQuantity, CategoryID, ProductImage)
VALUES 
(1, 'Electric Kettle', '1.5L stainless steel electric kettle', 15.00, 25.00, 100, 1, 'kettle.jpg'),
(2, 'Smartphone', 'Latest model with 128GB storage', 300.00, 500.00, 50, 1, 'smartphone.jpg'),
(4, 'Ring', 'Latest model in 2024', 300.00, 500.00, 50, 2, 'ring.jpg'),
(3, 'Purse', 'Latest model from Gucci', 800.00, 999.00, 50, 2, 'purse.jpg'),
(3,'T-Shirt', 'Latest model from TImberland', 700.00, 889.00, 50, 3, 'TShirt.jpg');
SELECT * FROM Products;
--DROP TABLE Products;

-- Tạo bảng Order
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    VendorID INT,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(11, 2) CHECK (TotalAmount > 0),
    OrderStatus VARCHAR(20),
    CONSTRAINT fk_user_id1  FOREIGN KEY (UserID) REFERENCES Customer(UserID),
    CONSTRAINT fk_vendor_id2 FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID),
);
ALTER TABLE Orders
ADD CONSTRAINT DF_OrderDate DEFAULT GETDATE() FOR OrderDate;

INSERT INTO Orders(UserID, VendorID, TotalAmount, OrderStatus)
VALUES 
(1, 1, 50.00, 'Pending'),
(2, 2, 150.00, 'Completed');
SELECT * FROM Orders;
--DROP TABLE Orders;

--Bảng Order_detail 
CREATE TABLE Order_detail (
	Order_detail_id INT IDENTITY(1,1) PRIMARY KEY,
	ORDER_ID INT ,
	PRODUCT_ID INT,
	PRODUCT_QUANTITY INT CHECK (PRODUCT_QUANTITY > 0),
	SELL_PRICE DECIMAL(11,2),
	CONSTRAINT fk_order_id10 FOREIGN KEY (PRODUCT_ID) REFERENCES Orders(OrderID),
	CONSTRAINT fk_product_id9 FOREIGN KEY (PRODUCT_ID) REFERENCES Products(ProductID)
);
INSERT INTO Order_detail(ORDER_ID, PRODUCT_ID, PRODUCT_QUANTITY, SELL_PRICE)
VALUES 
(1, 1, 25, 50.00),
(1, 1, 25, 150.00),
(2, 2, 50, 49.99),
(2, 2, 100, 169.99);
SELECT * FROM Order_detail;
--DROP TABLE Order_detail;

--bảng giỏ hàng
CREATE TABLE CART(
	cart_id INT IDENTITY(1,1) PRIMARY KEY,
	customer_ID INT,
	order_id INT,
	CONSTRAINT fk_orders_id FOREIGN KEY (order_id) REFERENCES Orders(OrderID),
	CONSTRAINT fk_customer_id FOREIGN KEY (customer_ID) REFERENCES Customer(UserID)
);
INSERT INTO CART(customer_ID, order_id)
VALUES 
(1, 1), --truy vấn giỏ hàng của customer số 1
(1, 2),
(2, 2),-- truy vấn giỏ hàng của customer số 2
(2, 2);
SELECT * FROM CART;
DROP TABLE CART;

--bảng mã giảm giá
CREATE TABLE Vouchers (
	VouchersID INT PRIMARY KEY,
	UserID INT,
	ProductID INT,
	OrderID INT,
	VendorID INT,
	DiscountValue DECIMAL(11,2) CHECK (DiscountValue >= 10 AND DiscountValue <=100),
	DiscountName VARCHAR(200),
	CONSTRAINT fk_UserID FOREIGN KEY (UserID) REFERENCES Customer(UserID),
	CONSTRAINT fk_ProductID FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
	CONSTRAINT fk_OrderID FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
	CONSTRAINT fk_VendorID FOREIGN KEY (OrderID) REFERENCES Vendor(VendorID)
);
INSERT INTO  Vouchers(VouchersID, UserID, ProductID, OrderID, VendorID, DiscountValue,DiscountName)
VALUES 
(1, 1, 1, 1, 1, 50.00, 'KettleDiscount'),
(2, 1, 2, 2, 2, 25.99, 'PhoneDiscount');
--(3, 2, 2, 50, 49.99),
--(4, 2, 2, 100, 169.99);
SELECT * FROM Vouchers;
--DROP TABLE Vouchers;

-- Create table for HouseholdApplication (subclass of Product)
CREATE TABLE HouseholdApplication (
    ProductID INT PRIMARY KEY,
    Color VARCHAR(50),
    Voltage VARCHAR(10),
    HHA_Weight DECIMAL(5, 2),
    PowerConsumption INT,
    CONSTRAINT fk_product_id2 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
INSERT INTO HouseholdApplication (ProductID, Color, Voltage, HHA_Weight, PowerConsumption)
VALUES 
(1, 'Silver', '220V', 1.20, 1500),
(2, 'Gold', '224V', 22.4, 220);
SELECT * FROM HouseholdApplication;
--DROP TABLE HouseholdApplication;

-- Create table for ElectronicEquipment (subclass of Product)
CREATE TABLE ElectronicEquipment (
    ProductID INT PRIMARY KEY,
    Weight DECIMAL(5, 2),
    ScreenSize VARCHAR(20),
    OperatingSystem VARCHAR(50),
    CPU VARCHAR(50),
    CONSTRAINT fk_product_id3 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- Insert sample data for ElectronicEquipment table
INSERT INTO ElectronicEquipment (ProductID, Weight, ScreenSize, OperatingSystem, CPU)
VALUES 
(2, 0.5, '6.5 inches', 'Android', 'Snapdragon 888');
SELECT * FROM ElectronicEquipment;
--DROP TABLE ElectronicEquipment;

-- Create table for Accessory (subclass of Product)
CREATE TABLE Accessory (
	AccessoryID INT ,
    ProductID INT PRIMARY KEY,
    Color VARCHAR(50),
    CONSTRAINT fk_product_id4 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- Insert sample data for Accessory table
INSERT INTO Accessory (AccessoryID,ProductID, Color)
VALUES 
(1, 3, 'Black');
SELECT * FROM Accessory;
--DROP TABLE Accessory;

-- Create table for Fashion (subclass of Accessory)
CREATE TABLE Fashion (
    ProductID INT PRIMARY KEY,
    Style VARCHAR(50),
    Material VARCHAR(50),
    CONSTRAINT fk_Accessory_id FOREIGN KEY (ProductID) REFERENCES Accessory(ProductID)
);
-- Insert sample data for Fashion table
INSERT INTO Fashion (ProductID, Style, Material)
VALUES 
(3, 'Modern', 'Leather');
SELECT * FROM Fashion;
--DROP TABLE Fashion;

-- Create table for Clothes (subclass of Product)
CREATE TABLE Clothes (
    ProductID INT PRIMARY KEY,
    Color VARCHAR(50),
    Style VARCHAR(50),
    Material VARCHAR(50),
    CONSTRAINT fk_product_id5 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- Insert sample data for Clothes table
INSERT INTO Clothes (ProductID, Color, Style, Material)
VALUES 
(4, 'Blue', 'Casual', 'Cotton');
SELECT * FROM Clothes;
--DROP TABLE Clothes;

-- Create table for PaymentMethod
CREATE TABLE PaymentMethod (
    PaymentMethodID INT PRIMARY KEY,
    MethodName VARCHAR(50) UNIQUE NOT NULL
);
-- Insert sample data for PaymentMethod table
INSERT INTO PaymentMethod (PaymentMethodID, MethodName)
VALUES 
(1, 'Credit Card'),
(2, 'PayPal');
SELECT * FROM PaymentMethod;
--DROP TABLE PaymentMethod;

-- Create table for Invoice
CREATE TABLE Invoice (
    InvoiceID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    TotalQuantity INT CHECK (TotalQuantity > 0),
    IssueDate DATE NOT NULL,
    CONSTRAINT fk_order_id2 FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT fk_product_id6 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- Insert sample data for Invoice table
INSERT INTO Invoice (InvoiceID, OrderID, ProductID, TotalQuantity, IssueDate)
VALUES 
(1, 1, 1, 2, '2024-11-07'),
(2, 2, 2, 1, '2024-11-08');
SELECT * FROM Invoice;
DROP TABLE Invoice;

-- Create table for Complaint
CREATE TABLE Complaint (
    ComplaintID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT,
	ProductID INT,
    ComplaintContent TEXT NOT NULL,
    ComplaintStatus VARCHAR(20),
    ComplaintDate DATE,
    CONSTRAINT fk_order_id3 FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
-- Insert sample data for Complaint table
INSERT INTO Complaint (OrderID, ProductID, ComplaintContent, ComplaintStatus, ComplaintDate)
VALUES 
(1, 1, 'The product was damaged upon arrival', 'Pending', '2024-11-09'),
(2, 2, 'Incorrect item received', 'Resolved', '2024-11-10');
SELECT * FROM Complaint;
--DROP TABLE Complaint;


-- Create table for Review
CREATE TABLE Review (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT,
    UserID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    ReviewDate DATE,
    CONSTRAINT fk_product_id7 FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT fk_user_id6 FOREIGN KEY (UserID) REFERENCES Customer(UserID)
);
-- Insert sample data for Review table
INSERT INTO Review (ProductID, UserID, Rating, Comment, ReviewDate)
VALUES 
(1, 1, 4, 'Great product, very useful!', '2024-11-05'),
(2, 2, 5, 'Excellent phone, very fast!', '2024-11-06');
SELECT * FROM Review;
--DROP TABLE Review;


-- Create table for Conversation
CREATE TABLE Conversation (
    ConvID INT IDENTITY(1,1) PRIMARY KEY,
    StartDate DATE,
    UserID INT,
    VendorID INT,
    CONSTRAINT fk_user_id7 FOREIGN KEY (UserID) REFERENCES Customer(UserID),
    CONSTRAINT fk_vendor_id6 FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);
-- Insert sample data for Conversation table
INSERT INTO Conversation (StartDate, UserID, VendorID)
VALUES 
('2024-10-20', 1, 1),
('2024-10-25', 2, 2);
SELECT * FROM Conversation;
--DROP TABLE Conversation;


-- Create table for Message
CREATE TABLE Message (
    MessID INT IDENTITY(1,1) PRIMARY KEY,
    SentDate DATE,
    SenderID INT,
	ConvID INT,
    Content TEXT NOT NULL,
    CONSTRAINT fk_user_id8 FOREIGN KEY (SenderID) REFERENCES Customer(UserID),
	CONSTRAINT fk_conv_id FOREIGN KEY (ConvID) REFERENCES Conversation(ConvID)
);
-- Insert sample data for Message table
INSERT INTO Message (SentDate, SenderID, ConvID, Content)
VALUES 
('2024-11-01', 1,1, 'Hello, I have a question about my order.'),
('2024-11-02', 2,2, 'Can you update the status of my shipment?');
SELECT * FROM Message;
--DROP TABLE Message;


INSERT INTO Products (VendorID, ProductName, ProductDescription, PurchasePrice, SalePrice, StockQuantity, CategoryID, ProductImage)
VALUES 
(1, 'Wireless Headphones', 'Noise-cancelling over-ear headphones', 75.00, 120.00, 200, 1, 'headphones.jpg'),
(1, 'Smart Watch', 'Fitness tracking and notifications', 50.00, 100.00, 150, 1, 'smartwatch.jpg'),
(2, 'Desk Lamp', 'LED desk lamp with adjustable brightness', 20.00, 40.00, 300, 1, 'desklamp.jpg'),
(2, 'Bluetooth Speaker', 'Portable speaker with 10-hour battery life', 30.00, 60.00, 250, 1, 'speaker.jpg'),
(3, 'Leather Wallet', 'Premium leather wallet with RFID protection', 25.00, 50.00, 100, 2, 'wallet.jpg'),
(3, 'Necklace', 'Gold-plated necklace with pendant', 100.00, 150.00, 75, 2, 'necklace.jpg'),
(4, 'Sunglasses', 'Polarized sunglasses for men and women', 15.00, 30.00, 200, 2, 'sunglasses.jpg'),
(4, 'Running Shoes', 'Lightweight running shoes for all terrains', 45.00, 90.00, 120, 3, 'shoes.jpg'),
(3, 'Jacket', 'Waterproof jacket for winter', 70.00, 120.00, 80, 3, 'jacket.jpg'),
(4, 'Backpack', 'Durable backpack with multiple compartments', 40.00, 80.00, 150, 3, 'backpack.jpg');

INSERT INTO Customer (Username, FullName, PasswordHash, PhoneNumber, Address, AccountStatus)
VALUES 
('alice_wonder', 'Alice Wonderland', '$2y$05$kksf...abc123', '111111111', '789 Dream St', 'Active'),
('bob_builder', 'Bob Builder', '$2y$05$xyz...def456', '222222222', '456 Hammer Ln', 'Warned'),
('charlie_brown', 'Charlie Brown', '$2y$05$pqr...ghi789', '333333333', '123 Snoopy Rd', 'Locked');

INSERT INTO Orders (VendorID, UserID, OrderDate, TotalAmount, OrderStatus)
VALUES 
(2, 1, '2024-12-01', 300.00, 'Completed'),
(1, 2, '2024-12-02', 150.00, 'Processing'),
(2, 3, '2024-12-03', 220.00, 'Shipped'),
(3, 4, '2024-12-03', 350.00, 'Completed'),
(4, 5, '2024-12-04', 400.00, 'Processing'),
(1, 1, '2024-12-04', 180.00, 'Completed'),
(2, 2, '2024-12-05', 120.00, 'Shipped'),
(2, 3, '2024-12-05', 200.00, 'Completed'),
(3, 4, '2024-12-06', 320.00, 'Processing'),
(4, 5, '2024-12-06', 250.00, 'Completed');

INSERT INTO Invoice(OrderID, ProductID, TotalQuantity, IssueDate)
VALUES 
-- Order 1
(1, 1, 2, '2024-12-01'),
(1, 3, 1, '2024-12-01'),
(1, 7, 1, '2024-12-01'),
-- Order 2
(2, 2, 1, '2024-12-02'),
(2, 4, 2, '2024-12-02'),
(2, 5, 1, '2024-12-02'),
-- Order 3
(3, 6, 1, '2024-12-03'),
(3, 8, 2, '2024-12-03'),
(3, 10, 1, '2024-12-03'),
-- Order 4
(4, 9, 2, '2024-12-03'),
(4, 7, 3, '2024-12-03'),
(4, 1, 1, '2024-12-03'),
-- Order 5
(5, 2, 2, '2024-12-04'),
(5, 5, 1, '2024-12-04'),
(5, 10, 2, '2024-12-04'),
-- Order 6
(6, 8, 2, '2024-12-04'),
(6, 3, 3, '2024-12-04'),
(6, 1, 1, '2024-12-04'),
-- Order 7
(7, 4, 3, '2024-12-05'),
(7, 6, 1, '2024-12-05'),
(7, 9, 1, '2024-12-05'),
-- Order 8
(8, 7, 2, '2024-12-05'),
(8, 8, 1, '2024-12-05'),
(8, 5, 1, '2024-12-05'),
-- Order 9
(9, 10, 3, '2024-12-06'),
(9, 1, 2, '2024-12-06'),
(9, 4, 1, '2024-12-06'),
-- Order 10
(10, 3, 1, '2024-12-06'),
(10, 8, 2, '2024-12-06'),
(10, 6, 1, '2024-12-06');

INSERT INTO Review (ProductID, UserID, Rating, Comment, ReviewDate)
VALUES
-- Review cho Product 1
(1, 1, 5, 'Sản phẩm rất tốt, đúng như mô tả.', '2024-12-01'),
(1, 2, 4, 'Hài lòng nhưng còn cải thiện được.', '2024-12-02'),
-- Review cho Product 2
(2, 3, 3, 'Chất lượng trung bình, cần cải tiến.', '2024-12-03'),
(2, 4, 5, 'Tuyệt vời! Sẽ mua lại.', '2024-12-04'),
-- Review cho Product 3
(3, 5, 4, 'Hài lòng, nhưng giao hàng hơi chậm.', '2024-12-05'),
(3, 1, 3, 'Ổn nhưng cần cải thiện thêm.', '2024-12-06'),
-- Review cho Product 4
(4, 2, 5, 'Rất đáng giá tiền, chất lượng tốt.', '2024-12-06'),
(4, 3, 4, 'Hài lòng với sản phẩm.', '2024-12-07'),
-- Review cho Product 5
(5, 4, 5, 'Sản phẩm rất tốt, đóng gói kỹ càng.', '2024-12-08'),
(5, 5, 3, 'Tạm ổn nhưng chưa thật sự ấn tượng.', '2024-12-09'),
-- Review cho Product 6
(6, 1, 4, 'Phù hợp với giá tiền.', '2024-12-10'),
(6, 2, 2, 'Không như mong đợi.', '2024-12-11'),
-- Review cho Product 7
(7, 3, 5, 'Hoàn hảo, rất hài lòng.', '2024-12-12'),
(7, 4, 4, 'Chất lượng và dịch vụ tốt.', '2024-12-13'),
-- Review cho Product 8
(8, 5, 3, 'Ổn, nhưng có thể tốt hơn.', '2024-12-14'),
(8, 1, 4, 'Giá cả hợp lý, sản phẩm tốt.', '2024-12-15'),
-- Review cho Product 9
(9, 2, 5, 'Rất hài lòng với sản phẩm.', '2024-12-16'),
(9, 3, 4, 'Tốt, nhưng giao hàng hơi chậm.', '2024-12-17'),
-- Review cho Product 10
(10, 4, 5, 'Sản phẩm rất tuyệt vời.', '2024-12-18'),
(10, 5, 3, 'Ổn, nhưng chưa thật sự nổi bật.', '2024-12-19');

EXEC GetProductSalesByVendor @p_VendorID = 2, @startDate = '2024-01-01', @endDate = '2024-12-31'
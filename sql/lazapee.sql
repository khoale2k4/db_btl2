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
(1, 'HouseholdApplication'),
(2, 'ElectronicEquipment'),
(3, 'Accessory'),
(4, 'Fashion'),
(5, 'Clothes');
SELECT * FROM Category;


--Bảng Sán phẩm
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
	VendorID INT,
    ProductName VARCHAR(100) NOT NULL,
    ProductDescription TEXT,
    PurchasePrice DECIMAL(10, 2) CHECK (PurchasePrice >= 0),
    SalePrice DECIMAL(10, 2),
    StockQuantity INT CHECK (StockQuantity >= 0),
    CategoryID INT,
    ProductImage VARCHAR(255),
    Deleted BIT DEFAULT 0,
    Sold BIT DEFAULT 0,
	CONSTRAINT sale_price_ck CHECK (SalePrice >= PurchasePrice),
	CONSTRAINT fk_Vendor_ID FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
	ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_Category_ID FOREIGN KEY (CategoryID) REFERENCES Category(Category_ID)
	ON DELETE SET NULL ON UPDATE CASCADE
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
    CONSTRAINT fk_user_id1  FOREIGN KEY (UserID) REFERENCES Customer(UserID)
	ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vendor_id2 FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
	ON DELETE CASCADE ON UPDATE CASCADE
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
--DROP TABLE Invoice;

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

--bảng mã giảm giá
CREATE TABLE Vouchers (
	VouchersID INT PRIMARY KEY,
	UserID INT,
	ProductID INT,
	OrderID INT,
	DiscountValue DECIMAL(11,2) CHECK (DiscountValue >= 10 AND DiscountValue <=100),
	DiscountName VARCHAR(200),
	CONSTRAINT fk_OrderID FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
	ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT fk_ProductID FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
	ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_UserID FOREIGN KEY (UserID) REFERENCES Customer(UserID)
	ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO  Vouchers(VouchersID, UserID, ProductID, OrderID, DiscountValue,DiscountName)
VALUES 
(1, 1, 1, 1, 50.00, 'KettleDiscount'),
(2, 2, 2, 2, 25.99, 'PhoneDiscount');
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
    ON DELETE CASCADE ON UPDATE CASCADE
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
    ON DELETE CASCADE ON UPDATE CASCADE
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
    ON DELETE CASCADE ON UPDATE CASCADE
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
    ON DELETE CASCADE ON UPDATE CASCADE
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
    ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT fk_order_id2 FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
	ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_product_id6 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
	ON DELETE NO ACTION ON UPDATE NO ACTION
);
-- Insert sample data for Invoice table
INSERT INTO Invoice (OrderID, ProductID, TotalQuantity, IssueDate)
VALUES 
(1, 1, 2, '2024-11-07'),
(2, 2, 1, '2024-11-08');
SELECT * FROM Invoice;
--DROP TABLE Invoice;

-- Create table for Complaint
CREATE TABLE Complaint (
    ComplaintID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT,
	ProductID INT,
    ComplaintContent TEXT NOT NULL,
    ComplaintStatus VARCHAR(20),
    ComplaintDate DATE,
    CONSTRAINT fk_order_id3 FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
	ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_product_id8 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
	ON DELETE NO ACTION ON UPDATE NO ACTION
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
    CONSTRAINT fk_product_id7 FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
	ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_id6 FOREIGN KEY (UserID) REFERENCES Customer(UserID)
	ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT fk_user_id7 FOREIGN KEY (UserID) REFERENCES Customer(UserID)
	ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vendor_id6 FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
	ON DELETE CASCADE ON UPDATE CASCADE
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
    CONSTRAINT fk_user_id8 FOREIGN KEY (SenderID) REFERENCES Customer(UserID)
	ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_conv_id FOREIGN KEY (ConvID) REFERENCES Conversation(ConvID)
	ON DELETE NO ACTION ON UPDATE NO ACTION
);
-- Insert sample data for Message table
INSERT INTO Message (SentDate, SenderID, ConvID, Content)
VALUES 
('2024-11-01', 1,1, 'Hello, I have a question about my order.'),
('2024-11-02', 2,2, 'Can you update the status of my shipment?');
SELECT * FROM Message;
--DROP TABLE Message;



-- 1. Country Table
CREATE TABLE Country (
    country_id INT PRIMARY KEY IDENTITY(1,1),
    country_name VARCHAR(100) NOT NULL
);

-- 2. States Table
CREATE TABLE States (
    state_id INT PRIMARY KEY IDENTITY(1,1),
    state_name VARCHAR(100) NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

-- 3. Cities Table
CREATE TABLE Cities (
    city_id INT PRIMARY KEY IDENTITY(1,1),
    city_name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES States(state_id)
);

-- 4. Areas/Places Table
CREATE TABLE Areas (
    area_id INT PRIMARY KEY IDENTITY(1,1),
    area_name VARCHAR(100) NOT NULL,
    city_id INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES Cities(city_id)
);

-- 5. HostelStays Table
CREATE TABLE HostelStays (
    pg_id INT PRIMARY KEY IDENTITY(1,1),
    pg_name VARCHAR(150) NOT NULL,
    address TEXT,
    pincode CHAR(6),
    category VARCHAR(50),
    owner_name VARCHAR(100),
    contact VARCHAR(15),
    area_id INT NOT NULL,
    FOREIGN KEY (area_id) REFERENCES Areas(area_id)
);
-- Insert Country
INSERT INTO Country (country_name) VALUES ('India');

-- Insert States
INSERT INTO States (state_name, country_id) VALUES 
('Karnataka', 1), 
('Maharashtra', 1);

-- Insert Cities
INSERT INTO Cities (city_name, state_id) VALUES 
('Bangalore', 1), 
('Mysore', 1), 
('Mumbai', 2);

-- Insert Areas
INSERT INTO Areas (area_name, city_id) VALUES 
('Marathalli', 1), 
('Yelahanka', 1), 
('Andheri', 3);

-- Insert Hostel Stays
INSERT INTO HostelStays (pg_name, address, pincode, category, owner_name, contact, area_id)
VALUES 
('Green Stay PG', '12 Marathalli Main Rd', '560037', 'Boys', 'Ravi Kumar', '9876543210', 1),
('Comfort Hostel', '45 Yelahanka Cross', '560064', 'Girls', 'Priya Sharma', '9123456780', 2),
('Sea View PG', '78 Andheri West', '400053', 'Mixed', 'Amit Patel', '9988776655', 3);
select * from country;
select * from states;
select * from cities;
select * from areas;
select * from HostelStays;



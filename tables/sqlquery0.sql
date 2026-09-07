-- 1. Country Table
CREATE TABLE Country (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100) NOT NULL
);

-- 2. States Table
CREATE TABLE States (
    state_id INT PRIMARY KEY AUTO_INCREMENT,
    state_name VARCHAR(100) NOT NULL,
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

-- 3. Cities Table
CREATE TABLE Cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(100) NOT NULL,
    state_id INT,
    FOREIGN KEY (state_id) REFERENCES States(state_id)
);

-- 4. Areas/Places Table
CREATE TABLE Areas (
    area_id INT PRIMARY KEY AUTO_INCREMENT,
    area_name VARCHAR(100) NOT NULL,
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES Cities(city_id)
);

-- 5. HostelStays Table
CREATE TABLE HostelStays (
    pg_id INT PRIMARY KEY AUTO_INCREMENT,
    pg_name VARCHAR(150) NOT NULL,
    address TEXT,
    pincode CHAR(6),
    category VARCHAR(50),
    owner_name VARCHAR(100),
    contact VARCHAR(15),
    area_id INT,
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



-- Get states in India
SELECT state_name 
FROM States 
JOIN Country ON States.country_id = Country.country_id
WHERE Country.country_name = 'India';

-- Get cities in Karnataka
SELECT city_name 
FROM Cities 
JOIN States ON Cities.state_id = States.state_id
WHERE States.state_name = 'Karnataka';

-- Get areas in Bangalore
SELECT area_name 
FROM Areas 
JOIN Cities ON Areas.city_id = Cities.city_id
WHERE Cities.city_name = 'Bangalore';

-- Get hostel stays in Marathalli
SELECT pg_id, pg_name, address, pincode, category, owner_name, contact 
FROM HostelStays 
JOIN Areas ON HostelStays.area_id = Areas.area_id
WHERE Areas.area_name = 'Marathalli';
-- Get states in India
SELECT state_name 
FROM States 
JOIN Country ON States.country_id = Country.country_id
WHERE Country.country_name = 'India';

-- Get cities in Karnataka
SELECT city_name 
FROM Cities 
JOIN States ON Cities.state_id = States.state_id
WHERE States.state_name = 'Karnataka';

-- Get areas in Bangalore
SELECT area_name 
FROM Areas 
JOIN Cities ON Areas.city_id = Cities.city_id
WHERE Cities.city_name = 'Bangalore';

-- Get hostel stays in Marathalli
SELECT pg_id, pg_name, address, pincode, category, owner_name, contact 
FROM HostelStays 
JOIN Areas ON HostelStays.area_id = Areas.area_id
WHERE Areas.area_name = 'Marathalli';

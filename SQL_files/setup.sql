-- ** SETUP QUERIES **
-- This file contains the queries that will be used
-- to setup the database and populate it with initial
-- data.

-- Drop all the tables so they can be recreated cleanly 
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS galleries;
DROP TABLE IF EXISTS paintings_categories;
DROP TABLE IF EXISTS paintings_mediums;
DROP TABLE IF EXISTS mediums;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS paintings;

-- Create paintings table
DROP TABLE IF EXISTS paintings;
CREATE TABLE paintings(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	title varchar(255) NOT NULL,
	year_created SMALLINT, 
	image_link varchar(2083), 
	artist int(11),
	gallery int(11) DEFAULT NULL
);

-- Create galleries table
DROP TABLE IF EXISTS galleries;
CREATE TABLE galleries(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	city varchar(255),
	state varchar(255), 
	country varchar(255), 
	street varchar(255), 
	name varchar(255) NOT NULL
);

-- Create categories table
DROP TABLE IF EXISTS categories;
CREATE TABLE categories(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL, 
	decade_of_conception SMALLINT
);

-- Create mediums table
DROP TABLE IF EXISTS mediums;
CREATE TABLE mediums(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	painting_medium varchar(255) NOT NULL
);

-- Create artists table
DROP TABLE IF EXISTS artists;
CREATE TABLE artists(
	id int(11) AUTO_INCREMENT PRIMARY KEY, 
	first_name varchar(255) NOT NULL, 
	last_name varchar(255) NOT NULL, 
	year_born SMALLINT,
	year_deceased SMALLINT
);

-- Add foriegn key relationships from artists and galleries to the paintings table
ALTER TABLE paintings
ADD FOREIGN KEY (artist) REFERENCES artists(id) ON DELETE CASCADE,
ADD FOREIGN KEY (gallery) REFERENCES galleries(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Create paintings categories table
DROP TABLE IF EXISTS paintings_categories;
CREATE TABLE paintings_categories(
	painting_id INT(11), 
	category_id INT(11),
	FOREIGN KEY (painting_id) REFERENCES paintings(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create paintings mediums table
DROP TABLE IF EXISTS paintings_mediums;
CREATE TABLE paintings_mediums(
	painting_id INT(11),
	medium_id INT(11),
	FOREIGN KEY (painting_id) REFERENCES paintings(id) ON DELETE CASCADE,
	FOREIGN KEY (medium_id) REFERENCES mediums(id) ON DELETE CASCADE
);

-- BEGIN DATA POPULATION

-- Populate galleries table with initial data
INSERT INTO galleries(city, state, country, street, name)
VALUES ('Los Angeles', 'California', 'United States', 'Wilshire Blvd', 'Los Angeles County Museum of Art'),
('New York', 'New York', 'United States', '5th Ave', 'The Metropolitan Museum of Art'),
('New York', 'New York', 'United States', '53rd St', 'The Museum of Modern Art');

-- Populate artists table with initial data
INSERT INTO artists(first_name, last_name, year_born, year_deceased)
VALUES ('Vincent', 'van Gogh', 1853, 1890), 
('Pablo', 'Picasso', 1881, 1973),
('Claude', 'Monet', 1840, 1926),
('Andy', 'Warhol', 1928, 1987),
('Roy', 'Lichtenstein', 1923, 1997);

-- Populate paintings table with initial data
INSERT INTO paintings(title, year_created, image_link, artist, gallery)
VALUES ('Starry Night', 1889, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', 1, 3),
('Sunflowers', 1888, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg', 1, 2),
('Guernica', 1937, 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Mural_del_Gernika.jpg', 2, 1),
("Les Demoiselles d'Avignon", 1907, 'https://uploads1.wikiart.org/images/pablo-picasso/the-girls-of-avignon-1907.jpg', 2, 3),
('The Water Lily Pond', 1899, 'https://upload.wikimedia.org/wikipedia/commons/1/10/Bridge_Over_a_Pond_of_Water_Lilies%2C_Claude_Monet_1899.jpg', 3, 1),
('Poppies', 1873, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Claude_Monet_037.jpg/800px-Claude_Monet_037.jpg', 3, 2),
("Campbell's Soup Cans", 1962, 'http://www.moma.org/media/W1siZiIsIjMxODI0MiJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=269531510f1f9eb6', 4, 3),
('Shot Marilyns', 1964, 'https://www.arthipo.com/image/cache/catalog/artists-painters/a/andy-warhol/AW003-andy-warhol-shot-marilyns-1000x1000.jpg', 4, 2),
('Crying Girl', 1963, 'https://mocomuseum.com/uploads/2018/05/Crying-Girl-2.jpg', 5, 1),
('Brushstrokes', 1965, 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Brushstrokes.png/250px-Brushstrokes.png', 5, 3);

-- Populate categories table with initial data
INSERT INTO categories(name, decade_of_conception)
VALUES('Impressionism', 1860),
('Pop Art', 1950),
('Still Life', 1600),
('Cubism', 1900),
('Surrealism', 1920);

-- Populate mediums table with initial data
INSERT INTO mediums(painting_medium)
VALUES ('Oil'),
('Magna'),
('Watercolor'),
('Enamel');

-- Populate paintings_categories table with initial data
INSERT INTO paintings_categories(painting_id, category_id)
VALUES (1, 1),
(2, 3),
(3, 4),
(3, 5),
(4, 4),
(5, 1),
(6, 1),
(7, 2),
(8, 2),
(9, 2),
(10, 2);

-- Populate paintings_mediums table with initial data
INSERT INTO paintings_mediums(painting_id, medium_id)
VALUES (1, 1),
(2, 1), 
(3, 1), 
(4, 1), 
(5, 1),
(6, 1), 
(7, 1), 
(8, 1), 
(9, 1), 
(10, 1), 
(10, 2);

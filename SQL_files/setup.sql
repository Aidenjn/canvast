-- ** SETUP QUERIES **
-- This file contains the queries that will be used
-- to setup the database and populate it with initial
-- data.
CREATE TABLE paintings(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	title varchar(255),
	year_created year, 
	image_link varchar(2083), 
	artist int(11),
	gallery int(11)
);

CREATE TABLE galleries(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	city varchar(255),
	state varchar(255), 
	country varchar(255), 
	street varchar(255), 
	name varchar(255)
);

CREATE TABLE categories(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	name varchar(255), 
	decade_of_conception year
);

CREATE TABLE mediums(
	id int(11) AUTO_INCREMENT PRIMARY KEY,
	painting_medium varchar(255)
);

CREATE TABLE artists(
	id int(11) AUTO_INCREMENT PRIMARY KEY, 
	first_name varchar(255), 
	last_name varchar(255), 
	year_born year,
	year_deceased year
);

ALTER TABLE paintings
ADD FOREIGN KEY (artist) REFERENCES artists(id),
ADD FOREIGN KEY (gallery) REFERENCES galleries(id);

CREATE TABLE paintings_categories(
	painting_id INT(11), 
	category_id INT(11),
	FOREIGN KEY (painting_id) REFERENCES paintings(id),
	FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE paintings_mediums(
	painting_id INT(11),
	medium_id INT(11),
	FOREIGN KEY (painting_id) REFERENCES paintings(id),
	FOREIGN KEY (medium_id) REFERENCES mediums(id)
);
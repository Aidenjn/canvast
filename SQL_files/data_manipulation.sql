-- ** DATA MANIPULATION QUERIES **
-- This file contains the queries that will be triggered
-- by data oriented interactions with the CanVast web
-- application.

-- '?' values are supplied by the user from the front end of the application

-- Filter paintings by gallery
SELECT paintings.id as id, title, year_created, image_link, artist, gallery 
FROM paintings 
INNER JOIN galleries ON paintings.gallery = galleries.id 
WHERE paintings.gallery = ?;

-- Get all paintings 
SELECT paintings.id, title, year_created, image_link, CONCAT(artists.first_name, " ", artists.last_name) as artist, galleries.name as gallery 
FROM paintings 
INNER JOIN artists ON paintings.artist = artists.id
LEFT JOIN galleries ON paintings.gallery = galleries.id
order by paintings.id;

-- Get a single painting
SELECT id, title, year_created, image_link, artist, gallery 
FROM paintings 
WHERE id = ?;

-- Get all galleries
SELECT id, city, state, country, street, name 
FROM galleries;

-- Get all artists
SELECT id, first_name, last_name, year_born, year_deceased 
FROM artists;

-- Get all categories
SELECT id, name FROM categories;

-- Get categories for a single painting
SELECT c.id, c.name, c.decade_of_conception FROM categories c
INNER JOIN paintings_categories pc ON pc.category_id = c.id
INNER JOIN paintings p ON pc.painting_id = p.id 
WHERE p.id = ?;

-- Get all mediums
SELECT id, painting_medium FROM mediums;

-- Get mediums for a single painting
SELECT m.id, m.painting_medium FROM mediums m
INNER JOIN paintings_mediums pm ON pm.medium_id = m.id
INNER JOIN paintings p on pm.painting_id = p.id
WHERE p.id = ?;

-- Update a painting
UPDATE paintings 
SET title=?, year_created=?, image_link=?, artist=?, gallery = IF(?='NULL', NULL, ?) 
WHERE id=?;

-- Deleting Art
DELETE FROM paintings WHERE id = ?;

-- Delete category from a painting
DELETE FROM paintings_categories 
WHERE painting_id = ? AND category_id = ?;

-- Delete medium from a painting
DELETE FROM paintings_mediums 
WHERE painting_id = ? AND medium_id = ?;

-- Add new Painting
INSERT INTO paintings (title, year_created, image_link, artist, gallery) 
VALUES (?,?,?,?,?);

-- Add Category to Painting
INSERT INTO paintings_categories (painting_id, category_id) 
VALUES (?,?);

-- Add Medium to Painting
INSERT INTO paintings_mediums (painting_id, medium_id) 
VALUES (?,?);

-- Add new Artist
INSERT INTO artists (first_name, last_name, year_born, year_deceased) 
VALUES (?,?,?,?);

-- Add new Gallery
INSERT INTO galleries (city, state, country, street, name) 
VALUES (?,?,?,?,?);

-- Add new Category
INSERT INTO categories (name, decade_of_conception) 
VALUES (?,?);

-- Add new Medium
INSERT INTO mediums (painting_medium) 
VALUES (?);

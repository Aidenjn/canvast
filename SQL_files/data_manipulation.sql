-- ** DATA MANIPULATION QUERIES **
-- This file contains the queries that will be triggered
-- by data oriented interactions with the CanVast web
-- application.

-- Any variable name that starts with the ':' character
-- is a value that will be supplied by the backend of
-- the web application.

-- Statements that are wrapped by two '#' symbols denote
-- that there could be one or zero of them depending on
-- the backend application's request.

-- Statements that are wrapped by two '%' symbols denote
-- that there could be zero to multiple of them depending the
-- backend application's request.


-- Searching for Painting
SELECT p.id, p.title, p.year_created, p.image_link, p.artist, p.gallery, m.painting_medium, c.name
    FROM paintings p
    JOIN paintings_mediums pm ON p.painting_id = pm.painting_id
    JOIN mediums m ON pm.medium_id = m.id
    JOIN paintings_categories pc ON p.painting_id = pc.painting_id
    JOIN categories c ON pc.category_id = c.id
    WHERE
        # p.title = :title_from_search_entry AND #
        # p.year_created = :year_created_from_search_entry AND #
        # p.artist = :artist_from_search_entry AND #
        # p.gallery = :gallery_from_search_entry AND #
        % m.painting_medium = :medium_from_search_entry AND %
        % c.name = :category_from_search_entry AND %
        -- Last line will not end with an AND
;

-- Transfering Art
UPDATE paintings
    SET gallery = :gallery_id_from_text_entry
    WHERE id = :painting_id_from_text_entry
;

-- Deleting Art
DELETE FROM paintings WHERE id = :id_from_text_entry;

-- Add new Painting
INSERT INTO paintings (title, year_created, image_link, artist, gallery)
    VALUES (:title_from_entry, :year_created_from_entry, :image_link_from_entry, :artist_from_entry, :gallery_from_dropdown)
;

-- Add Category to Painting
INSERT INTO paintings_categories (painting_id, category_id)
    VALUES (:painting_id, :category_id_from_dropdown)
;

-- Add Medium to Painting
INSERT INTO paintings_mediums (painting_id, medium_id)
    VALUES (:painting_id, :medium_id_from_dropdown)
;

-- Add new Artist
INSERT INTO artists (first_name, last_name, year_born, year_desceased)
    VALUES (:first_name_from_text_entry, :last_name_from_text_entry, :year_born_from_text_entry, year_desceased_from_text_entry)
;

-- Add new Gallery
INSERT INTO galleries (city, state, country, street, name)
    VALUES (:city_from_entry, :state_from_entry, :country_from_entry, :street_from_entry, :name_from_entry)
;

-- Add new Category
INSERT INTO categories (name, decade_of_conception)
    VALUES (:name_from_entry, :decade_of_conception_from_entry)
;

-- Add new Medium
INSERT INTO mediums (painting_medium)
    VALUES (:painting_medium_from_entry)
;

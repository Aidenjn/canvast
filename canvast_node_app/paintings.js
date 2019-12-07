module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Select all paintings for table, display the artist and gallery name instead of ID numbers */
    function getPaintings(res, mysql, context, complete){
        mysql.pool.query(`select paintings.id, title, year_created, image_link, CONCAT(artists.first_name, " ", artists.last_name) as artist, galleries.name as gallery from paintings 
                        inner join artists on paintings.artist = artists.id
                        left join galleries on paintings.gallery = galleries.id
                        order by paintings.id`, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paintings = results;
            complete();
        });
    }

    /* Select all galleries for dropdown */
    function getGalleries(res, mysql, context, complete){
        mysql.pool.query("select id, city, state, country, street, name from galleries", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.galleries = results;
            complete();
        });
    }

    /* Select all artists for dropdown */
    function getArtists(res, mysql, context, complete){
        mysql.pool.query("select id, first_name, last_name, year_born, year_deceased from artists", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists = results;
            complete();
        });
    }

    /* Select all categories for dropdown */
    function getCategories(res, mysql, context, complete){
        mysql.pool.query("select id, name from categories", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.categories = results;
            complete();
        });
    }

    /* Select all mediums for dropdown*/
    function getMediums(res, mysql, context, complete){
        mysql.pool.query("select id, painting_medium from mediums", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.mediums = results;
            complete();
        });
    }

    /* Select paintings based on the gallery ID to filter the paintings page*/
    function getPaintingsByGallery(req, res, mysql, context, complete){
      var query = "SELECT paintings.id as id, title, year_created, image_link, artist, gallery FROM paintings INNER JOIN galleries ON paintings.gallery = galleries.id WHERE paintings.gallery = ?;"
      console.log(req.params)
      var inserts = [req.params.gallery]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paintings = results;
            complete();
        });
    }

    /* Select a painting for the purpose of updating or deleting*/
    function getPainting(res, mysql, context, id, complete){
        var sql = "SELECT id, title, year_created, image_link, artist, gallery FROM paintings WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.painting = results[0];
            complete();
        });
    }

    /* Selects all categories for a specific painting */
    function getCategoriesForPainting(res, mysql, context, id, complete){
        var sql = `SELECT c.id, c.name, c.decade_of_conception FROM categories c
                    INNER JOIN paintings_categories pc ON pc.category_id = c.id
                    INNER JOIN paintings p ON pc.painting_id = p.id 
                    WHERE p.id = ?;`;
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.painting_categories = results;
            complete();
        });
    }

    /* Selects all mediums for a specific painting */
    function getMediumsForPainting(res, mysql, context, id, complete){
        var sql = `SELECT m.id, m.painting_medium FROM mediums m
                    INNER JOIN paintings_mediums pm ON pm.medium_id = m.id
                    INNER JOIN paintings p on pm.painting_id = p.id
                    WHERE p.id = ?`;
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.painting_mediums = results;
            complete();
        });
    }

    /*Display all paintings. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterpaintings.js", "deletepainting.js"];
        var mysql = req.app.get('mysql');
        getPaintings(res, mysql, context, complete);
        getGalleries(res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('paintings', context);
            }

        }
    });

    /*Display all paintings from a given gallery. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:gallery', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterpaintings.js", "deletepainting.js"];
        var mysql = req.app.get('mysql');
        getPaintingsByGallery(req,res, mysql, context, complete);
        getGalleries(res, mysql, context, complete);
        getArtists(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('paintings', context);
            }

        }
    });

    /* Display one painting for the specific purpose of updating paintings*/
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedpainting.js", "updatepainting.js", "addcategory.js", "deletecategory.js", "deletemedium.js"];
        var mysql = req.app.get('mysql');
        getPainting(res, mysql, context, req.params.id, complete);
        getArtists(res, mysql, context, complete);
        getGalleries(res, mysql, context, complete);
        getCategoriesForPainting(res, mysql, context, req.params.id, complete);
        getCategories(res, mysql, context, complete);
        getMediumsForPainting(res, mysql, context, req.params.id, complete);
        getMediums(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 7){
                res.render('update-painting', context);
            }
        }
    });

    /* Adds a painting, redirects to the paintings page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var gallery = req.body.gallery
        if (gallery == 'NULL'){
            var sql = "INSERT INTO paintings (title, year_created, image_link, artist, gallery) VALUES (?,?,?,?,NULL)";
            var inserts = [req.body.title, req.body.year_created, req.body.image_link, req.body.artist];
        }
        else {
            var sql = "INSERT INTO paintings (title, year_created, image_link, artist, gallery) VALUES (?,?,?,?,?)";
            var inserts = [req.body.title, req.body.year_created, req.body.image_link, req.body.artist, req.body.gallery];
        }
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/paintings');
            }
        });
    });

    /* The URI that update data is sent to in order to update a painting */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = `UPDATE paintings SET title=?, year_created=?, image_link=?, artist=?, gallery = IF(?='NULL', NULL, ?) WHERE id=?;`;
        var inserts = [req.body.title, req.body.year_created, req.body.image_link, req.body.artist, req.body.gallery, req.body.gallery, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Insert a category into a painting, updating a many-to-many relationship */
    router.post('/:id/category', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = `INSERT INTO paintings_categories (painting_id, category_id) VALUES (?,?);`;
        var inserts = [req.params.id, req.body.category];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/paintings/' + req.params.id)
            }
        });
    });

    /* Insert a medium into a painting, updating a many-to-many relationship */
    router.post('/:id/medium', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = `INSERT INTO paintings_mediums (painting_id, medium_id) VALUES (?,?);`;
        var inserts = [req.params.id, req.body.medium];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/paintings/' + req.params.id)
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM paintings WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })


    /* Remove a category from a painting */
    router.delete('/:id/category/:cid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM paintings_categories WHERE painting_id = ? AND category_id = ?";
        var inserts = [req.params.id, req.params.cid];
        sql = mysql.pool.query(sql, inserts, function(error, results , fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    /* Remove a medium from a painting */
    router.delete('/:id/medium/:mid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM paintings_mediums WHERE painting_id = ? AND medium_id = ?";
        var inserts = [req.params.id, req.params.mid];
        sql = mysql.pool.query(sql, inserts, function(error, results , fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();

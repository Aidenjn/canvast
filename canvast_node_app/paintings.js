module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPaintings(res, mysql, context, complete){
        mysql.pool.query(`select paintings.id, title, year_created, image_link, CONCAT(artists.first_name, " ", artists.last_name) as artist, galleries.name as gallery from paintings 
                        inner join artists on paintings.artist = artists.id
                        inner join galleries on paintings.gallery = galleries.id
                        order by paintings.id`, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.paintings = results;
            complete();
        });
    }

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

    function getPaintingsByGallery(req, res, mysql, context, complete){
      //var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
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

    /* Find people whose fname starts with a given string in the req */
    /*function getPeopleWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }*/

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

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    /*router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }
        }
    });*/

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedpainting.js", "updatepainting.js"];
        var mysql = req.app.get('mysql');
        getPainting(res, mysql, context, req.params.id, complete);
        getArtists(res, mysql, context, complete);
        getGalleries(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-painting', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        //console.log(req.body.homeworld)
        //console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO paintings (title, year_created, image_link, artist, gallery) VALUES (?,?,?,?,?)";
        var inserts = [req.body.title, req.body.year_created, req.body.image_link, req.body.artist, req.body.gallery];
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

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = `UPDATE paintings SET title=?, year_created=?, image_link=?, artist=?, gallery=? WHERE id=?;`;
        var inserts = [req.body.title, req.body.year_created, req.body.image_link, req.body.artist, req.body.gallery, req.params.id];
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

    return router;
}();

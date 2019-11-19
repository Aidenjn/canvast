module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["filterpaintings.js"];
        var mysql = req.app.get('mysql');
        getArtists(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('artists', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO artists (first_name, last_name, year_born, year_deceased) VALUES (?,?,?,?)";
        var inserts = [req.body.first_name, req.body.last_name, req.body.year_born, req.body.year_deceased];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/artists');
            }
        });
    });

    return router;
}();
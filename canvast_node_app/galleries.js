module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["filterpaintings.js"];
        var mysql = req.app.get('mysql');
        getGalleries(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('galleries', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO galleries (city, state, country, street, name) VALUES (?,?,?,?,?)";
        var inserts = [req.body.city, req.body.state, req.body.country, req.body.street, req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/galleries');
            }
        });
    });

    return router;
}();
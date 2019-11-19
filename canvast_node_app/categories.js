module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
    function getCategories(res, mysql, context, complete){
        mysql.pool.query("select id, name, decade_of_conception from categories", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.categories = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["filterpaintings.js"];
        var mysql = req.app.get('mysql');
        getCategories(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('categories', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO categories (name, decade_of_conception) VALUES (?,?)";
        var inserts = [req.body.name, req.body.decade_of_conception];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/categories');
            }
        });
    });

    return router;
}();
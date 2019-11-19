module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
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

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["filterpaintings.js"];
        var mysql = req.app.get('mysql');
        getMediums(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('mediums', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO mediums (painting_medium) VALUES (?)";
        var inserts = [req.body.painting_medium];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/mediums');
            }
        });
    });

    return router;
}();
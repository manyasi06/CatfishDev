var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');



router.delete('/:id',function(req,res){
	var mysql = req.app.get('mysql');
	var sql = "delete from ortholog where id=?";
	var insert = [req.params.id];
	mysql.pool.query(sql,insert, function(error,rows,fields){
		if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }

	})


})


module.exports = router;
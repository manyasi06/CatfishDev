var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');


function getAllProteinIDS(res,req,mysql,context,complete){
    var search = 'select id,NCBI_ProteinID,NCBI_GeneID,Annotation from geneid';

    mysql.pool.query(search,function(error,results,fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        geneIDList = {};
        geneIDList.datas = [];

        for(row in results){
            data = {};
            data.id = results[row].id;
            data.proteinName = results[row].NCBI_ProteinID;
            data.Ncbi_GeneID = results[row].NCBI_GeneID;
            data.Annotation = results[row].Annotation;
            geneIDList.datas.push(data);
        }
        context.geneIDList = geneIDList;
        complete();
    })
}

router.get('/geneID',function(req,res){
    context = {};
    callbackCount = 0;
    getAllProteinIDS(res,req,mysql,context,complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            //console.log("Completed" + callbackCount);
            console.log(context.geneIDList);
            res.render('geneID', context);
        }

    }

});


router.delete('/geneID/:id',function(req,res){
    var sql = "delete from GeneID where id = ?";
    var insert = [req.params.id];
    console.log(req.params.id);
	mysql.pool.query(sql,insert, function(error,rows,fields){
		if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }

	});
});


router.post('/addGene',function(req,res,next){
    
    mysql.pool.query('insert into GeneID (NCBI_ProteinID, NCBI_GeneID, Annotation) values (?,?,?)',
    [req.body.PName,req.body.GName,req.body.AName],function(err,result){
        if(err){
            //console.log("Error");
            next(err);
            return;
        }
        res.redirect('/geneID');
    });
});

module.exports = router;
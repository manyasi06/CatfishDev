var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');


function getAllProteinIDS(res,req,mysql,context,complete){
    var search = 'select id,NCBI_ProteinID from geneid';

    mysql.pool.query(search,function(error,results,fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        geneIDList = {};
        geneIDList.proteinIds = [];

        for(row in results){
            pData = {};
            pData.id = results[row].id;
            pData.proteinName = results[row].NCBI_ProteinID;
            geneIDList.proteinIds.push(pData);
        }
        context.pDataSet = geneIDList;
        complete();
    })
}



router.delete('/:id',function(req,res){
	//var mysql = req.app.get('mysql');
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

router.delete('/organsim/:id',function(req,res){
	//var mysql = req.app.get('mysql');
	var sql = "delete from organism where Organism_id=?";
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


router.delete('/expression/:id',function(req,res){
	//var mysql = req.app.get('mysql');
	var sql = "delete from rna_seq_sample_info where id=?";
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

router.get('/expression',function(req,res,next){
	context = {};
	callbackCount = 0;
	query = 'select rna_seq_sample_info.id, g.NCBI_ProteinID, Sample_info, Expression from rna_seq_sample_info inner join geneid as g on g.NCBI_ProteinID = rna_seq_sample_info.ProteinNcbiID';
	getAllProteinIDS(res,req,mysql,context,complete);
	mysql.pool.query(query,function(error,results,fields){
		if(error){
			next(error)
			return;
		}
		//console.log(results);
		
		
		geneIDList = {};
        geneIDList.datas = [];

        for(row in results){
            data = {};
            data.id = results[row].id;
            data.proteinID = results[row].NCBI_ProteinID;
            data.sample_info = results[row].Sample_info;
            data.expression = results[row].Expression;
            geneIDList.datas.push(data);
        }
	
        context.geneIDList = geneIDList;
        console.log(context.geneIDList);
		//res.render('expression',context);
		complete();
	})
	function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            //console.log("Completed" + callbackCount);
            console.log(context.pDataSet);
            res.render('expression', context);
        }

    }
	
})



router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE GeneID SET NCBI_ProteinID = ?, NCBI_GeneID=?, Annotation=? WHERE id= ?";
        var inserts = [req.body.fname, req.body.lname, req.body.homeworld, req.body.age, req.params.id];
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




module.exports = router;
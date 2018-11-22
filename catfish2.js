var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

/**Function is responsible for getting the list of proteins. */
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


function getExperiments(res,req,mysql,context,complete){
    var search = 'select id, Experimental_Type from Experimental_validation';
    mysql.pool.query(search,function(error,results,fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        ExpList = {};
        ExpList.experiments= [];

        for(row in results){
            pData = {};
            pData.id = results[row].id;
            pData.experimentName = results[row].Experimental_Type;
            ExpList.experiments.push(pData);
        }
        context.pDataSet = ExpList;
        complete();
    });
}

function getExpressionData(req,res,mysql,context,complete){
    query = 'select ra.id,ge.NCBI_ProteinID,ge.Annotation,ra.Sample_info,ra.Expression from rna_seq_sample_info as ra ' +
            'inner join geneid as ge on ge.id = ra.ProteinNcbiID';
    mysql.pool.query(query,function(error,results,fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }

        

        Express = {};
        Express.List = [];
        
        for (row in results)
        {
            pData = {};
            pData.id = results[row].id;
            pData.ProteinID = results[row].NCBI_ProteinID;
            pData.Annotation = results[row].Annotation;
            pData.Sample_info = results[row].Sample_info;
            pData.Expression = results[row].Expression;
            Express.List.push(pData);
        }
        
        context.eDataSet = Express;
        complete();
    });
    
}

router.get('/Experiments',function(req,res){
    context = {};
    callbackCount = 0;
    getExperiments(res,req,mysql,context,complete);
    function complete()
    {
        callbackCount++;
        if(callbackCount >= 1)
        {
            //console.log("Completed" + callbackCount);
            //console.log(context.pDataSet);
            res.render('Experiments', context);
        };

    };
});



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

router.delete('/organism/:id',function(req,res){
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

router.delete('/Experiments/:id',function(req,res){
	//var mysql = req.app.get('mysql');
	var sql = 'delete from Experimental_validation where id = ?';
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
    //console.log(req.params.id);
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
    getAllProteinIDS(res,req,mysql,context,complete);
    getExpressionData(req,res,mysql,context,complete);
	function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            //console.log("Completed" + callbackCount);
            console.log(context.eDataSet);
            res.render('expression', context);
        }

    }
	
})



// router.put('/:id', function(req, res){
//         var mysql = req.app.get('mysql');
//         console.log(req.body)
//         console.log(req.params.id)
//         var sql = "UPDATE GeneID SET NCBI_ProteinID = ?, NCBI_GeneID=?, Annotation=? WHERE id= ?";
//         var inserts = [req.body.fname, req.body.lname, req.body.homeworld, req.body.age, req.params.id];
//         sql = mysql.pool.query(sql,inserts,function(error, results, fields){
//             if(error){
//                 console.log(error)
//                 res.write(JSON.stringify(error));
//                 res.end();
//             }else{
//                 res.status(200);
//                 res.end();
//             }
//         });
//     });




module.exports = router;
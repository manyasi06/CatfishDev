var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

/*The purpose of this function is to get the list of organisms*/
function getOrganism(res,req, mysql, context, complete){
    var answ = [req.params.id]
    mysql.pool.query("SELECT Organism_id,Organism_Type from Organism where Organism_id = ? and Organism_id is not null", answ,function(error, results, fields){
        if(error){
            console.log("Had a error")
            res.write(JSON.stringify(error));
            res.end();
        }
        someDatas = {};
        someDatas.List = [];
        for(row in results){
            data = {};
            data.id = results[row].Organism_id;
            data.Organism = results[row].Organism_Type;
            someDatas.List.push(data);
        }
        console.log("\n\n\nThis is my result: " + JSON.stringify(results[0]) + " \n");
        context.organism = results[0];
        context.oData = someDatas;
        complete();
    });
}


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



router.get('/:id',function(req,res){
    //res.send("Going to this location");
    callbackCount = 0;
    var context = {};
    //console.log('Here getting data.')
    getOrganism(res,req, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            //console.log("Completed" + callbackCount);
            console.log(context);
            res.render('Update', context);
        }

    }

})

router.put('/organism/:id',function(req,res){
    var updateStat = 'update organism set Organism_Type=? where Organism_id =?';
    var insert = [req.body.organism,req.body.id];
    mysql.pool.query(updateStat,insert,function(error,results,fields){
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
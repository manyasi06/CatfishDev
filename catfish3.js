var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');


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

function GetInteraction(res,req,mysql,context,complete){
    var query = "select o.id,g.NCBI_ProteinID,g2.NCBI_ProteinID as NCBI_ProteinID2, g2.Annotation, org.Organism_Type" + 
                " from Ortholog as o inner join GeneID as g on g.id = o.ProteinIDA inner join GeneID as g2 on " +
                "g2.id = o.ProteinIDB inner join Organism as org on o.Organism = org.Organism_id " +
                "where g.NCBI_ProteinID = ? OR g2.NCBI_ProteinID = ? ";
    var vals = [req.params.PName,req.params.PName];
    mysql.pool.query(query,vals,function(error,rows,fields){
        if(error)
        {
            console.log("Had a error");
            res.write(JSON.stringify(error));
            res.end();
        }
        row_data = {};
        row_data.inters = [];
        row_data.organisms = [];
        for( row in rows){
            inter = {};
            organ = {};
            inter.id = rows[row].id;
            inter.ProteinID_A = rows[row].NCBI_ProteinID;
            inter.ProteinID_B = rows[row].NCBI_ProteinID2;
            inter.PA_annotation = rows[row].Annotation;
            inter.Organism = rows[row].Organism_Type;
            row_data.inters.push(inter);
        }

        context.data = row_data;
        complete();
    })
}
/**This function will get all of the organism in the database. */
function getOrganism(res, mysql, context, complete){
    mysql.pool.query("SELECT Organism_id,Organism_Type from Organism", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log(results);
        someDatas = {};
        someDatas.List = [];
        for(row in results){
            data = {};
            data.id = results[row].Organism_id;
            data.Organism = results[row].Organism_Type;
            someDatas.List.push(data);
        }
        console.log(someDatas);
        context.oData = someDatas;
        complete();
    });
}

/*The purpose of this function is to get only one organism*/
function getCertainOrganism(res,req, mysql, context, complete){
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
    var search = 'select id,NCBI_ProteinID,NCBI_GeneID,Annotation from GeneID';

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
    getCertainOrganism(res,req, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            //console.log("Completed" + callbackCount);
            //console.log(context);
            res.render('Update', context);
        }

    }

})

router.put('/:id',function(req,res){
    console.log(req.body);
    var updateStat = 'update Organism set Organism_Type=? where Organism_id =?';
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


router.get('/home/search/:PName',function(req,res){
    var callbackCount = 0;
    context = {};
    getAllProteinIDS(res,req,mysql,context,complete);
    getOrganism(res,mysql,context,complete);
    GetInteraction(res,req,mysql,context,complete);
    getExperiments(res,req,mysql,context,complete)
    function complete(){
        callbackCount++;
        if(callbackCount >= 4){
            //console.log("Completed" + callbackCount);
            console.log(context);
            res.render('home', context);
        }

    }

})

module.exports = router;
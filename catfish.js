

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

function getProteinID(res,req,mysql,complete, checkVal){
    var query = "select NCBI_ProteinID from geneid where NCBI_ProteinID = ?";
    var search = [req.body.Input_ProteinIDA]
    mysql.pool.query(query,search, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        if(results.length > 0){
            checkVal();
        }
        complete();
    });
}

function getAllProteinIDS(res,req,mysql,context,complete){
    var search = 'select id,NCBI_ProteinID from geneid';

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
            geneIDList.datas.push(data);
        }
        context.geneIDList = geneIDList;
        complete();
    })
}



/*The purpose of this function is to get the list of organisms*/
function getOrganism(res, mysql, context, complete){
    mysql.pool.query("SELECT Organism_id,Organism_Type from Organism", function(error, results, fields){
        if(error){
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

        context.oData = someDatas;
        complete();
    });
}

/*This main function is responsible for displaying the orthologs in the data set.
It will collect all the organisms
It will collect all the Proteins
It will collect all the Experiments
*/
router.get('/',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    //add the js scripts to the front end.
    context.jsscripts =["delete.js","addInteraction.js"];
    getOrganism(res,mysql,context,complete);
    getAllProteinIDS(res,req,mysql,context,complete);
    getExperiments(res,req,mysql,context,complete);
    mysql.pool.query('select o.id,g.NCBI_ProteinID,g2.NCBI_ProteinID as NCBI_ProteinID2, g2.Annotation, org.Organism_Type from Ortholog as o ' +
    'inner join geneid as g on g.id = o.ProteinIDA inner join geneid as g2 on g2.id = o.ProteinIDB inner join organism as org on o.Organism = org.Organism_id'
    , function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        //console.log(JSON.stringify(rows));
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
            row_data.organisms.push(rows[row].Organism);
            row_data.inters.push(inter);
        }
        //make data into json
        context.results = JSON.stringify(rows);
        context.data = row_data;
  
        complete();

    })
    function complete(){
        callbackCount++;
        if(callbackCount >= 4){
            //console.log("Completed" + callbackCount);
            //console.log(context.pDataSet);
            res.render('home', context);
        }

    }
    //res.send("Home page");
});



router.post('/addOrtho',function(req,res,next){
    callbackCount = 0;
    callback = 0;
    var alpha = 'unchecked';
    getProteinID(res,req,mysql, complete,checkVal);
    
    function final(){
 
        if(alpha == 'unchecked'){
            var query = 'INSERT INTO GeneID ( NCBI_ProteinID, NCBI_GeneID, Annotation) values (?,?,?)';
            var insert = [req.body.Input_ProteinIDA, req.body.In_GeneID, req.body.Ann_ProteinIDA];
            mysql.pool.query(query,insert, function(err,result){
                if(err)
                {
                     next(err)
                    return;
                }

                var query2 = 'INSERT INTO Ortholog (ProteinIDA, Organism, ProteinIDB, Experimental_condition)  values (' +
                    '(select id from GeneID where NCBI_ProteinID = ?),'+ 
                    '(select Organism_id from Organism where Organism_Type = ? and Organism_Type is not null),' + 
                    ' (select id from GeneID where NCBI_ProteinID = ?  and NCBI_ProteinID is not null),' +
                    ' ?)';
                var insert2 = [req.body.Input_ProteinIDA,req.body.Organism,req.body.Input_ProteinIDB,req.body.Exp_Val];
                 
                 mysql.pool.query(query2,insert2, function(err,result){
                        if(err){
                            next(err);
                            return;
                        }
                    res.redirect('/');
                });
            });
        }else{
            //console.log("already present");
            var query2 = 'INSERT INTO Ortholog (ProteinIDA, Organism, ProteinIDB, Experimental_condition)  values (' +
                    '(select id from GeneID where NCBI_ProteinID = ?),'+ 
                    '(select Organism_id from Organism where Organism_Type = ? and Organism_Type is not null),' + 
                    ' (select id from GeneID where NCBI_ProteinID = ?  and NCBI_ProteinID is not null),' +
                    ' ?)';
                var insert2 = [req.body.Input_ProteinIDA,req.body.Organism,req.body.Input_ProteinIDB,req.body.Exp_Val];
                 mysql.pool.query(query2,insert2, function(err,result){
                        if(err){
                            next(err);
                            return;
                        }
                        res.redirect('/');
                });
            
        }
        
    }

    function complete(){
        callbackCount++;
        //console.log("This is my check value: " + alpha == 'true');
        if(callbackCount == 1 && alpha == 'unchecked'){
            final();
            
        }}

    function checkVal(){
        callback++;
        if(callback >= 1)
            alpha = 'checked';
        final();
    }

});
  

router.post('/addGeneExp',function(req,res,next){
    
    mysql.pool.query('INSERT INTO RNA_seq_Sample_info (ProteinNcbiID, Sample_info, Expression) values (?,?,?)',
    [req.body.GID,req.body.SID,req.body.ExpreVal],function(err,result){
        if(err){
            //console.log("Error");
            next(err);
            return;
        }
        res.redirect('/expression');
    });
});


router.get('/organism',function(req,res,next){
    var callbackCount = 0;
    var context = {};
    getOrganism(res, mysql, context, complete);

    function complete(){
        callbackCount++;
        if(callbackCount == 1)
        {
            console.log(context.oData);
            res.render('organism',context);  
        }}
});

router.post('/addOrganism', function(req,res,next){
    var orgAddQuery = 'insert into organism (Organism_Type)' +
                    'select ? from organism where not exists (select Organism_Type from Organism' + 
                    ' where Organism_Type = ?) Limit 1;'
    mysql.pool.query(orgAddQuery,[req.body.Organism,req.body.Organism],function(err,result){
        if(err){
            next(err);
            return;
        }
        res.redirect('/organism');
    });
});

router.post('/addExperiment',function(req,res,next){
    var insert = 'insert into Experimental_validation (Experimental_Type) values (?)';
    mysql.pool.query(insert,[req.body.experiments],function(err,result){
        if(err){
            next(err);
            return;
        }
        res.redirect('Experiments');
    })
})


module.exports = router;


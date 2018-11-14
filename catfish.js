

var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');


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
    mysql.pool.query("SELECT Organism_Type from Organism", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        someData = [];
        for(row in results){
            someData.push(results[row].Organism_Type);
        }
        context.someData = someData;
        complete();
    });
}


router.get('/',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    //add the js scripts to the front end.
    context.jsscripts =["delete.js","addInteraction.js"];
    getOrganism(res,mysql,context,complete);
    getAllProteinIDS(res,req,mysql,context,complete);
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
        if(callbackCount >= 3){
            //console.log("Completed" + callbackCount);
            console.log(context);
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
    console.log("Is this running:\n" + req.body.Input_ProteinIDB + "\n");
    //if(a === 'true'){
      //  console.log("Test worked");
        //res.redirect('/')
    //}
   
    /*
    mysql.pool.query('INSERT INTO GeneID ( NCBI_ProteinID, NCBI_GeneID, Annotation) values (?,?,?)',
    [req.body.Input_ProteinIDA, req.body.In_GeneID, req.body.Ann_ProteinIDA], function(err,result){
        if(err){
            next(err)
            return;
        }
        
        
        mysql.pool.query(
            'INSERT INTO Ortholog (ProteinIDA, Organism, ProteinIDB, Experimental_condition)  values (' +
            '(select id from GeneID where NCBI_ProteinID = ?),'+ 
            '(select Organism_id from Organism where Organism_Type = ? and Organism_Type is not null),' + 
            ' (select id from GeneID where NCBI_ProteinID = ?  and NCBI_ProteinID is not null),' +
            ' ?)',
        [req.body.Input_ProteinIDA,req.body.Organism,req.body.Input_ProteinIDB,req.body.Exp_Val], function(err,result){
            if(err){
                next(err);
                return;
            }
            
            res.redirect('/');
        });
        
    });*/
    
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
            console.log("already present");
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
        console.log("This is my check value: " + alpha == 'true');
        if(callbackCount == 1 && alpha == 'unchecked'){
            final();
            //console.log("Completed: + callbackCount);
             //console.log("\n This is the A value: " + alpha);
            
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
            console.log("Error");
            next(err);
            return;
        }
        res.redirect('/');
    });
});


router.get('/organism',function(req,res,next){
    var context = {};
    
    mysql.pool.query('SELECT Organism_Type from Organism',function(err,rows,fields){
        if(err){
            console.log("Error\n");
            next(err);
            return;
        }
        console.log(rows);
        row_data = {};
        row_data.inters = [];
        row_data.organisms = [];
        for( row in rows){
            inter = {};
            inter.id = rows[row].Organism_id; //test your organism id.
            inter.Organism = rows[row].Organism_Type;
            row_data.inters.push(inter);
        }
        //make data into json
        context.results = JSON.stringify(rows);
        context.data = row_data;

        console.log(context.data);
        console.log('\nThis is the results:\n' + context.data);
        
        res.render('organism', context);
    }); 
});

router.post('/addOrganism', function(req,res,next){
    mysql.pool.query('INSERT INTO Organism (Organism_Type) values (?)',[req.body.Organism],function(err,result){
        if(err){
            next(err);
            return;
        }
        res.redirect('/organism');
    });
});


/*
function insertGeneID(req,res,mysql,complete){
    console.log(req.body);
    var query = 'INSERT INTO GeneID ( NCBI_ProteinID, NCBI_GeneID, Annotation) Value (?,?,?)'; 
    var inserts = [req.body.Input_ProteinIDA, req.body.In_GeneID, req.body.Ann_ProteinIDA];
    mysql.pool.query(query,inserts, function(error,results, fields){
        if(error){
            res.write(JSON.stringify(error));
        }
        complete();
    });
}*/

/*
function insertOrtholog(req,res,mysql,complete){
    console.log('Adding Ortholog:\n');
    console.log(req.body);
    var query = 'INSERT INTO Ortholog (ProteinIDA, Organism, ProteinIDB, Experimental_condition) VALUES (?,?,?,?)';
    var inserts = [req.body.Input_ProteinIDA,req.body.Organism,req.body.Input_ProteinIDB,req.body.Exp_Val];
    mysql.pool.query(query,inserts, function(error,results, fields){
        if(error){
            res.write(JSON.stringify(error));
        }
        complete();
    });      
    
}*/

module.exports = router;


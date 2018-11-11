

var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');



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
    getOrganism(res,mysql,context,complete);
    mysql.pool.query('SELECT NCBI_ProteinID, ProteinIDB, Annotation, Organism  FROM ' 
    + 'GeneID as a inner join Ortholog as b On a.NCBI_ProteinID =b.ProteinIDA', function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        row_data = {};
        row_data.inters = [];
        row_data.organisms = [];
        for( row in rows){
            inter = {};
            organ = {};

            inter.ProteinID_A = rows[row].NCBI_ProteinID;
            inter.ProteinID_B = rows[row].ProteinIDB;
            inter.PA_annotation = rows[row].Annotation;
            inter.Organism = rows[row].Organism;
            //organ.Organism = rows[row].Organism;
            row_data.organisms.push(rows[row].Organism);
            row_data.inters.push(inter);
        }
        //make data into json
        context.results = JSON.stringify(rows);
        context.data = row_data;
        // console.log('\nDataSet One: \n');
        // console.log(context.results);
        // if(callbackCount >= 1){
        // console.log('\nDataSet Two: \n');
        // console.log(context.someData);
        // }
        // console.log('This is the results:\n' + context.data);
        complete();

    })
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            console.log(context);
            res.render('home', context);
        }

    }
    //res.send("Home page");
});

router.post('/addOrtho',function(req,res,next){
    mysql.pool.query('INSERT INTO GeneID ( NCBI_ProteinID, NCBI_GeneID, Annotation) Value (?,?,?)',
    [req.body.Input_ProteinIDA, req.body.In_GeneID, req.body.Ann_ProteinIDA], function(err,result){
        if(err){
            next(err)
            return;
        }
        mysql.pool.query('INSERT INTO Ortholog (ProteinIDA, Organism, ProteinIDB, Experimental_condition) VALUES (?,?,?,?)',
        [req.body.Input_ProteinIDA,req.body.Organism,req.body.Input_ProteinIDB,req.body.Exp_Val], function(err,result){
            if(err){
                next(err);
                return;
            }
            res.redirect('/');
        });
    });
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

module.exports = router;


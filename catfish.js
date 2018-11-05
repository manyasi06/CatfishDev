

var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');



router.get('/',function(req,res,next){
    var context = {};
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

        console.log(context.data);

        console.log('This is the results:\n' + context.data);
        res.render('home', context);

    })
    
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
    })
})

module.exports = router;


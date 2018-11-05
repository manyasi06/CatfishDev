/*
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        var context = {};
        mysql.pool.query('SELECT NCBI_ProteinID, ProteinIDB, Annotation, Organism  FROM ' 
        + 'GeneID as a inner join Ortholog as b On a.NCBI_ProteinID =b.ProteinIDA', function(err,rows,fields){
            if(err){
                next(err);
                return;
            }
            //console.log(JSON.stringify(rows));
            //console.log(JSON.stringify(fields));
            row_data = {};
            row_data.inters = [];
            for( row in rows){
                inter = {};
    
                inter.ProteinID_A = rows[row].NCBI_ProteinID;
                inter.ProteinID_B = rows[row].ProteinIDB;
                inter.PA_annotation = rows[row].Annotation;
                inter.Organism = rows[row].Organism;
                
                row_data.inters.push(inter);
            }
            //make data into json
            context.results = JSON.stringify(rows);
            context.data = row_data;
    
            console.log('This is the results:\n' + context.data);
            res.render('home', context);
    
        })
        
        //res.send("Home page");
    });
      
    router.get('/Add',function(req,res){
        res.render('Add');
        //res.send("This is the add interaction page");
    });
      
    router.get('/Remove',function(req,res){
        res.render('Remove');
        //res.send("This to remove interactions");
    });
    
    router.get('/Update',function(req,res){
        //res.send("This will be the redirect page to update");
        res.render('Update');
    });
    return router;
}();*/
/*
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/',function(req,res,next){
        var context = {};
        mysql.pool.query('SELECT NCBI_ProteinID, ProteinIDB, Annotation, Organism  FROM ' 
        + 'GeneID as a inner join Ortholog as b On a.NCBI_ProteinID =b.ProteinIDA', function(err,rows,fields){
            if(err){
                next(err);
                return;
            }
            //console.log(JSON.stringify(rows));
            //console.log(JSON.stringify(fields));
            row_data = {};
            row_data.inters = [];
            for( row in rows){
                inter = {};
    
                inter.ProteinID_A = rows[row].NCBI_ProteinID;
                inter.ProteinID_B = rows[row].ProteinIDB;
                inter.PA_annotation = rows[row].Annotation;
                inter.Organism = rows[row].Organism;
                
                row_data.inters.push(inter);
            }
            //make data into json
            context.results = JSON.stringify(rows);
            context.data = row_data;
    
            console.log('This is the results:\n' + context.data);
            res.render('home', context);
    
        })
        
        //res.send("Home page");
    });
      
    router.get('/Add',function(req,res){
        res.render('Add');
        //res.send("This is the add interaction page");
    });
      
    router.get('/Remove',function(req,res){
        res.render('Remove');
        //res.send("This to remove interactions");
    });
    
    router.get('/Update',function(req,res){
        //res.send("This will be the redirect page to update");
        res.render('Update');
    });

    return router;
}();

*/

var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT NCBI_ProteinID, ProteinIDB, Annotation, Organism  FROM ' 
    + 'GeneID as a inner join Ortholog as b On a.NCBI_ProteinID =b.ProteinIDA', function(err,rows,fields){
        if(err){
            next(err);
            return;
        }
        //console.log(JSON.stringify(rows));
        //console.log(JSON.stringify(fields));
        row_data = {};
        row_data.inters = [];
        for( row in rows){
            inter = {};

            inter.ProteinID_A = rows[row].NCBI_ProteinID;
            inter.ProteinID_B = rows[row].ProteinIDB;
            inter.PA_annotation = rows[row].Annotation;
            inter.Organism = rows[row].Organism;
            
            row_data.inters.push(inter);
        }
        //make data into json
        context.results = JSON.stringify(rows);
        context.data = row_data;

        console.log('This is the results:\n' + context.data);
        res.render('home', context);

    })
    
    //res.send("Home page");
});
  
router.get('/Add',function(req,res){
    res.render('Add');
    //res.send("This is the add interaction page");
});
  
router.get('/Remove',function(req,res){
    res.render('Remove');
    //res.send("This to remove interactions");
});

router.get('/Update',function(req,res){
    //res.send("This will be the redirect page to update");
    res.render('Update');
});

module.exports = router;


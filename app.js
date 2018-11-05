var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars');
var async = require('async');
var mysql = require('./dbcon.js');
//var catfish = require('./catfish.js');



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/',express.static('public'));
//app.use('/catfish', catfish);



// This how to setup the pariatial directories using handlebars
app.engine('handlebars', handlebars({
  helpers: {
      sayHello: function () { return "Hello"; },
      getStringifiedJson: function (value) {
          return JSON.stringify(value);
      }
  },
partialsDir: ['views/partials/'],
defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//add database schema

app.set('port', process.env.PORT || 3010);

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
}


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
    
}




app.get('/',function(req,res,next){
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
  

app.post('/addOrtho',function(req,res,next){
    /*callbackCount = 0;
    insertGeneID(req,res,mysql,complete);
    if(callbackCount == 1){
        console.log('function 2');
        insertOrtholog(req,res,mysql,complete);
    }
    //if(callbackCount == 1)
        //insertOrtholog(req,res,mysql,complete);
    function complete(){
        callbackCount++;
        }
        if(callbackCount == 2){
            console.log("Complete");
            res.redirect('/');
    }*/

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

app.post('/addGeneExp',function(req,res,next){
    
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

app.get('/Add',function(req,res){
    res.render('Add');
    //res.send("This is the add interaction page");
});
  
app.get('/Remove',function(req,res){
    res.render('Remove');
    //res.send("This to remove interactions");
});

app.get('/Update',function(req,res){
    //res.send("This will be the redirect page to update");
    res.render('Update');
});


app.use(function(req,res){
    res.status(404);
    res.render('404');
  });
  
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
  });


app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})


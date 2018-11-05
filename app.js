var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars');
var async = require('async');
var mysql = require('./dbcon.js');
var catfish = require('./catfish.js');



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/',express.static('public'));
app.use('/', catfish);



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


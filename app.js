var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars');
var mysql = require('./dbcon.js');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



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


// app.get('/',function(req,res,next){
//     var context = {};
//     var createString = "CREATE TABLE diagnostic(" +
//     "id INT PRIMARY KEY AUTO_INCREMENT," +
//     "text VARCHAR(255) NOT NULL)";
//     mysql.pool.query('DROP TABLE IF EXISTS diagnostic', function(err){
//       if(err){
//         next(err);
//         return;
//       }
//       mysql.pool.query(createString, function(err){
//         if(err){
//           next(err);
//           return;
//         }
//         mysql.pool.query('INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',function(err){
//           mysql.pool.query('SELECT * FROM diagnostic', function(err, rows, fields){
//             context.results = JSON.stringify(rows);
//             res.render('home',context);
//           });
//         });
//       });
//     });
//   });
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


var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars');
var mysql = ('./dbcon.js');


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


app.get('/',function(req,res,next){
    var context = {};
    var createString = "CREATE TABLE diagnostic(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "text VARCHAR(255) NOT NULL)";
    mysql.pool.query('DROP TABLE IF EXISTS diagnostic', function(err){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query(createString, function(err){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',function(err){
          mysql.pool.query('SELECT * FROM diagnostic', function(err, rows, fields){
            context.results = JSON.stringify(rows);
            res.render('home',context);
          });
        });
      });
    });
  });
// app.get('/',function(req,res){
//     res.render('home');
//     //res.send("Home page");
// });
  
app.get('/Add',function(req,res){
    res.render('Add');
    //res.send("This is the add interaction page");
});
  
app.get('/Remove',function(req,res){
    res.render('Remove');
    //res.send("This to remove interactions");
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


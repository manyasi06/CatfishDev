var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars');
var async = require('async');
var cors = require('cors');
var mysql = require('./dbcon.js');

var catfish = require('./catfish.js');
var catfish2 = require('./catfish2.js');
var catfish3 = require('./catfish3.js');



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/',express.static('public'));
app.use('/', catfish);
app.use('/', catfish2);
app.use('/',catfish3);





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
var sequelize = require('sequelize');
 
// sequelize initialization
var sequelize = new Sequelize('UserDB','bmusungu','Bryan123!',{
    host: 'localhost',
    port:3306,
    dialect: 'mysql'
});
 
// check database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

const User = sequelize.define('users',{
      UserName: {
          type: Sequelize.STRING
      },
      Pass: {
          type: Sequelize.STRING
      },
      
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true
      
  });

  // force: true will drop the table if it already exists
User.sync({force: true}).then(() => {
    // Table created
    return User.create({
      UserName: 'Bryan2',
      Pass: 'Bryan123!'
    });
  });

  User.findAll().then(user => {
    console.log(user)
  })
  

app.set('port', process.env.PORT || 3015);





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


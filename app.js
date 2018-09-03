const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');


//set up the middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//add database schema


app.set('port', process.env.PORT || 3000);




app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})


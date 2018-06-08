var express= require('express');
var app= express();
var config=require('./config');
var mongoose= require('mongoose');
var jwt    = require('jsonwebtoken');
var routes = require('./routes');

var fs=require('fs');
//  Connect all our routes to our application



var bodyParser =require('body-parser');

 // secret variable
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))
app.set('superSecret', config.secret);

app.use('/', routes);

mongoose.connect(config.dbUrl,(error)=>{
    if(error){
        console.log('mongoDb connection error',error);
    }
    else{
        console.log('mongo db connection established successfully');
    }
});

app.listen(config.port,(error)=>{
    if(error){
        console.log('error in starting server');
    }else{
        console.log('server running on the port',config.port);
    }
});
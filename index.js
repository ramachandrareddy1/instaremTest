var express= require('express');
var app= express();
var config=require('./config');
var mongoose= require('mongoose');

const routes = require('./routes');

//  Connect all our routes to our application
app.use('/', routes);


var bodyParser =require('body-parser');


app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))



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
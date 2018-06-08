var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var userSchema= new Schema({
    name: String,
    password: String
});

module.exports= mongoose.model('users',userSchema);



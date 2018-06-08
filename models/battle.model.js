var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var battleSchema= new Schema({
    name:String,
    year:Number,
    battle_number:Number,
    attacker_king:String,
    defender_king:String,
    attacker_1:String,
    attacker_2:String,
    attacker_3:String,
    attacker_4:String,
    defender_1:String,
    defender_2:String,
    defender_3:String,
    defender_4:String,
    attacker_outcome:String,
    battle_type:String,
    major_death:Number,
    major_capture:Number,
    attacker_size:Number,
    attacker_commander:String,
    defender_commander:String,
    summer:String,
    location:String,
    region:String,
    note:String
});

battleSchema.index({ attacker_king:'text',defender_king:'text',location: 'text' });

module.exports= mongoose.model('battles',battleSchema)
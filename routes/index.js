const routes = require('express').Router();
const fs = require('fs');
const csv = require('fast-csv');
const bettleModel= require('../models/battle.model');
const dbQuery=require('../dbQuery');

//reading csv file data and insert in to the db
routes.get('/readCsvFileAndInsert',((req,res)=>{

    var csvData=[];
    var stream=fs.createReadStream('./files/battles.csv');
    var parser = csv.fromStream(stream, {headers: true})
        .on("data", function (data) {
            //console.log(data);
            csvData.push(data);

        }).on('end', function (data) {
           // console.log(csvData);
           bettleModel.insertMany(csvData,((error,battles)=>{
               if(error){
                   res.status(500).json({'status':200,'message':'success'})
               }else{
                   //console.log('data',battles);
                   res.status(200).json({'message':'csf files records are added in db'})
               }
           }))
        })

}));

//list of places

routes.get('/list',((req,res)=>{

    bettleModel.find({},{location:1,_id:0}).then((locations)=>{

        //console.log(locations);

        //converting arrys
        let locationsArry=locations.map((location)=>{
            return location.location;
        });
        // eleminating empty values
        locationsArry = locationsArry.filter(function(e){return e});
        res.json({'status':200,'message':'success','places':locationsArry})
    }).catch((error)=>{
        console.log(error)
        res.status(500).json({'message':'server side errror'});
    })

}));


routes.get('/count',((req,res)=>{
    bettleModel.aggregate(
        [{ $group: { _id: null, count: { $sum: 1 } }},{ $project : {
            _id : 0 ,
            count : 1
        }}])
        .then((count)=>{
          //console.log(count);
            res.json({'status':200,'message':'success',count});
        })
        .catch((error)=>{
            //console.log(error);
            res.status(500).json({'message':'server side errror'});
          })
}));


routes.get('/status',((req,res)=>{

    let promiseArry=[dbQuery.query1(),dbQuery.query2(),dbQuery.query3()];

        Promise.all(promiseArry).then((result)=> {

            // most_active=most_active.filter(function(e){return e});
            let finalOutput =
                    {
                        'most_active': {
                            'attacker_king': result[0][0].attacker_king,
                            'defender_king': result[0][0].defender_king,
                            'region': result[0][0].region,
                            'name': result[0][0].name,
                        }
                    ,
                'battle_type':result[1].filter(function(e){return e}),
                 //'attacker_size':

           'attacker_size': {'avg':result[0][0].average,'max':result[0][0].max,
               'min':result[0][0].min},

                        'attacker_outcomes':result[2].map(obj =>{
                var rObj = {};
                rObj[obj._id] = obj.count;
                return rObj;})
        }

          console.log(finalOutput)
            res.json({'status':200,'message':'success',result});
        })
        .catch((error)=>{
        console.log(error);

        });
}));



routes.get('/search', ((req,res)=>{
    let keyParamsArry=[];
    let valueParamsArry=[];
    var query={};
    for (var param in req.query) {
        console.log(param, req.query[param]);
        keyParamsArry.push(param);
        valueParamsArry.push(JSON.parse(req.query[param]));
    }

    if(keyParamsArry.indexOf("king")>=0){
        query.$or=[];
        let kingName=valueParamsArry[keyParamsArry.indexOf('king')];
        query.$or.push({'attacker_king':kingName},{"defender_king":kingName})
    }
    if(keyParamsArry.indexOf("location")>=0){
        query.location= valueParamsArry[keyParamsArry.indexOf('location')];
    }

    if(keyParamsArry.indexOf("type")>=0){
        query.battle_type= valueParamsArry[keyParamsArry.indexOf('type')];
    }
    //console.log(query);
    bettleModel.find(query,{_id:0})
        .then((data)=> {
           res.json({'status':200,'message':'success',data});
          })
        .catch((error)=>{
           res.status(500).json({'message':'server side error'});
        })

}))


module.exports = routes;
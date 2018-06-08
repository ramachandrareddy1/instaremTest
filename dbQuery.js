const bettleModel=require('./models/battle.model');

module.exports={

    query1:()=>{
     return bettleModel.aggregate([
        { $group : { _id: null, 'attacker_king': { $max : "$attacker_king" },
            'defender_king':{ $max : "$attacker_king" },
            'region':{$max:"$region"},
            'name':{$max:'$name'},

            //based on the attacker_size
            average: { $avg: "$attacker_size" },min:{$min:"$attacker_size"},
            max:{$max:"$attacker_size"}

        }},
        {$project:{_id:0}}

      ])

    },

    query2:()=>{
        return bettleModel.distinct( "battle_type" )
     },




    query3:()=>{
       return bettleModel.aggregate([
        {"$group" : {_id:"$attacker_outcome", count:{$sum:1}}}
          

    ])


    }


}

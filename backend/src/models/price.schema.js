import mongoose from 'mongoose'

const PriceSchema= new mongoose.Schema({
    Amount:{
        type:Number,
        required:true
    },
    Currency:{
        type:String,
        enum:["INR","USD","GBP","EUR","JPY"],
        default:'INR'
    }
})

export default PriceSchema;
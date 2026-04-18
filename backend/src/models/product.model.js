import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Price:[
        {
            Amount:{
                type:Number,
                required:true
            },
            Currency:{
                type:String,
                enum:["INR","USD","GBP","EUR","JPY"],
                default:'INR'
            }
        }
    ],
    images:[
        {
            url:{
                type:String,
                required:true
            }
        }
    ],
    Seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
   
},{timestamps:true})

const ProductModel = mongoose.model("Product",ProductSchema)

export default ProductModel;
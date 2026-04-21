import mongoose from "mongoose";
import priceSchema from './price.schema.js'

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
        priceSchema
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
    },
    Variants:[
        {
            Images:[
                {
                    url:{
                        type:String,
                        required:true
                    }
                }
            ],
            stock:{
                type:Number,
                default:0
            },
            price:priceSchema,
            Attributes:{
                type:Map,
                of:String
            },
            
        }
    ]
   
},{
    timestamps:true
})

const ProductModel = mongoose.model("Product",ProductSchema)

export default ProductModel;

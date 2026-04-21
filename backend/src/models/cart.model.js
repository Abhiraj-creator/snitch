import mongoose from 'mongoose'
import priceSchema from './price.schema.js'
const CartSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    items:[
        {
           product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
           },
           variant:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product.Variants',
            required:false,
            default:null
           },
            quantity:{
                type:Number,
                required:true,
                default:1
            },
            price:priceSchema
        }
    ],
  
},{
    timestamps:true
})

const CartModel= new mongoose.model('cart',CartSchema)
export default CartModel
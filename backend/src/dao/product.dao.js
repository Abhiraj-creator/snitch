import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export async function StockCheck(productId,variantId){
    try {
        const product = await ProductModel.findOne({
            _id:productId,
            'Variants._id':variantId
        })
        const variant =product.Variants.find(variant=>variant._id.toString()===variantId)
        return variant ? variant.stock : 0;

    } 
    catch (error) {
        return {
            success:false,
            message:'error in stock check'
        }
    }
}
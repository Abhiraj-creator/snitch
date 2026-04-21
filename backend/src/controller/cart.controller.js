import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js"
import { StockCheck } from "../dao/product.dao.js"

export const AddToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params
        const { quantity } = req.body
        const user= req.user
        const product = await ProductModel.findOne({
            _id: productId,
            'Variants._id': variantId
        })
        console.log(productId, variantId, quantity);
        
        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                success: false
            })
        }
        const stock = await StockCheck(productId, variantId)

        const cart = (await CartModel.findOne({ userId: user._id })) || await CartModel.create({ userId: user._id })

        const IsProductAlredayInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

        if (IsProductAlredayInCart) {
            const QuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity

            if (QuantityInCart + quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items left in stock. and you already have ${QuantityInCart} items in your cart`,
                    success: false
                })
            }

            await CartModel.findOneAndUpdate(
                { userId: req.user._id, "items.product": productId, "items.variant": variantId },
                { $inc: { "items.$.quantity": quantity } },
                { new: true }
            )

            return res.status(200).json({
                message: "Cart updated successfully",
                success: true,
                cart
            })

        }
        if (quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock`,
                success: false
            })
        }

        cart.items.push({
            product:productId,
            variant: variantId,
            quantity,
            price: product.Variants.find(v => v._id.toString() === variantId).price
        })

        await cart.save()

        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true,
            cart
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const GetCart=async (req,res)=>{
    try {
        const cart = await CartModel.findOne({ userId: req.user._id }).lean()
        if (!cart) {
            return res.status(404).json({
                message: 'cart not found',
                success: false
            })
        }

        const productIds = cart.items.map((item) => item.product)
        const products = await ProductModel.find({ _id: { $in: productIds } })
            .select('Title images Variants')
            .lean()

        const productMap = new Map(products.map((product) => [product._id.toString(), product]))
        const enrichedItems = cart.items.map((item) => {
            const productDoc = productMap.get(item.product.toString())
            const variantDoc = productDoc?.Variants?.find(
                (variant) => variant._id.toString() === item.variant.toString()
            )

            return {
                ...item,
                product: productDoc
                    ? {
                        _id: productDoc._id,
                        Title: productDoc.Title,
                        images: productDoc.images
                    }
                    : item.product,
                variant: variantDoc
                    ? {
                        _id: variantDoc._id,
                        Images: variantDoc.Images,
                        Attributes: variantDoc.Attributes,
                        stock: variantDoc.stock,
                        price: variantDoc.price
                    }
                    : item.variant
            }
        })

        const enrichedCart = {
            ...cart,
            items: enrichedItems
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart: enrichedCart
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
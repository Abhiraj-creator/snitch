import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js"
import { StockCheck } from "../dao/product.dao.js"
import mongoose from "mongoose";

export const AddToCart = async (req, res) => {
    try {
        const { productId, variantId } = req.params
        const { quantity = 1 } = req.body
        const user= req.user

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product id",
                success: false
            })
        }

        if (variantId && !mongoose.Types.ObjectId.isValid(variantId)) {
            return res.status(400).json({
                message: "Invalid variant id",
                success: false
            })
        }

        const hasVariant = Boolean(variantId)
        const product = await ProductModel.findOne(
            hasVariant
                ? { _id: productId, 'Variants._id': variantId }
                : { _id: productId }
        )
        console.log(productId, variantId, quantity);
        
        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                success: false
            })
        }
        const stock = hasVariant ? await StockCheck(productId, variantId) : Number.MAX_SAFE_INTEGER

        const cart = (await CartModel.findOne({ userId: user._id })) || await CartModel.create({ userId: user._id })

        const IsProductAlredayInCart = cart.items.some((item) => {
            const sameProduct = item.product.toString() === productId
            const sameVariant = hasVariant
                ? item.variant?.toString() === variantId
                : !item.variant
            return sameProduct && sameVariant
        })

        if (IsProductAlredayInCart) {
            const existingItem = cart.items.find((item) => {
                const sameProduct = item.product.toString() === productId
                const sameVariant = hasVariant
                    ? item.variant?.toString() === variantId
                    : !item.variant
                return sameProduct && sameVariant
            })
            const QuantityInCart = existingItem.quantity

            if (QuantityInCart + quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items left in stock. and you already have ${QuantityInCart} items in your cart`,
                    success: false
                })
            }

            await CartModel.findOneAndUpdate(
                hasVariant
                    ? { userId: req.user._id, "items.product": productId, "items.variant": variantId }
                    : { userId: req.user._id, "items.product": productId, "items.variant": null },
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
            variant: hasVariant ? variantId : null,
            quantity,
            price: hasVariant
                ? product.Variants.find(v => v._id.toString() === variantId).price
                : (product.Price?.[0] || { Amount: 0, Currency: 'INR' })
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
            const variantDoc = item.variant
                ? productDoc?.Variants?.find(
                    (variant) => variant._id.toString() === item.variant.toString()
                )
                : null

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
                    : null
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

export const DiscardCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ userId: req.user._id })
        if (!cart) {
            return res.status(404).json({
                message: 'cart not found',
                success: false
            })
        }

        cart.items = []
        await cart.save()

        return res.status(200).json({
            message: 'Cart discarded successfully',
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
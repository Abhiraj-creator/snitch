import {Router} from 'express'
import { AuthenticateUser } from '../middlewares/auth.middleware.js'
import { ValidateAddToCart } from '../validator/cart.validator.js'
import { AddToCart,GetCart } from '../controller/cart.controller.js';
const CartRouter= Router();


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add product to cart
 * @access Private
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @param {number} quantity - Quantity
 */


CartRouter.post('/add/:productId/:variantId',AuthenticateUser,ValidateAddToCart,AddToCart)


/**
 * @route GET /api/cart/
 * @desc Get user cart
 * @access Private
 */

CartRouter.get('/',AuthenticateUser,GetCart);

export default CartRouter;
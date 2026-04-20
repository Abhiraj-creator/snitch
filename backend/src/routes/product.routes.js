import express, { Router } from 'express'
import { AuthenticateSeller } from '../middlewares/auth.middleware.js'
import { CreateProduct, GetAllSellerProducts, GetAllProducts, GetProductById, CreateVariants } from '../controller/product.controller.js';
import { validateCreateProduct } from '../validator/product.validator.js'
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 7 * 1024 * 1024 //7mb
    }
})

const router = Router();

/**
 * @route POST /api/products/
 * @desc Create a new product
 * @access Private
 */
router.post('/', AuthenticateSeller, upload.array('images', 7), validateCreateProduct, CreateProduct);


/**
 * @route GET /api/products/seller
 * @desc Get all products of seller
 * @access Private
 */
router.get('/seller', AuthenticateSeller, GetAllSellerProducts);


/**
 * @route Get /api/products/
 * @desc Get all products
 * @access Public
 */
router.get('/', GetAllProducts);


/**
 * @route Get /api/products/:id
 * @desc Get product by id
 * @access Public
 */
router.get('/:id', GetProductById);



/**
 * @route POST /api/products/:productId/variants
 * @desc Create variants for a product  
 * @access Private
 */
router.post('/:productId/variants', AuthenticateSeller, upload.array('images', 7), CreateVariants);

export default router;
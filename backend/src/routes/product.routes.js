import express, { Router } from 'express'
import { AuthenticateSeller } from '../middlewares/auth.middleware.js'
import { CreateProduct,GetAllProducts } from '../controller/product.controller.js';
import {validateCreateProduct} from '../validator/product.validator.js'
import multer from 'multer';

const upload= multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:7*1024*1024 //7mb
    }
})

const router = Router();

/**
 * @route POST /api/products/
 * @desc Create a new product
 * @access Private
 */
router.post('/',AuthenticateSeller,upload.array('images',7),validateCreateProduct,CreateProduct);


/**
 * @route GET /api/products/seller
 * @desc Get all products of seller
 * @access Private
 */
router.get('/seller',AuthenticateSeller,GetAllProducts);

export default router;
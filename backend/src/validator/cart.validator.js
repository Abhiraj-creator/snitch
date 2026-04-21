import {param,validationResult,body} from 'express-validator'

const ValidateRequest=(req,res,next)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
}


export const ValidateAddToCart =[
    param('productId').notEmpty().withMessage('Product is required'),
    param('variantId').notEmpty().withMessage('Variant is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
   ValidateRequest
]
    
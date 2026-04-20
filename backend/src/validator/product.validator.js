import {body,validationResult} from 'express-validator'

export const handleValidationErrors = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}



export const validateCreateProduct = [
    body('Title').notEmpty().isLength({min:3,max:100}).withMessage('Title is required and must be between 3 and 100 characters'),
    body('Description').notEmpty().isLength({min:10,max:1000}).withMessage('Description is required and must be between 10 and 1000 characters'),
    body('PriceAmount').notEmpty().isNumeric().withMessage('PriceAmount is required and must be a number'),
    body('PriceCurrency').notEmpty().isLength({min:3,max:3}).withMessage('PriceCurrency is required and must be a 3 digit code'),
    body('images').custom((value,{req})=>{
        if(!req.files || req.files.length === 0){
            throw new Error('Images are required');
        }
        return true;
    }),

    handleValidationErrors
]

export const validateCreateVariants = [
    body('stock').notEmpty().isNumeric().withMessage('Stock is required and must be a number'),
    body('priceAmount').notEmpty().isNumeric().withMessage('PriceAmount is required and must be a number'),
    body('priceCurrency').notEmpty().isLength({min:3,max:3}).withMessage('PriceCurrency is required and must be a 3 digit code'),
    body('images').custom((value,{req})=>{
        if(!req.files || req.files.length === 0){
            throw new Error('Images are required');
        }
        return true;
    }),
    body('attributes').custom((value,{req})=>{
        if(!req.body.attributes){
            throw new Error('Attributes are required');
        }
        return true;
    }),

    handleValidationErrors
]
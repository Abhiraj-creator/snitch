import {body,validationResult} from 'express-validator'


function handleValidationErrors(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}


export const validateRegister = [
    body('fullname').notEmpty().isLength({min:3,max:50}).withMessage('name is required and must be between 3 and 50 characters'),
    body('email').notEmpty().isEmail().withMessage('Email is required'),
    body('password').notEmpty().isLength({min:6,max:20}).withMessage('Password is required and must be between 6 and 20 characters'),
    body('contact').notEmpty().isLength({min:10,max:10}).withMessage('Contact is required and must be 10 digits'),

    handleValidationErrors  
]
export const validateLogin=[
    body('email').notEmpty().isEmail().withMessage('Email is required'),
    body('password').notEmpty().isLength({min:6,max:20}).withMessage('Password is required and must be between 6 and 20 characters'),

    handleValidationErrors
]
import express, { Router } from 'express'
import { validateRegister, validateLogin } from '../validator/auth.validator.js'
import { UserRegisterController, UserLoginController, GoogleCallback ,GetMe} from '../controller/auth.controller.js';
import passport from 'passport';
import { AuthenticateSeller } from '../middlewares/auth.middleware.js';
const router = Router();
/**
 * @route .api/auth/register
 * @method post
 * @body {fullname,email,password,contact}
 * @response {message,User:{fullname,email,contact,role}}
 * @description register a new user
 * @access public
 */

router.post('/register', validateRegister, UserRegisterController)


/**
 * @route /api/auth/login
 * @method post
 * @body {email,password}
 * @response {message,User:{fullname,email,contact,role}}
 * @description login a user
 * @access public
 */

router.post('/login', validateLogin, UserLoginController)


/**
 * @route /api/auth/google
 * @method get
 * @description login with google
 * @access public
 */

router.get('/google', (req, res, next) => {
    const role = req.query.role || 'buyer';
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: role 
    })(req, res, next);
});

/**
 * @route /api/auth/google/callback
 * @method get
 * @description callback for google login
 * @access public
 */

router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173/login'
}), GoogleCallback)




/**
 * @routes /api/auth/me
 * @method get
 * @description get current user
 * @access private
 */

router.get('/me',AuthenticateSeller,GetMe);


export default router
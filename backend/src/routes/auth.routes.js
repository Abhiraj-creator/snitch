import express, { Router } from 'express'
import { validateRegister, validateLogin } from '../validator/auth.validator.js'
import { UserRegisterController, UserLoginController, GoogleCallback } from '../controller/auth.controller.js';
import passport from 'passport';
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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route /api/auth/google/callback
 * @method get
 * @description callback for google login
 * @access public
 */

router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
}), GoogleCallback)

export default router
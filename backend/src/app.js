import express from 'express'
import cookieparser from 'cookie-parser'
import AuthRouter from './routes/auth.routes.js'
import ProductRouter from './routes/product.routes.js'
import passport from 'passport'
import { Config } from './config/config.js'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import morgan from'morgan'
import CartRouter from './routes/cart.routes.js'
import SearchRouter from './routes/search.routes.js'

// import cors from 'cors'
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(passport.initialize())
app.use(morgan('dev'))
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))




passport.use(new GoogleStrategy({
  clientID: Config.GOOGLE_CLIENT_ID,
  clientSecret: Config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null,profile);
}
));

app.use('/api/auth',AuthRouter);
app.use('/api/products',ProductRouter);
app.use('/api/cart',CartRouter);
app.use('/api/search',SearchRouter);
export default app;
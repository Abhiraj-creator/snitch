import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import ProductReducer from '../features/product/state/product.slice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        product:ProductReducer
    }
})
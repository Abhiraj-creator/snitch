import { createSlice } from "@reduxjs/toolkit";


const ProductSlice = createSlice({
    name:"product",
    initialState:{
       SellerProducts:[],
       AllProducts:[],
       EachProductDeatil:[]
    },
    reducers:{
        SetSellerProducts:(state,action)=>{
            state.SellerProducts=action.payload
        },
        SetAllProducts:(state,action)=>{
            state.AllProducts=action.payload
        },
        SetEachProductDeatil:(state,action)=>{
            state.EachProductDeatil=action.payload
        }
    }
})

export const {SetSellerProducts,SetAllProducts,SetEachProductDeatil}=ProductSlice.actions

export default ProductSlice.reducer
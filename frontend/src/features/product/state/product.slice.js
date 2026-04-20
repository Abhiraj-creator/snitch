import { createSlice } from "@reduxjs/toolkit";


const ProductSlice = createSlice({
    name:"product",
    initialState:{
       SellerProducts:[],
       AllProducts:[],
       EachProductDeatil:[],
       Variants:[]
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
        },
        SetVariants:(state,action)=>{
            state.Variants=action.payload
        }
    }
})

export const {SetSellerProducts,SetAllProducts,SetEachProductDeatil,SetVariants}=ProductSlice.actions

export default ProductSlice.reducer
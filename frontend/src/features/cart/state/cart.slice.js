import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        cart:[]
    },
    reducers:{
        addItems:(state,action)=>{
            state.items.push(action.payload)
        },
        SetItems:(state,action)=>{
            state.items=action.payload
        },
        setCart:(state,action)=>{
            state.cart=action.payload
        }
    }
})

export const {addItems,SetItems,setCart}=CartSlice.actions
export default CartSlice.reducer
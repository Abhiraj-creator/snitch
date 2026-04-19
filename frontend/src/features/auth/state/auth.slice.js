import {createSlice} from '@reduxjs/toolkit'

const UserSlice= createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:true,
        error:null
    },
    reducers:{
        SetUser:(state,action)=>{
            state.user= action.payload
        },
        SetLoading:(state,action)=>{
            state.loading= action.payload
        },
        SetError:(state,action)=>{
            state.error= action.payload
        }
    }
})

export const {SetUser,SetError,SetLoading}= UserSlice.actions

export default UserSlice.reducer
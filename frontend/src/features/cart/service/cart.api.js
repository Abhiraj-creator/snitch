import axios from 'axios';

const CartApiInstance= axios.create({
    baseURL:'/api/cart',
    withCredentials:true
})


export const AddToCart=async ({productId,variantId})=>{
    if (!productId) {
        return {
            success: false,
            message: 'Please select a valid product before adding to cart.'
        }
    }
    
    try {
        const path = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`
        const response = await CartApiInstance.post(path,{
            quantity:1,
            variantId
        })
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const GetCart=async ()=>{
    try {
        const response = await CartApiInstance.get('/')
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const DiscardCart=async ()=>{
    try {
        const response = await CartApiInstance.delete('/discard')
        return response.data
    } catch (error) {
        return error.response.data
    }
}
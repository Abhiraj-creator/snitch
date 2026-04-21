import axios from 'axios';

const CartApiInstance= axios.create({
    baseURL:'/api/cart',
    withCredentials:true
})


export const AddToCart=async ({productId,variantId})=>{
    console.log(variantId);
    
    try {
        const response = await CartApiInstance.post(`/add/${productId}/${variantId}`,{
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
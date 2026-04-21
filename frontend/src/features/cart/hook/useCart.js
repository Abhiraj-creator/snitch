import { AddToCart, GetCart } from '../service/cart.api'
import { useDispatch } from 'react-redux'
import { setCart } from '../state/cart.slice'

export const useCart=()=>{
    const dispatch = useDispatch()

    const handleAddToCart=async ({productId,variantId})=>{
        const data = await AddToCart({productId,variantId})
        return data
    }

    const handleGetCart=async ()=>{
        const data = await GetCart()
        if (data?.cart) {
            dispatch(setCart(data.cart))
        }
        return data.cart
    }
    return {handleAddToCart,handleGetCart}
}
import { CreateProduct, GetSellerProducts,GetAllProducts,GetProductDetailById } from '../services/product.api'
import { SetSellerProducts,SetAllProducts,SetEachProductDeatil } from '../state/product.slice'
import { useDispatch, useSelector } from 'react-redux'
export const useProduct = () => {

    const dispatch = useDispatch()

    async function HandleCreateProduct(formData) {
        const result = await CreateProduct(formData)
        return result.products
    }

    async function HandleGetSellerProducts() {
        const result = await GetSellerProducts();
        dispatch(SetSellerProducts(result.products))
        return result.products
    }

    async function HandleAllProducts(){
        const result= await GetAllProducts()
        dispatch(SetAllProducts(result.products))
    }

    async function HandleProductDeatilById(id) {
        const result = await GetProductDetailById(id);
        dispatch(SetEachProductDeatil(result.product));
    }
    return {
        HandleCreateProduct,
        HandleGetSellerProducts,
        HandleAllProducts,
        HandleProductDeatilById
    }
}
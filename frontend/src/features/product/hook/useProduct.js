import { CreateProduct, GetSellerProducts, GetAllProducts, GetProductDetailById, CreateVariants, FetchRecommendation } from '../services/product.api'
import { SetSellerProducts, SetAllProducts, SetEachProductDeatil, SetVariants,setRecommendations } from '../state/product.slice'
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

    async function HandleAllProducts() {
        const result = await GetAllProducts()
        dispatch(SetAllProducts(result.products))
    }

    async function HandleProductDeatilById(id) {
        const result = await GetProductDetailById(id);
        dispatch(SetEachProductDeatil(result.product));
    }

    async function HandleCreateVariants(productId, formData) {
        const result = await CreateVariants(productId, formData);
        dispatch(SetVariants(result.product.Variants));
    }

    async function HandleDeleteVariant(productId, variantId) {
        const result = await DeleteVariant(productId, variantId);
        dispatch(SetVariants(result.product.Variants));
        // Also update the product details if we're on a details page
        dispatch(SetEachProductDeatil(result.product));
    }
    async function HandleRecommendations(productId) {
        try {
            const data = await FetchRecommendation(productId);
            dispatch(setRecommendations(data));
        } catch (err) {
            console.error("Recommendations error:", err);
        }
    }
    return {
        HandleCreateProduct,
        HandleGetSellerProducts,
        HandleAllProducts,
        HandleProductDeatilById,
        HandleCreateVariants,
        HandleRecommendations
    }
}
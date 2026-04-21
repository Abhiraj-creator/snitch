import axios from 'axios'

const ProductApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

export const CreateProduct = async (formData) => {
    try {
        const response = await ProductApiInstance.post("/", formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const GetSellerProducts = async () => {
    try {
        const response = await ProductApiInstance.get("/seller")
        return response.data
    } catch (error) {
        throw error
    }
}

export const GetAllProducts =async ()=>{
    try{
        const response= await ProductApiInstance.get('/')
        return response.data
    }
    catch(error){
        throw error
    }
}

export const GetProductDetailById= async (id)=>{
    try {
        const response= await ProductApiInstance.get(`/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const CreateVariants = async (productId, formData) => {
    try {
        const response = await ProductApiInstance.post(`/${productId}/variants`, formData)
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteVariant = async (productId, variantId) => {
    try {
        const response = await ProductApiInstance.delete(`/${productId}/variants/${variantId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const FetchRecommendation= async(productId)=>{
    try {
        const response= await ProductApiInstance.get(`/recommendations/${productId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
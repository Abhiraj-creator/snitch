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
import axios from 'axios'

const SearchApiInstance= axios.create({
    baseURL:"/api/search",
    withCredentials:true
})

export const searchProduct = async (query) => {
    try {
        const response = await SearchApiInstance.get(`/?q=${query}`)
        return response.data
    } catch (error) {
        throw error
    }
}
import { SetUser, SetError, SetLoading } from '../state/auth.slice'
import { Register, Login,GetMe } from '../services/auth.api'
import { useDispatch } from 'react-redux'

export const useAuth = () => {
    const dispatch = useDispatch()
    const HandleRegister = async (data) => {

        try {
            dispatch(SetLoading(true))
            const res = await Register(data)
            dispatch(SetUser(res.User))
            return res.User
        } catch (error) {
            console.error(error)
            dispatch(SetError(error.response.data.message))
        }
        finally{
            dispatch(SetLoading(false))

        }
    }

    const HandleLogin = async (data) => {
        try {
            dispatch(SetLoading(true))
             const res=await Login(data)
            dispatch(SetUser(res.User))
            return res.User
            
        } catch (error) {
            console.error(error)
            dispatch(SetError(error.response.data.message))
        }
        finally{
            dispatch(SetLoading(false))

        }
    }
    async function HandleGetMe(){
        try {
            dispatch(SetLoading(true))
            const res = await GetMe()
            dispatch(SetUser(res.User))
           
        } catch (error) {
            console.error("Auto login failed or no session found");
        }
        finally{
             dispatch(SetLoading(false))
        }
    }
    return {
        HandleRegister,
        HandleLogin,
        HandleGetMe
    }
}
import { SetUser, SetError, SetLoading } from '../state/auth.slice'
import { Register, Login } from '../services/auth.api'
import { useDispatch } from 'react-redux'

export const useAuth = () => {
    const dispatch = useDispatch()
    const HandleRegister = async (data) => {

        try {
            dispatch(SetLoading(true))
            const res = await Register(data)
            dispatch(SetUser(res.data))
            dispatch(SetLoading(false))
        } catch (error) {
            console.error(error)
            dispatch(SetError(error.response.data.message))
            dispatch(SetLoading(false))
        }
    }

    const HandleLogin = async (data) => {
        try {
            dispatch(SetLoading(true))
            const res = await Login(data)
            dispatch(SetUser(res.data))
            dispatch(SetLoading(false))
        } catch (error) {
            console.error(error)
            dispatch(SetError(error.response.data.message))
            dispatch(SetLoading(false))
        }
    }

    return {
        HandleRegister,
        HandleLogin
    }
}
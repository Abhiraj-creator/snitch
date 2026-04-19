import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';
const Protected = ({ children ,role='buyer'}) => {

    const loading = useSelector(state => state.auth.loading)
    const user = useSelector(state => state.auth.user)

    console.log(loading, user);

    if (loading) {
        return <h1>loading...</h1>
    }
    if (!user) {
        return <Navigate to='/login' />
    }
    if(user.role!==role){
        return <Navigate to='/'/>
    }

    return children
};

export default Protected;
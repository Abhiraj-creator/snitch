import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'

import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useEffect } from 'react'
function App() {


  let user = useSelector((state) => state.auth.user)

  

  const { HandleGetMe } = useAuth();
  useEffect(() => {
    HandleGetMe()
  }, [])
  console.log(user);

  return (
     <RouterProvider router={router} />
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/App.css'
import App from './app/App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/app.store'
import { RouterProvider } from 'react-router'
import { router } from './app/app.routes'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

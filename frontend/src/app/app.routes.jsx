import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

import CreateProduct from "../features/product/pages/CreateProduct";
import GetSellerProducts from "../features/product/pages/Dashboard";
import Protected from "../features/product/components/Protected";
import Dashboard from "../features/product/pages/Dashboard";
import Home from "../features/product/pages/Home";
import ProductDetail from "../features/product/pages/ProductDetail";
import SellerProductdetails from "../features/product/pages/SellerProductdetails";
import Cart from "../features/cart/pages/Cart";
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: 
          <Home/>
    },
    {
        path: "/product/:id",
        element: 
            <ProductDetail />
    },
    {
        path: "/cart",
        element: <Cart />
    },
    {
        path: '/seller',
        children: [
            {
                path: '/seller/create-product',
                element: <Protected role="seller">
                    <CreateProduct />
                </Protected>
            }, {
                path: '/seller/dashboard',
                element: <Protected role="seller">
                    <Dashboard />
                </Protected>
            },{
                path:'/seller/dashboard/:id',
                element:<Protected role="seller">
                    <SellerProductdetails />
                </Protected>
            }
        ]
    }
])

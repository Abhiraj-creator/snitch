import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import AppNavbar from '../../../components/AppNavbar';
import SearchBar from '../../search/component/SearchBar';
import { useAuth } from '../../auth/hook/useAuth';
const Home = () => {
    const { HandleAllProducts } = useProduct();
    const { HandleLogout } = useAuth();
    const products = useSelector((state) => state.product.AllProducts) || [];
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await HandleAllProducts();
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    async function Logout()
{
    await HandleLogout()
    navigate('/')
}    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2B] selection:bg-[#1F1E1D] selection:text-[#FAF7F2]">

            <AppNavbar
                rightContent={
                    <div className="flex items-center gap-8">
                        <SearchBar />
                        {/* {user ? (
                            <button onClick={HandleLogout} className="text-[11px] uppercase tracking-[0.2em] text-[#807B75] hover:text-[#1F1E1D] transition-colors hidden md:block hover:shadow-md bg-black">Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="text-[11px] uppercase tracking-[0.2em] text-[#807B75] hover:text-[#1F1E1D] transition-colors hidden md:block">
                                    Sign In
                                </Link>
                                <Link to="/register" className="text-[11px] uppercase tracking-[0.2em] text-[#807B75] hover:text-[#1F1E1D] transition-colors hidden md:block">
                                    Register
                                </Link>
                            </>
                        )} */}
                    </div>
                }
            />
           

            {/* Hero Header */}
            <header className="pt-32 pb-16 px-6 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#807B75] mb-6">SS26 Collection</p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-[#1F1E1D] leading-tight tracking-tight">
                    New<br />
                    <span className="font-light">Arrivals.</span>
                </h1>
         
            </header>
            {/* Divider */}
            <div className="border-t border-[#EBE5DB] mx-6 md:mx-12 lg:mx-20 mb-16" />

            {/* Product Grid */}
            <main className="px-6 md:px-12 lg:px-20 pb-32 max-w-[1800px] mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#B5AC9E] animate-pulse font-serif italic">
                            Curating the collection...
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <p className="text-4xl font-serif italic text-[#C2BCB1] mb-4">Empty season.</p>
                        <p className="text-xs uppercase tracking-widest text-[#B5AC9E]">No pieces available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product, idx) => (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="block group"
                            >
                                {/* Image */}
                                <div className="w-full aspect-[3/4] mb-5 overflow-hidden bg-[#F4EFE6] rounded-2xl relative">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.Title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-[10px] uppercase tracking-widest text-[#B5AC9E]">No Image</span>
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-[#1F1E1D]/0 group-hover:bg-[#1F1E1D]/5 transition-colors duration-500 rounded-2xl" />
                                </div>

                                {/* Details */}
                                <div className="px-1">
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#B5AC9E] mb-2">
                                        {String(idx + 1).padStart(2, '0')}
                                    </p>
                                    <h2 className="font-serif italic text-xl text-[#1F1E1D] leading-tight mb-2 group-hover:opacity-70 transition-opacity line-clamp-1">
                                        {product.Title}
                                    </h2>
                                    <p className="text-sm text-[#807B75] font-light">
                                        {product.Price && product.Price.length > 0
                                            ? `${product.Price[0].Currency} ${product.Price[0].Amount}`
                                            : 'Price TBA'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#EBE5DB] px-6 md:px-12 lg:px-20 py-10 max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="font-serif italic text-[#1F1E1D]">Snitch</span>
                <p className="text-[10px] tracking-widest text-[#B5AC9E] uppercase">
                    © {new Date().getFullYear()} — Premium Atelier
                </p>
            </footer>
        </div>
    );
};

export default Home;

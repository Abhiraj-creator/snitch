import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const Home = () => {
    const { HandleAllProducts } = useProduct();
    const products = useSelector((state) => state.product.AllProducts) || [];
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
    }, []); // Removed HandleAllProducts from dependency array to prevent infinite loops if function isn't memoized

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Top Navbar */}
            <nav className="w-full bg-white border-b border-gray-200 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-black text-2xl tracking-tighter uppercase">SNITCH</div>
                {/* <div className="space-x-8 hidden md:block font-bold text-sm">
                    <Link to="/" className="text-black">SHOP</Link>
                    <span className="text-gray-400">ARCHIVE</span>
                    <Link to="/seller" className="text-gray-400 hover:text-black transition-colors">SELL</Link>
                </div> */}
            </nav>

            {/* Main Content */}
            <main className="px-6 py-12 md:px-12 lg:px-24 ">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-black">
                        New Arrivals
                    </h1>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64 ">
                        <div className="text-lg font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 bg-gray-200 py-4 px-8">
                        {products.map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="block group">
                                {/* Image Container */}
                                <div className="bg-gray-200 w-full aspect-[3/4] mb-4 overflow-hidden rounded-md relative cursor-pointer">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.Title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 font-medium">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                {/* Product Details */}
                                <div className="space-y-1 ">
                                    <h2 className="text-lg font-bold uppercase tracking-tight text-gray-900 line-clamp-1">
                                        {product.Title}
                                    </h2>
                                    <p className="font-semibold text-gray-600">
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
        </div>
    );
};

export default Home;

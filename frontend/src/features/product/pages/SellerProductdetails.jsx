import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import CreateVariant from '../components/CreateVariant';

const SellerProductdetails = () => {
    const { id } = useParams();
    const { HandleProductDeatilById } = useProduct();
    const product = useSelector((state) => state.product.EachProductDeatil);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showCreateVariant, setShowCreateVariant] = useState(false);


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                await HandleProductDeatilById(id);
            } catch (error) {
                console.error("Error fetching product detail:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-xl font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading Product...</div>
            </div>
        );
    }

    if (!product || !product._id) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center flex-col">
                <h1 className="text-3xl font-black uppercase text-gray-900 mb-4">Product Not Found</h1>
                <Link to="/seller/dashboard" className="text-black underline font-bold">RETURN TO DASHBOARD</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Main Content */}
            <main className="px-6 py-12 md:px-12 lg:px-24 max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link to="/seller/dashboard" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                        &larr; Back to Dashboard
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-6">
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 pb-2 md:pb-0 scrollbar-hide">
                                {product.images.map((img, index) => (
                                    <button 
                                        key={img._id || index}
                                        onClick={() => setActiveImage(index)}
                                        className={`shrink-0 w-20 h-28 md:w-24 md:h-32 rounded bg-gray-200 overflow-hidden border-2 transition-all ${activeImage === index ? 'border-gray-900 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Main Image */}
                        <div className="bg-gray-200 w-full aspect-[4/5] rounded-md overflow-hidden relative grow">
                            {product.images && product.images.length > 0 ? (
                                <img 
                                    src={product.images[activeImage].url} 
                                    alt={product.Title} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image Available</div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-start">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 leading-none mb-4">
                                {product.Title}
                            </h1>
                            <p className="text-2xl font-bold text-gray-700">
                                {product.Price && product.Price.length > 0 
                                    ? `${product.Price[0].Currency} ${product.Price[0].Amount}`
                                    : 'Price TBA'}
                            </p>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {product.Description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Variants List */}
                        <div className="mt-12 border-t border-gray-200 pt-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold uppercase tracking-widest text-gray-900">Variants</h3>
                                {!showCreateVariant && (
                                    <button 
                                        onClick={() => setShowCreateVariant(true)} 
                                        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                    >
                                        + Add Variant
                                    </button>
                                )}
                            </div>

                            {showCreateVariant && (
                                <CreateVariant 
                                    product={product} 
                                    onClose={() => setShowCreateVariant(false)} 
                                />
                            )}

                            {!showCreateVariant && product.Variants && product.Variants.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.Variants.map((v, i) => (
                                        <div key={i} className="border-2 border-gray-200 p-4 relative group">
                                            {v.Images && v.Images.length > 0 && (
                                                <img src={v.Images[0].url} alt="Variant" className="w-16 h-16 object-cover mb-4 border border-gray-200" />
                                            )}
                                            <p className="font-bold text-lg mb-1">{v.price?.Currency} {v.price?.Amount}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Stock: {v.stock}</p>
                                            {v.Attributes && Object.keys(v.Attributes).length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(v.Attributes).map(([k, val]) => (
                                                        <span key={k} className="bg-gray-100 px-2 py-1 text-xs font-mono uppercase text-gray-600 border border-gray-300">
                                                            {k}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!showCreateVariant && (!product.Variants || product.Variants.length === 0) && (
                                <div className="text-sm font-medium text-gray-400 italic">No variants created yet.</div>
                            )}
                        </div>
                        
                        {/* Meta */}
                        <div className="mt-8 text-xs font-mono text-gray-400 uppercase tracking-widest pt-10">
                            <p>Product_ID // {product._id}</p>
                            <p className="mt-1">Visibility // Public</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SellerProductdetails;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import CreateVariant from '../components/CreateVariant';
import AppNavbar from '../../../components/AppNavbar';

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
        if (id) fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center">
                <div className="text-sm uppercase tracking-[0.2em] text-[#B5AC9E] animate-pulse font-serif italic">Loading piece details...</div>
            </div>
        );
    }

    if (!product || !product._id) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center flex-col gap-6">
                <h1 className="text-4xl font-serif italic text-gray-900 tracking-tight">Piece Not Found</h1>
                <Link to="/seller/dashboard" className="text-xs uppercase tracking-widest border-b border-gray-900 pb-1 hover:opacity-70">
                    Return to Archive
                </Link>
            </div>
        );
    }

    const formatPrice = (priceInfo) => {
        if (!priceInfo) return 'Price TBA';
        let amt, cur;
        if (Array.isArray(priceInfo) && priceInfo.length > 0) {
            amt = priceInfo[0].Amount;
            cur = priceInfo[0].Currency;
        } else {
            amt = priceInfo.Amount;
            cur = priceInfo.Currency;
        }
        if (amt === undefined) return 'Price TBA';
        const sym = { INR: '₹', USD: '$', GBP: '£', EUR: '€', JPY: '¥' }[cur] || cur || '';
        return `${sym}${Number(amt).toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2B] font-sans selection:bg-[#1F1E1D] selection:text-[#FAF7F2]">
            <AppNavbar backTo="/seller/dashboard" className="sticky" />

            <main className="px-6 py-12 md:px-12 lg:px-20 max-w-[1800px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    {/* Left: Images */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="w-full bg-[#F4EFE6] aspect-[4/5] rounded-3xl overflow-hidden shadow-sm relative mb-6">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[activeImage < product.images.length ? activeImage : 0].url}
                                    alt={product.Title}
                                    className="w-full h-full object-cover transform transition duration-700 hover:scale-[1.03]"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] tracking-widest uppercase text-[#B5AC9E]">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {product.images.map((img, index) => (
                                    <button
                                        key={img._id || index}
                                        onClick={() => setActiveImage(index)}
                                        className={`relative shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden transition-all duration-300 ${activeImage === index ? 'ring-2 ring-[#1F1E1D] ring-offset-2 ring-offset-[#FAF7F2]' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info & Variants */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4">
                        <div className="mb-10">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-[#B5AC9E] mb-4">Piece Detail</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1F1E1D] leading-tight tracking-tight mb-4">
                                {product.Title}
                            </h1>
                            <p className="text-xl md:text-2xl font-light text-[#807B75]">
                                {formatPrice(product.Price)}
                            </p>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-xs uppercase tracking-[0.2em] text-[#807B75] mb-4 border-b border-[#EBE5DB] pb-3">Curator Description</h3>
                            <p className="text-sm text-[#5C5853] leading-relaxed">
                                {product.Description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Variants Section */}
                        <div className="mt-4 pt-8 border-t border-[#EBE5DB]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-serif italic text-[#1F1E1D] tracking-wide text-2xl">Variants</h3>
                                {!showCreateVariant && (
                                    <button
                                        onClick={() => setShowCreateVariant(true)}
                                        className="relative px-5 py-2 rounded-[20px_15px_25px_30px] border border-[#1F1E1D] text-[#1F1E1D] font-serif italic text-sm overflow-hidden group transition-all duration-500 hover:shadow-md bg-transparent"
                                    >
                                        <span className="relative z-10 group-hover:text-white transition-colors duration-500">Add Variant</span>
                                        <div className="absolute inset-0 bg-[#1F1E1D] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out rounded-[20px_15px_25px_30px]" />
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.Variants.map((v, i) => (
                                        <div key={i} className="rounded-2xl border border-[#EBE5DB] bg-[#F4EFE6]/30 p-5 flex flex-col">
                                            {v.Images && v.Images.length > 0 && (
                                                <div className="w-16 h-20 rounded-lg overflow-hidden border border-[#EBE5DB] mb-4">
                                                    <img src={v.Images[0].url} alt="Variant" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <p className="font-serif italic text-lg text-[#1F1E1D] mb-1">{v.price?.Currency} {v.price?.Amount}</p>
                                            <p className="text-[10px] text-[#807B75] uppercase tracking-widest mb-4">Stock: {v.stock}</p>
                                            
                                            {v.Attributes && Object.keys(v.Attributes).length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {Object.entries(v.Attributes).map(([k, val]) => (
                                                        <span key={k} className="bg-white px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#5C5853] rounded-full border border-[#D1CCC2]">
                                                            {k}: <span className="font-medium text-[#1F1E1D]">{val}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!showCreateVariant && (!product.Variants || product.Variants.length === 0) && (
                                <div className="text-sm font-serif italic text-[#C2BCB1] border border-dashed border-[#EBE5DB] rounded-2xl p-8 text-center bg-[#F4EFE6]/20">
                                    No variants cataloged.
                                </div>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="mt-16 pt-8 border-t border-[#EBE5DB] text-[10px] font-mono text-[#B5AC9E] uppercase tracking-[0.2em]">
                            <p>Product ID // {product._id}</p>
                            <p className="mt-2">Visibility // Public</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SellerProductdetails;
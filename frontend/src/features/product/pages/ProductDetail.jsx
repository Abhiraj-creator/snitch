import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';

const ProductDetail = () => {
    const { id } = useParams();
    const { HandleProductDeatilById } = useProduct();
    const product = useSelector((state) => state.product.EachProductDeatil);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Tracks which value the user has selected per attribute key
    // e.g. { Color: "Black", Size: "Large" }
    const [selectedAttrs, setSelectedAttrs] = useState({});

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

    // Reset selections when product changes
    useEffect(() => {
        setSelectedAttrs({});
        setActiveImage(0);
    }, [product?._id]);

    // ── Derived Data ──────────────────────────────────────────────────────────

    // Collect all unique attribute keys across all variants, preserving order
    const attrKeys = useMemo(() => {
        if (!product?.Variants?.length) return [];
        const keys = new Set();
        product.Variants.forEach(v => {
            if (v.Attributes) {
                Object.keys(v.Attributes).forEach(k => keys.add(k));
            }
        });
        return [...keys];
    }, [product]);

    // Collect unique values per attribute key
    const attrValues = useMemo(() => {
        const map = {};
        attrKeys.forEach(key => {
            const vals = new Set();
            product.Variants.forEach(v => {
                if (v.Attributes?.[key]) vals.add(v.Attributes[key]);
            });
            map[key] = [...vals];
        });
        return map;
    }, [attrKeys, product]);

    // Find the variant that matches ALL currently selected attrs
    const matchedVariant = useMemo(() => {
        if (!product?.Variants?.length || !Object.keys(selectedAttrs).length) return null;
        return product.Variants.find(v => {
            return Object.entries(selectedAttrs).every(
                ([k, val]) => v.Attributes?.[k] === val
            );
        }) || null;
    }, [selectedAttrs, product]);

    // Check if a value is "available" given what's already selected in OTHER keys
    // i.e., does any variant exist that satisfies the other selected attrs + this value?
    const isValueAvailable = (key, value) => {
        if (!product?.Variants?.length) return false;
        const testAttrs = { ...selectedAttrs, [key]: value };
        return product.Variants.some(v =>
            Object.entries(testAttrs).every(([k, val]) => v.Attributes?.[k] === val)
        );
    };

    // Handle clicking an attribute value button
    const handleAttrSelect = (key, value) => {
        // If already selected, deselect
        if (selectedAttrs[key] === value) {
            const next = { ...selectedAttrs };
            delete next[key];
            setSelectedAttrs(next);
            setActiveImage(0);
            return;
        }

        const next = { ...selectedAttrs, [key]: value };

        // Auto-fix other attribute keys if the current combination becomes invalid
        // For every OTHER key that has a value selected, check if it's still valid
        attrKeys.forEach(otherKey => {
            if (otherKey === key) return;
            if (!next[otherKey]) return;
            // Check if the selected value in otherKey still has a variant with 'next'
            const stillValid = product.Variants.some(v =>
                Object.entries(next).every(([k, val]) => v.Attributes?.[k] === val)
            );
            if (!stillValid) {
                // Find which value for otherKey IS valid with the new selection
                const fallback = attrValues[otherKey]?.find(v2 => {
                    const probe = { ...next, [otherKey]: v2 };
                    return product.Variants.some(variant =>
                        Object.entries(probe).every(([k, val]) => variant.Attributes?.[k] === val)
                    );
                });
                if (fallback) {
                    next[otherKey] = fallback;
                } else {
                    delete next[otherKey];
                }
            }
        });

        setSelectedAttrs(next);
        setActiveImage(0);
    };

    // What to display
    const hasVariantImages = matchedVariant?.Images?.length > 0;
    const displayImages = hasVariantImages ? matchedVariant.Images : (product?.images || []);
    const displayPrice = matchedVariant?.price
        ? `${matchedVariant.price.Currency} ${matchedVariant.price.Amount}`
        : product?.Price?.length > 0
        ? `${product.Price[0].Currency} ${product.Price[0].Amount}`
        : 'Price TBA';
    const displayStock = matchedVariant ? matchedVariant.stock : null;

    // ── Loading / Not Found ───────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-sm font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse font-mono">
                    // Loading...
                </div>
            </div>
        );
    }

    if (!product || !product._id) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center flex-col gap-4">
                <h1 className="text-3xl font-black uppercase tracking-tight text-black">Product Not Found</h1>
                <Link to="/" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1">
                    ← Return To Shop
                </Link>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Navbar */}
            <nav className="w-full bg-white border-b-2 border-black px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link to="/" className="font-black text-xl tracking-tighter uppercase italic">SNITCH</Link>
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest hidden md:block">
                    // {product.Title}
                </span>
            </nav>

            <main className="px-6 py-10 md:px-12 lg:px-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* ── Image Gallery ── */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[620px] shrink-0">
                                {displayImages.map((img, index) => (
                                    <button
                                        key={img._id || index}
                                        onClick={() => setActiveImage(index)}
                                        className={`shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all ${
                                            activeImage === index ? 'border-black' : 'border-gray-200 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.url} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="flex-1 bg-gray-100 aspect-[4/5] overflow-hidden border-2 border-black relative">
                            {displayImages.length > 0 ? (
                                <img
                                    key={`${matchedVariant?._id}-${activeImage}`}
                                    src={displayImages[activeImage]?.url}
                                    alt={product.Title}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-mono text-[10px] uppercase text-gray-400">
                                    No Media
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Product Info ── */}
                    <div className="flex flex-col gap-8">

                        {/* Title + Price */}
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">// New Arrival</p>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4 italic">
                                {product.Title}
                            </h1>
                            <p className="text-2xl font-black font-mono">{displayPrice}</p>
                            {displayStock !== null && (
                                <p className={`mt-1 text-xs font-mono font-bold uppercase tracking-widest ${
                                    displayStock > 0 ? 'text-green-600' : 'text-red-500'
                                }`}>
                                    {displayStock > 0 ? `${displayStock} in stock` : 'Out of stock'}
                                </p>
                            )}
                        </div>

                        {/* ── Attribute Selectors ── */}
                        {attrKeys.length > 0 && (
                            <div className="flex flex-col gap-6">
                                {attrKeys.map(key => (
                                    <div key={key}>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">
                                            // {key}
                                            {selectedAttrs[key] && (
                                                <span className="ml-2 text-black">{selectedAttrs[key]}</span>
                                            )}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {attrValues[key]?.map(val => {
                                                const isSelected = selectedAttrs[key] === val;
                                                const available = isValueAvailable(key, val);
                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => handleAttrSelect(key, val)}
                                                        disabled={!available}
                                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                                            isSelected
                                                                ? 'bg-black text-white border-black'
                                                                : available
                                                                ? 'bg-white text-black border-black hover:bg-gray-50'
                                                                : 'bg-white text-gray-300 border-gray-200 cursor-not-allowed line-through'
                                                        }`}
                                                    >
                                                        {val}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 border-b border-gray-100 pb-2">
                                // Description
                            </p>
                            <p className="text-gray-700 leading-relaxed font-medium text-sm">
                                {product.Description || 'No description provided.'}
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3 mt-auto">
                            <button
                                disabled={displayStock === 0}
                                className="w-full bg-black text-white py-5 text-sm font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Add To Cart
                            </button>
                            <button
                                disabled={displayStock === 0}
                                className="w-full bg-white text-black border-2 border-black py-5 text-sm font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Meta */}
                        <div className="text-[9px] font-mono text-gray-300 uppercase tracking-widest space-y-1 border-t border-gray-100 pt-4">
                            <p>Product_ID // {product._id}</p>
                            {matchedVariant && <p>Variant_ID // {matchedVariant._id}</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useCart } from '../../cart/hook/useCart';
import AppNavbar from '../../../components/AppNavbar';

const ProductDetail = () => {
    const { id } = useParams();
    const { HandleProductDeatilById } = useProduct();
    const product = useSelector((state) => state.product.EachProductDeatil);
    const [loading, setLoading] = useState(true);
    const {handleAddToCart}=useCart()

    const [selectedAttrs, setSelectedAttrs] = useState({});
    const [accordionOpen, setAccordionOpen] = useState('details'); // details, sizing, shipping
    const [activeImgIdx, setActiveImgIdx] = useState(0);
    console.log(product);
    

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

    useEffect(() => {
        setSelectedAttrs({});
    }, [product?._id]);

    // Normalize Mongoose Map → plain object (handles Map, BSON Map, and plain objects)
    const normalizeAttrs = (attrs) => {
        if (!attrs) return {};
        // If it's already a plain object, Object.entries works fine
        try {
            return Object.fromEntries(Object.entries(attrs));
        } catch {
            return {};
        }
    };

    const attrKeys = useMemo(() => {
        if (!product?.Variants?.length) return [];
        const keys = new Set();
        product.Variants.forEach(v => {
            const attrs = normalizeAttrs(v.Attributes);
            Object.keys(attrs).forEach(k => keys.add(k));
        });
        // Debug: log first variant's Attributes shape
        if (product.Variants[0]) {
            console.log('[DEBUG] Raw Attributes:', product.Variants[0].Attributes);
            console.log('[DEBUG] Normalized Attributes:', normalizeAttrs(product.Variants[0].Attributes));
        }
        return [...keys];
    }, [product]);

    const attrValues = useMemo(() => {
        const map = {};
        attrKeys.forEach(key => {
            const vals = new Set();
            product.Variants.forEach(v => {
                const attrs = normalizeAttrs(v.Attributes);
                if (attrs[key] !== undefined && attrs[key] !== null) vals.add(attrs[key]);
            });
            map[key] = [...vals];
        });
        return map;
    }, [attrKeys, product]);

    const matchedVariant = useMemo(() => {
        if (!product?.Variants?.length) return null;
        // Only try to match once the user has selected ALL attribute keys
        const allSelected = attrKeys.length > 0 && attrKeys.every(k => selectedAttrs[k] !== undefined);
        if (!allSelected) return null;

        console.log('[matchedVariant] All attrs selected, finding match for:', selectedAttrs);
        const variant = product.Variants.find((v, idx) => {
            const attrs = normalizeAttrs(v.Attributes);
            console.log(`[matchedVariant] Variant[${idx}] attrs:`, attrs);

            const isMatch = attrKeys.every(k => {
                const selectedVal = String(selectedAttrs[k] ?? '').trim();
                const storedVal   = String(attrs[k] ?? attrs[k.toLowerCase()] ?? '').trim();
                console.log(`  key="${k}" selected="${selectedVal}" stored="${storedVal}" match=${selectedVal===storedVal}`);
                return selectedVal === storedVal;
            });

            if (isMatch) console.log('[matchedVariant] ✅ MATCH at index:', idx, v);
            return isMatch;
        });

        return variant || null;
    }, [selectedAttrs, product, attrKeys]);

    const variantForCart = useMemo(() => {
        if (matchedVariant?._id) return matchedVariant;
        if (!product?.Variants?.length) return null;

        // Fallback for products that effectively have a single/default variant.
        if (attrKeys.length === 0 || product.Variants.length === 1) {
            return product.Variants[0] ?? null;
        }

        return null;
    }, [matchedVariant, product, attrKeys]);

    useEffect(() => {
        console.log("Current Selection:", selectedAttrs);
        console.log("Current Matched Variant:", matchedVariant);
    }, [selectedAttrs, matchedVariant]);

    const isValueAvailable = (key, value) => {
        if (!product?.Variants?.length) return false;
        const testAttrs = { ...selectedAttrs, [key]: value };
        return product.Variants.some(v => {
            const attrs = normalizeAttrs(v.Attributes);
            return Object.entries(testAttrs).every(([k, val]) => {
                const attrVal =
                    attrs[k] ??
                    attrs[k.toLowerCase()] ??
                    attrs[k.charAt(0).toUpperCase() + k.slice(1)];
                return String(attrVal ?? '').trim() === String(val).trim();
            });
        });
    };


    const handleAttrSelect = (key, value) => {
        console.log('[handleAttrSelect] key:', key, 'value:', value);
        if (selectedAttrs[key] === value) {
            const next = { ...selectedAttrs };
            delete next[key];
            setSelectedAttrs(next);
            return;
        }

        const next = { ...selectedAttrs, [key]: value };

        attrKeys.forEach(otherKey => {
            if (otherKey === key) return;
            if (!next[otherKey]) return;
            const stillValid = product.Variants.some(v => {
                const attrs = normalizeAttrs(v.Attributes);
                return Object.entries(next).every(([k, val]) => attrs[k] === val);
            });
            if (!stillValid) {
                const fallback = attrValues[otherKey]?.find(v2 => {
                    const probe = { ...next, [otherKey]: v2 };
                    return product.Variants.some(variant => {
                        const attrs = normalizeAttrs(variant.Attributes);
                        return Object.entries(probe).every(([k, val]) => attrs[k] === val);
                    });
                });
                if (fallback) next[otherKey] = fallback;
                else delete next[otherKey];
            }
        });

        console.log('[handleAttrSelect] next selectedAttrs:', next);
        setSelectedAttrs(next);
    };
    console.log(matchedVariant,product);
    
    const hasVariantImages = matchedVariant?.Images?.length > 0;
    const displayImages = hasVariantImages ? matchedVariant.Images : (product?.images || []);
    const displayPrice = matchedVariant?.price
        ? `${matchedVariant.price.Currency} ${matchedVariant.price.Amount}`
        : product?.Price?.length > 0
        ? `${product.Price[0].Currency} ${product.Price[0].Amount}`
        : 'Price TBA';
    const displayStock = variantForCart ? variantForCart.stock : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center">
                <div className="text-sm uppercase tracking-[0.2em] text-[#A39B8F] animate-pulse font-serif italic">
                    Loading the collection...
                </div>
            </div>
        );
    }

    if (!product || !product._id) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center flex-col gap-6">
                <h1 className="text-4xl font-serif italic text-gray-900 tracking-tight">Piece not found.</h1>
                <Link to="/" className="text-xs uppercase tracking-widest border-b border-gray-900 pb-1">
                    Return to Atelier
                </Link>
            </div>
        );
    }

    const brandColors = {
        black: '#1a1a1a',
        white: '#ffffff',
        ivory: '#fffff0',
        cream: '#fffdd0',
        beige: '#f5f5dc',
        brown: '#5c4033',
        navy: '#000080',
        olive: '#808000',
        grey: '#808080',
        sand: '#C2B280',
        stone: '#877F6C'
    };

    const getBlobShape = (index) => {
        const shapes = [
            'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]',
            'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
            'rounded-[50%_50%_20%_80%/25%_75%_25%_75%]',
            'rounded-[80%_20%_60%_40%/30%_70%_50%_50%]',
            'rounded-[30%_70%_70%_30%/80%_20%_80%_20%]'
        ];
        return shapes[index % shapes.length];
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2B] font-sans selection:bg-[#E3D9CD]">
            
            <AppNavbar
                backTo="/"
                className="fixed"
                containerClassName="px-6 md:px-12 py-5 max-w-[1800px] mx-auto"
            />

            <main className="max-w-[1800px] mx-auto pt-20">
                <div className="flex flex-col lg:flex-row">
                    
                    {/* ── Left Fixed Gallery ── */}
                    <div className="w-full lg:w-1/2 lg:border-r border-[#EBE5DB] flex flex-col pt-8 md:pt-16 px-6 lg:px-16 pb-10">
                        {displayImages.length > 0 ? (
                            <>
                                {/* Main Image */}
                                <div className="w-full bg-[#F4EFE6] aspect-[4/5] md:aspect-[3/4] flex items-center justify-center rounded-2xl overflow-hidden shadow-sm relative">
                                    <img 
                                        src={displayImages[activeImgIdx < displayImages.length ? activeImgIdx : 0].url} 
                                        alt={`${product.Title} - Main View`} 
                                        className="w-full h-full object-cover transform transition duration-700 hover:scale-[1.03]"
                                    />
                                </div>
                                
                                {/* Thumbnails */}
                                {displayImages.length > 1 && (
                                    <div className="flex gap-4 mt-6 overflow-x-auto pb-4 scrollbar-hide">
                                        {displayImages.map((img, idx) => {
                                            const isActive = idx === (activeImgIdx < displayImages.length ? activeImgIdx : 0);
                                            return (
                                                <button 
                                                    key={img._id || idx}
                                                    onClick={() => setActiveImgIdx(idx)}
                                                    className={`relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden transition-all duration-300 ${isActive ? 'ring-2 ring-[#1F1E1D] ring-offset-2 ring-offset-[#FAF7F2]' : 'opacity-60 hover:opacity-100'}`}
                                                >
                                                    <img 
                                                        src={img.url} 
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-[70vh] flex items-center justify-center bg-[#F4EFE6] rounded-2xl">
                                <span className="text-xs uppercase tracking-widest text-[#B5AC9E]">No imagery available</span>
                            </div>
                        )}
                    </div>

                    {/* ── Right Sticky Info Panel ── */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-16 xl:p-24 relative">
                        <div className="sticky top-28 flex flex-col gap-8 max-w-lg mx-auto lg:mx-0">
                            
                            {/* Header */}
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-[#1F1E1D] leading-tight tracking-tight mb-4">
                                    {product.Title}
                                </h1>
                                <div className="flex items-end gap-3">
                                    <p className="text-lg md:text-xl font-light tracking-wide">{displayPrice}</p>
                                    {displayStock !== null && (
                                        <span className={`text-[10px] tracking-widest uppercase mb-1 ${displayStock > 0 ? 'text-[#879978]' : 'text-[#A65B5B]'}`}>
                                            {displayStock > 0 ? 'Available' : 'Archive'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Attributes */}
                            <div className="flex flex-col gap-8 mt-2">
                                {attrKeys.map((key) => {
                                    const isColor = key.toLowerCase() === 'color' || key.toLowerCase() === 'colour';
                                    const isSize = key.toLowerCase() === 'size';

                                    return (
                                        <div key={key} className="flex flex-col gap-4">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-xs uppercase tracking-[0.2em] text-[#807B75]">{key}</h3>
                                                {selectedAttrs[key] && !isColor && (
                                                    <span className="text-[10px] uppercase font-medium">{selectedAttrs[key]}</span>
                                                )}
                                                {selectedAttrs[key] && isColor && (
                                                    <span className="text-[10px] uppercase font-medium">{selectedAttrs[key]}</span>
                                                )}
                                            </div>

                                            {isColor ? (
                                                <div className="flex flex-wrap gap-4">
                                                    {attrValues[key].map((val, idx) => {
                                                        const isSelected = selectedAttrs[key] === val;
                                                        const isAvailable = isValueAvailable(key, val);
                                                        const hexColor = brandColors[val.toLowerCase()] || val;
                                                        
                                                        return (
                                                            <button
                                                                key={val}
                                                                onClick={() => handleAttrSelect(key, val)}
                                                                disabled={!isAvailable}
                                                                className={`relative group !border-none !outline-none ${!isAvailable ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                                                aria-label={val}
                                                            >
                                                                <div 
                                                                    className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ${getBlobShape(idx)} shadow-inner border border-black/5`}
                                                                    style={{ 
                                                                        backgroundColor: hexColor,
                                                                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                                                        boxShadow: isSelected ? '0 0 0 1px #FAF7F2, 0 0 0 2px #1F1E1D' : 'none'
                                                                    }}
                                                                />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            ) : isSize ? (
                                                <div className="flex flex-wrap gap-4 border-b border-t border-[#EBE5DB] py-6">
                                                    {attrValues[key].map((val, idx) => {
                                                        const isSelected = selectedAttrs[key] === val;
                                                        const isAvailable = isValueAvailable(key, val);
                                                        
                                                        return (
                                                            <button
                                                                key={val}
                                                                onClick={() => handleAttrSelect(key, val)}
                                                                disabled={!isAvailable}
                                                                className={`flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 transition-all duration-300 ${getBlobShape(idx + 2)} ${
                                                                    isSelected 
                                                                    ? 'bg-[#1F1E1D] text-white scale-110 shadow-lg' 
                                                                    : isAvailable 
                                                                        ? 'bg-transparent text-[#1F1E1D] hover:bg-[#EBE5DB]' 
                                                                        : 'bg-transparent text-[#C2BCB1] cursor-not-allowed'
                                                                }`}
                                                            >
                                                                <span className="text-lg md:text-xl font-serif italic leading-none">{idx + 1}</span>
                                                                <span className={`text-[8px] uppercase tracking-widest mt-1 ${isSelected ? 'text-white/80' : 'text-[#807B75]'}`}>{val}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-3">
                                                    {attrValues[key].map(val => (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleAttrSelect(key, val)}
                                                            disabled={!isValueAvailable(key, val)}
                                                            className={`px-6 py-3 rounded-full text-xs transition-all ${
                                                                selectedAttrs[key] === val
                                                                    ? 'bg-[#1F1E1D] text-white border border-[#1F1E1D]'
                                                                    : isValueAvailable(key, val)
                                                                        ? 'bg-transparent text-[#1F1E1D] border border-[#D1CCC2] hover:border-[#1F1E1D]'
                                                                        : 'bg-transparent text-[#C2BCB1] border border-[#EBE5DB] cursor-not-allowed line-through'
                                                            }`}
                                                        >
                                                            {val}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <button
                                    onClick={() => {
                                        const safeProductId = product?._id || id;
                                        const safeVariantId = variantForCart?._id;

                                        if (safeProductId && safeVariantId) {
                                            handleAddToCart({
                                                productId: safeProductId,
                                                variantId: safeVariantId
                                            });
                                        }
                                    }}
                                    disabled={!variantForCart || displayStock === 0}
                                    className="relative flex-1 h-14 md:h-16 rounded-[40px_30px_35px_50px] border border-[#1F1E1D] text-[#1F1E1D] font-serif italic text-lg overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500 hover:shadow-lg bg-transparent"
                                >
                                    <span className="relative z-10 block group-hover:text-white transition-colors duration-500">
                                        {variantForCart ? (displayStock > 0 ? 'Add to Cart' : 'Out of Stock') : 'Select Options'}
                                    </span>
                                    <div className="absolute inset-0 bg-[#1F1E1D] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out rounded-[40px_30px_35px_50px]" />
                                </button>
                                
                                <button
                                    disabled={displayStock === 0}
                                    className="relative flex-1 h-14 md:h-16 rounded-[30px_45px_40px_35px] border border-[#1F1E1D] text-white font-serif italic text-lg overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500 hover:shadow-lg bg-[#1F1E1D]"
                                >
                                    <span className="relative z-10 block transition-transform duration-500 group-hover:scale-105">
                                        Buy Now
                                    </span>
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-[30px_45px_40px_35px]" />
                                </button>
                            </div>

                            {/* Minimalist Accordion */}
                            <div className="mt-8 border-t border-[#EBE5DB]">
                                {[
                                    { id: 'details', title: 'Curator Details', content: product.Description || 'Material specifics unavailable.' },
                                    { id: 'sizing', title: 'Sizing Paradigm', content: 'Our garments follow an intentional relaxed silhouette. Numbered sizing represents our custom proportional scaling.' },
                                    { id: 'shipping', title: 'Global Dispatch', content: 'Complimentary expedited carbon-neutral shipping on collections over $400.' }
                                ].map((tab) => (
                                    <div key={tab.id} className="border-b border-[#EBE5DB]">
                                        <button 
                                            onClick={() => setAccordionOpen(accordionOpen === tab.id ? '' : tab.id)}
                                            className="w-full flex justify-between items-center py-6 group"
                                        >
                                            <span className="text-xs uppercase tracking-[0.15em] text-[#1F1E1D] group-hover:opacity-70 transition-opacity">
                                                {tab.title}
                                            </span>
                                            <span className="font-light text-[#807B75] text-lg">
                                                {accordionOpen === tab.id ? '−' : '+'}
                                            </span>
                                        </button>
                                        <div 
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                accordionOpen === tab.id ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed text-[#5C5853]">
                                                {tab.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ProductDetail;

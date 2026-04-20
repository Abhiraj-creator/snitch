import React, { useState, useRef } from 'react';
import { useProduct } from '../hook/useProduct';

const CreateVariant = ({ product, onClose }) => {
    const { HandleCreateVariants, HandleProductDeatilById } = useProduct();
    const [stock, setStock] = useState(1);
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [attributes, setAttributes] = useState({});
    const [attrKey, setAttrKey] = useState('');
    const [attrValue, setAttrValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const handleAddAttribute = (e) => {
        e?.preventDefault();
        if (attrKey.trim() && attrValue.trim()) {
            setAttributes(prev => ({
                ...prev,
                [attrKey.trim()]: attrValue.trim()
            }));
            setAttrKey('');
            setAttrValue('');
        }
    };

    const handleRemoveAttribute = (keyToRemove) => {
        setAttributes(prev => {
            const updated = { ...prev };
            delete updated[keyToRemove];
            return updated;
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedImages.length + files.length > 7) {
            alert("Maximum 7 images allowed");
            return;
        }

        const newImages = [...selectedImages, ...files];
        setSelectedImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSave = async () => {
        if (selectedImages.length === 0) {
            alert("Please upload at least one image");
            return;
        }
        
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('stock', stock);
            formData.append('priceAmount', priceAmount);
            formData.append('priceCurrency', priceCurrency);
            formData.append('attributes', JSON.stringify(attributes));
            
            selectedImages.forEach(image => {
                formData.append('images', image);
            });
            
            await HandleCreateVariants(product._id, formData);
            
            // Refresh product details to show new variant
            await HandleProductDeatilById(product._id);
            
            if (onClose) onClose();
        } catch (error) {
            console.error("Error creating variant", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border-2 border-black p-6 flex flex-col gap-4 mt-6 animate-fade-in shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Add New Variant</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Stock Available</label>
                    <input 
                        type="number" 
                        min="0" 
                        className="border-b-2 border-black p-2 font-mono text-lg focus:bg-gray-50 outline-none transition-all placeholder:text-gray-300" 
                        value={stock} 
                        onChange={e => setStock(e.target.value)} 
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pricing</label>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            className="flex-1 border-b-2 border-black p-2 font-mono text-lg focus:bg-gray-50 outline-none transition-all" 
                            value={priceAmount} 
                            onChange={e => setPriceAmount(e.target.value)} 
                        />
                        <select 
                            className="border-b-2 border-black p-2 bg-transparent font-bold focus:bg-gray-50 outline-none transition-all" 
                            value={priceCurrency} 
                            onChange={e => setPriceCurrency(e.target.value)}
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Image Upload Section */}
            <div className="mt-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">
                    Product Images (Max 7)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {previews.map((src, index) => (
                        <div key={index} className="relative aspect-square border border-black group overflow-hidden">
                            <img src={src} alt="preview" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                            <button 
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    {selectedImages.length < 7 && (
                        <button 
                            onClick={() => fileInputRef.current.click()}
                            className="aspect-square border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-black hover:bg-gray-50 transition-all group"
                        >
                            <span className="text-xl font-light group-hover:scale-125 transition-transform">+</span>
                            <span className="text-[8px] font-bold uppercase tracking-tighter">Upload</span>
                        </button>
                    )}
                </div>
                <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                />
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Technical Attributes</label>
                </div>
                
                {/* Render Existing Attributes */}
                <div className="flex flex-col gap-2 mb-4">
                    {Object.entries(attributes).map(([key, value]) => (
                        <div key={key} className="flex gap-2 items-center bg-gray-50 p-2 border border-gray-200">
                            <span className="text-xs font-bold font-mono min-w-[80px]">{key}:</span>
                            <span className="text-xs font-mono flex-1">{value}</span>
                            <button 
                                onClick={() => handleRemoveAttribute(key)}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold px-2 uppercase tracking-widest"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add New Attribute */}
                <div className="flex gap-2 group">
                    <div className="w-1 bg-gray-200 group-hover:bg-black transition-colors"></div>
                    <input 
                        type="text" 
                        placeholder="Key (e.g. Size)" 
                        className="flex-1 border-b border-gray-200 p-2 text-xs font-mono focus:border-black outline-none transition-colors" 
                        value={attrKey} 
                        onChange={e => setAttrKey(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Value (e.g. XL)" 
                        className="flex-1 border-b border-gray-200 p-2 text-xs font-mono focus:border-black outline-none transition-colors" 
                        value={attrValue} 
                        onChange={e => setAttrValue(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddAttribute(e)}
                    />
                    <button 
                        onClick={handleAddAttribute}
                        className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 hover:bg-gray-800 transition-colors"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className={`flex-[2] bg-black text-white font-black tracking-[0.2em] uppercase py-4 text-sm transition-all shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900 active:scale-[0.98]'}`}
                >
                    {isSaving ? 'Processing...' : 'Deploy Variant'}
                </button>
                <button 
                    onClick={onClose} 
                    disabled={isSaving} 
                    className="flex-1 border-2 border-black text-black font-black tracking-[0.2em] uppercase py-4 text-sm hover:bg-gray-50 transition-all"
                >
                    Abort
                </button>
            </div>
        </div>
    );
};

export default CreateVariant;

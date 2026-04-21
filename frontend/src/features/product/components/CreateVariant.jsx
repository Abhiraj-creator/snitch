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
        <div className="bg-[#F4EFE6]/50 backdrop-blur-md rounded-3xl border border-[#EBE5DB] p-8 lg:p-10 flex flex-col gap-8 mt-8 animate-fade-in shadow-sm relative">
            <h3 className="text-3xl lg:text-4xl font-serif italic tracking-tight text-[#1F1E1D]">Design Variant.</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#807B75]">Available Stock</label>
                    <input 
                        type="number" 
                        min="0" 
                        className="bg-transparent border-b border-[#D1CCC2] p-2 text-lg text-[#1F1E1D] focus:border-[#1F1E1D] outline-none transition-colors" 
                        value={stock} 
                        onChange={e => setStock(e.target.value)} 
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#807B75]">Pricing</label>
                    <div className="flex gap-4">
                        <input 
                            type="number" 
                            placeholder="0.00" 
                            className="bg-transparent flex-1 border-b border-[#D1CCC2] p-2 text-lg text-[#1F1E1D] focus:border-[#1F1E1D] outline-none transition-colors placeholder:text-[#C2BCB1]" 
                            value={priceAmount} 
                            onChange={e => setPriceAmount(e.target.value)} 
                        />
                        <select 
                            className="bg-transparent border-b border-[#D1CCC2] p-2 font-serif italic text-lg text-[#1F1E1D] focus:border-[#1F1E1D] outline-none transition-colors w-24" 
                            value={priceCurrency} 
                            onChange={e => setPriceCurrency(e.target.value)}
                        >
                            <option value="INR" className="bg-[#FAF7F2] font-sans text-sm">INR</option>
                            <option value="USD" className="bg-[#FAF7F2] font-sans text-sm">USD</option>
                            <option value="GBP" className="bg-[#FAF7F2] font-sans text-sm">GBP</option>
                            <option value="EUR" className="bg-[#FAF7F2] font-sans text-sm">EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Image Upload Section */}
            <div>
                <label className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#807B75] mb-3 block">
                    Editorial Imagery (Max 7)
                </label>
                <div className="flex flex-wrap gap-4">
                    {previews.map((src, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden group border border-[#EBE5DB]">
                            <img src={src} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-[#1F1E1D]/0 group-hover:bg-[#1F1E1D]/20 transition-all duration-300" />
                            <button 
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-[#FAF7F2]/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                            >
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <line x1="1" y1="1" x2="7" y2="7" stroke="#1F1E1D" strokeWidth="1" strokeLinecap="round" />
                                    <line x1="7" y1="1" x2="1" y2="7" stroke="#1F1E1D" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    {selectedImages.length < 7 && (
                        <button 
                            onClick={() => fileInputRef.current.click()}
                            className="w-24 h-24 rounded-2xl border border-dashed border-[#D1CCC2] flex flex-col items-center justify-center gap-2 hover:border-[#1F1E1D] hover:bg-[#FAF7F2] transition-colors group"
                        >
                            <span className="text-2xl font-light text-[#807B75] group-hover:text-[#1F1E1D] leading-none transition-colors">+</span>
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

            <div className="border-t border-[#EBE5DB] pt-6">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#807B75]">Technical Attributes</label>
                </div>
                
                {/* Render Existing Attributes */}
                <div className="flex flex-col gap-3 mb-6">
                    {Object.entries(attributes).map(([key, value]) => (
                        <div key={key} className="flex gap-4 items-center bg-[#FAF7F2] px-4 py-3 rounded-xl border border-[#EBE5DB]">
                            <span className="text-xs uppercase tracking-widest text-[#807B75] w-20">{key}</span>
                            <span className="text-sm font-medium text-[#1F1E1D] flex-1">{value}</span>
                            <button 
                                onClick={() => handleRemoveAttribute(key)}
                                className="text-[10px] tracking-[0.2em] uppercase text-[#B5AC9E] hover:text-[#1F1E1D] transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add New Attribute */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text" 
                        placeholder="Key (e.g. Size/Color)" 
                        className="bg-transparent flex-1 border-b border-[#D1CCC2] p-2 text-sm text-[#1F1E1D] focus:border-[#1F1E1D] outline-none transition-colors placeholder:text-[#C2BCB1]" 
                        value={attrKey} 
                        onChange={e => setAttrKey(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Value (e.g. XL/Obsidian Black)" 
                        className="bg-transparent flex-1 border-b border-[#D1CCC2] p-2 text-sm text-[#1F1E1D] focus:border-[#1F1E1D] outline-none transition-colors placeholder:text-[#C2BCB1]" 
                        value={attrValue} 
                        onChange={e => setAttrValue(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddAttribute(e)}
                    />
                    <button 
                        onClick={handleAddAttribute}
                        className="bg-white border border-[#D1CCC2] text-[#1F1E1D] text-[10px] tracking-widest uppercase px-6 py-3 rounded-full hover:border-[#1F1E1D] transition-colors"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className={`flex-[2] py-4 bg-[#1F1E1D] text-[#FAF7F2] rounded-[30px_45px_40px_35px] font-serif italic text-sm transition-all duration-500 hover:shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                >
                    {isSaving ? 'Processing...' : 'Deploy Variant'}
                </button>
                <button 
                    onClick={onClose} 
                    disabled={isSaving} 
                    className="flex-1 px-8 py-4 border border-[#D1CCC2] rounded-[40px_30px_35px_50px] text-[#1F1E1D] font-serif italic text-sm transition-all duration-300 hover:bg-[#FAF7F2]"
                >
                    Abort
                </button>
            </div>
        </div>
    );
};

export default CreateVariant;

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';

import ProductInput from '../components/ProductInput';
import ProductTextarea from '../components/ProductTextarea';
import ProductSelect from '../components/ProductSelect';
import ProductImageUpload from '../components/ProductImageUpload';

const CURRENCIES = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'JPY', label: 'JPY (¥)' },
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const { HandleCreateProduct } = useProduct();

  const [form, setForm] = useState({
    Title: '',
    Description: '',
    PriceAmount: '',
    PriceCurrency: 'INR',
  });
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImagesChange = (newFiles) => {
    setImageFiles((prev) => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 7) {
        return combined.slice(0, 7);
      }
      return combined;
    });
  };

  const handleImageRemove = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Title', form.Title);
    formData.append('Description', form.Description);
    formData.append('PriceAmount', form.PriceAmount);
    formData.append('PriceCurrency', form.PriceCurrency);
    imageFiles.forEach((file) => formData.append('images', file));

    await HandleCreateProduct(formData);
    navigate('/seller/dashboard');
  };

  const charCount = form.Description.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2B] font-sans flex flex-col md:overflow-hidden h-screen selection:bg-[#1F1E1D] selection:text-[#FAF7F2]">
      
      {/* Background organic elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#F4EFE6] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-[#EBE5DB] opacity-40 pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Top Nav Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#EBE5DB] bg-[#FAF7F2]/80 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[11px] font-sans tracking-[0.2em] uppercase text-[#807B75] hover:text-[#1F1E1D] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
          <span className="font-serif italic text-xl tracking-tight text-[#1F1E1D]">Snitch</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col lg:flex-row flex-1 overflow-y-auto md:overflow-hidden max-w-[1800px] mx-auto w-full">

        {/* LEFT — Brand Identity */}
        <aside className="lg:w-1/3 flex-col justify-between px-10 py-16 xl:px-16 border-b md:border-b-0 md:border-r border-[#EBE5DB] bg-[#FAF7F2] hidden lg:flex">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#B5AC9E] mb-6">
              Release Studio
            </p>
            <h1 className="text-5xl xl:text-6xl font-serif italic tracking-tight leading-tight mb-6 text-[#1F1E1D]">
              Publish<br />
              <span className="font-light">Piece.</span>
            </h1>
            <p className="text-sm font-light text-[#807B75] leading-relaxed max-w-[280px]">
              Complete the exact specifications, imagery, and pricing for your newly curated release.
            </p>
          </div>

          <p className="text-[10px] tracking-[0.2em] uppercase text-[#B5AC9E]">
            © {new Date().getFullYear()} / Snitch Atelier
          </p>
        </aside>

        {/* RIGHT — The Form */}
        <section className="flex-1 px-6 py-10 md:p-12 xl:p-16 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl mx-auto flex flex-col gap-10 h-full"
          >
            {/* Section header (mobile) */}
            <div className="lg:hidden mb-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#B5AC9E] mb-4">Release Studio</p>
              <h1 className="text-4xl font-serif italic tracking-tight text-[#1F1E1D] leading-tight">
                Publish<br /><span className="font-light">Piece.</span>
              </h1>
            </div>

            {/* Form Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              
              {/* Left Column: Details */}
              <div className="flex flex-col gap-8">
                <ProductInput
                  label="Title"
                  name="Title"
                  value={form.Title}
                  onChange={handleChange}
                  placeholder="E.g., Obsidian Resort Shirt"
                  required
                />

                <div className="flex gap-6 items-end">
                  <div className="flex-1">
                    <ProductInput
                      label="Pricing"
                      type="number"
                      name="PriceAmount"
                      value={form.PriceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="w-[120px]">
                    <ProductSelect
                      label="Currency"
                      name="PriceCurrency"
                      value={form.PriceCurrency}
                      onChange={handleChange}
                      options={CURRENCIES}
                      required
                    />
                  </div>
                </div>

                <div>
                  <ProductTextarea
                    label="Editorial Description"
                    name="Description"
                    value={form.Description}
                    onChange={handleChange}
                    placeholder="Describe cut, fabric, and artistic merit..."
                    required
                    rows={5}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[9px] tracking-widest text-[#B5AC9E] uppercase">
                      {charCount} Characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Images & Submit */}
              <div className="flex flex-col justify-between gap-8 h-full">
                <div className="flex-1 pt-1 md:pt-0">
                  <ProductImageUpload
                    files={imageFiles}
                    onChange={handleImagesChange}
                    onRemove={handleImageRemove}
                  />
                </div>

                {/* Submit Block */}
                <div className="flex items-center gap-4 mt-auto pt-8 border-t border-[#EBE5DB]">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-[#1F1E1D] text-[#FAF7F2] rounded-[30px_45px_40px_35px] font-serif italic text-sm transition-all duration-500 hover:shadow-lg hover:scale-[1.02]"
                  >
                    Publish Release
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-8 py-4 border border-[#D1CCC2] rounded-[40px_30px_35px_50px] text-[#1F1E1D] font-serif italic text-sm transition-all duration-300 hover:bg-[#F4EFE6]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateProduct;

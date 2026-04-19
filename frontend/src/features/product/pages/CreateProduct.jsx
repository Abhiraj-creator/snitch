import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';

import ProductInput from '../components/ProductInput';
import ProductTextarea from '../components/ProductTextarea';
import ProductSelect from '../components/ProductSelect';
import ProductImageUpload from '../components/ProductImageUpload';

/* ─────────────────────────────────────────────
   Currency options – matches backend enum exactly
───────────────────────────────────────────── */
const CURRENCIES = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'JPY', label: 'JPY (¥)' },
];

/* ─────────────────────────────────────────────
   Status indicator – tiny inline pill
───────────────────────────────────────────── */
const StatusPill = ({ state }) => {
  const map = {
    idle: null,
    loading: { label: 'Publishing…', cls: 'bg-gray-200 text-black' },
    success: { label: 'Published', cls: 'bg-green-100 text-green-800' },
    error: { label: 'Failed', cls: 'bg-red-100 text-red-800' },
  };
  const config = map[state];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-mono px-2 py-1 font-bold ${config.cls}`}>
      {state === 'loading' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {config.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   CreateProduct Page
───────────────────────────────────────────── */
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

  /* ── Handlers ── */
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
    navigate('/');
  };

  const charCount = form.Description.length;

  return (
    <div className="min-h-screen bg-white text-black font-mono flex flex-col md:overflow-hidden h-screen">

      {/* ── Background dot pattern ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Top Nav Bar ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b-2 border-black bg-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:underline"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm font-black tracking-tighter uppercase">Snitch</span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex flex-col lg:flex-row flex-1 overflow-y-auto md:overflow-hidden">

        {/* ────────────────────────────────
            LEFT — Brand Identity
        ──────────────────────────────── */}
        <aside className="lg:w-1/3 flex-col justify-between p-8 xl:p-12 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white hidden lg:flex">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-6">
              // New Product
            </p>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tighter leading-tight mb-4 uppercase">
              Publish<br />
              <span className="text-gray-400">Piece</span>
            </h1>
            <p className="text-xs font-medium text-gray-600 leading-relaxed max-w-[240px]">
              Complete the exact specifications for your release.
            </p>
          </div>

          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
            © {new Date().getFullYear()} / SNITCH
          </p>
        </aside>

        {/* ────────────────────────────────
            RIGHT — The Form (Compact)
        ──────────────────────────────── */}
        <section className="flex-1 p-6 md:p-8 xl:p-12 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-4 h-full"
          >
            {/* ── Section header (mobile) ── */}
            <div className="lg:hidden mb-2">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-1">// New Product</p>
              <h1 className="text-3xl font-black tracking-tighter uppercase">
                Publish Piece
              </h1>
            </div>

            {/* ── Form Grid Layout ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Left Column: Details */}
              <div className="flex flex-col gap-5">
                <ProductInput
                  label="Title"
                  name="Title"
                  value={form.Title}
                  onChange={handleChange}
                  placeholder="Obsidian Resort Shirt"
                  required
                />

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <ProductInput
                      label="Price"
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
                    label="Description"
                    name="Description"
                    value={form.Description}
                    onChange={handleChange}
                    placeholder="Describe cut, fabric, construction..."
                    required
                    rows={4}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest">
                      {charCount} CHARS
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Images & Submit */}
              <div className="flex flex-col justify-between gap-5 h-full">
                <div className="flex-1">
                  <ProductImageUpload
                    files={imageFiles}
                    onChange={handleImagesChange}
                    onRemove={handleImageRemove}
                  />
                </div>

                {/* Submit Block */}
                <div className="flex items-center gap-3 mt-4 mb-4 pt-4 border-t-2 border-gray-200">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-black text-white text-xs tracking-widest uppercase font-bold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Publish Product
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border-2 border-black text-black text-xs tracking-widest uppercase font-bold hover:bg-gray-100 transition-colors duration-300"
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

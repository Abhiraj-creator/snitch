import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import AppNavbar from '../../../components/AppNavbar';
import { useAuth } from '../../auth/hook/useAuth';
import SearchBar from '../../search/component/SearchBar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { HandleGetSellerProducts } = useProduct();
  const { HandleLogout } = useAuth();
  const products = useSelector((state) => state.product.SellerProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await HandleGetSellerProducts();
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [HandleGetSellerProducts]);

  const formatPrice = (priceInfo) => {
    if (!priceInfo) return 'N/A';
    let amt, cur;
    if (Array.isArray(priceInfo) && priceInfo.length > 0) {
      amt = priceInfo[0].Amount;
      cur = priceInfo[0].Currency;
    } else {
      amt = priceInfo.Amount;
      cur = priceInfo.Currency;
    }
    if (amt === undefined) return 'N/A';
    const symbols = { INR: '₹', USD: '$', GBP: '£', EUR: '€', JPY: '¥' };
    const sym = symbols[cur] || cur || '';
    return `${sym}${Number(amt).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2C2B] selection:bg-[#1F1E1D] selection:text-[#FAF7F2]">

      <AppNavbar
        className="sticky"
        rightContent={
          <>
            <SearchBar/>
            <button onClick={HandleLogout} className="relative px-6 py-3 rounded-[30px_20px_25px_35px] border border-[#1F1E1D] text-[#1F1E1D] font-serif italic text-sm overflow-hidden group transition-all duration-500 hover:shadow-md flex items-center gap-2 bg-transparent hover:shadow-md bg-black"> logout</button>
            <button
              onClick={() => navigate('/seller/Create-product')}
              className="relative px-6 py-3 rounded-[30px_20px_25px_35px] border border-[#1F1E1D] text-[#1F1E1D] font-serif italic text-sm overflow-hidden group transition-all duration-500 hover:shadow-md flex items-center gap-2 bg-transparent"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">Publish New</span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-500 text-lg leading-none">+</span>
              <div className="absolute inset-0 bg-[#1F1E1D] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out rounded-[30px_20px_25px_35px]" />
            </button>
          </>
        }
      />

      {/* Main */}
      <main className="px-6 md:px-12 lg:px-20 pt-16 pb-32 max-w-[1800px] mx-auto">

        {/* Title row */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EBE5DB] pb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#807B75] mb-4">Seller Studio</p>
            <h1 className="text-5xl md:text-6xl font-serif italic text-[#1F1E1D] leading-tight">
              The <span className="font-light">Archive</span>
            </h1>
          </div>
          {!loading && (
            <span className="text-sm font-light text-[#807B75] font-serif italic">
              {products?.length || 0} piece{products?.length !== 1 ? 's' : ''} released
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-full flex items-center justify-center py-32">
            <p className="text-sm uppercase tracking-[0.2em] text-[#B5AC9E] animate-pulse font-serif italic">
              Loading your archive...
            </p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14">
            {products.map((product, idx) => (
              <article
                key={product._id}
                onClick={() => navigate(`/seller/dashboard/${product._id}`)}
                className="group flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-[#F4EFE6] mb-5 overflow-hidden rounded-2xl">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.Title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                      <span className="text-[10px] uppercase tracking-widest text-[#807B75]">No Image</span>
                    </div>
                  )}
                  {/* ID Chip on hover */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-[#FAF7F2]/90 backdrop-blur-sm px-2.5 py-1 text-[9px] tracking-widest uppercase text-[#807B75] rounded-full">
                      #{product._id.slice(-6)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-[#1F1E1D]/0 group-hover:bg-[#1F1E1D]/5 transition-colors duration-500 rounded-2xl" />
                </div>

                <div className="px-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#B5AC9E] mb-2">
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-serif italic text-lg text-[#1F1E1D] leading-tight mb-2 group-hover:opacity-70 transition-opacity line-clamp-1">
                    {product.Title}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#807B75] font-light">{formatPrice(product.Price)}</p>
                  </div>
                  {product.Description && (
                    <p className="text-xs text-[#B5AC9E] mt-2 leading-relaxed line-clamp-2">{product.Description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-32 text-center border border-[#EBE5DB] rounded-3xl bg-[#F4EFE6]/50">
            <p className="text-5xl font-serif italic text-[#C2BCB1] mb-4">Void.</p>
            <p className="text-xs uppercase tracking-widest text-[#B5AC9E] mb-10">No pieces in your archive yet.</p>
            <button
              onClick={() => navigate('/seller/Create-product')}
              className="relative px-8 py-4 rounded-[40px_30px_35px_50px] border border-[#1F1E1D] text-[#1F1E1D] font-serif italic text-sm overflow-hidden group transition-all duration-500 hover:shadow-md"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Publish First Piece
              </span>
              <div className="absolute inset-0 bg-[#1F1E1D] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out rounded-[40px_30px_35px_50px]" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

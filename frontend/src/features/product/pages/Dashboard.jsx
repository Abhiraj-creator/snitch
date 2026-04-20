import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';

const Dashboard = () => {
  const navigate = useNavigate();
  const { HandleGetSellerProducts } = useProduct();
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

  // Format Price Helper (accounts for both Array and Object schemas)
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
    <div className="h-screen bg-white text-black font-mono selection:bg-black selection:text-white pb-20">
      
      {/* ── Background dot pattern ── */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b-2 border-black bg-white">
        <div className="flex items-center gap-2">
           <span className="text-sm font-black tracking-tighter uppercase">Snitch</span>
           <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mt-0.5 ml-2">/ Studio</span>
        </div>
        
        <button
          onClick={() => navigate('/seller/Create-product')}
          className="px-4 py-2 bg-black text-white text-[10px] tracking-widest uppercase font-bold hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2"
        >
          <span>Publish New</span>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
             <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 mt-12 md:mt-16">
        
        {/* Title row */}
        <div className="mb-12 border-b-2 border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
               The <span className="text-gray-400">Archive</span>
             </h1>
             <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-3 flex items-center gap-2">
               Your Released Pieces 
               {!loading && (
                 <span className="bg-black text-white px-2 py-0.5 rounded-sm text-[9px]">
                   {products?.length || 0}
                 </span>
               )}
             </p>
           </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-full flex items-center justify-center py-32">
             <div className="flex gap-1.5">
               <span className="w-2 h-2 rounded-full bg-black animate-ping" />
               <span className="w-2 h-2 rounded-full bg-black animate-ping delay-75" />
               <span className="w-2 h-2 rounded-full bg-black animate-ping delay-150" />
             </div>
          </div>
        ) : products && products.length > 0 ? (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-6">
            {products.map((product) => (
              <article 
              onClick={()=>{navigate(`/seller/dashboard/${product._id}`)}}
              key={product._id} className="group flex flex-col cursor-pointer">
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-gray-50 mb-3 overflow-hidden border-2 border-transparent group-hover:border-black transition-colors duration-300">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.Title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                         <circle cx="8.5" cy="8.5" r="1.5"/>
                         <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Image</span>
                    </div>
                  )}

                  {/* ID overlay on hover */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <span className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase border border-black">
                        ID: {product._id.slice(-6)}
                     </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h2 className="text-sm font-bold uppercase tracking-tight leading-tight group-hover:underline decoration-2 underline-offset-2">
                      {product.Title}
                    </h2>
                    <span className="text-xs font-bold whitespace-nowrap bg-gray-100 px-1.5 py-0.5">
                      {formatPrice(product.Price)}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2 mt-1">
                    {product.Description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          
        ) : (
          
          <div className="w-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200">
             <p className="text-3xl font-black uppercase text-gray-300 mb-2">Void.</p>
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">You have no active pieces in your catalog.</p>
             <button
               onClick={() => navigate('/seller/Create-product')}
               className="px-6 py-3 bg-black text-white text-xs tracking-widest uppercase font-bold hover:bg-gray-800 transition-colors duration-300"
             >
               Publish First Piece
             </button>
          </div>
          
        )}

      </main>
    </div>
  );
};

export default Dashboard;

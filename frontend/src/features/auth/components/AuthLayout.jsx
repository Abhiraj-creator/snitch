import React from 'react';
import { Link } from 'react-router'; 

const AuthLayout = ({ children, title, subtitle, bottomText, bottomLinkText, bottomLinkTo }) => {
  return (
    <div className="min-h-screen h-screen overflow-hidden bg-[#FAFAFA] text-[#111] font-mono selection:bg-[#111] selection:text-white flex flex-col md:flex-row">
      {/* Brand Side - Left */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/5 bg-white relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 flex-1 flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase mb-2">
            Snitch<span className="text-black/20">.</span>
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase opacity-40">
            Premium Apparatus
          </p>
        </div>
        
        <div className="hidden md:block relative z-10">
          <p className="text-[10px] tracking-widest opacity-30 mt-auto">© {new Date().getFullYear()} / ALL RIGHTS RESERVED</p>
        </div>
      </div>

      {/* Form Side - Right */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#FAFAFA]">
        <div className="w-full max-w-[400px] flex flex-col transform transition-all duration-700">
          <div className="mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs md:text-sm opacity-50 tracking-wider font-light">{subtitle}</p>}
          </div>

          <div className="w-full">
            {children}
          </div>

          {bottomText && bottomLinkText && (
            <div className="mt-8 text-center text-[10px] md:text-xs tracking-widest">
              <span className="opacity-40">{bottomText}</span>{' '}
              <Link to={bottomLinkTo} className="font-bold border-b border-[#111]/30 pb-[1px] hover:border-[#111] transition-colors">
                {bottomLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

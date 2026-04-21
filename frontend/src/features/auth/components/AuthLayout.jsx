import React from 'react';
import { Link } from 'react-router';

const AuthLayout = ({ children, title, subtitle, bottomText, bottomLinkText, bottomLinkTo }) => {
  return (
    <div className="min-h-screen h-screen overflow-hidden bg-[#FAF7F2] text-[#2C2C2B] flex flex-col md:flex-row selection:bg-[#1F1E1D] selection:text-[#FAF7F2]">
      
      {/* Brand Side - Left */}
      <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EBE5DB] bg-[#F4EFE6] relative overflow-hidden">
        {/* Background organic circle */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#EBE5DB] opacity-50 pointer-events-none" />
        <div className="absolute top-16 right-8 w-24 h-24 rounded-full bg-[#E3D9CD] opacity-60 pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="font-serif text-3xl italic tracking-tight text-[#1F1E1D] hover:opacity-70 transition-opacity">
            Snitch
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#807B75] mb-6">
            Premium Atelier
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-[#1F1E1D] leading-tight tracking-tight mb-6">
            Curated<br />
            <span className="font-light">for you.</span>
          </h1>
          <p className="text-sm leading-relaxed text-[#807B75] max-w-xs">
            A luxury streetwear destination where craftsmanship meets contemporary culture.
          </p>
        </div>

        <div className="hidden md:block relative z-10">
          <p className="text-[10px] tracking-widest text-[#B5AC9E] uppercase">
            © {new Date().getFullYear()} Snitch — All Rights Reserved
          </p>
        </div>
      </div>

      {/* Form Side - Right */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-[#FAF7F2]">
        <div className="w-full max-w-[400px] flex flex-col">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif italic text-[#1F1E1D] mb-3 leading-tight">{title}</h2>
            {subtitle && (
              <p className="text-xs text-[#807B75] tracking-wider leading-relaxed">{subtitle}</p>
            )}
          </div>

          <div className="w-full">
            {children}
          </div>

          {bottomText && bottomLinkText && (
            <div className="mt-10 text-center text-[11px] tracking-widest">
              <span className="text-[#B5AC9E] uppercase">{bottomText}</span>{' '}
              <Link
                to={bottomLinkTo}
                className="font-serif italic text-[#1F1E1D] border-b border-[#1F1E1D]/30 pb-[1px] hover:border-[#1F1E1D] transition-colors"
              >
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

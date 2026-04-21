import React from 'react';
import { Link } from 'react-router';

const AppNavbar = ({
  backTo,
  brandTo = '/',
  rightContent,
  className = 'fixed',
  containerClassName = 'px-6 md:px-12 lg:px-20 py-5 max-w-[1800px] mx-auto',
}) => {
  return (
    <nav className={`${className} w-full top-0 z-50 backdrop-blur-xl bg-[#FAF7F2]/70 border-b border-[#EBE5DB]`}>
      <div className={`${containerClassName} flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          {backTo ? (
            <Link to={backTo} className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Go back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : null}
          <Link to={brandTo} className="font-serif italic text-2xl tracking-tight text-[#1F1E1D]">
            Snitch
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {rightContent}
          <Link
            to="/cart"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#1F1E1D] text-[#1F1E1D] hover:bg-[#1F1E1D] hover:text-white transition-all duration-300"
            aria-label="Open cart"
            title="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;

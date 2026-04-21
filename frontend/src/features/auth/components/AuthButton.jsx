import React from 'react';

const AuthButton = ({ children, type = 'button', onClick, disabled, variant = 'primary' }) => {
  const base = "w-full py-4 px-6 text-center transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-serif italic flex items-center justify-center gap-2 relative overflow-hidden group";

  const variants = {
    primary: "bg-[#1F1E1D] text-[#FAF7F2] rounded-[40px_30px_35px_50px] hover:shadow-lg",
    secondary: "bg-transparent text-[#1F1E1D] border border-[#D1CCC2] rounded-[30px_45px_40px_35px] hover:border-[#1F1E1D]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
        {children}
      </span>
    </button>
  );
};

export default AuthButton;

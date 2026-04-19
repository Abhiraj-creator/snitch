import React from 'react';

const AuthButton = ({ children, type = 'button', onClick, disabled, variant = 'primary' }) => {
  const baseStyled = "w-full py-3 px-4 text-center font-mono uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-semibold flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#111] text-white hover:bg-[#222] shadow-sm",
    secondary: "bg-white text-[#111] border border-[#111]/10 hover:border-[#111]/30 hover:bg-[#FAFAFA] shadow-sm"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      // disabled={disabled}
      className={`${baseStyled} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default AuthButton;

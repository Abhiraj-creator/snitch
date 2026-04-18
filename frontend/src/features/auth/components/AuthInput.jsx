import React from 'react';

const AuthInput = ({ label, type = 'text', name, value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col mb-4 w-full font-mono relative group">
      <label className="text-[10px] tracking-[0.1em] text-[#111]/50 mb-1 font-semibold uppercase group-focus-within:text-[#111] transition-colors">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-0 border-b border-[#111]/10 text-[#111] py-1.5 px-0 text-sm focus:outline-none focus:ring-0 focus:border-[#111] transition-colors placeholder-[#111]/20 font-light"
      />
    </div>
  );
};

export default AuthInput;

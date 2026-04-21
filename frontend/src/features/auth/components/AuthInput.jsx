import React from 'react';

const AuthInput = ({ label, type = 'text', name, value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col mb-6 w-full relative group">
      <label className="text-[10px] tracking-[0.2em] text-[#807B75] mb-2 uppercase font-medium group-focus-within:text-[#1F1E1D] transition-colors">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-0 border-b border-[#EBE5DB] text-[#1F1E1D] py-2 px-0 text-sm focus:outline-none focus:ring-0 focus:border-[#1F1E1D] transition-colors placeholder-[#C2BCB1] font-light"
      />
    </div>
  );
};

export default AuthInput;

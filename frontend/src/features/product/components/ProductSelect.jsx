import React from 'react';

const ProductSelect = ({ label, name, value, onChange, options = [], required }) => {
  return (
    <div className="flex flex-col w-full relative group">
      <label className="text-[10px] tracking-[0.2em] text-[#807B75] mb-2 uppercase font-medium group-focus-within:text-[#1F1E1D] transition-colors">
        {label}
        {required && <span className="ml-1 text-[#1F1E1D]">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full appearance-none bg-transparent border-0 border-b border-[#EBE5DB] text-[#1F1E1D] py-2 px-0 text-sm focus:outline-none focus:ring-0 focus:border-[#1F1E1D] transition-colors font-light cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#FAF7F2] text-[#1F1E1D]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="#1F1E1D" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProductSelect;

import React from 'react';

const ProductSelect = ({ label, name, value, onChange, options = [], required }) => {
  return (
    <div className="flex flex-col w-full font-mono relative group">
      <label className="text-xs font-bold uppercase text-black mb-1 group-focus-within:text-black transition-colors duration-300">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full appearance-none bg-transparent border-0 border-b-2 border-gray-300 text-black py-1 px-0 text-sm md:text-base focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 font-medium cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProductSelect;

import React from 'react';

const ProductTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}) => {
  return (
    <div className="flex flex-col w-full font-mono relative group">
      <label className="text-xs font-bold uppercase text-black mb-1 group-focus-within:text-black transition-colors duration-300">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full bg-transparent border-0 border-b-2 border-gray-300 text-black py-1 px-0 text-sm md:text-base focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 placeholder-gray-400 font-medium resize-none leading-relaxed"
      />
    </div>
  );
};

export default ProductTextarea;

import React from 'react';

const ProductInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  hint,
}) => {
  return (
    <div className="flex flex-col w-full font-mono relative group">
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-xs font-bold uppercase text-black group-focus-within:text-black transition-colors duration-300">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] tracking-widest uppercase text-gray-500">
            {hint}
          </span>
        )}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-0 border-b-2 border-gray-300 text-black py-1 px-0 text-sm md:text-base focus:outline-none focus:ring-0 focus:border-black transition-colors duration-300 placeholder-gray-400 font-medium"
      />
    </div>
  );
};

export default ProductInput;

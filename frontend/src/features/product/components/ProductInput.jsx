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
    <div className="flex flex-col w-full relative group">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[10px] tracking-[0.2em] text-[#807B75] uppercase font-medium group-focus-within:text-[#1F1E1D] transition-colors">
          {label}
          {required && <span className="ml-1 text-[#1F1E1D]">*</span>}
        </label>
        {hint && (
          <span className="text-[9px] tracking-[0.1em] uppercase text-[#B5AC9E]">
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
        className="w-full bg-transparent border-0 border-b border-[#EBE5DB] text-[#1F1E1D] py-2 px-0 text-sm focus:outline-none focus:ring-0 focus:border-[#1F1E1D] transition-colors placeholder-[#C2BCB1] font-light"
      />
    </div>
  );
};

export default ProductInput;

import React, { useRef, useState } from 'react';

const ProductImageUpload = ({ files, onChange, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (dropped.length) onChange(dropped);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length) onChange(selected);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <p className="text-[10px] tracking-[0.2em] text-[#807B75] mb-2 uppercase font-medium">
        Editorial Imagery <span className="text-[#1F1E1D]">*</span>
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { 
          e.preventDefault(); 
          if(files.length < 7) setDragging(true); 
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          if(files.length < 7) handleDrop(e);
        }}
        onClick={() => {
          if(files.length < 7) inputRef.current?.click();
        }}
        className={`
          relative flex items-center justify-center gap-4
          border border-dashed rounded-2xl
          py-4 px-6 h-48 transition-all duration-300 select-none cursor-pointer overflow-hidden
          ${files.length >= 7 ? 'cursor-not-allowed opacity-50 bg-[#F4EFE6] border-[#D1CCC2]' : ''}
          ${dragging && files.length < 7
            ? 'border-[#1F1E1D] bg-[#F4EFE6]'
            : (!dragging && files.length < 7 ? 'border-[#D1CCC2] hover:border-[#1F1E1D] bg-[#FAF7F2] hover:bg-[#F4EFE6]' : '')}
        `}
      >
        <div className="flex flex-col items-center">
            <span className="font-serif italic text-2xl text-[#C2BCB1] mb-2">{files.length >= 7 ? 'Catalog Full' : 'Drop Images'}</span>
            <p className="text-[10px] text-[#807B75] tracking-widest uppercase">
              {files.length >= 7 ? '' : 'or click to browse'}
            </p>
            <p className="text-[9px] text-[#B5AC9E] font-medium tracking-[0.2em] uppercase mt-2">
            Limit: 7 Files. High Res JPG/WEBP.
            </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={files.length >= 7}
        />
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6">
          {files.map((file, idx) => (
            <div key={idx} className="relative group w-20 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1F1E1D]/0 group-hover:bg-[#1F1E1D]/20 transition-all duration-300" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                className="absolute top-2 right-2 w-6 h-6 bg-[#FAF7F2]/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <line x1="1" y1="1" x2="7" y2="7" stroke="#1F1E1D" strokeWidth="1" strokeLinecap="round" />
                  <line x1="7" y1="1" x2="1" y2="7" stroke="#1F1E1D" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;

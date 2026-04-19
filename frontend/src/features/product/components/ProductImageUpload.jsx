import React, { useRef } from 'react';

/**
 * ProductImageUpload
 * Drag-and-drop + click-to-browse image upload zone.
 * Previews selected images in a grid with individual remove controls.
 */
const ProductImageUpload = ({ files, onChange, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = React.useState(false);

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
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="w-full font-mono ">
      {/* Label */}
      <p className="text-xs font-bold uppercase text-black mb-1">
        Images <span className="text-red-600">*</span>
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
          border-2 border-dashed rounded-sm
          py-4 px-6 
          h-56
          transition-all duration-300 select-none
          ${files.length >= 7 ? 'cursor-not-allowed opacity-50 bg-gray-50 border-gray-300' : 'cursor-pointer'}
          ${dragging && files.length < 7
            ? 'border-black bg-gray-50'
            : (!dragging && files.length < 7 ? 'border-gray-300 hover:border-black hover:bg-gray-50' : '')}
        `}
      >
        {/* Upload Icon */}
        <div className="opacity-60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-black font-semibold uppercase tracking-wider">
            {files.length >= 7 ? 'Max Images Reached' : 'Drop images or '}
            {files.length < 7 && <span className="underline decoration-2 underline-offset-2">browse</span>}
          </p>
          <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">
            PNG, JPG, WEBP (Max 10MB) • {files.length}/7 uploaded
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
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((file, idx) => (
            <div key={idx} className="relative group w-16 h-16 shrink-0">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover rounded-sm"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#111]/0 group-hover:bg-[#111]/30 transition-all duration-200 rounded-sm" />
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <line x1="1" y1="1" x2="7" y2="7" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="7" y1="1" x2="1" y2="7" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              {/* Index badge */}
              <span className="absolute bottom-1.5 left-1.5 text-[8px] text-white/70 font-mono tracking-widest">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;

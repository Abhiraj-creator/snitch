import { useDispatch, useSelector } from "react-redux";
import { setQuery, clearResults } from "../state/search.slice";
import { useSearch } from "../hook/useSearch";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { results, loading, query } = useSelector((state) => state.search);
  const { debouncedSearch } = useSearch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;

    dispatch(setQuery(value));
    if (value.trim() === "") {
        dispatch(clearResults());
    } else {
        debouncedSearch(value);
    }
  };

  const handleProductClick = (id) => {
    dispatch(setQuery(""));
    dispatch(clearResults());
    navigate(`/product/${id}`);
  };

  return (
    <div className="relative z-50">
      <input
        type="text"
        value={query || ""}
        placeholder="Search clothes..."
        onChange={handleChange}
        className="text-xs tracking-widest text-[#2C2C2B] bg-[#EBE5DB]  border-radius-20px  px-4 py-2 border-b border-[#EBE5DB] focus:outline-none focus:border-[#2C2C2B] transition-colors py-1 w-48 md:w-64"
      />

      {loading && <p className="absolute top-full mt-2 text-[10px] uppercase tracking-widest text-[#B5AC9E]">Searching...</p>}

      {results && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full md:w-[300px] right-0 bg-[#FAF7F2] border border-[#EBE5DB] rounded-lg shadow-sm overflow-hidden z-50 max-h-[300px] overflow-y-auto">
          {results.map((item) => (
            <div key={item._id} onClick={() => handleProductClick(item._id)} className="flex items-center gap-3 p-3 hover:bg-[#F4EFE6] transition-colors border-b border-[#EBE5DB] last:border-0 cursor-pointer">
              <img src={item.images?.[0]?.url || ""} className="w-12 h-14 object-cover rounded-sm bg-[#EBE5DB]" />
              <div className="flex flex-col">
                <p className="text-xs text-[#1F1E1D] font-medium line-clamp-1">{item.Title}</p>
                <p className="text-[10px] tracking-widest text-[#807B75]">
                  {item.Price?.[0]?.Currency} {item.Price?.[0]?.Amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
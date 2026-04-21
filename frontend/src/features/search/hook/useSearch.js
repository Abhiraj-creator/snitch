import { useDispatch } from "react-redux";
import { searchProduct } from "../service/search.api";
import { setResults, setLoading, setError } from "../state/search.slice";
import debounce from 'lodash.debounce'
import { useMemo } from "react";



export const useSearch = () => {
    const dispatch = useDispatch()
    const handleSearch = async (query) => {
        try {
            dispatch(setLoading(true))
            const data = await searchProduct(query)
            dispatch(setResults(data.products || []))
            dispatch(setError(null))
        } catch (error) {
            console.error(error)
            dispatch(setError(error))
        } finally {
            dispatch(setLoading(false))
        }
    }

   const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    []
  );

  return {debouncedSearch};
}

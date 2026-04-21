import { createSlice } from '@reduxjs/toolkit'


const SearchSlice = createSlice({
    name: 'search',
    initialState: {
        query: "",
        results: [],
        loading: false,
        error: null
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearResults: (state) => {
            state.results = [];
        }

    }
})

export const { setQuery, setResults,setLoading,setError,clearResults } = SearchSlice.actions
export default SearchSlice.reducer
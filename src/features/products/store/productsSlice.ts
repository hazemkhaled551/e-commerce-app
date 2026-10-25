import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product, ProductSortOption } from '../types/product'
import type { AsyncStatus } from '@/types/common'
import { getProducts, FALLBACK_PRODUCTS } from '../api/productApi'

export interface ProductsState {
  items: Product[]
  status: AsyncStatus
  error: string | null
  selectedProduct: Product | null
  searchQuery: string
  selectedCategory: string
  sortBy: ProductSortOption
}

const initialState: ProductsState = {
  items: FALLBACK_PRODUCTS,
  status: 'idle',
  error: null,
  selectedProduct: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'featured',
}

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProducts()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products'
      return rejectWithValue(message)
    }
  }
)

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setSortBy: (state, action: PayloadAction<ProductSortOption>) => {
      state.sortBy = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) || 'Failed to fetch products'
      })
  },
})

export const {
  setSelectedProduct,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
} = productsSlice.actions

export const productsReducer = productsSlice.reducer

// Base selectors
export const selectProductsState = (state: { products: ProductsState }) => state.products
export const selectAllProducts = (state: { products: ProductsState }) => state.products.items
export const selectProductsStatus = (state: { products: ProductsState }) => state.products.status
export const selectProductsError = (state: { products: ProductsState }) => state.products.error
export const selectSelectedProduct = (state: { products: ProductsState }) => state.products.selectedProduct
export const selectSearchQuery = (state: { products: ProductsState }) => state.products.searchQuery
export const selectSelectedCategory = (state: { products: ProductsState }) => state.products.selectedCategory
export const selectSortBy = (state: { products: ProductsState }) => state.products.sortBy

// Derived memoized selectors
export const selectCategories = createSelector(
  [selectAllProducts],
  (products) => {
    const categories = Array.from(new Set(products.map((p) => p.category)))
    return ['all', ...categories]
  }
)

export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSearchQuery, selectSelectedCategory, selectSortBy],
  (products, searchQuery, selectedCategory, sortBy) => {
    let result = products

    if (selectedCategory !== 'all') {
      const catKey = selectedCategory.toLowerCase().trim()
      result = result.filter((p) => {
        const pCat = p.category.toLowerCase().trim()
        return (
          pCat === catKey ||
          pCat.includes(catKey) ||
          catKey.includes(pCat) ||
          (catKey === 'electronics' && pCat.includes('audio')) ||
          (catKey === 'workspace' && (pCat.includes('desk') || pCat.includes('ergonomic'))) ||
          (catKey === 'kitchen' && (pCat.includes('culinary') || pCat.includes('cooking'))) ||
          (catKey === 'outdoors' && (pCat.includes('lifestyle') || pCat.includes('edc')))
        )
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating.rate - a.rating.rate
        case 'featured':
        default:
          return a.id - b.id
      }
    })
  }
)

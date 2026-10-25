import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  fetchProducts,
  setSelectedProduct,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  selectFilteredProducts,
  selectProductsStatus,
  selectProductsError,
  selectSelectedProduct,
  selectCategories,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortBy,
} from '../store/productsSlice'
import type { Product, ProductSortOption } from '../types/product'

export function useProducts() {
  const dispatch = useAppDispatch()

  const products = useAppSelector(selectFilteredProducts)
  const status = useAppSelector(selectProductsStatus)
  const error = useAppSelector(selectProductsError)
  const selectedProduct = useAppSelector(selectSelectedProduct)
  const categories = useAppSelector(selectCategories)
  const searchQuery = useAppSelector(selectSearchQuery)
  const selectedCategory = useAppSelector(selectSelectedCategory)
  const sortBy = useAppSelector(selectSortBy)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const selectProduct = useCallback(
    (product: Product | null) => {
      dispatch(setSelectedProduct(product))
    },
    [dispatch]
  )

  const changeSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query))
    },
    [dispatch]
  )

  const changeCategory = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category))
    },
    [dispatch]
  )

  const changeSort = useCallback(
    (sort: ProductSortOption) => {
      dispatch(setSortBy(sort))
    },
    [dispatch]
  )

  const refreshProducts = useCallback(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  return {
    products,
    status,
    error,
    selectedProduct,
    categories,
    searchQuery,
    selectedCategory,
    sortBy,
    selectProduct,
    changeSearch,
    changeCategory,
    changeSort,
    refreshProducts,
  }
}

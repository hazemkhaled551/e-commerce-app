import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  selectCartItems,
  selectIsCartOpen,
  selectCartTotalQuantity,
  selectCartTotalPrice,
} from '../store/cartSlice'
import type { Product } from '@/features/products/types/product'

export function useCart() {
  const dispatch = useAppDispatch()

  const items = useAppSelector(selectCartItems)
  const isOpen = useAppSelector(selectIsCartOpen)
  const totalQuantity = useAppSelector(selectCartTotalQuantity)
  const totalPrice = useAppSelector(selectCartTotalPrice)

  const addItem = useCallback(
    (product: Product) => {
      dispatch(addToCart(product))
    },
    [dispatch]
  )

  const removeItem = useCallback(
    (productId: number) => {
      dispatch(removeFromCart(productId))
    },
    [dispatch]
  )

  const changeQuantity = useCallback(
    (productId: number, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }))
    },
    [dispatch]
  )

  const clear = useCallback(() => {
    dispatch(clearCart())
  }, [dispatch])

  const toggle = useCallback(() => {
    dispatch(toggleCart())
  }, [dispatch])

  const setOpen = useCallback(
    (open: boolean) => {
      dispatch(setCartOpen(open))
    },
    [dispatch]
  )

  return {
    items,
    isOpen,
    totalQuantity,
    totalPrice,
    addItem,
    removeItem,
    changeQuantity,
    clear,
    toggle,
    setOpen,
  }
}

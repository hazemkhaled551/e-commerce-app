import { combineReducers } from '@reduxjs/toolkit'
import { productsReducer } from '@/features/products/store/productsSlice'
import { cartReducer } from '@/features/cart/store/cartSlice'
import { authReducer } from '@/features/auth/store/authSlice'

export const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  auth: authReducer,
})


import { useEffect, useState, useCallback } from 'react'
import { X, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { CartItemRow } from './CartItemRow'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/feedback/EmptyState'

export function CartDrawer() {
  const {
    items,
    isOpen,
    totalQuantity,
    totalPrice,
    changeQuantity,
    removeItem,
    clear,
    setOpen,
  } = useCart()

  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const handleClose = useCallback(() => {
    setCheckoutSuccess(false)
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handleCheckout = () => {
    setCheckoutSuccess(true)
    setTimeout(() => {
      clear()
      setCheckoutSuccess(false)
      setOpen(false)
    }, 2000)
  }

  const shipping = totalPrice > 50 || totalPrice === 0 ? 0 : 5.99
  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop (DESIGN.md line 203) */}
      <div
        className="fixed inset-0 bg-on-surface/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-card shadow-2xl flex flex-col border-l border-border-divider animate-fade-in">
          {/* Drawer Header (DESIGN.md Level 3 elevation) */}
          <div className="px-6 py-4 bg-surface-card border-b border-border-divider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-action-primary" />
              <h3 id="cart-drawer-title" className="text-base font-bold text-neutral-core">
                Shopping Cart
              </h3>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-low text-action-primary tabular-nums">
                {totalQuantity}
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close cart"
              className="rounded-lg p-1.5 text-neutral-subdued hover:text-neutral-core hover:bg-neutral-slate transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout Success Feedback */}
          {checkoutSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-stock-in-bg text-stock-in flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-neutral-core mb-2">Order Confirmed!</h4>
              <p className="text-sm text-neutral-subdued max-w-xs mb-4">
                Thank you for your order! Your simulated purchase has been processed successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <EmptyState
                    title="Your cart is empty"
                    description="Looks like you haven't added any products to your cart yet. Explore our featured catalog!"
                    action={
                      <Button variant="primary" size="sm" onClick={handleClose}>
                        Start Shopping
                      </Button>
                    }
                  />
                ) : (
                  <div className="divide-y divide-border-divider">
                    {items.map((item) => (
                      <CartItemRow
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={changeQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer & Checkout Summary (DESIGN.md line 241-242: tabular line items & fixed checkout) */}
              {items.length > 0 && (
                <div className="p-6 bg-canvas border-t border-border-divider space-y-3">
                  <div className="space-y-1.5 text-xs text-neutral-subdued">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-neutral-core tabular-nums">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-neutral-core tabular-nums">
                        {shipping === 0 ? (
                          <span className="text-stock-in font-medium">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="font-semibold text-neutral-core tabular-nums">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-border-divider pt-2 flex justify-between text-sm font-bold text-neutral-core">
                      <span>Total</span>
                      <span className="text-action-primary tabular-nums">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    onClick={handleCheckout}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Checkout (
                    <span className="tabular-nums">${grandTotal.toFixed(2)}</span>)
                  </Button>

                  <button
                    type="button"
                    onClick={clear}
                    className="w-full text-center text-xs text-neutral-subdued hover:text-stock-out transition-colors cursor-pointer py-1"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

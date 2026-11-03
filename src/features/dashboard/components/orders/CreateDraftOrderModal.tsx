import { useState } from 'react'
import { X, Plus, ShoppingBag, AlertCircle } from 'lucide-react'
import type { DashboardOrder } from '../../types/dashboard'

interface CreateDraftOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateOrder: (order: DashboardOrder) => void
}

export function CreateDraftOrderModal({
  isOpen,
  onClose,
  onCreateOrder,
}: CreateDraftOrderModalProps) {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [channel, setChannel] = useState('Online Web Store')
  const [itemName, setItemName] = useState('AeroSound Pro Wireless ANC')
  const [itemPrice, setItemPrice] = useState('199.00')
  const [quantity, setQuantity] = useState('1')
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending_wire'>('paid')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Customer name and email are required.')
      return
    }

    const priceNum = parseFloat(itemPrice) || 0
    const qtyNum = parseInt(quantity, 10) || 1
    const total = priceNum * qtyNum
    const initials = customerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)

    const newOrder: DashboardOrder = {
      id: `ord-custom-${Date.now()}`,
      orderNumber: `#NX-849${randomSuffix}`,
      channel,
      channelIcon: channel.includes('POS') ? 'point_of_sale' : channel.includes('iOS') ? 'smartphone' : 'language',
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerInitials: initials || 'CU',
      customerAvatarBg: 'bg-primary/10 text-primary border border-primary/20',
      dateTimeText: 'Just now',
      timeAgoText: '1 min ago',
      paymentStatus,
      paymentMethodText: paymentStatus === 'paid' ? 'Manual Invoice (Paid)' : 'Net 30 Pending',
      fulfillmentStatus: 'unfulfilled',
      slaRemainingText: 'SLA: 4h 00m remaining',
      itemCount: qtyNum,
      itemsSummary: `${itemName} (${qtyNum}x)`,
      totalPrice: total,
      items: [
        {
          id: `li-${Date.now()}`,
          name: itemName,
          sku: `NX-ORD-${randomSuffix}`,
          quantity: qtyNum,
          unitPrice: priceNum,
          totalPrice: total,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
        },
      ],
      financials: {
        subtotal: total,
        shipping: 0,
        shippingTierName: 'Standard Shipping',
        tax: 0,
        total,
      },
    }

    onCreateOrder(newOrder)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-on-surface">Create Draft Order</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
              Sales Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs font-medium"
            >
              <option value="Online Web Store">Online Web Store</option>
              <option value="Mobile App iOS">Mobile App iOS</option>
              <option value="POS • Soho Store NYC">POS • Soho Store NYC</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Item Title
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Unit Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-mono border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-mono border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'pending_wire')}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-xs border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer shadow-xs font-medium"
              >
                <option value="paid">Paid (Mark Received)</option>
                <option value="pending_wire">Authorized Pending</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-4 border-t border-outline-variant/60 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


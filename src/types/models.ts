export interface ProductImage {
  id: number
  url: string
  position: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  /** Remaining units */
  stock: number
  position: number
  isActive: boolean
  categoryId: number
  images: ProductImage[]
  coverImage: string | null
  inStock: boolean
  /** Admin only */
  sold?: number
  totalQuantity?: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  position: number
  isActive: boolean
  productCount?: number
}

export interface CategoryWithProducts extends Category {
  products: Product[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: number
  productId: number | null
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: number
  reference: string
  status: OrderStatus
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  note: string | null
  total: number
  itemCount: number
  createdAt: string
  items: OrderItem[]
}

export interface User {
  id: number
  email: string
  fullName: string | null
  roles: string[]
}

export type LineStatus = 'ok' | 'out_of_stock' | 'insufficient_stock' | 'unavailable'

export interface CartCheckLine {
  productId: number
  name: string | null
  image: string | null
  price: number | null
  quantity: number
  available: number
  status: LineStatus
  lineTotal: number
}

export interface CartCheck {
  lines: CartCheckLine[]
  total: number
  hasIssues: boolean
}

export interface DashboardSummary {
  categories: number
  products: { total: number; active: number; outOfStock: number; unitsInStock: number; unitsSold: number }
  orders: { byStatus: Record<OrderStatus, number>; total: number }
  revenue: number
  lowStock: Product[]
  recentOrders: Order[]
}

/** Payloads */
export type CategoryPayload = Partial<Pick<Category, 'name' | 'description' | 'image' | 'isActive'>>

export interface ProductPayload {
  name?: string
  description?: string | null
  price?: number
  stock?: number
  categoryId?: number
  isActive?: boolean
  images?: string[]
  coverImage?: string
}

export interface OrderPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  note?: string | null
  items: { productId: number; quantity: number }[]
}

export type OrderUpdatePayload = Partial<
  Pick<Order, 'status' | 'customerName' | 'customerEmail' | 'customerPhone' | 'shippingAddress' | 'note'>
>

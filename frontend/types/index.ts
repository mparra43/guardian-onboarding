export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category?: string
  stock?: number
}

export interface ProductsResponse {
  data: Product[]
  total: number
  page: number
  pageSize: number
}

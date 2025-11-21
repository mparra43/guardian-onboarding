import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProductsList } from '@/components/products/ProductsList'
import { Product } from '@/types'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Test description 1',
    price: 99.99,
    category: 'Electronics',
    imageUrl: 'https://example.com/image1.jpg',
    stock: 10,
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test description 2',
    price: 199.99,
    category: 'Accessories',
    imageUrl: 'https://example.com/image2.jpg',
    stock: 5,
  },
]

describe('ProductsList Component', () => {
  it('should render loading skeletons when loading', () => {
    render(<ProductsList products={[]} isLoading={true} error={null} />)

    const skeletons = screen.getAllByRole('article')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render error message when error occurs', () => {
    const errorMessage = 'Failed to load products'
    render(<ProductsList products={[]} isLoading={false} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText(/please try again later/i)).toBeInTheDocument()
  })

  it('should render empty state when no products', () => {
    render(<ProductsList products={[]} isLoading={false} error={null} />)

    expect(screen.getByText(/no products available/i)).toBeInTheDocument()
    expect(screen.getByText(/check back soon/i)).toBeInTheDocument()
  })

  it('should render products grid with all products', () => {
    render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
  })

  it('should display product prices correctly', () => {
    render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$199.99')).toBeInTheDocument()
  })

  it('should display product categories', () => {
    render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Accessories')).toBeInTheDocument()
  })

  it('should display stock information', () => {
    render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    expect(screen.getByText(/10 in stock/i)).toBeInTheDocument()
    expect(screen.getByText(/5 in stock/i)).toBeInTheDocument()
  })

  it('should render product links with correct href', () => {
    render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/products/1')
    expect(links[1]).toHaveAttribute('href', '/products/2')
  })

  it('should render product images with correct alt text', () => {
    render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    const images = screen.getAllByAltText(/test product/i)
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('alt', 'Test Product 1')
    expect(images[1]).toHaveAttribute('alt', 'Test Product 2')
  })

  it('should match snapshot', () => {
    const { container } = render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    expect(container).toMatchSnapshot()
  })

  it('should handle products without images gracefully', () => {
    const productsWithoutImages: Product[] = [
      {
        id: '3',
        name: 'No Image Product',
        description: 'Product without image',
        price: 49.99,
        category: 'Test',
        stock: 1,
      },
    ]

    render(
      <ProductsList
        products={productsWithoutImages}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('No Image Product')).toBeInTheDocument()
  })

  it('should apply hover effects on product cards', () => {
    const { container } = render(
      <ProductsList products={mockProducts} isLoading={false} error={null} />
    )

    const cards = container.querySelectorAll('[class*="group"]')
    expect(cards.length).toBeGreaterThan(0)
  })
})

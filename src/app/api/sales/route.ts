import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sales = await db.sale.findMany({
      include: {
        product: true
      },
      orderBy: {
        saleDate: 'desc'
      }
    })
    return NextResponse.json(sales)
  } catch (error) {
    console.error('Failed to fetch sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity, saleDate } = body

    if (!productId || quantity === undefined || !saleDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      )
    }

    // Get product details
    const product = await db.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if sufficient stock is available
    if (product.quantity < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${product.quantity} units available.` },
        { status: 400 }
      )
    }

    // Calculate total
    const total = product.sellingPrice * quantity

    // Create the sale and update product quantity in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create sale record
      const sale = await tx.sale.create({
        data: {
          productId,
          quantity,
          unitPrice: product.sellingPrice,
          total,
          saleDate: new Date(saleDate)
        },
        include: {
          product: true
        }
      })

      // Update product quantity
      await tx.product.update({
        where: { id: productId },
        data: {
          quantity: product.quantity - quantity
        }
      })

      return sale
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Failed to create sale:', error)
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    )
  }
}
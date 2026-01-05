import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Check if data already exists
    const existingProducts = await db.product.count()
    if (existingProducts > 0) {
      return NextResponse.json(
        { error: 'Demo data already exists. Clear the database first.' },
        { status: 400 }
      )
    }

    // Demo products suitable for Nigerian market
    const demoProducts = [
      {
        name: 'Rice (50kg bag)',
        buyingPrice: 25000,
        sellingPrice: 32000,
        quantity: 15
      },
      {
        name: 'Vegetable Oil (5L)',
        buyingPrice: 3500,
        sellingPrice: 4500,
        quantity: 25
      },
      {
        name: 'Sugar (50kg)',
        buyingPrice: 28000,
        sellingPrice: 35000,
        quantity: 8
      },
      {
        name: 'Salt (1kg)',
        buyingPrice: 400,
        sellingPrice: 600,
        quantity: 50
      },
      {
        name: 'Breadcrumbs (500g)',
        buyingPrice: 800,
        sellingPrice: 1200,
        quantity: 30
      },
      {
        name: 'Tomato Paste (210g)',
        buyingPrice: 350,
        sellingPrice: 500,
        quantity: 40
      },
      {
        name: 'Indomie Noodles (Carton)',
        buyingPrice: 1800,
        sellingPrice: 2500,
        quantity: 20
      },
      {
        name: 'Milo (400g)',
        buyingPrice: 1200,
        sellingPrice: 1800,
        quantity: 35
      },
      {
        name: 'Detergent (1kg)',
        buyingPrice: 700,
        sellingPrice: 1100,
        quantity: 45
      },
      {
        name: 'Toothpaste (Family Size)',
        buyingPrice: 450,
        sellingPrice: 750,
        quantity: 60
      }
    ]

    // Create products
    const createdProducts = await Promise.all(
      demoProducts.map(product => 
        db.product.create({
          data: product
        })
      )
    )

    // Generate some demo sales from the last 30 days
    const demoSales = []
    const today = new Date()
    
    for (let i = 0; i < 50; i++) {
      const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)]
      const randomQuantity = Math.floor(Math.random() * 5) + 1
      const daysAgo = Math.floor(Math.random() * 30)
      const saleDate = new Date(today)
      saleDate.setDate(saleDate.getDate() - daysAgo)
      
      // Only create sale if product has enough stock
      if (randomProduct.quantity >= randomQuantity) {
        demoSales.push({
          productId: randomProduct.id,
          quantity: randomQuantity,
          unitPrice: randomProduct.sellingPrice,
          total: randomProduct.sellingPrice * randomQuantity,
          saleDate: saleDate
        })
        
        // Update product quantity
        await db.product.update({
          where: { id: randomProduct.id },
          data: {
            quantity: randomProduct.quantity - randomQuantity
          }
        })
      }
    }

    // Create sales
    await db.sale.createMany({
      data: demoSales
    })

    return NextResponse.json({
      message: 'Demo data created successfully',
      productsCreated: createdProducts.length,
      salesCreated: demoSales.length
    })
  } catch (error) {
    console.error('Failed to create demo data:', error)
    return NextResponse.json(
      { error: 'Failed to create demo data' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Delete all sales first (due to foreign key constraint)
    await db.sale.deleteMany({})
    
    // Delete all products
    await db.product.deleteMany({})

    return NextResponse.json({
      message: 'All demo data cleared successfully'
    })
  } catch (error) {
    console.error('Failed to clear demo data:', error)
    return NextResponse.json(
      { error: 'Failed to clear demo data' },
      { status: 500 }
    )
  }
}
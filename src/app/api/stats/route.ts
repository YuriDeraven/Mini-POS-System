import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') // 'today', 'week', 'month', 'all'
    
    let dateFilter: Date | undefined
    
    if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      dateFilter = today
    } else if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = weekAgo
    } else if (filter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = monthAgo
    }

    // Get sales with optional date filtering
    const salesWhereClause = dateFilter 
      ? { saleDate: { gte: dateFilter } }
      : {}

    const sales = await db.sale.findMany({
      where: salesWhereClause,
      include: {
        product: true
      }
    })

    // Get all products
    const products = await db.product.findMany()

    // Calculate total sales (revenue)
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)

    // Calculate cost of goods sold (COGS)
    const cogs = sales.reduce((sum, sale) => {
      return sum + (sale.product.buyingPrice * sale.quantity)
    }, 0)

    // Calculate profit
    const profit = totalSales - cogs

    // Calculate current stock value (always based on current inventory)
    const stockValue = products.reduce((sum, product) => {
      return sum + (product.buyingPrice * product.quantity)
    }, 0)

    return NextResponse.json({
      totalSales,
      cogs,
      profit,
      stockValue,
      filter: filter || 'all',
      salesCount: sales.length
    })
  } catch (error) {
    console.error('Failed to calculate stats:', error)
    return NextResponse.json(
      { error: 'Failed to calculate stats' },
      { status: 500 }
    )
  }
}
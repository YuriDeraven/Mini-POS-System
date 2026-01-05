'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Package, DollarSign, TrendingUp, ShoppingCart, Calendar, Database } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  buyingPrice: number
  sellingPrice: number
  quantity: number
  createdAt: string
  updatedAt: string
}

interface Sale {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  total: number
  saleDate: string
  createdAt: string
  product: Product
}

interface DashboardStats {
  totalSales: number
  cogs: number
  profit: number
  stockValue: number
  filter?: string
  salesCount?: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    cogs: 0,
    profit: 0,
    stockValue: 0
  })
  const [currentFilter, setCurrentFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showRecordSale, setShowRecordSale] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: ''
  })

  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: '',
    saleDate: new Date().toISOString().split('T')[0]
  })

  // Fetch data
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchSales = async () => {
    try {
      const response = await fetch('/api/sales')
      if (response.ok) {
        const data = await response.json()
        setSales(data)
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error)
    }
  }

  const fetchStats = async (filter = 'all') => {
    try {
      const response = await fetch(`/api/stats?filter=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchProducts(), fetchSales(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleFilterChange = async (newFilter: string) => {
    setCurrentFilter(newFilter)
    await fetchStats(newFilter)
  }

  const handleSeedDemoData = async () => {
    try {
      const response = await fetch('/api/seed', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        toast({ 
          title: 'Demo data created successfully',
          description: `Added ${data.productsCreated} products and ${data.salesCreated} sales`
        })
        await Promise.all([fetchProducts(), fetchSales(), fetchStats()])
      } else {
        const error = await response.json()
        toast({ 
          title: 'Error', 
          description: error.message || 'Failed to create demo data', 
          variant: 'destructive' 
        })
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to create demo data', 
        variant: 'destructive' 
      })
    }
  }

  const handleClearDemoData = async () => {
    try {
      const response = await fetch('/api/seed', {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({ title: 'All data cleared successfully' })
        await Promise.all([fetchProducts(), fetchSales(), fetchStats()])
      } else {
        const error = await response.json()
        toast({ 
          title: 'Error', 
          description: error.message || 'Failed to clear data', 
          variant: 'destructive' 
        })
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to clear data', 
        variant: 'destructive' 
      })
    }
  }

  // Product operations
  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          buyingPrice: parseFloat(productForm.buyingPrice),
          sellingPrice: parseFloat(productForm.sellingPrice),
          quantity: parseInt(productForm.quantity)
        })
      })

      if (response.ok) {
        toast({ title: 'Product added successfully' })
        setProductForm({ name: '', buyingPrice: '', sellingPrice: '', quantity: '' })
        setShowAddProduct(false)
        fetchProducts()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add product', variant: 'destructive' })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          buyingPrice: parseFloat(productForm.buyingPrice),
          sellingPrice: parseFloat(productForm.sellingPrice),
          quantity: parseInt(productForm.quantity)
        })
      })

      if (response.ok) {
        toast({ title: 'Product updated successfully' })
        setProductForm({ name: '', buyingPrice: '', sellingPrice: '', quantity: '' })
        setEditingProduct(null)
        fetchProducts()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update product', variant: 'destructive' })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({ title: 'Product deleted successfully' })
        fetchProducts()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' })
    }
  }

  // Sale operations
  const handleRecordSale = async () => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: saleForm.productId,
          quantity: parseInt(saleForm.quantity),
          saleDate: saleForm.saleDate
        })
      })

      if (response.ok) {
        toast({ title: 'Sale recorded successfully' })
        setSaleForm({ productId: '', quantity: '', saleDate: new Date().toISOString().split('T')[0] })
        setShowRecordSale(false)
        fetchProducts()
        fetchSales()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to record sale', variant: 'destructive' })
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      buyingPrice: product.buyingPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      quantity: product.quantity.toString()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading your inventory system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pos-card p-8 rounded-2xl pos-gradient text-white">
          <div className="flex justify-center mb-4">
            <img
              src="/pos-logo.png"
              alt="Mini-POS Logo"
              className="w-20 h-20 object-contain bg-white/10 rounded-xl p-2"
            />
          </div>
          <h1 className="text-4xl font-bold">Mini-POS System</h1>
          <p className="text-lg opacity-90">Simplified Inventory & Sales Tracker for SMEs</p>
          <div className="flex justify-center gap-2 mt-6">
            <Button onClick={handleSeedDemoData} variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Database className="h-4 w-4 mr-2" />
              Load Demo Data
            </Button>
            <Button onClick={handleClearDemoData} variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="pos-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{stats.totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="pos-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost of Goods Sold</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₦{stats.cogs.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="pos-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{stats.profit.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="pos-stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Stock Value</CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₦{stats.stockValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 pos-card">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Inventory</TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sales</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reports</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Product Inventory</h2>
              <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new product
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="buyingPrice">Buying Price (₦)</Label>
                        <Input
                          id="buyingPrice"
                          type="number"
                          step="0.01"
                          value={productForm.buyingPrice}
                          onChange={(e) => setProductForm({ ...productForm, buyingPrice: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sellingPrice">Selling Price (₦)</Label>
                        <Input
                          id="sellingPrice"
                          type="number"
                          step="0.01"
                          value={productForm.sellingPrice}
                          onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Initial Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <Button onClick={handleAddProduct} className="w-full">
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="pos-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product Name</TableHead>
                      <TableHead>Buying Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>₦{product.buyingPrice.toFixed(2)}</TableCell>
                        <TableCell>₦{product.sellingPrice.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={product.quantity > 10 ? 'default' : product.quantity > 0 ? 'secondary' : 'destructive'}>
                            {product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Product</DialogTitle>
                                  <DialogDescription>
                                    Update the product details
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="edit-name">Product Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={productForm.name}
                                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-buyingPrice">Buying Price (₦)</Label>
                                      <Input
                                        id="edit-buyingPrice"
                                        type="number"
                                        step="0.01"
                                        value={productForm.buyingPrice}
                                        onChange={(e) => setProductForm({ ...productForm, buyingPrice: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-sellingPrice">Selling Price (₦)</Label>
                                      <Input
                                        id="edit-sellingPrice"
                                        type="number"
                                        step="0.01"
                                        value={productForm.sellingPrice}
                                        onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-quantity">Quantity</Label>
                                    <Input
                                      id="edit-quantity"
                                      type="number"
                                      value={productForm.quantity}
                                      onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                                    />
                                  </div>
                                  <Button onClick={handleUpdateProduct} className="w-full">
                                    Update Product
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the product "{product.name}" and all associated sales records.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {products.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No products found. Add your first product to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Sales Ledger</h2>
              <Dialog open={showRecordSale} onOpenChange={setShowRecordSale}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Sale
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record New Sale</DialogTitle>
                    <DialogDescription>
                      Enter the details for the sale
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product">Select Product</Label>
                      <Select value={saleForm.productId} onValueChange={(value) => setSaleForm({ ...saleForm, productId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.quantity > 0).map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} (Stock: {product.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sale-quantity">Quantity</Label>
                        <Input
                          id="sale-quantity"
                          type="number"
                          value={saleForm.quantity}
                          onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sale-date">Sale Date</Label>
                        <Input
                          id="sale-date"
                          type="date"
                          value={saleForm.saleDate}
                          onChange={(e) => setSaleForm({ ...saleForm, saleDate: e.target.value })}
                        />
                      </div>
                    </div>
                    {saleForm.productId && saleForm.quantity && (
                      <Alert>
                        <AlertDescription>
                          Total: ₦{(products.find(p => p.id === saleForm.productId)?.sellingPrice || 0) * parseInt(saleForm.quantity || 0)}
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button onClick={handleRecordSale} className="w-full">
                      Record Sale
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="pos-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{sale.product.name}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>₦{sale.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>₦{sale.total.toFixed(2)}</TableCell>
                        <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {sales.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No sales recorded yet. Record your first sale to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Business Reports</h2>
              <Select value={currentFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="pos-card">
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                  <CardDescription>
                    Financial performance overview 
                    {currentFilter !== 'all' && (
                      <span className="ml-2 text-sm">
                        ({currentFilter === 'today' ? 'Today' : 
                          currentFilter === 'week' ? 'This Week' : 'This Month'})
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-semibold text-green-600">₦{stats.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost of Goods:</span>
                    <span className="font-semibold text-orange-600">₦{stats.cogs.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Profit:</span>
                    <span className={`font-semibold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₦{stats.profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span className="font-semibold">
                      {stats.totalSales > 0 ? ((stats.profit / stats.totalSales) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  {stats.salesCount !== undefined && (
                    <div className="flex justify-between">
                      <span>Sales Count:</span>
                      <span className="font-semibold">{stats.salesCount}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="pos-card">
                <CardHeader>
                  <CardTitle>Inventory Summary</CardTitle>
                  <CardDescription>Current stock status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-semibold">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Stock:</span>
                    <span className="font-semibold text-green-600">
                      {products.filter(p => p.quantity > 10).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Stock:</span>
                    <span className="font-semibold text-yellow-600">
                      {products.filter(p => p.quantity > 0 && p.quantity <= 10).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock:</span>
                    <span className="font-semibold text-red-600">
                      {products.filter(p => p.quantity === 0).length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Recent Sales Activity</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div>
                        <span className="font-medium">{sale.product.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {sale.quantity} units × ₦{sale.unitPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">₦{sale.total.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(sale.saleDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sales.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No sales activity yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { KPICard } from '@/components/kpi-card'
import { Sidebar } from '@/components/sidebar'
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Calendar, 
  Database, 
  Plus, 
  Edit, 
  Trash2,
  Printer,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Users,
  Receipt,
  BarChart3,
  Settings,
  Save,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

type ViewType = 'dashboard' | 'inventory' | 'orders' | 'sales' | 'reports' | 'settings'

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

const chartData = [
  { name: 'Mon', sales: 4000, profit: 2400 },
  { name: 'Tue', sales: 3000, profit: 1398 },
  { name: 'Wed', sales: 2000, profit: 9800 },
  { name: 'Thu', sales: 2780, profit: 3908 },
  { name: 'Fri', sales: 1890, profit: 4800 },
  { name: 'Sat', sales: 2390, profit: 3800 },
  { name: 'Sun', sales: 3490, profit: 4300 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b']

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    cogs: 0,
    profit: 0,
    stockValue: 0
  })
  const [currentFilter, setCurrentFilter] = useState('today')
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showRecordSale, setShowRecordSale] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [showRecordSaleModal, setShowRecordSaleModal] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const viewTitles: Record<ViewType, { title: string; subtitle: string }> = {
    dashboard: { title: 'Financial Summary', subtitle: 'Dashboard Overview' },
    inventory: { title: 'Inventory Management', subtitle: 'Manage your products' },
    orders: { title: 'Orders', subtitle: 'View and manage orders' },
    sales: { title: 'Sales', subtitle: 'Track your sales' },
    reports: { title: 'Reports', subtitle: 'Business analytics' },
    settings: { title: 'Settings', subtitle: 'Configure your system' },
  }

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
      const response = await fetch('/api/seed', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        toast({ 
          title: 'Success',
          description: `Added ${data.productsCreated} products and ${data.salesCreated} sales`
        })
        await Promise.all([fetchProducts(), fetchSales(), fetchStats()])
      } else {
        const error = await response.json()
        toast({ 
          title: 'Error', 
          description: error.error || 'Failed to create demo data', 
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
      const response = await fetch('/api/seed', { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Success', description: 'All data cleared successfully' })
        await Promise.all([fetchProducts(), fetchSales(), fetchStats()])
      } else {
        const error = await response.json()
        toast({ 
          title: 'Error', 
          description: error.error || 'Failed to clear data', 
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
        toast({ title: 'Success', description: 'Product added successfully' })
        setProductForm({ name: '', buyingPrice: '', sellingPrice: '', quantity: '' })
        setShowAddProductModal(false)
        fetchProducts()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add product', variant: 'destructive' })
    }
  }

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
        toast({ title: 'Success', description: 'Sale recorded successfully' })
        setSaleForm({ productId: '', quantity: '', saleDate: new Date().toISOString().split('T')[0] })
        setShowRecordSaleModal(false)
        fetchProducts()
        fetchSales()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to record sale', variant: 'destructive' })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Success', description: 'Product deleted successfully' })
        fetchProducts()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' })
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
    setShowEditProductModal(true)
  }

  const handleEditModalClose = (open: boolean) => {
    setShowEditProductModal(open)
    if (!open) {
      setEditingProduct(null)
      setProductForm({ name: '', buyingPrice: '', sellingPrice: '', quantity: '' })
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
        toast({ title: 'Success', description: 'Product updated successfully' })
        setShowEditProductModal(false)
        setEditingProduct(null)
        setProductForm({ name: '', buyingPrice: '', sellingPrice: '', quantity: '' })
        fetchProducts()
        fetchStats()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update product', variant: 'destructive' })
    }
  }

  const handleSwitchUser = () => {
    setShowSwitchUserModal(true)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSales = sales.filter(s => 
    s.product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stockDistribution = products.reduce((acc, p) => {
    if (p.quantity > 10) acc.inStock++
    else if (p.quantity > 0) acc.lowStock++
    else acc.outOfStock++
    return acc
  }, { inStock: 0, lowStock: 0, outOfStock: 0 })

  const pieData = [
    { name: 'In Stock', value: stockDistribution.inStock },
    { name: 'Low Stock', value: stockDistribution.lowStock },
    { name: 'Out of Stock', value: stockDistribution.outOfStock },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB]">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="ml-64">
          <Header 
            title="Dashboard" 
            subtitle="Financial Overview"
            onSeedData={handleSeedDemoData}
            onClearData={handleClearDemoData}
            onSwitchUser={handleSwitchUser}
          />
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-[#FFC107] border-t-transparent animate-spin" />
              <p className="text-slate-500">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="ml-64">
        <Header 
          title={viewTitles[currentView].title}
          subtitle={viewTitles[currentView].subtitle}
          onSeedData={handleSeedDemoData}
          onClearData={handleClearDemoData}
          onSwitchUser={handleSwitchUser}
        />

        {/* Switch User Modal */}
        <Dialog open={showSwitchUserModal} onOpenChange={setShowSwitchUserModal}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Switch User</DialogTitle>
              <DialogDescription>Select a user to continue</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <button 
                onClick={() => { setShowSwitchUserModal(false); toast({ title: 'Switched to Admin' }) }}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC107]">
                  <Users className="h-5 w-5 text-[#1A1A1A]" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Admin</p>
                  <p className="text-xs text-slate-500">Full access</p>
                </div>
              </button>
              <button 
                onClick={() => { setShowSwitchUserModal(false); toast({ title: 'Switched to Cashier' }) }}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Cashier</p>
                  <p className="text-xs text-slate-500">Sales only</p>
                </div>
              </button>
              <button 
                onClick={() => { setShowSwitchUserModal(false); toast({ title: 'Switched to Viewer' }) }}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Viewer</p>
                  <p className="text-xs text-slate-500">Read-only access</p>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="p-6 space-y-6">
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                  title="Total Profit"
                  value={`₦${stats.profit.toLocaleString()}`}
                  change={12}
                  changeLabel="vs last week"
                  icon={DollarSign}
                  trend="up"
                />
                <KPICard 
                  title="Total Sales"
                  value={`₦${stats.totalSales.toLocaleString()}`}
                  change={8}
                  changeLabel="vs last week"
                  icon={TrendingUp}
                  trend="up"
                />
                <KPICard 
                  title="Gross Sales"
                  value={`₦${(stats.totalSales + stats.cogs).toLocaleString()}`}
                  change={-2}
                  changeLabel="vs last week"
                  icon={ShoppingCart}
                  trend="down"
                />
                <KPICard 
                  title="Net Sales"
                  value={`₦${stats.totalSales.toLocaleString()}`}
                  change={5}
                  changeLabel="vs last week"
                  icon={Wallet}
                  trend="up"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">Product Details</CardTitle>
                      <CardDescription>Sales and profit trends</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={currentFilter === 'week' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleFilterChange('week')}
                        className={currentFilter === 'week' ? 'bg-[#FFC107] text-[#1A1A1A] hover:bg-[#FFC107]/90' : 'rounded-xl'}
                      >
                        Week
                      </Button>
                      <Button 
                        variant={currentFilter === 'month' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleFilterChange('month')}
                        className={currentFilter === 'month' ? 'bg-[#FFC107] text-[#1A1A1A] hover:bg-[#FFC107]/90' : 'rounded-xl'}
                      >
                        Month
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#fff' }}/>
                          <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                          <Area type="monotone" dataKey="profit" stroke="#FFC107" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-bold text-slate-900">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Gross Sales</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">₦{(stats.totalSales + stats.cogs).toLocaleString()}</span>
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Net Sales</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">₦{stats.totalSales.toLocaleString()}</span>
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Total Orders</span>
                        <span className="font-bold text-slate-900">{stats.salesCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Products</span>
                        <span className="font-bold text-slate-900">{products.length}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-bold text-slate-900">Recent Activity</CardTitle>
                      <CardDescription>Latest transactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {sales.slice(0, 4).map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFC107]/20">
                              <FileText className="h-4 w-4 text-[#FFC107]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{sale.product.name}</p>
                              <p className="text-xs text-slate-500">{new Date(sale.saleDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-600">₦{sale.total.toLocaleString()}</span>
                        </div>
                      ))}
                      {sales.length === 0 && (
                        <p className="text-center text-sm text-slate-500 py-4">No recent activity</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* INVENTORY VIEW */}
          {currentView === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FFC107] rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>Enter product details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Enter product name" className="rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Buying Price</Label>
                          <Input type="number" value={productForm.buyingPrice} onChange={(e) => setProductForm({ ...productForm, buyingPrice: e.target.value })} placeholder="0.00" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Selling Price</Label>
                          <Input type="number" value={productForm.sellingPrice} onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })} placeholder="0.00" className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input type="number" value={productForm.quantity} onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })} placeholder="0" className="rounded-xl" />
                      </div>
                      <Button onClick={handleAddProduct} className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FFC107] rounded-xl">Add Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Buying Price</TableHead>
                        <TableHead className="font-semibold">Selling Price</TableHead>
                        <TableHead className="font-semibold">Stock</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>₦{product.buyingPrice.toLocaleString()}</TableCell>
                          <TableCell>₦{product.sellingPrice.toLocaleString()}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <Badge className={`${product.quantity > 10 ? 'bg-emerald-100 text-emerald-700' : product.quantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                              {product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => openEditDialog(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>Are you sure you want to delete "{product.name}"?</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 rounded-xl">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No products found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Edit Product Dialog */}
              <Dialog open={showEditProductModal} onOpenChange={handleEditModalClose}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>Update product details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Buying Price</Label>
                        <Input type="number" value={productForm.buyingPrice} onChange={(e) => setProductForm({ ...productForm, buyingPrice: e.target.value })} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Selling Price</Label>
                        <Input type="number" value={productForm.sellingPrice} onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })} className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" value={productForm.quantity} onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })} className="rounded-xl" />
                    </div>
                    <Button onClick={handleUpdateProduct} className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FFC107] rounded-xl">Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* ORDERS VIEW */}
          {currentView === 'orders' && (
            <div className="space-y-6">
              <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">Order History</CardTitle>
                  <CardDescription>View all recorded sales orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Order ID</TableHead>
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono text-sm">#{sale.id.slice(-6).toUpperCase()}</TableCell>
                          <TableCell className="font-medium">{sale.product.name}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell className="font-semibold text-emerald-600">₦{sale.total.toLocaleString()}</TableCell>
                          <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {sales.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Receipt className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* SALES VIEW */}
          {currentView === 'sales' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Today's Sales</p>
                        <p className="text-2xl font-bold text-slate-900">₦{stats.totalSales.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Dialog open={showRecordSaleModal} onOpenChange={setShowRecordSaleModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FFC107] rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Record Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Record New Sale</DialogTitle>
                      <DialogDescription>Enter sale details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Product</Label>
                        <Select value={saleForm.productId} onValueChange={(value) => setSaleForm({ ...saleForm, productId: value })}>
                          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a product" /></SelectTrigger>
                          <SelectContent>
                            {products.filter(p => p.quantity > 0).map((product) => (
                              <SelectItem key={product.id} value={product.id}>{product.name} (Stock: {product.quantity})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input type="number" value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} placeholder="0" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" value={saleForm.saleDate} onChange={(e) => setSaleForm({ ...saleForm, saleDate: e.target.value })} className="rounded-xl" />
                        </div>
                      </div>
                      {saleForm.productId && saleForm.quantity && (
                        <div className="rounded-xl bg-emerald-50 p-3 text-center">
                          <p className="text-sm text-slate-500">Total</p>
                          <p className="text-2xl font-bold text-emerald-600">₦{(products.find(p => p.id === saleForm.productId)?.sellingPrice || 0) * parseInt(saleForm.quantity || 0)}</p>
                        </div>
                      )}
                      <Button onClick={handleRecordSale} className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FFC107] rounded-xl">Record Sale</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Unit Price</TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((sale) => (
                        <TableRow key={sale.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{sale.product.name}</TableCell>
                          <TableCell><Badge variant="outline">{sale.quantity}</Badge></TableCell>
                          <TableCell>₦{sale.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold text-emerald-600">₦{sale.total.toLocaleString()}</TableCell>
                          <TableCell className="text-slate-500">{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredSales.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>No sales recorded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* REPORTS VIEW */}
          {currentView === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Revenue" value={`₦${stats.totalSales.toLocaleString()}`} change={15} icon={DollarSign} trend="up" />
                <KPICard title="Total Profit" value={`₦${stats.profit.toLocaleString()}`} change={12} icon={TrendingUp} trend="up" />
                <KPICard title="Total Orders" value={String(stats.salesCount || 0)} change={8} icon={ShoppingCart} trend="up" />
                <KPICard title="Stock Value" value={`₦${stats.stockValue.toLocaleString()}`} change={-3} icon={Package} trend="down" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900">Sales Overview</CardTitle>
                    <CardDescription>Weekly sales performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#fff' }} />
                          <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="profit" fill="#FFC107" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900">Stock Distribution</CardTitle>
                    <CardDescription>Inventory status overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {currentView === 'settings' && (
            <div className="space-y-6">
              <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Configure your Mini-POS system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                          <RefreshCw className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Auto-refresh data</p>
                          <p className="text-sm text-slate-500">Automatically refresh dashboard every 30 seconds</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">Enabled</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">Low stock alerts</p>
                          <p className="text-sm text-slate-500">Get notified when products are running low</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">Enabled</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                          <Save className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Auto-backup</p>
                          <p className="text-sm text-slate-500">Automatically backup data daily</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">Enabled</Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Database Actions</h3>
                    <div className="flex gap-3">
                      <Button onClick={handleSeedDemoData} variant="outline" className="rounded-xl">
                        <Database className="h-4 w-4 mr-2" />
                        Load Demo Data
                      </Button>
                      <Button onClick={handleClearDemoData} variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><strong>Mini-POS System</strong> v1.0.0</p>
                    <p>Inventory & Sales Management for SMEs</p>
                    <p className="text-slate-500">Built with Next.js, Tailwind CSS, and Prisma</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

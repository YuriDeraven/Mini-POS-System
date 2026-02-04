# 🚀 Mini-POS System

A modern, production-ready Point of Sale (POS) application designed for speed, accuracy, and ease of use. This system leverages a high-performance tech stack to provide a seamless retail management experience.

## ✨ Technology Stack

This project is built with a robust foundation to handle transactions and inventory management:

### 🎯 Core Framework
* **⚡ Next.js 15** - The React framework for production with App Router.
* **📘 TypeScript 5** - Type-safe JavaScript for reliable financial calculations.
* **🎨 Tailwind CSS 4** - Utility-first CSS for a custom-branded interface.

### 🧩 UI Components & Styling
* **🧩 shadcn/ui** - Accessible components for consistent checkout interfaces.
* **🎯 Lucide React** - Intuitive icons for product categories and actions.
* **🌈 Framer Motion** - Production-ready motion library for React.
* **🎨 Next Themes** - Built-in light/dark mode for different lighting environments.

### 📋 Forms & Validation
* **🎣 React Hook Form** - Fast inventory and customer entry forms.
* **✅ Zod** - Strict schema validation for prices, stock levels, and user data.

### 🔄 State Management & Data Fetching
* **🐻 Zustand** - Lightweight state management for the shopping cart.
* **🔄 TanStack Query** - Efficient data synchronization for real-time stock updates.
* **🌐 Axios** - Reliable API communication for payment processing.

### 🗄️ Database & Backend
* **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM for managing products and sales.
* **🔐 NextAuth.js** - Secure authentication for staff and admin access.

### 📊 Advanced POS Features
* **📈 TanStack Table** - Detailed transaction logs and inventory lists.
* **🖱️ DND Kit** - Drag-and-drop functionality for organizing product grids.
* **📊 Recharts** - Sales analytics and daily revenue visualizations.
* **🖼️ Sharp** - High performance image processing for product thumbnails.

---

## 🎯 Why This System?

* **🏎️ Rapid Checkout** - Optimized for speed with minimal latency.
* **🔒 Financial Integrity** - End-to-end type safety for transaction data.
* **📱 Tablet Friendly** - Fully responsive design for mobile or tablet stations.
* **🗄️ Inventory Ready** - Prisma integration for managing complex product variants.
* **📊 Insights** - Built-in charts and tables for reporting and auditing.
* **🌍 Multi-Currency** - i18n support for localized pricing and labels.
* **🚀 Production Ready** - Optimized build and deployment settings.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open http://localhost:3000 to access the POS terminal.

## 📁 Project Structure

```
src/
├── app/                 # Routes for Dashboard, Sales, and Reports
├── components/          # POS-specific components (Cart, ProductGrid)
│   └── ui/             # Core shadcn components
├── hooks/               # Custom hooks for cart logic and barcodes
└── lib/                 # Prisma client and tax calculation utilities
```

### 🎨 Available Features & Components

#### 🛒 Checkout Experience
* **Cart Management**: Real-time total calculation with tax and discounts.
* **Product Search**: High-performance filtering for large inventories.
* **Receipts**: Clean layouts ready for thermal printing or digital export.

#### 📊 Management Tools
* **Tables**: Powerful data tables with sorting and filtering (TanStack Table).
* **Charts**: Beautiful visualizations of sales trends with Recharts.
* **Forms**: Type-safe entry for products and categories (React Hook Form + Zod).

#### 🔐 Security & Operations
* **Authentication**: Ready-to-use auth flows with NextAuth.js.
* **Role-Based Access**: Separate views for Cashiers and Store Managers.
* **Theme Switching**: Built-in dark/light mode support for various environments.
* **Internationalization**: Multi-language support with Next Intl.
* **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns.

---

Built with ❤️ for retailers and small businesses. **Mini-POS System** 🚀

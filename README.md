# 🏪 Zema Cashier - Inventory Management System

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://inventory-management-snowy-six.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A comprehensive **multi-user** inventory management system built with Next.js, featuring Google OAuth authentication, complete business workflow management, and real-time inventory tracking. Perfect for small to medium businesses managing products, customers, sales, and suppliers.

## 🌐 Live Demo

**🚀 Production URL:** [https://inventory-management-snowy-six.vercel.app/](https://inventory-management-snowy-six.vercel.app/)

> **Note:** Sign in with your Google account to access your personal inventory workspace

## ✨ Key Features

### 🔐 Multi-User Authentication
- **Google OAuth Integration**: Secure sign-in with Google accounts
- **User Isolation**: Each user has their own private inventory space
- **Session Management**: Persistent login sessions across devices
- **Route Protection**: Automatic redirection for unauthenticated users

### 📦 Advanced Inventory Management
- **Item CRUD Operations**: Create, read, update, delete inventory items
- **Barcode System**: Unique barcode generation and scanning support
- **Stock Tracking**: Real-time quantity updates with low-stock alerts
- **Image Support**: Product images with URL-based storage
- **Smart Search**: Find items by name, barcode, or status
- **Status Management**: Available, low stock, out of stock indicators

### 👥 Customer Relationship Management
- **Client Profiles**: Complete customer information management
- **Purchase History**: Automatic tracking of client transactions
- **Contact Management**: Email, phone, and address information
- **Spending Analytics**: Total spent and purchase frequency tracking
- **Client Notes**: Additional information and preferences

### 💰 Point of Sale System
- **Multi-Item Sales**: Add multiple products to single transaction
- **Automatic Calculations**: Subtotal, tax, discount, and total computation
- **Payment Methods**: Cash, card, and other payment type tracking
- **Client Integration**: Link sales to customer profiles
- **Inventory Updates**: Automatic stock deduction on sale completion
- **Sale Numbers**: Auto-generated unique transaction IDs

### 📋 Purchase Order Management
- **Supplier Orders**: Create and track orders from dealers/suppliers
- **Delivery Tracking**: Expected vs actual delivery date monitoring
- **Cost Management**: Track item costs, shipping, and taxes
- **Inventory Integration**: Process received orders directly to inventory
- **New Item Support**: Add new products through purchase orders
- **Order Status**: Pending, arrived, cancelled status tracking

### 📊 Analytics & Reporting
- **Dashboard Overview**: Key metrics and quick stats
- **Sales Analytics**: Revenue tracking and transaction history
- **Inventory Reports**: Stock levels and product performance
- **Client Analytics**: Customer behavior and purchase patterns
- **Visual Charts**: Graphical representation of business data

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.1**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **Tailwind CSS 4**: Modern utility-first styling
- **Custom Hooks**: Reusable business logic
- **Responsive Design**: Mobile-first approach

### Backend & Database
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose 8.16.3**: Object modeling for MongoDB
- **NextAuth.js 4.24.11**: Authentication and session management
- **MongoDB Adapter**: Session storage in database

### Authentication & Security
- **Google OAuth 2.0**: Secure third-party authentication
- **NextAuth.js**: Industry-standard auth solution
- **User Data Isolation**: Complete separation of user data
- **Session Security**: HTTP-only cookies with CSRF protection
- **Route Protection**: Middleware-based access control

### Development & Deployment
- **Turbopack**: Fast development builds
- **Vercel**: Serverless deployment platform
- **ESLint**: Code quality and consistency
- **Environment Variables**: Secure configuration management

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** installed on your machine
- **MongoDB database** (MongoDB Atlas recommended)
- **Google Cloud Console** account for OAuth setup

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/inventory-management.git
   cd inventory-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key_at_least_32_characters_long
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Configure Google OAuth:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://inventory-management-snowy-six.vercel.app/api/auth/callback/google`

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🔧 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
```

## 🔌 API Documentation

### Authentication Required
All API endpoints require user authentication. Include session cookies or use NextAuth.js session.

### Items API (`/api/items`)
- **`GET /api/items`** - Fetch all user's items
- **`POST /api/items`** - Create new item
  ```json
  {
    "name": "Product Name",
    "barcode": "unique_barcode",
    "quantity": 100,
    "price": 29.99,
    "image": "https://example.com/image.jpg"
  }
  ```
- **`GET /api/items/[id]`** - Get specific item by ID
- **`PUT /api/items/[id]`** - Update item (user-owned only)
- **`DELETE /api/items/[id]`** - Delete item (user-owned only)
- **`GET /api/items/search?barcode=xxx`** - Search by barcode

### Sales API (`/api/sales`)
- **`GET /api/sales`** - Fetch user's sales history
- **`POST /api/sales`** - Create new sale (auto-updates inventory)
  ```json
  {
    "client": "client_id",
    "items": [
      {
        "item": "item_id",
        "quantity": 2,
        "unitPrice": 29.99
      }
    ],
    "paymentMethod": "cash",
    "discount": 5.00
  }
  ```
- **`DELETE /api/sales/[id]`** - Cancel sale (restores inventory)

### Clients API (`/api/clients`)
- **`GET /api/clients`** - Fetch all user's clients
- **`POST /api/clients`** - Create new client
- **`PUT /api/clients/[id]`** - Update client information
- **`DELETE /api/clients/[id]`** - Remove client

### Purchase Orders API (`/api/purchase-orders`)
- **`GET /api/purchase-orders`** - Fetch user's purchase orders
- **`POST /api/purchase-orders`** - Create new purchase order
- **`PUT /api/purchase-orders/[id]`** - Update order status
- **`POST /api/purchase-orders/[id]/process`** - Process order to inventory

### Authentication API (`/api/auth`)
- **`POST /api/auth/signin`** - Google OAuth sign-in
- **`POST /api/auth/signout`** - Sign out current user
- **`GET /api/auth/session`** - Get current session

## 🧪 Testing API

**Postman Collection:** Import `islam-api.postman_collection.json` for complete API testing.

**Test Authentication:**
1. Sign in through the web interface first
2. Copy session cookies for API testing
3. Use cookies in Postman requests

## 🏗️ Project Architecture

### Directory Structure
```
📁 islam-inventory-management/
├── 📁 src/app/
│   ├── 📁 api/                    # 🔧 Backend API Routes
│   │   ├── 📁 auth/
│   │   │   └── 📁 [...nextauth]/  # NextAuth.js configuration
│   │   ├── 📁 items/              # Items CRUD operations
│   │   │   ├── 📁 [id]/           # Individual item operations
│   │   │   ├── 📁 search/         # Barcode search endpoint
│   │   │   └── route.js          # Items API logic
│   │   ├── 📁 clients/            # Client management API
│   │   ├── 📁 purchase-orders/    # Purchase orders API
│   │   └── 📁 sales/              # Sales transactions API
│   ├── 📁 auth/
│   │   └── 📁 signin/             # Custom sign-in page
│   ├── 📁 components/             # 🎨 Reusable UI Components
│   │   ├── ClientCard.jsx         # Client display card
│   │   ├── ClientForm.jsx         # Client creation/editing
│   │   ├── ItemCard.jsx           # Product display card
│   │   ├── ItemForm.jsx           # Product creation/editing
│   │   ├── ItemFilter.jsx         # Search and filter items
│   │   ├── LoadingSpinner.jsx     # Loading indicator
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── PurchaseOrderCard.jsx  # Purchase order display
│   │   ├── PurchaseOrderForm.jsx  # Purchase order creation
│   │   ├── ErrorMessage.jsx       # Error display component
│   │   └── SessionProvider.jsx    # Auth context provider
│   ├── 📁 hooks/                  # 🎣 Custom React Hooks
│   │   ├── useItems.js            # Items state management
│   │   ├── useClients.js          # Clients state management
│   │   ├── useSales.js            # Sales state management
│   │   └── usePurchaseOrders.js   # Purchase orders management
│   ├── 📁 lib/                    # 🛠️ Utility Functions
│   │   ├── mongodb.js             # Database connection
│   │   ├── auth.js                # NextAuth configuration
│   │   └── auth-server.js         # Server-side auth utilities
│   ├── 📁 models/                 # 🗄️ MongoDB Schemas
│   │   ├── Item.js                # Product data model
│   │   ├── Client.js              # Customer data model
│   │   ├── Sale.js                # Transaction data model
│   │   └── PurchaseOrder.js       # Purchase order model
│   ├── 📁 New-item/               # ➕ Add New Item Page
│   ├── 📁 clients/                # 👥 Client Management Page
│   ├── 📁 purchase-orders/        # 📋 Purchase Orders Page
│   ├── 📁 sales/                  # 💰 Sales Management Page
│   ├── 📁 reports/                # 📊 Analytics & Reports Page
│   ├── layout.js                  # 🎨 Root layout component
│   ├── page.js                    # 🏠 Dashboard home page
│   └── globals.css                # 🎨 Global styles
├── 📄 middleware.js               # 🔒 Route protection
├── 📄 tailwind.config.js          # 🎨 Tailwind configuration
├── 📄 jsconfig.json               # 📝 JavaScript configuration
├── 📄 package.json                # 📦 Dependencies and scripts
├── 📄 vercel.json                 # 🚀 Deployment configuration
├── 📄 islam-api.postman_collection.json  # 🧪 API testing collection
├── 📄 AUTHENTICATION_SETUP.md     # 🔐 Auth setup guide
├── 📄 TECHNICAL_DOCUMENTATION.md  # 📚 Detailed technical docs
├── 📄 VERCEL_ENV_VARS.md          # 🔧 Environment variables guide
└── 📄 README.md                   # 📖 This file
```

### 🔄 Data Flow Architecture

1. **User Authentication Flow:**
   ```
   User → Google OAuth → NextAuth.js → MongoDB Session → Protected Routes
   ```

2. **Inventory Management Flow:**
   ```
   Add Item → Validate → Store in MongoDB → Update UI → Real-time Sync
   ```

3. **Sales Transaction Flow:**
   ```
   Create Sale → Validate Stock → Update Inventory → Update Client Stats → Generate Receipt
   ```

4. **Purchase Order Flow:**
   ```
   Create Order → Track Delivery → Process to Inventory → Update Stock Levels
   ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

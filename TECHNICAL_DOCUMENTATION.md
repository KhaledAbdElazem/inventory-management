# 📚 Zema Cashier - Technical Documentation

A comprehensive multi-user inventory management system built with Next.js, MongoDB, and Google OAuth authentication.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.4.1 (App Router) + React 19.1.0
- **Backend**: Next.js API Routes (Server-side)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel

### Project Structure
```
├── src/app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── auth/              # Authentication endpoints
│   │   ├── items/             # Items CRUD operations
│   │   ├── clients/           # Clients CRUD operations
│   │   ├── sales/             # Sales CRUD operations
│   │   └── purchase-orders/   # Purchase orders CRUD
│   ├── auth/                  # Authentication pages
│   ├── components/            # Reusable React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── models/               # MongoDB schemas
│   └── [pages]/              # App pages (routes)
├── middleware.js             # Route protection
└── tailwind.config.js       # Styling configuration
```

## 🔐 Authentication System

### NextAuth.js Configuration
**File**: `src/app/api/auth/[...nextauth]/route.js`

```javascript
// Core authentication setup
const authOptions = {
  adapter: MongoDBAdapter(clientPromise),  // Store sessions in MongoDB
  providers: [GoogleProvider()],          // Google OAuth only
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id           // Add user ID to session
      return session
    }
  },
  trustHost: true                         // Handle dynamic URLs
}
```

### Authentication Flow
1. **User visits protected route** → Middleware checks authentication
2. **Not authenticated** → Redirect to `/auth/signin`
3. **Google OAuth** → User signs in with Google account
4. **Session created** → User data stored in MongoDB
5. **Access granted** → User can access protected resources

### Route Protection
**File**: `middleware.js`

```javascript
// Protects all routes except auth-related ones
export const config = {
  matcher: [
    '/((?!api/auth|auth/signin|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## 🗄️ Database Schema

### User-Centric Design
Every data model includes a `userId` field for multi-tenant isolation.

### Models Overview

#### 1. Item Model (`src/app/models/Item.js`)
```javascript
{
  name: String,           // Product name
  barcode: String,        // Unique identifier per user
  image: String,          // Product image URL
  quantity: Number,       // Stock quantity
  price: Number,          // Unit price
  status: String,         // 'available', 'low_stock', 'out_of_stock'
  userId: String,         // Owner of this item
  createdAt: Date
}
```

#### 2. Client Model (`src/app/models/Client.js`)
```javascript
{
  name: String,           // Client name
  email: String,          // Email (optional)
  phone: String,          // Phone number
  address: String,        // Physical address
  totalPurchases: Number, // Number of transactions
  totalSpent: Number,     // Total money spent
  lastPurchase: Date,     // Last transaction date
  notes: String,          // Additional notes
  userId: String          // Owner of this client
}
```

#### 3. Sale Model (`src/app/models/Sale.js`)
```javascript
{
  saleNumber: String,     // Auto-generated (YYYYMMDD0001)
  client: ObjectId,       // Reference to Client
  clientName: String,     // Cached client name
  items: [{               // Array of sold items
    item: ObjectId,       // Reference to Item
    itemName: String,     // Cached item name
    quantity: Number,     // Quantity sold
    unitPrice: Number,    // Price per unit
    totalPrice: Number    // quantity × unitPrice
  }],
  subtotal: Number,       // Sum of all item totals
  tax: Number,           // Tax amount
  discount: Number,      // Discount amount
  total: Number,         // Final amount
  paymentMethod: String, // 'cash', 'card', etc.
  status: String,        // 'completed', 'pending', 'cancelled'
  userId: String         // Owner of this sale
}
```

#### 4. Purchase Order Model (`src/app/models/PurchaseOrder.js`)
```javascript
{
  orderNumber: String,    // Auto-generated (PO + YYYYMMDD0001)
  dealerName: String,     // Supplier name
  dealerContact: String,  // Supplier contact info
  items: [{              // Array of ordered items
    itemName: String,    // Product name
    itemBarcode: String, // Product barcode
    quantity: Number,    // Quantity ordered
    unitCost: Number,    // Cost per unit
    sellingPrice: Number,// Planned selling price
    isNewItem: Boolean   // Whether it's a new product
  }],
  subtotal: Number,      // Sum of all costs
  tax: Number,          // Tax amount
  shippingCost: Number, // Shipping fees
  totalCost: Number,    // Final cost
  status: String,       // 'pending', 'arrived', 'cancelled'
  orderDate: Date,      // When order was placed
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  processedToInventory: Boolean, // Added to inventory?
  userId: String        // Owner of this order
}
```

## 🔧 API Architecture

### RESTful Design
All API routes follow REST conventions with user-specific data filtering.

### Authentication Pattern
```javascript
// Every protected API route uses this pattern
export async function GET() {
  try {
    await connectToDatabase()
    
    try {
      const user = await getAuthenticatedUser()
      // Return user-specific data
      const data = await Model.find({ userId: user.id })
      return Response.json(data)
    } catch (authError) {
      // Gracefully handle unauthenticated requests
      return Response.json([])
    }
  } catch (error) {
    return Response.json({ message: 'Error' }, { status: 500 })
  }
}
```

### Key API Endpoints

#### Items API (`/api/items`)
- **GET**: Fetch user's items
- **POST**: Create new item (requires auth)
- **PUT**: Update existing item (user-owned only)
- **DELETE**: Delete item (user-owned only)

#### Sales API (`/api/sales`)
- **GET**: Fetch user's sales history
- **POST**: Create new sale (updates inventory & client stats)
- **DELETE**: Cancel sale (restores inventory)

#### Clients API (`/api/clients`)
- **GET**: Fetch user's clients
- **POST**: Create new client
- **PUT**: Update client info
- **DELETE**: Remove client

## ⚛️ Frontend Architecture

### Component Structure

#### Core Components
1. **Navbar** (`src/app/components/Navbar.jsx`)
   - Shows only when authenticated
   - User profile dropdown with sign-out
   - Navigation links to all sections

2. **SessionProvider** (`src/app/components/SessionProvider.jsx`)
   - Wraps entire app for authentication state
   - Provides session context to all components

#### Business Logic Components
1. **ItemCard** - Display individual items
2. **ClientCard** - Display client information
3. **ItemForm** - Add/edit items
4. **PurchaseOrderForm** - Create purchase orders

### Custom Hooks

#### Data Management Hooks
```javascript
// Example: useItems hook
const useItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchItems = async () => {
    const response = await fetch('/api/items')
    const data = await response.json()
    setItems(data)
  }
  
  return { items, loading, fetchItems, addItem, updateItem, deleteItem }
}
```

### Page Structure

#### Dashboard (`src/app/page.js`)
- **StatCards**: Show key metrics
- **InventoryStatus**: Stock levels overview
- **RecentActivity**: Latest items added
- **TopItemsChart**: Most valuable items
- **QuickActions**: Navigation shortcuts

#### Other Pages
- **Sales** (`/sales`) - Point of sale interface
- **Clients** (`/clients`) - Customer management
- **Purchase Orders** (`/purchase-orders`) - Supplier orders
- **New Item** (`/New-item`) - Add inventory
- **Reports** (`/reports`) - Analytics dashboard

## 🔒 Security Features

### Multi-Tenant Data Isolation
- Every database query filters by `userId`
- No user can access another user's data
- API routes validate ownership before CRUD operations

### Authentication Security
- **Google OAuth** - No password storage
- **Session Management** - Handled by NextAuth.js
- **CSRF Protection** - Built into NextAuth.js
- **Secure Cookies** - HTTP-only, secure flags

### API Security
```javascript
// Example: User-specific data filtering
const items = await Item.find({ userId: user.id })

// Example: Ownership validation for updates
const item = await Item.findOneAndUpdate(
  { _id: itemId, userId: user.id }, // Must be owned by user
  updateData
)
```

## 🚀 Deployment Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secure-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Vercel Deployment
1. **Environment Variables**: Set in Vercel dashboard
2. **Build Command**: `npm run build`
3. **Auto-deployment**: Connected to Git repository
4. **Edge Functions**: API routes run on Vercel Edge Runtime

## 📊 Data Flow Examples

### Creating a Sale
1. **Frontend** → POST `/api/sales` with sale data
2. **API** → Validate user authentication
3. **API** → Validate client and items exist
4. **API** → Check inventory availability
5. **API** → Create sale record with `userId`
6. **API** → Update item quantities (subtract sold amounts)
7. **API** → Update client statistics (total spent, purchases)
8. **API** → Return created sale data
9. **Frontend** → Update UI with new sale

### Adding New Item
1. **Frontend** → POST `/api/items` with item data
2. **API** → Authenticate user
3. **API** → Add `userId` to item data
4. **API** → Check for duplicate barcode (per user)
5. **API** → Create item with user ownership
6. **API** → Return created item
7. **Frontend** → Update items list

## 🔄 State Management

### Client-Side State
- **React State**: Component-level state
- **Custom Hooks**: Shared business logic
- **Session State**: NextAuth.js handles auth state

### Server-Side State
- **Database**: MongoDB as single source of truth
- **Session Storage**: MongoDB (via NextAuth adapter)
- **No caching**: Real-time data for accuracy

## 🧪 Development Workflow

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### File Organization
- **API Routes**: Server-side business logic
- **Components**: Reusable UI elements
- **Hooks**: Shared state logic
- **Models**: Database schemas
- **Pages**: Route components

## 🔍 Debugging & Monitoring

### Error Handling
```javascript
// API Error Pattern
try {
  // Operation
} catch (error) {
  console.error('[API] Error context:', error)
  return Response.json({ message: 'User-friendly message' }, { status: 500 })
}
```

### Logging
- **API Operations**: Logged to console
- **Authentication**: Debug logs in auth utility
- **Database**: Mongoose operation logging

## 🎯 Key Features Summary

### Multi-User Support
- Complete data isolation per user
- Google OAuth authentication
- User-specific inventory, clients, and sales

### Inventory Management
- Add, edit, delete items
- Track quantities and prices
- Low stock alerts
- Barcode support

### Sales Tracking
- Point of sale interface
- Automatic inventory updates
- Client purchase history
- Payment method tracking

### Purchase Orders
- Order from suppliers
- Track delivery status
- Add to inventory when arrived

### Analytics
- Dashboard with key metrics
- Sales history and trends
- Client statistics
- Inventory status overview

## 🔧 Customization Guide

### Adding New Features
1. **Create Model** → Define MongoDB schema
2. **Create API Routes** → Add CRUD endpoints
3. **Create Components** → Build UI elements
4. **Create Hooks** → Add state management
5. **Add Navigation** → Update navbar/routing

### Modifying Authentication
- **Add Providers**: Extend `authOptions.providers`
- **Custom Fields**: Modify session callbacks
- **Authorization Logic**: Update middleware

### Database Changes
- **Schema Updates**: Modify model files
- **Migrations**: Handle existing data
- **Indexes**: Add for performance

---

## 📖 Getting Started for Developers

### Prerequisites
- Node.js 18+
- MongoDB database
- Google OAuth credentials

### Setup Steps
1. **Clone repository**
2. **Install dependencies**: `npm install`
3. **Configure environment**: Copy `.env.example` to `.env.local`
4. **Set up Google OAuth** (see AUTHENTICATION_SETUP.md)
5. **Run development server**: `npm run dev`

### Contributing
1. **Follow existing patterns**
2. **Add user authentication** to new API routes
3. **Include `userId`** in all data models
4. **Test multi-user scenarios**
5. **Update documentation**

This documentation provides a complete technical overview of the Zema Cashier inventory management system. For specific setup instructions, refer to `AUTHENTICATION_SETUP.md` and `VERCEL_ENV_VARS.md`.

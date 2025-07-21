# Islam Inventory Management System

A full-stack inventory management system built with Next.js, featuring both frontend and backend functionality in a single application. This system manages inventory items, clients, purchase orders, and sales with comprehensive barcode support and real-time tracking.

## Features

- 📦 **Item Management**: Add, edit, delete, and search inventory items
- 👥 **Client Management**: Manage customer information and relationships
- 📋 **Purchase Orders**: Track and manage purchase orders
- 💰 **Sales Management**: Monitor sales transactions and history
- 📊 **Reports**: Generate comprehensive inventory and sales reports
- 🏷️ **Barcode Support**: Unique barcode tracking and search functionality
- 📈 **Stock Alerts**: Low stock and out-of-stock notifications
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🔄 **Real-time Updates**: Automatic data synchronization
- 🚀 **Full API**: Complete REST API for all operations

## Tech Stack

- **Frontend**: Next.js 15.4.1, React 19.1.0
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your MongoDB connection string.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item by ID
- `PUT /api/items/[id]` - Update item by ID
- `DELETE /api/items/[id]` - Delete item by ID
- `GET /api/items/search?barcode=xxx` - Search item by barcode

### Other Resources
- `GET /api/clients` - Get all clients
- `GET /api/purchase-orders` - Get all purchase orders
- `GET /api/sales` - Get all sales

## Testing API

Import the Postman collection `islam-api.postman_collection.json` to test all API endpoints.

## Project Structure

```
src/
├── app/
│   ├── api/               # API routes (backend)
│   │   ├── items/         # Items API endpoints
│   │   │   ├── [id]/      # Individual item operations
│   │   │   ├── search/    # Barcode search
│   │   │   └── route.js   # CRUD operations
│   │   ├── clients/       # Clients API
│   │   ├── purchase-orders/
│   │   └── sales/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Database connection
│   ├── models/            # MongoDB models
│   ├── New-item/          # Add new item page
│   ├── clients/           # Client management page
│   ├── purchase-orders/   # Purchase orders page
│   ├── sales/             # Sales management page
│   ├── reports/           # Reports page
│   ├── layout.js          # Root layout
│   ├── page.js            # Dashboard home page
│   └── globals.css        # Global styles
├── islam-api.postman_collection.json  # Postman API collection
└── README.md
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

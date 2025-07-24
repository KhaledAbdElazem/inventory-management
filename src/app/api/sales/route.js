import { connectToDatabase } from '../../lib/mongodb';
import Sale from '../../models/Sale';
import Item from '../../models/Item';
import Client from '../../models/Client';
import { getAuthenticatedUser } from '../../lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Try to get authenticated user, but handle gracefully if not authenticated
    try {
      const user = await getAuthenticatedUser();
      // If user is authenticated, return their sales
      const sales = await Sale.find({ userId: user.id })
        .populate('client', 'name email phone')
        .populate('items.item', 'name barcode')
        .sort({ createdAt: -1 });
      return Response.json(sales);
    } catch (authError) {
      // If not authenticated, return empty array (user will be redirected by middleware)
      return Response.json([]);
    }
  } catch (error) {
    console.error('[API] Error fetching sales:', error);
    return Response.json({ message: 'Error fetching sales' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser();
    await connectToDatabase();
    const data = await req.json();

    console.log('[API] Received data for new sale:', data);

    // Validate client exists
    const client = await Client.findById(data.clientId);
    if (!client) {
      return Response.json({ message: 'Client not found' }, { status: 400 });
    }

    // Validate and process items
    const saleItems = [];
    let subtotal = 0;

    for (const saleItem of data.items) {
      const item = await Item.findById(saleItem.itemId);
      if (!item) {
        return Response.json({ message: `Item not found: ${saleItem.itemId}` }, { status: 400 });
      }

      // Check if enough stock available
      if (item.quantity < saleItem.quantity) {
        return Response.json({ 
          message: `Not enough stock for ${item.name}. Available: ${item.quantity}, Requested: ${saleItem.quantity}` 
        }, { status: 400 });
      }

      const totalPrice = saleItem.quantity * item.price;
      subtotal += totalPrice;

      saleItems.push({
        item: item._id,
        itemName: item.name,
        itemBarcode: item.barcode,
        quantity: saleItem.quantity,
        unitPrice: item.price,
        totalPrice: totalPrice,
      });
    }

    // Calculate totals
    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const total = subtotal + tax - discount;

    // Create sale
    const newSale = await Sale.create({
      client: client._id,
      clientName: client.name,
      items: saleItems,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: data.paymentMethod || 'cash',
      status: 'completed',
      notes: data.notes,
      userId: user.id,
    });

    // Update item quantities and client stats
    for (const saleItem of saleItems) {
      await Item.findByIdAndUpdate(saleItem.item, {
        $inc: { quantity: -saleItem.quantity }
      });
    }

    // Update client statistics
    await Client.findByIdAndUpdate(client._id, {
      $inc: { 
        totalPurchases: 1,
        totalSpent: total
      },
      lastPurchase: new Date()
    });

    // Populate the response
    const populatedSale = await Sale.findById(newSale._id)
      .populate('client', 'name email phone')
      .populate('items.item', 'name barcode');

    console.log('[API] Successfully created new sale:', populatedSale);
    return Response.json(populatedSale, { status: 201 });

  } catch (error) {
    console.error('[API] Error creating sale:', error);

    if (error.name === 'ValidationError') {
      return Response.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }

    return Response.json({ message: 'Error creating sale' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { _id } = await req.json();

    if (!_id) {
      return Response.json({ message: 'Sale ID is required for deletion' }, { status: 400 });
    }

    // Get sale details before deletion to restore inventory
    const sale = await Sale.findById(_id);
    if (!sale) {
      return Response.json({ message: 'Sale not found' }, { status: 404 });
    }

    // Restore item quantities
    for (const saleItem of sale.items) {
      await Item.findByIdAndUpdate(saleItem.item, {
        $inc: { quantity: saleItem.quantity }
      });
    }

    // Update client statistics
    await Client.findByIdAndUpdate(sale.client, {
      $inc: { 
        totalPurchases: -1,
        totalSpent: -sale.total
      }
    });

    // Delete the sale
    await Sale.findByIdAndDelete(_id);

    return Response.json({ message: 'Sale cancelled and inventory restored' });
  } catch (error) {
    console.error('[API] Error deleting sale:', error);
    return Response.json({ message: 'Error deleting sale' }, { status: 500 });
  }
}

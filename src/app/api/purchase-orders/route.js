import { connectToDatabase } from '../../lib/mongodb';
import PurchaseOrder from '../../models/PurchaseOrder';
import Item from '../../models/Item';

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await PurchaseOrder.find()
      .populate('items.existingItem', 'name barcode')
      .sort({ createdAt: -1 });
    return Response.json(orders);
  } catch (error) {
    console.error('[API] Error fetching purchase orders:', error);
    return Response.json({ message: 'Error fetching purchase orders' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();

    console.log('[API] Received data for new purchase order:', data);

    // Process items and check for existing items
    const processedItems = [];
    let subtotal = 0;

    for (const orderItem of data.items) {
      // Check if item exists by barcode
      const existingItem = await Item.findOne({ barcode: orderItem.itemBarcode });
      
      const totalCost = orderItem.quantity * orderItem.unitCost;
      subtotal += totalCost;

      processedItems.push({
        itemName: orderItem.itemName,
        itemBarcode: orderItem.itemBarcode,
        quantity: orderItem.quantity,
        unitCost: orderItem.unitCost,
        totalCost: totalCost,
        sellingPrice: orderItem.sellingPrice,
        existingItem: existingItem ? existingItem._id : null,
        isNewItem: !existingItem,
      });
    }

    // Calculate totals
    const tax = data.tax || 0;
    const shippingCost = data.shippingCost || 0;
    const totalCost = subtotal + tax + shippingCost;

    // Create purchase order
    const newOrder = await PurchaseOrder.create({
      dealerName: data.dealerName,
      dealerContact: data.dealerContact,
      dealerEmail: data.dealerEmail,
      items: processedItems,
      subtotal,
      tax,
      shippingCost,
      totalCost,
      status: 'pending',
      expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
      notes: data.notes,
    });

    // Populate the response
    const populatedOrder = await PurchaseOrder.findById(newOrder._id)
      .populate('items.existingItem', 'name barcode');

    console.log('[API] Successfully created new purchase order:', populatedOrder);
    return Response.json(populatedOrder, { status: 201 });

  } catch (error) {
    console.error('[API] Error creating purchase order:', error);

    if (error.name === 'ValidationError') {
      return Response.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }

    return Response.json({ message: 'Error creating purchase order' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const { _id, status, ...updateData } = data;

    if (!_id) {
      return Response.json({ message: 'Order ID is required for update' }, { status: 400 });
    }

    const order = await PurchaseOrder.findById(_id);
    if (!order) {
      return Response.json({ message: 'Purchase order not found' }, { status: 404 });
    }

    // If status is being changed to 'arrived' and hasn't been processed yet
    if (status === 'arrived' && order.status !== 'arrived' && !order.processedToInventory) {
      console.log('[API] Processing order arrival - updating inventory');
      
      // Process each item in the order
      for (const orderItem of order.items) {
        if (orderItem.existingItem) {
          // Update existing item quantity
          await Item.findByIdAndUpdate(orderItem.existingItem, {
            $inc: { quantity: orderItem.quantity }
          });
          console.log(`[API] Updated existing item ${orderItem.itemName} - added ${orderItem.quantity} units`);
        } else {
          // Create new item
          const newItem = await Item.create({
            name: orderItem.itemName,
            barcode: orderItem.itemBarcode,
            quantity: orderItem.quantity,
            price: orderItem.sellingPrice,
            image: '', // Can be updated later
            status: orderItem.quantity === 0
              ? 'out_of_stock'
              : orderItem.quantity <= 5
                ? 'low_stock'
                : 'available',
          });
          
          // Update the order item to reference the new item
          orderItem.existingItem = newItem._id;
          orderItem.isNewItem = false;
          
          console.log(`[API] Created new item ${orderItem.itemName} with ${orderItem.quantity} units`);
        }
      }

      // Mark as processed and set delivery date
      updateData.processedToInventory = true;
      updateData.actualDeliveryDate = new Date();
    }

    // Update the order
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      _id, 
      { ...updateData, status },
      { new: true, runValidators: true }
    ).populate('items.existingItem', 'name barcode');

    console.log('[API] Successfully updated purchase order:', updatedOrder.orderNumber);
    return Response.json(updatedOrder);

  } catch (error) {
    console.error('[API] Error updating purchase order:', error);
    return Response.json({ message: 'Error updating purchase order' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { _id } = await req.json();

    if (!_id) {
      return Response.json({ message: 'Order ID is required for deletion' }, { status: 400 });
    }

    const deletedOrder = await PurchaseOrder.findByIdAndDelete(_id);

    if (!deletedOrder) {
      return Response.json({ message: 'Purchase order not found' }, { status: 404 });
    }

    return Response.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('[API] Error deleting purchase order:', error);
    return Response.json({ message: 'Error deleting purchase order' }, { status: 500 });
  }
}

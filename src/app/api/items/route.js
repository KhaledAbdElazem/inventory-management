import { connectToDatabase } from '../../lib/mongodb';
import Item from '../../models/Item';

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Item.find().sort({ createdAt: -1 });
    return Response.json(items);
  } catch (error) {
    console.error('[API] Error fetching items:', error);
    return Response.json({ message: 'Error fetching items' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // --- DEBUGGING STEP ---
    // Log the data received by the server.
    // Check your server's terminal console for this log.
    console.log('[API] Received data for new item:', data);

    // Make sure barcode is included in the data sent from the client
    if (!data.barcode) {
        return Response.json({ message: 'Barcode is missing from request' }, { status: 400 });
    }

    const newItem = await Item.create({
      name: data.name,
      barcode: data.barcode, // Ensure barcode is saved
      image: data.image,
      quantity: data.quantity,
      price: data.price,
      // This status logic is fine
      status: data.quantity === 0
        ? 'out_of_stock'
        : data.quantity <= 5
          ? 'low_stock'
          : 'available',
    });

    console.log('[API] Successfully created new item:', newItem);
    return Response.json(newItem, { status: 201 }); // Use 201 for created resources

  } catch (error) {
    // --- IMPROVED ERROR HANDLING ---
    console.error('[API] Error creating item:', error);

    // Check for a duplicate key error (for the unique barcode)
    if (error.code === 11000) {
      return Response.json(
        { message: `An item with this barcode already exists: ${error.keyValue.barcode}` },
        { status: 409 } // 409 Conflict
      );
    }

    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
        return Response.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }

    // Generic server error
    return Response.json({ message: 'Error creating item' }, { status: 500 });
  }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const data = await req.json();
        const { _id, ...updateData } = data; // Separate id from the rest of the data

        if (!_id) {
            return Response.json({ message: 'Item ID is required for update' }, { status: 400 });
        }

        const updatedItem = await Item.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
        
        if (!updatedItem) {
            return Response.json({ message: 'Item not found' }, { status: 404 });
        }

        return Response.json(updatedItem);
    } catch (error) {
        console.error('[API] Error updating item:', error);
        if (error.code === 11000) {
            return Response.json({ message: `An item with this barcode already exists.` }, { status: 409 });
        }
        return Response.json({ message: 'Error updating item' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { _id } = await req.json(); // Get ID from body

        if (!_id) {
            return Response.json({ message: 'Item ID is required for deletion' }, { status: 400 });
        }

        const deletedItem = await Item.findByIdAndDelete(_id);

        if (!deletedItem) {
            return Response.json({ message: 'Item not found' }, { status: 404 });
        }

        return Response.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('[API] Error deleting item:', error);
        return Response.json({ message: 'Error deleting item' }, { status: 500 });
    }
}
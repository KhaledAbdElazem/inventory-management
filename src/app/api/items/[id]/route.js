import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const item = await Item.findById(id);
    
    if (!item) {
      return Response.json({ message: 'Item not found' }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error('[API] Error fetching item:', error);
    return Response.json({ message: 'Error fetching item' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updateData = await req.json();

    const updatedItem = await Item.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return Response.json({ message: 'Item not found' }, { status: 404 });
    }

    return Response.json(updatedItem);
  } catch (error) {
    console.error('[API] Error updating item:', error);
    if (error.code === 11000) {
      return Response.json({ message: 'An item with this barcode already exists' }, { status: 409 });
    }
    if (error.name === 'ValidationError') {
      return Response.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ message: 'Error updating item' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return Response.json({ message: 'Item not found' }, { status: 404 });
    }

    return Response.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('[API] Error deleting item:', error);
    return Response.json({ message: 'Error deleting item' }, { status: 500 });
  }
}

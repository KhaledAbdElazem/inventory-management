import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const barcode = searchParams.get('barcode');

    if (!barcode) {
      return Response.json({ message: 'Barcode parameter is required' }, { status: 400 });
    }

    const item = await Item.findOne({ barcode });
    
    if (!item) {
      return Response.json({ message: 'Item not found' }, { status: 404 });
    }

    return Response.json(item);
  } catch (error) {
    console.error('[API] Error searching item:', error);
    return Response.json({ message: 'Error searching item' }, { status: 500 });
  }
}

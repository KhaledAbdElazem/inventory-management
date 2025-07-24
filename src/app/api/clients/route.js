import { connectToDatabase } from '../../lib/mongodb';
import Client from '../../models/Client';
import { getAuthenticatedUser } from '../../lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Try to get authenticated user, but handle gracefully if not authenticated
    try {
      const user = await getAuthenticatedUser();
      // If user is authenticated, return their clients
      const clients = await Client.find({ userId: user.id }).sort({ createdAt: -1 });
      return Response.json(clients);
    } catch (authError) {
      // If not authenticated, return empty array (user will be redirected by middleware)
      return Response.json([]);
    }
  } catch (error) {
    console.error('[API] Error fetching clients:', error);
    return Response.json({ message: 'Error fetching clients' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser();
    await connectToDatabase();
    const data = await req.json();

    console.log('[API] Received data for new client:', data);

    const newClient = await Client.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      userId: user.id,
    });

    console.log('[API] Successfully created new client:', newClient);
    return Response.json(newClient, { status: 201 });

  } catch (error) {
    console.error('[API] Error creating client:', error);

    // Check for duplicate key error
    if (error.code === 11000) {
      return Response.json(
        { message: 'A client with this information already exists' },
        { status: 409 }
      );
    }

    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      return Response.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }

    return Response.json({ message: 'Error creating client' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return Response.json({ message: 'Client ID is required for update' }, { status: 400 });
    }

    const updatedClient = await Client.findByIdAndUpdate(_id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!updatedClient) {
      return Response.json({ message: 'Client not found' }, { status: 404 });
    }

    return Response.json(updatedClient);
  } catch (error) {
    console.error('[API] Error updating client:', error);
    if (error.code === 11000) {
      return Response.json({ message: 'A client with this information already exists' }, { status: 409 });
    }
    return Response.json({ message: 'Error updating client' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { _id } = await req.json();

    if (!_id) {
      return Response.json({ message: 'Client ID is required for deletion' }, { status: 400 });
    }

    const deletedClient = await Client.findByIdAndDelete(_id);

    if (!deletedClient) {
      return Response.json({ message: 'Client not found' }, { status: 404 });
    }

    return Response.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('[API] Error deleting client:', error);
    return Response.json({ message: 'Error deleting client' }, { status: 500 });
  }
}

import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true },
  image: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: String,
  userId: { type: String, required: true }, // User who owns this item
  createdAt: { type: Date, default: Date.now }
});

// Create compound index for user-specific barcodes
ItemSchema.index({ barcode: 1, userId: 1 }, { unique: true });

// This prevents Mongoose from redefining the model every time in development.
export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
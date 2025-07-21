import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  image: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: String,
  createdAt: { type: Date, default: Date.now }
});

// This prevents Mongoose from redefining the model every time in development.
export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  totalPurchases: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  lastPurchase: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
  userId: { type: String, required: true }, // User who owns this client
}, {
  timestamps: true,
});

// Create indexes
clientSchema.index({ name: 1, userId: 1 });
clientSchema.index({ email: 1, userId: 1 });

export default mongoose.models.Client || mongoose.model('Client', clientSchema);

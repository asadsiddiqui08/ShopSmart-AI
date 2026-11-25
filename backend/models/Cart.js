import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate totals pre-save
cartSchema.pre('save', function (next) {
  this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.subtotal = parseFloat(
    this.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

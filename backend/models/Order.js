import mongoose from 'mongoose';
import { getUseJsonDb } from '../config/db.js';
import { JsonModel } from '../utils/fileDb.js';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'card' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  trackingNumber: { type: String, default: '' }
}, { timestamps: true });

const MongooseOrder = mongoose.models.Order || mongoose.model('Order', orderSchema);
const JsonOrder = new JsonModel('orders', {
  products: [],
  paymentMethod: 'card',
  paymentStatus: 'Pending',
  orderStatus: 'Pending',
  trackingNumber: ''
});

const Order = {
  find: (q) => getUseJsonDb() ? JsonOrder.find(q) : MongooseOrder.find(q),
  findOne: (q) => getUseJsonDb() ? JsonOrder.findOne(q) : MongooseOrder.findOne(q),
  findById: (id) => getUseJsonDb() ? JsonOrder.findById(id) : MongooseOrder.findById(id),
  create: (data) => getUseJsonDb() ? JsonOrder.create(data) : MongooseOrder.create(data),
  findByIdAndUpdate: (id, update, options) => getUseJsonDb() ? JsonOrder.findByIdAndUpdate(id, update, options) : MongooseOrder.findByIdAndUpdate(id, update, options),
  findByIdAndDelete: (id) => getUseJsonDb() ? JsonOrder.findByIdAndDelete(id) : MongooseOrder.findByIdAndDelete(id),
  countDocuments: (q) => getUseJsonDb() ? JsonOrder.countDocuments(q) : MongooseOrder.countDocuments(q),
  
  createInstance: (data) => {
    if (getUseJsonDb()) {
      return JsonOrder.createInstance(data);
    } else {
      return new MongooseOrder(data);
    }
  }
};

export default Order;

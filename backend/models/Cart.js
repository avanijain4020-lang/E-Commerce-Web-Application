import mongoose from 'mongoose';
import { getUseJsonDb } from '../config/db.js';
import { JsonModel } from '../utils/fileDb.js';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
}, { timestamps: true });

const MongooseCart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const JsonCart = new JsonModel('carts', { products: [] });

const Cart = {
  find: (q) => getUseJsonDb() ? JsonCart.find(q) : MongooseCart.find(q),
  findOne: (q) => getUseJsonDb() ? JsonCart.findOne(q) : MongooseCart.findOne(q),
  findById: (id) => getUseJsonDb() ? JsonCart.findById(id) : MongooseCart.findById(id),
  create: (data) => getUseJsonDb() ? JsonCart.create(data) : MongooseCart.create(data),
  findByIdAndUpdate: (id, update, options) => getUseJsonDb() ? JsonCart.findByIdAndUpdate(id, update, options) : MongooseCart.findByIdAndUpdate(id, update, options),
  findByIdAndDelete: (id) => getUseJsonDb() ? JsonCart.findByIdAndDelete(id) : MongooseCart.findByIdAndDelete(id),
  countDocuments: (q) => getUseJsonDb() ? JsonCart.countDocuments(q) : MongooseCart.countDocuments(q),
  
  createInstance: (data) => {
    if (getUseJsonDb()) {
      return JsonCart.createInstance(data);
    } else {
      return new MongooseCart(data);
    }
  }
};

export default Cart;

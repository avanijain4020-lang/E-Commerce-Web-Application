import mongoose from 'mongoose';
import { getUseJsonDb } from '../config/db.js';
import { JsonModel } from '../utils/fileDb.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true }
}, { timestamps: true });

const MongooseProduct = mongoose.models.Product || mongoose.model('Product', productSchema);
const JsonProduct = new JsonModel('products', { stock: 0 });

const Product = {
  find: (q) => getUseJsonDb() ? JsonProduct.find(q) : MongooseProduct.find(q),
  findOne: (q) => getUseJsonDb() ? JsonProduct.findOne(q) : MongooseProduct.findOne(q),
  findById: (id) => getUseJsonDb() ? JsonProduct.findById(id) : MongooseProduct.findById(id),
  create: (data) => getUseJsonDb() ? JsonProduct.create(data) : MongooseProduct.create(data),
  findByIdAndUpdate: (id, update, options) => getUseJsonDb() ? JsonProduct.findByIdAndUpdate(id, update, options) : MongooseProduct.findByIdAndUpdate(id, update, options),
  findByIdAndDelete: (id) => getUseJsonDb() ? JsonProduct.findByIdAndDelete(id) : MongooseProduct.findByIdAndDelete(id),
  countDocuments: (q) => getUseJsonDb() ? JsonProduct.countDocuments(q) : MongooseProduct.countDocuments(q),
  
  createInstance: (data) => {
    if (getUseJsonDb()) {
      return JsonProduct.createInstance(data);
    } else {
      return new MongooseProduct(data);
    }
  }
};

export default Product;

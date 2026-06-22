import mongoose from 'mongoose';
import { getUseJsonDb } from '../config/db.js';
import { JsonModel } from '../utils/fileDb.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
const JsonUser = new JsonModel('users', { role: 'user' });

const User = {
  find: (q) => getUseJsonDb() ? JsonUser.find(q) : MongooseUser.find(q),
  findOne: (q) => getUseJsonDb() ? JsonUser.findOne(q) : MongooseUser.findOne(q),
  findById: (id) => getUseJsonDb() ? JsonUser.findById(id) : MongooseUser.findById(id),
  create: (data) => getUseJsonDb() ? JsonUser.create(data) : MongooseUser.create(data),
  findByIdAndUpdate: (id, update, options) => getUseJsonDb() ? JsonUser.findByIdAndUpdate(id, update, options) : MongooseUser.findByIdAndUpdate(id, update, options),
  findByIdAndDelete: (id) => getUseJsonDb() ? JsonUser.findByIdAndDelete(id) : MongooseUser.findByIdAndDelete(id),
  countDocuments: (q) => getUseJsonDb() ? JsonUser.countDocuments(q) : MongooseUser.countDocuments(q),
  
  createInstance: (data) => {
    if (getUseJsonDb()) {
      return JsonUser.createInstance(data);
    } else {
      return new MongooseUser(data);
    }
  }
};

export default User;

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

// Ensure database data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonModel {
  constructor(collectionName, defaults = {}) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.defaults = defaults;
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  async find(query = {}) {
    const items = this._read();
    return items.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          // Handle simple matching
          if (typeof query[key] === 'object' && query[key] !== null) {
            // Check for MongoDB-like operator support like $regex or $in if needed
            if (query[key].$regex) {
              const regex = new RegExp(query[key].$regex, 'i');
              if (!regex.test(item[key])) return false;
              continue;
            }
          }
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items.length > 0 ? items[0] : null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      ...this.defaults,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const items = this._read();
    const idx = items.findIndex(item => item._id === id);
    if (idx === -1) return null;

    // Handle Mongoose-style atomic updates like $set or regular updates
    const current = items[idx];
    const newFields = updateData.$set ? updateData.$set : updateData;
    
    items[idx] = {
      ...current,
      ...newFields,
      updatedAt: new Date().toISOString()
    };
    
    this._write(items);
    return items[idx];
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const idx = items.findIndex(item => item._id === id);
    if (idx === -1) return null;
    const deletedItem = items[idx];
    const filtered = items.filter(item => item._id !== id);
    this._write(filtered);
    return deletedItem;
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  // Model-level save simulation
  createInstance(data = {}) {
    const modelInstance = {
      ...this.defaults,
      ...data,
      _id: data._id || Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      save: async () => {
        const items = this._read();
        const idx = items.findIndex(item => item._id === modelInstance._id);
        
        const plainData = { ...modelInstance };
        delete plainData.save;
        
        if (idx === -1) {
          plainData.createdAt = new Date().toISOString();
          plainData.updatedAt = new Date().toISOString();
          items.push(plainData);
        } else {
          plainData.updatedAt = new Date().toISOString();
          items[idx] = plainData;
        }
        
        this._write(items);
        return plainData;
      }
    };
    return modelInstance;
  }
}

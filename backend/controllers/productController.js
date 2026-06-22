import Product from '../models/Product.js';
import { getUseJsonDb } from '../config/db.js';

// @desc    Get all products (with search, filter, sort, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const sortBy = req.query.sortBy || 'newest'; // newest, priceAsc, priceDesc, nameAsc

    let products = [];
    let count = 0;

    if (getUseJsonDb()) {
      // JSON File DB filtering logic
      let allProducts = await Product.find({});
      
      // Filter by search
      if (search) {
        const regex = new RegExp(search, 'i');
        allProducts = allProducts.filter(
          p => regex.test(p.name) || regex.test(p.description)
        );
      }

      // Filter by category
      if (category) {
        allProducts = allProducts.filter(
          p => p.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by price range
      allProducts = allProducts.filter(
        p => p.price >= minPrice && p.price <= maxPrice
      );

      count = allProducts.length;

      // Sort
      if (sortBy === 'priceAsc') {
        allProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'priceDesc') {
        allProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'nameAsc') {
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        // newest / default
        allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // Paginate
      const skip = pageSize * (page - 1);
      products = allProducts.slice(skip, skip + pageSize);
    } else {
      // MongoDB Query
      const query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) {
        query.category = { $regex: `^${category}$`, $options: 'i' };
      }

      query.price = { $gte: minPrice, $lte: maxPrice === Infinity ? 99999999 : maxPrice };

      count = await Product.countDocuments(query);

      let sortOptions = {};
      if (sortBy === 'priceAsc') {
        sortOptions = { price: 1 };
      } else if (sortBy === 'priceDesc') {
        sortOptions = { price: -1 };
      } else if (sortBy === 'nameAsc') {
        sortOptions = { name: 1 };
      } else {
        sortOptions = { createdAt: -1 }; // newest
      }

      products = await Product.find(query)
        .sort(sortOptions)
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    }

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  try {
    if (!name || !price || !description || !image || !category || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all product fields' });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      image,
      category,
      stock: Number(stock)
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: name || product.name,
          price: price !== undefined ? Number(price) : product.price,
          description: description || product.description,
          image: image || product.image,
          category: category || product.category,
          stock: stock !== undefined ? Number(stock) : product.stock
        },
        { new: true }
      );

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

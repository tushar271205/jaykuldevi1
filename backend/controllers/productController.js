const Product = require('../models/Product');

// @GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category, subCategory, minPrice, maxPrice, size, color,
      sort, page = 1, limit = 20, isFeatured, isTopPick, isBudgetBuy, search,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isTopPick === 'true') filter.isTopPick = true;
    if (isBudgetBuy === 'true') filter.isBudgetBuy = true;
    if (minPrice || maxPrice) {
      filter.discountedPrice = {};
      if (minPrice) filter.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) filter.discountedPrice.$lte = Number(maxPrice);
    }
    if (size) filter['sizes.size'] = { $in: Array.isArray(size) ? size : [size] };
    if (color) filter.colors = { $in: Array.isArray(color) ? color : [color] };

    if (search) {
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const searchRegex = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
        { subCategory: searchRegex }
      ];
    }

    const sortMap = {
      'price-asc': { discountedPrice: 1 },
      'price-desc': { discountedPrice: -1 },
      'rating': { ratings: -1 },
      'newest': { createdAt: -1 },
      'popular': { numReviews: -1 },
    };
    const sortQuery = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortQuery).skip(skip).limit(Number(limit)).select('-__v'),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/products/search-suggestions
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 1) return res.json({ success: true, suggestions: [] });

    const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const qRegex = { $regex: escapeRegex(q), $options: 'i' };

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: qRegex },
        { tags: qRegex },
        { subCategory: qRegex },
      ],
    }).select('name subCategory category images').limit(8);

    const suggestions = products.map(p => ({
      _id: p._id,
      name: p.name,
      subCategory: p.subCategory,
      category: p.category,
      image: p.images[0]?.url || p.images[0] || '',
    }));

    res.json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

// @GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @POST /api/products (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const uploadedFiles = req.files ? req.files.map(f => f.path) : [];
    const imageColors = req.body.imageColors ? JSON.parse(req.body.imageColors) : [];

    const images = uploadedFiles.map((url, i) => ({
      url,
      color: imageColors[i] || ''
    }));

    const productData = { ...req.body, images };
    if (typeof productData.sizes === 'string') productData.sizes = JSON.parse(productData.sizes);
    if (typeof productData.colors === 'string') productData.colors = JSON.parse(productData.colors);
    if (typeof productData.tags === 'string') productData.tags = JSON.parse(productData.tags);
    if (typeof productData.ageGroup === 'string') productData.ageGroup = JSON.parse(productData.ageGroup);

    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Product created.', product });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/products/:id (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : null;
    const uploadedFiles = req.files ? req.files.map(f => f.path) : [];
    const newImageColors = req.body.imageColors ? JSON.parse(req.body.imageColors) : [];

    const newImages = uploadedFiles.map((url, i) => ({
      url,
      color: newImageColors[i] || ''
    }));

    if (existingImages !== null) {
      updateData.images = [...existingImages, ...newImages];
    } else if (uploadedFiles.length > 0) {
      updateData.images = newImages;
    } else if (updateData.images && typeof updateData.images === 'string') {
      updateData.images = JSON.parse(updateData.images);
    }

    if (typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);
    if (typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);
    if (typeof updateData.tags === 'string') updateData.tags = JSON.parse(updateData.tags);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated.', product });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/products/:id/discount (Admin)
exports.setDiscount = async (req, res, next) => {
  try {
    const { active, type, percent, flatAmount, validUntil } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    product.discount = { active: active !== false, type, percent, flatAmount, validUntil: validUntil ? new Date(validUntil) : null };
    await product.save();
    res.json({ success: true, message: 'Discount updated.', product });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/products/:id (Admin) - soft delete
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product removed.' });
  } catch (error) {
    next(error);
  }
};

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../services/productsApi";
import useGetStore from "../hooks/useGetStore";
import { getUserData } from "../utils/jwtUtils";
import { useAddProduct } from "../hooks/useAddProduct";
const mockProducts = [
  {
    id: 8,
    name: "Wireless Noise Cancelling Headphones",
    description: "",
    category: "electronics",
    originalPrice: 79.99,
    finalPrice: 49.5938,
    rating: 5,
    storeName: "Shop-Easy",
    discount: 38,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a",
      "https://images.unsplash.com/photo-1545127398-14699f92334b",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29",
    ],
    sizes: null,
    colors: null,
    tag: "Trending",
    stockQuantity: 10,
  },
  {
    id: 9,
    name: "Smart Fitness Watch Pro",
    description: "",
    category: "electronics",
    originalPrice: 199.99,
    finalPrice: 133.9933,
    rating: 5,
    storeName: "Shop-Easy",
    discount: 33,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
    sizes: null,
    colors: null,
    tag: "Best Seller",
    stockQuantity: 10,
  },
  {
    id: 14,
    name: "Premium Yoga Mat Set",
    description: "",
    category: "sports",
    originalPrice: 29.99,
    finalPrice: 29.99,
    rating: 5,
    storeName: "Shop-Easy",
    discount: 0,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f"],
    sizes: null,
    colors: null,
    tag: "Top",
    stockQuantity: 100,
  },
  {
    id: 15,
    name: "LED Desk Lamp",
    description: "",
    category: "home ",
    originalPrice: 34.99,
    finalPrice: 24.493,
    rating: 4,
    storeName: "Shop-Easy",
    discount: 30,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c"],
    sizes: null,
    colors: null,
    tag: "New",
    stockQuantity: 100,
  },
  {
    id: 16,
    name: "Wireless Gaming Mouse",
    description: "",
    category: "electronics",
    originalPrice: 19.99,
    finalPrice: 9.995,
    rating: 4,
    storeName: "Shop-Easy",
    discount: 50,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"],
    sizes: null,
    colors: null,
    tag: "50% OFF",
    stockQuantity: 100,
  },
  {
    id: 17,
    name: "Stainless Water Bottle",
    description: "",
    category: "sports",
    originalPrice: 12.99,
    finalPrice: 6.7548,
    rating: 5,
    storeName: "Shop-Easy",
    discount: 48,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8"],
    sizes: null,
    colors: null,
    tag: "Top Rated",
    stockQuantity: 10,
  },
  {
    id: 18,
    name: "Designer Sunglasses",
    description: "",
    category: "fashion",
    originalPrice: 149.99,
    finalPrice: 74.995,
    rating: 5,
    storeName: "Shop-Easy",
    discount: 50,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f"],
    sizes: null,
    colors: null,
    tag: "Hot Deal",
    stockQuantity: 10,
  },
  {
    id: 19,
    name: "Bestseller Novel Collection",
    description: "",
    category: "books",
    originalPrice: 24.99,
    finalPrice: 24.99,
    rating: 5,
    storeName: "Shop-Easy",
    discount: 0,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f"],
    sizes: null,
    colors: null,
    tag: "New",
    stockQuantity: 10,
  },
  {
    id: 21,
    name: "Premium Running Shoes",
    description: "Premium Running Shoes",
    category: "sports",
    originalPrice: 1234,
    finalPrice: 1110.6,
    rating: 0,
    storeName: "Shop-Easy",
    discount: 10,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: [],
    sizes: null,
    colors: null,
    tag: "Hot",
    stockQuantity: 12,
  },
  {
    id: 24,
    name: "Premium Running Shoes",
    description: "Premium Running Shoes",
    category: "sports",
    originalPrice: 1234,
    finalPrice: 1110.6,
    rating: 0,
    storeName: "Tech-Vault",
    discount: 10,
    storeLogoUrl: "string",
    reviewsCount: 0,
    imageUrls: [
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Products/products/1771519296337-0.8615801317422493-photo-1542291026-7eec264c27ff.jpg",
    ],
    sizes: null,
    colors: null,
    tag: "Hot",
    stockQuantity: 12,
  },
  {
    id: 25,
    name: "Special Coffee Beans ",
    description: "Smooth",
    category: "home & garden",
    originalPrice: 122,
    finalPrice: 120.78,
    rating: 0,
    storeName: "Shop-Easy",
    discount: 1,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: [
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Products/products/1771519884748-0.5882022153925813-photo-1517668808822-9ebb02f2a0e6.jpg",
    ],
    sizes: null,
    colors: null,
    tag: "New",
    stockQuantity: 12,
  },
  {
    id: 26,
    name: "Laptop Backpack Water Resistant",
    description: "",
    category: "clothing",
    originalPrice: 112,
    finalPrice: 98.56,
    rating: 0,
    storeName: "Shop-Easy",
    discount: 12,
    storeLogoUrl:
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Store/logos/1771509562000-0.19678124160442945-81V+xOw5D6L._SL1500_.jpg",
    reviewsCount: 0,
    imageUrls: [
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Products/products/1771520261893-0.8346332657626959-photo-1553062407-98eeb64c6a62.jpg",
      "https://aaimjjnjbyjayczwxzhy.supabase.co/storage/v1/object/public/Products/products/1771520264678-0.4359829890552538-photo-1517668808822-9ebb02f2a0e6.jpg",
    ],
    sizes: null,
    colors: null,
    tag: "Hot",
    stockQuantity: 120,
  },
];
const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const { userId } = getUserData();
  const { storeData, error, isLoading: StoreIsLoading } = useGetStore(userId);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
    storeId: 0,
    sizes: [],
    colors: [],
    discount: "",
    tag: "",
  });
  const {
    addProduct,
    error: addProductError,
    isLoading: isAddingProduct,
  } = useAddProduct();

  // Size and Color input states
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const categories = [
    "electronics",
    "clothing",
    "accessories",
    "home & garden",
    "sports",
    "books",
    "toys",
    "beauty",
    "fashion",
    "home",
  ];

  // Predefined tags
  const predefinedTags = [
    "New",
    "Hot",
    "Trending",
    "Best Seller",
    "Top Rated",
    "Popular",
    "50% OFF",
    "Hot Deal",
    "Limited Edition",
    "Flash Sale",
  ];

  // Predefined common sizes
  const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Predefined common colors
  const commonColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#00FF00" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Purple", hex: "#800080" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Gray", hex: "#808080" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle adding size
  const handleAddSize = (size) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));
      setSizeInput("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove),
    }));
  };

  // Handle adding color
  const handleAddColor = (color) => {
    if (color && !formData.colors.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== colorToRemove),
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Please select only image files (JPG, PNG, GIF, WebP)",
      }));
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Each image must be less than 5MB",
      }));
      return;
    }

    // Limit total images to 5
    if (images.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload maximum 5 images",
      }));
      return;
    }

    // Clear any previous errors
    setErrors((prev) => ({
      ...prev,
      images: "",
    }));

    // Add new images
    setImages((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input value
    e.target.value = "";
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Set primary image (move to first position)
  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;

    const newImages = [...images];
    const newPreviews = [...imagePreviewUrls];

    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
    [newPreviews[0], newPreviews[index]] = [newPreviews[index], newPreviews[0]];

    setImages(newImages);
    setImagePreviewUrls(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "Valid stock quantity is required";
    }

    if (
      formData.discount &&
      (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare product data with images
      const productData = {
        ...formData,
        images: images,
        storeId: storeData ? storeData.id : null,
        userId,
      };

      console.log("Product Data:", productData);

      addProduct(productData);
      //console.log("Product created successfully:", productData);

      // Navigate to products list
      //;
    } catch (error) {
      console.error("Error creating product:", error);
      setErrors({
        submit: error.message || "Failed to add product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl">🛍️</span>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Shop-Easy
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Link
                  to="/vendor/dashboard"
                  className="hover:text-orange-600 transition-colors"
                >
                  Dashboard
                </Link>
                <span>→</span>
                <Link
                  to="/vendor/products"
                  className="hover:text-orange-600 transition-colors"
                >
                  Products
                </Link>
                <span>→</span>
                <span className="text-gray-900 font-semibold">Add Product</span>
              </div>
            </div>
            <Link
              to="/vendor/products"
              className="text-gray-700 hover:text-orange-600 font-semibold text-sm transition-colors"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>➕</span>
              Add New Product
            </h1>
            <p className="text-gray-600">
              Fill in the details to add a new product to your store
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300 resize-none"
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.category
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Price, Discount & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.price
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      step="1"
                      min="0"
                      max="100"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.discount
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      %
                    </span>
                  </div>
                  {errors.discount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.discount}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="stockQuantity"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.stockQuantity
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                    }`}
                  />
                  {errors.stockQuantity && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {errors.stockQuantity}
                    </p>
                  )}
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Tag (Optional)
                </label>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, tag }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          formData.tag === tag
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="Or enter custom tag"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sizes (Optional)
                </label>

                {/* Common Sizes Quick Add */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleAddSize(size)}
                        disabled={formData.sizes.includes(size)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          formData.sizes.includes(size)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Size Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSize(sizeInput))
                    }
                    placeholder="Add custom size (e.g., 32, 34, 36)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSize(sizeInput)}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Sizes */}
                {formData.sizes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-semibold"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(size)}
                          className="hover:text-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Colors (Optional)
                </label>

                {/* Common Colors Quick Add */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleAddColor(color.name)}
                        disabled={formData.colors.includes(color.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          formData.colors.includes(color.name)
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        ></span>
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddColor(colorInput))
                    }
                    placeholder="Add custom color (e.g., Navy Blue, Forest Green)"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-200 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddColor(colorInput)}
                    disabled={isAddingProduct}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Colors */}
                {formData.colors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="hover:text-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images *{" "}
                  {imagePreviewUrls.length > 0 &&
                    `(${imagePreviewUrls.length}/5)`}
                </label>

                {/* Upload Button */}
                <div className="mb-4">
                  <label
                    htmlFor="images"
                    className={`inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                      errors.images
                        ? "border-red-500 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-orange-500"
                    }`}
                  >
                    <span className="text-2xl">📸</span>
                    <span className="font-semibold text-gray-700">
                      {imagePreviewUrls.length === 0
                        ? "Upload Images"
                        : "Add More Images"}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imagePreviewUrls.length >= 5}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload up to 5 images • JPG, PNG, GIF, WebP • Max 5MB each •
                    Recommended: 800x800px
                  </p>
                </div>

                {/* Error Message */}
                {errors.images && (
                  <p className="mb-4 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.images}
                  </p>
                )}

                {/* Image Previews Grid */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-all duration-300"
                      >
                        {/* Image */}
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            Primary
                          </div>
                        )}

                        {/* Overlay with Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          {/* Set as Primary Button */}
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              className="bg-white text-gray-900 p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-300"
                              title="Set as primary image"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-300"
                            title="Remove image"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Image Number */}
                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  to="/vendor/products"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg text-center transition-all duration-300"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <span>➕</span>
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

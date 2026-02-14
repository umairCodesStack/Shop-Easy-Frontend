import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setLoading(true);

    // Simulate loading cart from localStorage or API
    // Replace with actual cart data from your backend
    const mockCartItems = [
      {
        id: 1,
        name: "Wireless Noise Cancelling Headphones",
        price: 79.99,
        originalPrice: 129.99,
        quantity: 2,
        size: "Medium",
        color: "Black",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        storeName: "TechVault Store",
        storeId: 1,
        inStock: true,
        stockCount: 45,
      },
      {
        id: 2,
        name: "Smart Fitness Watch Pro",
        price: 199.99,
        originalPrice: 299.99,
        quantity: 1,
        size: "Large",
        color: "Silver",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        storeName: "Gadget Hub",
        storeId: 2,
        inStock: true,
        stockCount: 20,
      },
      {
        id: 3,
        name: "Premium Running Shoes",
        price: 89.99,
        originalPrice: 149.99,
        quantity: 1,
        size: "X-Large",
        color: "Blue",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        storeName: "Sports Arena",
        storeId: 3,
        inStock: true,
        stockCount: 15,
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 500);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stockCount) }
          : item,
      ),
    );
  };

  const removeItem = (itemId) => {
    if (
      window.confirm("Are you sure you want to remove this item from cart?")
    ) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId),
      );
    }
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setCartItems([]);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.originalPrice) {
        return sum + (item.originalPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 9.99;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your cart...</p>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-primary-600">
                Home
              </Link>
              <span>›</span>
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </div>
          </div>
        </div>

        {/* Empty Cart Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-12 text-center">
            <span className="text-8xl mb-6 block">🛒</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. Start
              shopping and discover amazing products!
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Shopping Cart
              </h1>
              <p className="text-white/90">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300 backdrop-blur-sm border border-white/30"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Group items by store */}
            {Object.entries(
              cartItems.reduce((acc, item) => {
                if (!acc[item.storeName]) {
                  acc[item.storeName] = [];
                }
                acc[item.storeName].push(item);
                return acc;
              }, {}),
            ).map(([storeName, storeItems]) => (
              <div
                key={storeName}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Store Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b flex items-center gap-2">
                  <span className="text-2xl">🏪</span>
                  <Link
                    to={`/stores/${storeItems[0].storeId}`}
                    className="font-bold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {storeName}
                  </Link>
                </div>

                {/* Store Items */}
                <div className="divide-y">
                  {storeItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <Link
                          to={`/products/${item.id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-primary-500 transition-colors duration-300"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            className="font-bold text-lg text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2"
                          >
                            {item.name}
                          </Link>

                          {/* Variants */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            {item.color && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Color:</span>{" "}
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Size:</span>{" "}
                                {item.size}
                              </span>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                              <span className="text-2xl font-bold text-primary-600">
                                ${item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Quantity and Remove */}
                            <div className="flex items-center gap-4">
                              {/* Quantity Selector */}
                              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 font-bold"
                                >
                                  -
                                </button>
                                <span className="px-6 py-2 font-bold min-w-[60px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= item.stockCount}
                                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-300"
                                title="Remove item"
                              >
                                <svg
                                  className="w-6 h-6"
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
                          </div>

                          {/* Stock Warning */}
                          {item.quantity >= item.stockCount && (
                            <p className="text-sm text-red-600 mt-2">
                              ⚠️ Maximum stock reached ({item.stockCount}{" "}
                              available)
                            </p>
                          )}

                          {/* Item Total */}
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-sm text-gray-600">
                              Item Total:{" "}
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-300"
            >
              <span>←</span>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
                Order Summary
              </h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-semibold">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>

                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-semibold">
                      -${calculateSavings().toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span className="flex items-center gap-1">
                    Shipping
                    {calculateShipping() === 0 && (
                      <span className="text-xs text-green-600 font-semibold">
                        (FREE)
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">
                    {calculateShipping() === 0
                      ? "FREE"
                      : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>

                {calculateSubtotal() < 50 && calculateShipping() > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    💡 Add ${(50 - calculateSubtotal()).toFixed(2)} more for
                    FREE shipping!
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">
                    ${calculateTax().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-primary-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Security Badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Money-back guarantee</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  We Accept
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">
                    💳 VISA
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">
                    💳 MasterCard
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">
                    💳 PayPal
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">
                    💳 Amex
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

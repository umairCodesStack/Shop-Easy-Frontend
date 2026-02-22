import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import OrderSummary from "../components/orders/OrderSummary";
import Navbar from "../components/common/Navbar";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart: removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  // Group items by store
  const groupedByStore = cartItems.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = {
        storeName: item.storeName,
        storeId: item.storeId,
        items: [],
      };
    }
    acc[item.storeId].items.push(item);
    return acc;
  }, {});

  const storeGroups = Object.values(groupedByStore);

  // Calculate overall totals
  const calculateOverallTotal = () => {
    return storeGroups.reduce((total, group) => {
      const subtotal = group.items.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0,
      );
      const shipping = subtotal >= 50 ? 0 : 9.99;
      const tax = subtotal * 0.1;
      return total + subtotal + shipping + tax;
    }, 0);
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

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
      <Navbar />
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
                from {storeGroups.length}{" "}
                {storeGroups.length === 1 ? "store" : "stores"}
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
            {storeGroups.map((group) => (
              <div
                key={group.storeId}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Store Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b flex items-center gap-2">
                  <span className="text-2xl">🏪</span>
                  <Link
                    to={`/stores/${group.storeId}`}
                    className="font-bold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {group.storeName}
                  </Link>
                  <span className="ml-auto text-sm text-gray-600">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Store Items */}
                <div className="divide-y">
                  {group.items.map((item) => (
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
                            src={
                              item.imageUrl || "https://via.placeholder.com/400"
                            }
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
                            {item.colors && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Color:</span>{" "}
                                {item.colors}
                              </span>
                            )}
                            {item.sizes && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">Size:</span>{" "}
                                {item.sizes}
                              </span>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                              <span className="text-2xl font-bold text-primary-600">
                                ${item.finalPrice}
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
                                    updateQuantity(
                                      item.cartItemId || item.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  -
                                </button>
                                <span className="px-6 py-2 font-bold min-w-[60px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId || item.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  disabled={item.quantity >= item.stockQuantity}
                                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() =>
                                  removeItem(item.cartItemId || item.id)
                                }
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
                              ${(item.finalPrice * item.quantity).toFixed(2)}
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

          {/* Order Summaries Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Individual Store Order Summaries */}
              {storeGroups.map((group) => (
                <OrderSummary
                  key={group.storeId}
                  storeName={group.storeName}
                  storeId={group.storeId}
                  storeItems={group.items}
                />
              ))}

              {/* Overall Total (if multiple stores) */}
              {storeGroups.length > 1 && (
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl shadow-lg p-6 border-2 border-primary-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Overall Cart Total
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">
                      Total for all stores
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${calculateOverallTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Note: Separate orders will be placed for each store
                  </p>
                </div>
              )}

              {/* Security Badges */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Secure Shopping
                </h3>
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
    </div>
  );
};

export default CartPage;

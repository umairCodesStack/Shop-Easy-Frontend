import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { getUserData } from "../utils/jwtUtils";
import { useAddOrder } from "../hooks/useAddOrder";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeFromCart } = useCart();

  // Get store-specific checkout data from OrderSummary
  const checkoutData = location.state;

  useEffect(() => {
    if (!checkoutData || !checkoutData.items) {
      navigate("/cart");
    }
  }, [checkoutData, navigate]);

  if (!checkoutData || !checkoutData.items) {
    return null;
  }

  const { storeId, storeName, items: checkoutItems } = checkoutData;
  const userData = getUserData();

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
  });

  const [paymentMethod] = useState("cod"); // Only COD available
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Load saved shipping info from localStorage
  // useEffect(() => {
  //   const savedShipping = localStorage.getItem("shippingInfo");
  //   if (savedShipping) {
  //     try {
  //       const parsed = JSON.parse(savedShipping);
  //       setShippingInfo((prev) => ({ ...prev, ...parsed }));
  //     } catch (error) {
  //       console.error("Error parsing saved shipping info:", error);
  //     }
  //   }
  // }, []);

  const { mutate: createOrder, isLoading } = useAddOrder();

  // Calculate totals
  const calculateSubtotal = () => {
    return checkoutItems.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );
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

  const getTotalItems = () => {
    return checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Shipping validation
    if (!shippingInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!shippingInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsProcessing(true);

    try {
      // Save shipping info for future use
      //localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

      const { userId } = getUserData();

      // Prepare order data for single store
      const orderData = {
        customerId: userId,
        customerName: shippingInfo.fullName,
        customerPhone: shippingInfo.phone,
        customerEmail: shippingInfo.email,
        vendorId: checkoutItems[0].vendorId,
        orderItems: checkoutItems.map((item) => ({
          productId: item.id,
          productName: item.productName || item.name,
          productColor: item.selectedColor || item.colors || "",
          productSize: item.selectedSize || item.sizes || "",
          productImageUrl: item.imageUrl || "",
          productFinalPrice: item.finalPrice,
          quantity: item.quantity,
        })),
        orderDate: new Date().toISOString(),
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        paymentMethod: "cod",
        shippingCost: calculateShipping(),
        totalPrice: calculateTotal(),
        taxPrice: calculateTax(),
      };

      // Send order to backend API
      createOrder(orderData, {
        onSuccess: () => {
          // Remove items from cart
          checkoutItems.forEach((item) => {
            removeFromCart(item.cartItemId || item.id);
          });

          // Navigate to success page or orders page
          toast.success("Order placed successfully!");
          navigate("/my-orders");
        },
        onError: (error) => {
          console.error("Error placing order:", error);
          toast.error(
            error.message || "Failed to place order. Please try again.",
          );
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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
            <Link to="/cart" className="hover:text-primary-600">
              Cart
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Secure Checkout
          </h1>
          <p className="text-white/90">
            Checkout from <strong>{storeName}</strong> • {getTotalItems()}{" "}
            {getTotalItems() === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">📦</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="(123) 456-7890"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123 Main Street, Apt 4B"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        errors.zipCode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Pakistan">Pakistan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">💳</span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                {/* Payment Method Selection - COD Only */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center p-4 border-2 border-primary-500 bg-primary-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={true}
                      readOnly
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="ml-3 font-semibold text-gray-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="ml-auto text-2xl">💵</span>
                  </label>
                </div>

                {/* COD Information */}
                <div className="border-t pt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm mb-2">
                      💡 <strong>Cash on Delivery</strong>
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1 ml-4 list-disc">
                      <li>Payment will be collected at delivery time</li>
                      <li>Please keep exact amount ready</li>
                      <li>Inspect your order before making payment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Store Order Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                    <span className="text-xl">🏪</span>
                    <h3 className="font-bold text-gray-900">{storeName}</h3>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
                    {checkoutItems.map((item) => (
                      <div
                        key={item.cartItemId || item.id}
                        className="flex gap-3"
                      >
                        <img
                          src={
                            item.imageUrl || "https://via.placeholder.com/80"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                            {item.name || item.productName}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {item.selectedColor || item.colors || "N/A"} •{" "}
                            {item.selectedSize || item.sizes || "N/A"}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-bold text-primary-600">
                              ${(item.finalPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {calculateShipping() === 0
                          ? "FREE"
                          : `$${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (10%)</span>
                      <span className="font-semibold">
                        ${calculateTax().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-primary-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing || isLoading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing || isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>🔒</span>
                      Place Order
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Secure Order Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Cash on Delivery Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Easy Returns & Refunds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

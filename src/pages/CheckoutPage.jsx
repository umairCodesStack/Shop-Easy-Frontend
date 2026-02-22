import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { getUserData } from "../utils/jwtUtils";
import { useAddOrder } from "../hooks/useAddOrder";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeFromCart } = useCart();

  // Get store-specific checkout data from OrderSummary
  const checkoutData = location.state;

  if (!checkoutData || !checkoutData.items) {
    // Redirect if no checkout data
    useEffect(() => {
      navigate("/cart");
    }, []);
    return null;
  }

  const { storeId, storeName, items: checkoutItems } = checkoutData;

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Load saved shipping info from localStorage
  useEffect(() => {
    const savedShipping = localStorage.getItem("shippingInfo");
    if (savedShipping) {
      setShippingInfo(JSON.parse(savedShipping));
    }
  }, []);
  const { mutate: createOrder, isLoading, error } = useAddOrder();
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
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
      newErrors.email = "Email is invalid";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";

    // Payment validation (if credit card)
    if (paymentMethod === "credit-card") {
      if (!paymentInfo.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      else if (paymentInfo.cardNumber.replace(/\s/g, "").length !== 16)
        newErrors.cardNumber = "Card number must be 16 digits";
      if (!paymentInfo.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
      if (!paymentInfo.expiryDate.trim())
        newErrors.expiryDate = "Expiry date is required";
      if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required";
      else if (paymentInfo.cvv.length !== 3)
        newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    setIsProcessing(true);

    try {
      // Save shipping info for future use
      localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

      // Get user ID from localStorage or context
      const { userId } = getUserData();
      console.log("User ID", userId);
      //const userId = user?.id || 1;
      //const token = localStorage.getItem("token");
      console.log("Check out Items", checkoutItems);
      // Prepare order data for single store - MATCH BACKEND API
      const orderData = {
        customerId: userId,
        customerName: shippingInfo.fullName,
        customerPhone: shippingInfo.phone,
        customerEmail: shippingInfo.email,
        vendorId: checkoutItems[0].vendorId,
        orderItems: checkoutItems.map((item) => ({
          productId: item.id,
          productName: item.productName,
          productColor: item.selectedColor || item.colors || "",
          productSize: item.selectedSize || item.sizes || "",
          productImageUrl: item.imageUrl || "",
          productFinalPrice: item.finalPrice,
          quantity: item.quantity,
        })),
        orderDate: new Date().toISOString(),
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        paymentMethod: paymentMethod,
        shippingCost: calculateShipping(),
        totalPrice: calculateTotal(),
        taxPrice: calculateTax(),
      };

      console.log("Order to be placed:", orderData);

      // Send order to backend API
      createOrder(orderData);

      // Remove items from cart (only items from this store)
      checkoutItems.forEach((item) => {
        removeFromCart(item.cartItemId || item.id);
      });

      // Navigate to success page
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`Failed to place order: ${error.message}`);
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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setPaymentInfo((prev) => ({ ...prev, [name]: formattedValue }));
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

                {/* Payment Method Selection */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="ml-3 font-semibold">
                      Credit / Debit Card
                    </span>
                    <div className="ml-auto flex gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        VISA
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        MC
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        AMEX
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="ml-3 font-semibold">PayPal</span>
                    <span className="ml-auto text-2xl">💙</span>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-600"
                    />
                    <span className="ml-3 font-semibold">Cash on Delivery</span>
                    <span className="ml-auto text-2xl">💵</span>
                  </label>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === "credit-card" && (
                  <div className="border-t pt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                          errors.cardName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="JOHN DOE"
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cardName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                            errors.expiryDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                            errors.cvv ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="border-t pt-6">
                    <p className="text-gray-600 text-center">
                      You will be redirected to PayPal to complete your purchase
                      securely.
                    </p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="border-t pt-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        💡 <strong>Note:</strong> Payment will be collected in
                        cash at the time of delivery. Please keep the exact
                        amount ready.
                      </p>
                    </div>
                  </div>
                )}
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
                  <div className="space-y-3 mb-4">
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
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {item.selectedColor || item.colors} •{" "}
                            {item.selectedSize || item.sizes}
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
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
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
                      <span>SSL Encrypted Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>100% Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Money-back Guarantee</span>
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

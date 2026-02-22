import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, orderNumber } = location.state || {};

  // Redirect if no order data
  React.useEffect(() => {
    if (!orders) {
      navigate("/");
    }
  }, [orders, navigate]);

  if (!orders) return null;

  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-primary-600">
                {orderNumber}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
              >
                View Orders
              </Link>
              <Link
                to="/products"
                className="bg-white border-2 border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <span className="text-2xl">🏪</span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {order.storeName}
                  </h3>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <img
                        src={
                          item.productImageUrl ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.productColor} • {item.productSize}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </span>
                          <span className="font-bold text-primary-600">
                            ${item.productFinalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0
                        ? "FREE"
                        : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-primary-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Shipping Address
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.fullName}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                    <br />
                    {order.shippingAddress.country}
                    <br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Email Confirmation */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <p className="text-blue-800 text-center">
              📧 A confirmation email has been sent to your email address with
              order details and tracking information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

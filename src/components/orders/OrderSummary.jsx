import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ storeName, storeId, storeItems }) => {
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return storeItems.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0,
    );
  };

  const calculateSavings = () => {
    return storeItems.reduce((sum, item) => {
      if (item.originalPrice) {
        return sum + (item.originalPrice - item.finalPrice) * item.quantity;
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

  const getTotalItems = () => {
    return storeItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    // Navigate to checkout with store-specific data
    navigate("/checkout", {
      state: {
        storeId,
        storeName,
        items: storeItems,
        orderSummary: {
          subtotal: calculateSubtotal(),
          savings: calculateSavings(),
          shipping: calculateShipping(),
          tax: calculateTax(),
          total: calculateTotal(),
        },
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Store Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <span className="text-2xl">🏪</span>
        <h2 className="text-xl font-bold text-gray-900">{storeName}</h2>
      </div>

      {/* Summary Items */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>
            Subtotal ({getTotalItems()}{" "}
            {getTotalItems() === 1 ? "item" : "items"})
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
            💡 Add ${(50 - calculateSubtotal()).toFixed(2)} more for FREE
            shipping!
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <span>Tax (10%)</span>
          <span className="font-semibold">${calculateTax().toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Order Total</span>
          <span className="text-2xl font-bold text-primary-600">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg"
      >
        Checkout from {storeName}
      </button>
    </div>
  );
};

export default OrderSummary;

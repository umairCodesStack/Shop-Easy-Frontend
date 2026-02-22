import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getUserData } from "../utils/jwtUtils";
import useGetCustomerOrders from "../hooks/useCustomerOrders";
//import { cancelOrder } from "../services/orderApi";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const navigate = useNavigate();
  const userData = getUserData();

  // Redirect if not logged in
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetCustomerOrders(userData?.userId);

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "refunded":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    // try {
    //   await cancelOrder(selectedOrder.id, cancelReason);
    //   alert("Order cancelled successfully");
    //   setShowCancelModal(false);
    //   setCancelReason("");
    //   setSelectedOrder(null);
    //   refetch(); // Refresh orders list
    // } catch (error) {
    //   alert("Failed to cancel order. Please try again.");
    //   console.error("Cancel order error:", error);
    // }
  };

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const orderId = `ORD-${order.id}`;
    const matchesSearch =
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort orders by date (newest first)
  const sortedOrders = filteredOrders?.sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
  );

  // Pagination
  const totalOrders = sortedOrders?.length || 0;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = sortedOrders?.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const orderStats = {
    total: orders?.length || 0,
    pending:
      orders?.filter((o) => o.status?.toLowerCase() === "pending").length || 0,
    processing:
      orders?.filter((o) => o.status?.toLowerCase() === "processing").length ||
      0,
    shipped:
      orders?.filter((o) => o.status?.toLowerCase() === "shipped").length || 0,
    delivered:
      orders?.filter((o) => o.status?.toLowerCase() === "delivered").length ||
      0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">
              Loading Your Orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <span className="text-6xl block mb-4">⚠️</span>
            <p className="text-lg font-semibold text-red-600">
              Error loading orders
            </p>
            <p className="text-sm text-red-500 mt-2">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-primary-100">
                Track and manage all your orders
              </p>
            </div>
            <div className="hidden md:block text-6xl">📦</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-2xl font-bold text-gray-900">
              {orderStats.total}
            </p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-2xl font-bold text-yellow-600">
              {orderStats.pending}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-2xl font-bold text-blue-600">
              {orderStats.processing}
            </p>
            <p className="text-sm text-gray-600">Processing</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🚚</div>
            <p className="text-2xl font-bold text-purple-600">
              {orderStats.shipped}
            </p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-2xl font-bold text-green-600">
              {orderStats.delivered}
            </p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID or Store name..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          {totalOrders > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(endIndex, totalOrders)}
                </span>{" "}
                of <span className="font-semibold">{totalOrders}</span> orders
              </p>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {paginatedOrders && paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          ORD-{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                            order.status,
                          )} flex items-center gap-1`}
                        >
                          <span>{getStatusIcon(order.status)}</span>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <p>
                          📅{" "}
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        {order.storeName && <p>🏪 {order.storeName}</p>}
                      </div>
                    </div>

                    {/* Order Amount */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary-600">
                        $
                        {(
                          order.totalPrice + (order.shipppingPrice || 0)
                        ).toFixed(2)}
                      </p>
                      {order.paymentStatus && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getPaymentStatusColor(
                            order.paymentStatus,
                          )}`}
                        >
                          💳 {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📦</span>
                    Order Items ({order.products?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {order.products?.slice(0, 2).map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        {product.productImageUrl && (
                          <img
                            src={product.productImageUrl}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {product.productName}
                          </p>
                          <div className="flex gap-3 text-sm text-gray-600 mt-1">
                            <p>Qty: {product.quantity}</p>
                            {product.productColor && (
                              <p>• {product.productColor}</p>
                            )}
                            {product.productSize && (
                              <p>• {product.productSize}</p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">
                          $
                          {(
                            product.productFinalPrice * product.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {order.products?.length > 2 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        +{order.products.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  {order.address && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        📍 Shipping Address
                      </p>
                      <p className="text-sm text-gray-600">{order.address}</p>
                    </div>
                  )}

                  {/* Tracking Number */}
                  {order.trackingNumber && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ���� Tracking Number
                      </p>
                      <p className="text-sm font-mono text-purple-600 font-semibold">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="flex-1 min-w-[150px] bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300"
                    >
                      View Details
                    </button>

                    {order.status?.toLowerCase() === "shipped" &&
                      order.trackingNumber && (
                        <button className="flex-1 min-w-[150px] bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300">
                          Track Order
                        </button>
                      )}

                    {(order.status?.toLowerCase() === "pending" ||
                      order.status?.toLowerCase() === "processing") && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="flex-1 min-w-[150px] bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300"
                      >
                        Cancel Order
                      </button>
                    )}

                    {order.status?.toLowerCase() === "delivered" && (
                      <button className="flex-1 min-w-[150px] bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300">
                        Download Invoice
                      </button>
                    )}

                    <button className="flex-1 min-w-[150px] bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold transition-colors duration-300">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <span className="text-6xl block mb-4">📦</span>
              <p className="text-xl font-semibold text-gray-600 mb-2">
                No orders found
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Start shopping to see your orders here"}
              </p>
              <Link
                to="/products"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalOrders > 0 && totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary-300"
                >
                  ← Previous
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === pageNum
                            ? "bg-primary-500 text-white shadow-md"
                            : "border-2 border-gray-200 hover:bg-gray-50 hover:border-primary-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary-300"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cancel Order
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold">ORD-{selectedOrder.id}</span>?
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you're cancelling..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details - ORD-{selectedOrder.id}
              </h2>
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Status and Date */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(
                      selectedOrder.status,
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.orderDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {product.productImageUrl && (
                        <img
                          src={product.productImageUrl}
                          alt={product.productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {product.productName}
                        </p>
                        <div className="flex gap-3 text-sm text-gray-600 mt-1">
                          <p>Quantity: {product.quantity}</p>
                          {product.productColor && (
                            <p>• {product.productColor}</p>
                          )}
                          {product.productSize && (
                            <p>• {product.productSize}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          $
                          {(
                            product.productFinalPrice * product.quantity
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${product.productFinalPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${selectedOrder.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  {selectedOrder.shipppingPrice > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-semibold">
                        ${selectedOrder.shipppingPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      $
                      {(
                        selectedOrder.totalPrice +
                        (selectedOrder.shipppingPrice || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.address && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Shipping Address
                  </h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-700">{selectedOrder.address}</p>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {selectedOrder.paymentMethod && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Payment Information
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-semibold uppercase">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    {selectedOrder.paymentStatus && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600">Payment Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                            selectedOrder.paymentStatus,
                          )}`}
                        >
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

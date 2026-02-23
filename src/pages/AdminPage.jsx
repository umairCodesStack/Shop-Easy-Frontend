import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Status options your backend supports
const statusOptions = ["active", "inactive", "blocked"];

// Mock stores data
const MOCK_STORES = [
  {
    id: 1,
    name: "TechVault Store",
    ownerId: "34",
    description: "Premium electronics and gadgets",
    logoUrl: "https://via.placeholder.com/44",
    logo: "💻",
    status: "active",
    email: "techvault@example.com",
    phone: "+1-123-456-7890",
    address: "123 Tech Ave, Silicon Valley, CA",
  },
  {
    id: 2,
    name: "Fashion Gallery",
    ownerId: "21",
    description: "Trendy fashion for everyone",
    logoUrl: "",
    logo: "👗",
    status: "inactive",
    email: "fashiongallery@example.com",
    phone: "+1-987-654-3210",
    address: "456 Style Street, New York, NY",
  },
  {
    id: 3,
    name: "Sports Arena",
    ownerId: "49",
    description: "Quality sports equipment",
    logoUrl: "",
    logo: "⚽",
    status: "blocked",
    email: "sportsarena@example.com",
    phone: "+1-555-555-5555",
    address: "789 Champion Blvd, Austin, TX",
  },
];

const AdminPage = () => {
  const [stores, setStores] = useState(MOCK_STORES);
  const [selectedStore, setSelectedStore] = useState(null);

  const handleStatusUpdate = (storeId, status) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId ? { ...store, status } : store,
      ),
    );
  };

  const handleDelete = (storeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone.",
      )
    ) {
      setStores((prev) => prev.filter((store) => store.id !== storeId));
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Admin: Manage Stores
          </h1>
          {stores && stores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 text-sm">
                    <th className="py-3 px-4">Store</th>
                    <th className="py-3 px-4">Owner ID</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b last:border-none">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {store.logoUrl ? (
                            <img
                              src={store.logoUrl}
                              alt={store.name}
                              className="w-10 h-10 rounded-full object-cover border"
                            />
                          ) : (
                            <span className="text-2xl">{store.logo}</span>
                          )}
                          <span className="font-semibold text-gray-900">
                            {store.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{store.ownerId}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {store.description}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={store.status}
                          onChange={(e) =>
                            handleStatusUpdate(store.id, e.target.value)
                          }
                          className="px-3 py-1 rounded-lg border border-gray-300 bg-gray-50 font-semibold
                            focus:ring-primary-500 focus:border-primary-500 transition-all"
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => setSelectedStore(store)}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all font-semibold"
                        >
                          Show Detail
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              No stores available.
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Store Detail Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setSelectedStore(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
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
            <div className="flex items-center gap-4 mb-6">
              {selectedStore.logoUrl ? (
                <img
                  src={selectedStore.logoUrl}
                  alt={selectedStore.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : (
                <span className="text-4xl">{selectedStore.logo}</span>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedStore.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-semibold">{selectedStore.status}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <div>
                <span className="font-semibold">Owner ID:</span>{" "}
                {selectedStore.ownerId}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {selectedStore.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {selectedStore.phone}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {selectedStore.address}
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {selectedStore.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;

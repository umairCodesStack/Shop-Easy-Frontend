import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
      // TODO: Implement actual newsletter subscription
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/90 mb-6 text-sm md:text-base">
              Get the latest deals, new arrivals, and exclusive offers delivered
              to your inbox!
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-4xl">🛍️</span>
              <span className="text-2xl font-bold text-white">Shop-Easy</span>
            </Link>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your one-stop marketplace for products from thousands of trusted
              vendors worldwide. Quality products, competitive prices, seamless
              shopping.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/stores"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Browse Stores
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Today's Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-primary-400 transition-colors duration-300 flex items-center gap-2"
                >
                  <span>›</span> Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📍</span>
                <div>
                  <p className="text-sm">123 Business Street</p>
                  <p className="text-sm">New York, NY 10001</p>
                  <p className="text-sm">United States</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary-400 transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <a
                  href="mailto:support@Shop-Easy.com"
                  className="hover:text-primary-400 transition-colors duration-300"
                >
                  support@Shop-Easy.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">🕐</span>
                <span className="text-sm">Mon - Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 pb-6">
          <div className="text-center mb-6">
            <h4 className="text-white font-semibold mb-4">We Accept</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-4 py-2 rounded-lg">
                <span className="text-2xl">💳</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">
                  VISA
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">
                  MasterCard
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">
                  PayPal
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">
                  Amex
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Shop-Easy. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="hover:text-primary-400 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary-400 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary-400 transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

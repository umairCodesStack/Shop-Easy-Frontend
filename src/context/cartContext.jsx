import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Helper function to generate unique cart item key
  const getCartItemKey = (product) => {
    const color = product.selectedColor || product.colors || "";
    const size = product.selectedSize || product.sizes || "";
    return `${product.id}-${color}-${size}`;
  };

  // Helper function to check if two items are the same (including variants)
  const isSameCartItem = (item1, item2) => {
    const color1 = item1.selectedColor || item1.colors || "";
    const size1 = item1.selectedSize || item1.sizes || "";
    const color2 = item2.selectedColor || item2.colors || "";
    const size2 = item2.selectedSize || item2.sizes || "";

    return item1.id === item2.id && color1 === color2 && size1 === size2;
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Find existing item with same id, color, and size
      const existingItem = prevItems.find((item) =>
        isSameCartItem(item, product),
      );

      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map((item) =>
          isSameCartItem(item, product)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      // Add new item with unique cartItemId
      const newItem = {
        ...product,
        cartItemId: getCartItemKey(product), // Unique identifier for cart item
        selectedColor: product.selectedColor || product.colors || null,
        selectedSize: product.selectedSize || product.sizes || null,
        quantity,
      };

      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        // Support both old (by id) and new (by cartItemId) removal
        return item.cartItemId
          ? item.cartItemId !== cartItemId
          : item.id !== cartItemId;
      }),
    );
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        // Support both old (by id) and new (by cartItemId) update
        const matches = item.cartItemId
          ? item.cartItemId === cartItemId
          : item.id === cartItemId;

        return matches ? { ...item, quantity } : item;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.finalPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Get items count (unique products, not quantity)
  const getUniqueItemsCount = () => {
    return cartItems.length;
  };

  // Check if a specific variant is in cart
  const isInCart = (product) => {
    return cartItems.some((item) => isSameCartItem(item, product));
  };

  // Get quantity of specific variant in cart
  const getItemQuantity = (product) => {
    const item = cartItems.find((item) => isSameCartItem(item, product));
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getUniqueItemsCount,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

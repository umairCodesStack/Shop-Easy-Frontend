// Set item with expiry
export const setItemWithExpiry = (key, value, expiryInMinutes) => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + expiryInMinutes * 60 * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

// Get item and check if expired
export const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    // Check if expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    // If parsing fails, remove the item
    localStorage.removeItem(key);
    return null;
  }
};

// Remove item
export const removeItem = (key) => {
  localStorage.removeItem(key);
};
export const setItemWithServerExpiry = (key, value, expiresAt) => {
  try {
    const item = {
      value: value,
      expiry: new Date(expiresAt).getTime(), // Convert ISO string to timestamp
    };

    localStorage.setItem(key, JSON.stringify(item));
    console.log(`✅ Stored ${key} in localStorage`);
  } catch (error) {
    console.error(`❌ Error storing ${key} in localStorage:`, error);
    throw error;
  }
};

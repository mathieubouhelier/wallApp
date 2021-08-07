export const saveToLocalStorage = (key, entry) => {
  localStorage.setItem(key, entry);
};
export const loadFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const deleteFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

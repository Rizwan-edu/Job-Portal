// src/api.js
const API_URL = 'http://localhost:5000/api/items';

export const getItems = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addItem = async (item) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
};

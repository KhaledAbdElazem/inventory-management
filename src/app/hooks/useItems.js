import { useState } from 'react';

const ITEMS_URL = '/api/items';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(ITEMS_URL);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      const res = await fetch(ITEMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: 'available' }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      await fetchItems();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateItem = async (id, item) => {
    try {
      const res = await fetch(`${ITEMS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to update item');
      await fetchItems();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${ITEMS_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      await fetchItems();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { items, loading, error, fetchItems, addItem, updateItem, deleteItem };
};

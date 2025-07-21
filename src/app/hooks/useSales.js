import { useState, useCallback } from 'react';

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sales');
      if (!response.ok) {
        throw new Error('Failed to fetch sales');
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSale = useCallback(async (saleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create sale');
      }

      const newSale = await response.json();
      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (error) {
      console.error('Error creating sale:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSale = useCallback(async (saleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sales', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: saleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete sale');
      }

      setSales(prev => prev.filter(sale => sale._id !== saleId));
    } catch (error) {
      console.error('Error deleting sale:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sales,
    loading,
    error,
    fetchSales,
    createSale,
    deleteSale,
  };
};

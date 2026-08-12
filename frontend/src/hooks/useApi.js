import { useState, useCallback } from 'react';

export function useApi(asyncFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        setData(result?.data?.data ?? result?.data ?? result);
        return result;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Request failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { data, loading, error, execute };
}
import { useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export const useLoadingState = <T = any>(initialData?: T) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    data: initialData || null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, isLoading: false, error: null }));
  }, []);

  const execute = useCallback(async <R>(
    asyncFunction: () => Promise<R>,
    onSuccess?: (data: R) => void,
    onError?: (error: Error) => void
  ): Promise<R> => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      setState(prev => ({ ...prev, data: result as any, isLoading: false, error: null }));
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      if (onError) onError(error as Error);
      throw error;
    }
  }, [setLoading, setError]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: initialData || null,
    });
  }, [initialData]);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    execute,
    reset,
  };
};

// Hook for managing multiple loading states
export const useMultipleLoadingStates = () => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});

  const getState = useCallback((key: string): LoadingState => {
    return states[key] || { isLoading: false, error: null, data: null };
  }, [states]);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], isLoading: loading, error: null }
    }));
  }, []);

  const setError = useCallback((key: string, error: string | null) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], error, isLoading: false }
    }));
  }, []);

  const setData = useCallback((key: string, data: any) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], data, isLoading: false, error: null }
    }));
  }, []);

  const execute = useCallback(async <R>(
    key: string,
    asyncFunction: () => Promise<R>,
    onSuccess?: (data: R) => void,
    onError?: (error: Error) => void
  ) => {
    setLoading(key, true);
    try {
      const result = await asyncFunction();
      setData(key, result);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(key, errorMessage);
      if (onError) onError(error as Error);
      throw error;
    }
  }, [setLoading, setData, setError]);

  const reset = useCallback((key: string) => {
    setStates(prev => ({
      ...prev,
      [key]: { isLoading: false, error: null, data: null }
    }));
  }, []);

  const resetAll = useCallback(() => {
    setStates({});
  }, []);

  return {
    getState,
    setLoading,
    setError,
    setData,
    execute,
    reset,
    resetAll,
  };
};

// Hook for pagination with loading states
export const usePaginatedLoading = <T>(
  fetchFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  limit = 10
) => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { isLoading, error, execute } = useLoadingState();

  const loadPage = useCallback(async (pageNumber: number, reset = false) => {
    try {
      const result = await execute(() => fetchFunction(pageNumber, limit));
      
      if (reset) {
        setItems(result.data);
      } else {
        setItems(prev => [...prev, ...result.data]);
      }
      
      setTotal(result.total);
      setHasMore(result.data.length === limit);
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to load page:', error);
    }
  }, [execute, fetchFunction, limit]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPage(page + 1, false);
    }
  }, [isLoading, hasMore, page, loadPage]);

  const reload = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [loadPage]);

  return {
    items,
    total,
    page,
    hasMore,
    isLoading,
    error,
    loadPage,
    loadMore,
    reload,
  };
};
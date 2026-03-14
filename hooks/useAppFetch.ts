import { useState, useCallback, useRef, useEffect } from 'react';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  url?: string; // Allow overriding the URL for pagination, etc.
  body?: any; // Allow object instead of just BodyInit
  immediate?: boolean; // Whether to fire the request on mount (defaults to true for GET requests)
  retries?: number; // Number of retries on failure
  retryDelay?: number; // Delay between retries in milliseconds
  cancelPrevious?: boolean; // Cancel ongoing request if a new one is triggered
  globalToastError?: boolean; // Show a global error on failure
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAppFetch<T = any>(url: string, defaultOptions: FetchOptions = {}) {
  const { immediate = defaultOptions.method === undefined || defaultOptions.method.toUpperCase() === 'GET' } = defaultOptions;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (overrideOptions: FetchOptions = {}) => {
      const mergedOptions = { ...defaultOptions, ...overrideOptions };
      const {
        method = 'GET',
        body,
        headers,
        retries = 0,
        retryDelay = 1000,
        cancelPrevious = true,
        globalToastError = true,
        ...restOptions
      } = mergedOptions;

      if (cancelPrevious && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const fetchWithRetry = async (currentAttempt: number): Promise<T> => {
        try {
          const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
          };
          
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
          }

          const mergedHeaders = {
            ...defaultHeaders,
            ...headers,
          };

          const response = await fetch(mergedOptions.url || url, {
            method,
            headers: mergedHeaders,
            body: body ? JSON.stringify(body) : undefined,
            signal: abortController.signal,
            ...restOptions,
          });

          if (!response.ok) {
            if (response.status === 401) {
              console.warn('Unauthorized request! Token might be expired.');
            }

            const errorData = await response.json().catch(() => ({}));
            const err = new Error(errorData.message || errorData.error || `HTTP Error ${response.status}: ${response.statusText}`);
            (err as any).status = response.status;
            throw err;
          }

         
          if (response.status === 204) {
            return {} as T;
          }

          return await response.json();
        } catch (error: any) {
          if (error.name === 'AbortError') {
            throw error;
          }
          
          if (currentAttempt < retries) {
            console.log(`[useAppFetch] Retrying request (${currentAttempt + 1}/${retries})...`);
            await new Promise((res) => setTimeout(res, retryDelay));
            return fetchWithRetry(currentAttempt + 1); 
          }
          
          throw error;
        }
      };

      try {
        const data = await fetchWithRetry(0);
        
        if (!abortController.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
        return data;
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          const errorMessage = error.message || 'An unknown error occurred';
          setState({ data: null, loading: false, error: errorMessage });
          
          if (globalToastError) {
            console.error(`[Global Error Toast]: ${errorMessage}`);
          }
        }
        throw error;
      }
    },
    [url, JSON.stringify(defaultOptions)]
  );
  
  useEffect(() => {
    if (immediate) {
      execute().catch(() => {}); 
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return { ...state, execute };
}

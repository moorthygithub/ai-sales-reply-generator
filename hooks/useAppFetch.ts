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

/**
 * useAppFetch
 * A centralized fetch hook for comprehensive API requests.
 * 
 * Includes features like:
 * - Auto-parsing JSON (both requests and responses)
 * - Automatic Authorization and Content-Type headers
 * - Retry logic for failed requests
 * - Cancellation of previous requests (AbortController)
 * - Centralized error handling
 * - Token refresh (stubbed for customizable logic)
 * 
 * Usage Example:
 * const { data, loading, error, execute } = useAppFetch('/api/users', {
 *   method: 'POST',
 *   body: { name: 'John Doe' },
 *   immediate: false, // Default is false for POST
 * });
 * 
 * // Later
 * <button onClick={() => execute()}>Submit</button>
 */
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

      // 1. Cancel previous pending request if a new one starts
      if (cancelPrevious && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const fetchWithRetry = async (currentAttempt: number): Promise<T> => {
        try {
          // 2. Automatically attach headers
          const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
          };
          
          // Optionally retrieve auth token here (localStorage, cookies, etc.)
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
          }

          // Merge headers
          const mergedHeaders = {
            ...defaultHeaders,
            ...headers,
          };

          const response = await fetch(mergedOptions.url || url, {
            method,
            headers: mergedHeaders,
            // 3. Handle JSON payload serialization
            body: body ? JSON.stringify(body) : undefined,
            signal: abortController.signal,
            ...restOptions,
          });

          // 4. Centralized Error Handling for HTTP errors
          if (!response.ok) {
            // Optional feature: Handling automatic token refresh
            if (response.status === 401) {
              // Perform token refresh logic here and potentially retry
              console.warn('Unauthorized request! Token might be expired.');
            }

            const errorData = await response.json().catch(() => ({}));
            const err = new Error(errorData.message || errorData.error || `HTTP Error ${response.status}: ${response.statusText}`);
            (err as any).status = response.status;
            throw err;
          }

          // Handle Responses
          if (response.status === 204) {
            return {} as T; // No content
          }

          // Handle JSON parsing for response
          return await response.json();
        } catch (error: any) {
          // Ignore state updates if aborted
          if (error.name === 'AbortError') {
            throw error;
          }
          
          // 5. Retry failed requests feature
          if (currentAttempt < retries) {
            console.log(`[useAppFetch] Retrying request (${currentAttempt + 1}/${retries})...`);
            await new Promise((res) => setTimeout(res, retryDelay));
            return fetchWithRetry(currentAttempt + 1); // Retry recursively
          }
          
          throw error;
        }
      };

      try {
        const data = await fetchWithRetry(0);
        
        // Prevent setting state if component unmounted or request was aborted
        if (!abortController.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
        return data;
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          const errorMessage = error.message || 'An unknown error occurred';
          setState({ data: null, loading: false, error: errorMessage });
          
          // 6. Global error notification / toast feature
          if (globalToastError) {
            // Example Integration: replace this console.error with your actual toast notification handler
            console.error(`[Global Error Toast]: ${errorMessage}`);
          }
        }
        throw error;
      }
    },
    // Adding stringified dependencies that are objects will ensure we don't infinitely re-render
    [url, JSON.stringify(defaultOptions)]
  );
  
  // Execute automatically on mount if immediate is true (e.g. initial GET)
  useEffect(() => {
    if (immediate) {
      execute().catch(() => {}); // Catch to avoid unhandled promise rejection in console
    }
    
    // Cleanup abort controllers on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return { ...state, execute };
}

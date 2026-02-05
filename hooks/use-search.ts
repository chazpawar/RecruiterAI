'use client';

import { useState, useCallback, useRef, useSyncExternalStore } from 'react';

interface UseSearchReturn {
  searchValue: string;
  debouncedValue: string;
  isSearching: boolean;
  handleSearchChange: (value: string) => void;
  clearSearch: () => void;
}

export const useSearch = (initialValue = '', debounceMs = 300): UseSearchReturn => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSearchingRef = useRef(false);
  
  // Use a simple subscription pattern for isSearching state
  const subscribersRef = useRef<Set<() => void>>(new Set());
  
  const getIsSearching = useCallback(() => isSearchingRef.current, []);
  const subscribe = useCallback((callback: () => void) => {
    subscribersRef.current.add(callback);
    return () => subscribersRef.current.delete(callback);
  }, []);
  
  const isSearching = useSyncExternalStore(subscribe, getIsSearching, getIsSearching);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set searching state
    isSearchingRef.current = true;
    subscribersRef.current.forEach(cb => cb());
    
    // Set debounce timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      isSearchingRef.current = false;
      subscribersRef.current.forEach(cb => cb());
    }, debounceMs);
  }, [debounceMs]);

  const clearSearch = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSearchValue('');
    setDebouncedValue('');
    isSearchingRef.current = false;
    subscribersRef.current.forEach(cb => cb());
  }, []);

  return {
    searchValue,
    debouncedValue,
    isSearching,
    handleSearchChange,
    clearSearch,
  };
};

export default useSearch;

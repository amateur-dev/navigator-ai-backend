import * as React from 'react'

/**
 * Custom hook for interacting with localStorage
 * Provides type-safe methods to get, set, and remove data from localStorage
 */
export const useLocalStorage = <T>(key: string) => {
  const setItem = React.useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Failed to save to localStorage
      }
    },
    [key]
  )

  const getItem = React.useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [key])

  const removeItem = React.useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Failed to remove from localStorage
    }
  }, [key])

  const hasItem = React.useCallback((): boolean => {
    try {
      return localStorage.getItem(key) !== null
    } catch {
      return false
    }
  }, [key])

  return {
    setItem,
    getItem,
    removeItem,
    hasItem
  }
}

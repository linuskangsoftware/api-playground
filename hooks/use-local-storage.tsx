"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setData(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [key])

  // Update localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(key, JSON.stringify(data))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    }
  }, [key, data, isLoaded])

  return { data, setData }
}

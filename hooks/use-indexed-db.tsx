"use client"

import { useState, useEffect } from "react"

const DB_NAME = "api-playground"
const DB_VERSION = 1

export function useIndexedDB<T>(storeName: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const [db, setDb] = useState<IDBDatabase | null>(null)

  // Initialize IndexedDB
  useEffect(() => {
    let isMounted = true

    const openDB = () => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores for all our data types if they don't exist
        if (!db.objectStoreNames.contains("history")) {
          db.createObjectStore("history")
        }
        if (!db.objectStoreNames.contains("savedRequests")) {
          db.createObjectStore("savedRequests")
        }
        if (!db.objectStoreNames.contains("envVars")) {
          db.createObjectStore("envVars")
        }
      }

      request.onsuccess = (event) => {
        if (!isMounted) return

        const database = (event.target as IDBOpenDBRequest).result
        setDb(database)

        try {
          // Make sure the store exists before trying to use it
          if (database.objectStoreNames.contains(storeName)) {
            const transaction = database.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const getRequest = store.get("data")

            getRequest.onsuccess = () => {
              if (!isMounted) return
              if (getRequest.result !== undefined) {
                setData(getRequest.result)
              }
              setIsLoaded(true)
            }

            getRequest.onerror = () => {
              if (!isMounted) return
              console.error("Error reading from IndexedDB:", getRequest.error)
              setIsLoaded(true)
            }
          } else {
            console.warn(`Object store ${storeName} not found, using initial value`)
            setIsLoaded(true)
          }
        } catch (error) {
          if (!isMounted) return
          console.error("Error accessing IndexedDB:", error)
          setIsLoaded(true)
        }
      }

      request.onerror = () => {
        if (!isMounted) return
        console.error("Error opening IndexedDB:", request.error)
        setIsLoaded(true)
      }
    }

    // Use setTimeout to ensure this runs after the component is mounted
    // This helps with SSR and hydration issues
    setTimeout(() => {
      if (typeof window !== "undefined" && window.indexedDB) {
        openDB()
      } else {
        setIsLoaded(true)
      }
    }, 0)

    return () => {
      isMounted = false
      if (db) {
        db.close()
      }
    }
  }, [storeName])

  // Update IndexedDB when data changes
  useEffect(() => {
    if (isLoaded && db) {
      try {
        // Make sure the store exists before trying to use it
        if (db.objectStoreNames.contains(storeName)) {
          const transaction = db.transaction(storeName, "readwrite")
          const store = transaction.objectStore(storeName)
          store.put(data, "data")
        } else {
          console.warn(`Cannot save to IndexedDB: Object store ${storeName} not found`)
        }
      } catch (error) {
        console.error("Error writing to IndexedDB:", error)
      }
    }
  }, [data, storeName, isLoaded, db])

  return { data, setData }
}

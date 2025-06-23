import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
   const [value, setValue] = useState<T>(() => {
      try {
         const item = localStorage.getItem(key);
         return item ? (JSON.parse(item) as T) : initialValue;
      } catch (error) {
         console.warn(`Error reading localStorage key "${key}":`, error);
         return initialValue;
      }
   });

   useEffect(() => {
      try {
         localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
         console.warn(`Error setting localStorage key "${key}":`, error);
      }
   }, [key, value]);

   return [value, setValue] as const;
}

export default useLocalStorage;

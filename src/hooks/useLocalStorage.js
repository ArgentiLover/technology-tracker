import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка чтения из localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorage = (e) => {
      try {
        if (!e) return;
        if (e.key === key) {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        }
      } catch (err) {
        console.error('Ошибка обработки storage event:', err);
      }
    };

    const handleCustom = (e) => {
      try {
        const detail = e && e.detail;
        if (detail && detail.key === key) {
          setStoredValue(detail.value);
        }
      } catch (err) {
        console.error('Ошибка обработки custom local-storage event:', err);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage', handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage', handleCustom);
    };
  }, [key, initialValue]);

  const setValue = (value) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
          console.error(`Ошибка записи в localStorage ключа "${key}":`, err);
        }
        try {
          window.dispatchEvent(new CustomEvent('local-storage', { detail: { key, value: valueToStore } }));
        } catch (err) {
          // ignore
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Ошибка при установке значения в useLocalStorage для ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
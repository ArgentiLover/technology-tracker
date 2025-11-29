import { useState, useEffect, useCallback } from 'react';

function useLanguagesApi() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Определяем URL API в зависимости от окружения
  const getApiUrl = () => {
    if (import.meta.env.DEV) {
      // В разработке используем CORS прокси
      return 'https://api.allorigins.win/raw?url=https://onecompiler.com/api/v1/languages';
    } else {
      // В продакшене используем наш Vercel function
      return 'https://technology-tracker-lpjeogrhy-danils-projects-e42892b9.vercel.app/api/languages';
    }
  };

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = getApiUrl();
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLanguages(data);

    } catch (err) {
      setError(`Ошибка загрузки: ${err.message}`);
      console.error('Ошибка загрузки языков:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    language.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  return {
    languages: filteredLanguages,
    allLanguages: languages,
    loading,
    error,
    refetch: fetchLanguages,
    searchTerm,
    setSearchTerm
  };
}

export default useLanguagesApi;
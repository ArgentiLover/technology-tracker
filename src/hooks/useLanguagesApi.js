import { useState, useEffect, useCallback } from 'react';

function useLanguagesApi() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Используем CORS прокси для разработки
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = 'https://onecompiler.com/api/v1/languages';
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      
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
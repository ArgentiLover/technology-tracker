import { useState, useEffect, useCallback } from 'react';

function useLanguagesApi() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'technology-tracker-qub80a674-danils-projects-e42892b9.vercel.app/api/languages';

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      setLanguages(data);

    } catch (err) {
      setError('Failed to load languages');
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
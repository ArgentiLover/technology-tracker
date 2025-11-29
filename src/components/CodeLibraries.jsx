import { useState } from 'react';
import usePlapi from '../hooks/useLanguagesApi';
import './CodeLibraries.css';

function CodeLibraries() {
  const [tagsFilter, setTagsFilter] = useState('');
  
  const buildQueryParams = () => {
    const params = [];
    
    if (tagsFilter) {
      params.push(`tags=${encodeURIComponent(tagsFilter)}`);
    }
    
    return params.length > 0 ? `?${params.join('&')}` : '';
  };

  const queryParams = buildQueryParams();
  const { data, loading, error, refetch } = usePlapi('libraries', queryParams);

  const handleAddLibrary = (library) => {
    const existingTech = JSON.parse(localStorage.getItem('techTrackerData') || '[]');
    
    const newTech = {
      id: Date.now(),
      title: library.name,
      description: library.description || `Библиотека ${library.name}`,
      status: 'not-started',
      notes: '',
      category: 'library',
      tags: library.tags,
      website: library.website
    };

    const updatedTech = [...existingTech, newTech];
    localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));
    
    alert(`Библиотека "${library.name}" добавлена в трекер!`);
    window.dispatchEvent(new Event('storage'));
  };

  const popularTags = ['web', 'database', 'testing', 'deployment', 'authentication', 'frontend', 'backend'];

  if (loading) {
    return (
      <div className="code-libraries loading">
        <div className="spinner"></div>
        <p>Загрузка библиотек...</p>
      </div>
    );
  }

  return (
    <div className="code-libraries">
      <h3>Библиотеки и фреймворки из Plapi API</h3>
      
      <div className="filters">
        <div className="filter-group">
          <label>Теги (через запятую):</label>
          <input
            type="text"
            placeholder="Например: web, database, testing"
            value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)}
            className="filter-input"
          />
          <div className="tags-suggestions">
            {popularTags.map(tag => (
              <button
                key={tag}
                onClick={() => setTagsFilter(tag)}
                className="tag-suggestion"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <button onClick={refetch} className="apply-filters-btn">
          Поиск
        </button>
        
        <button 
          onClick={() => setTagsFilter('')} 
          className="clear-filters-btn"
        >
          Сбросить
        </button>
      </div>

      {error && (
        <div className="error-message">
          Ошибка: {error}
        </div>
      )}

      <div className="libraries-results">
        {data?.results && (
          <>
            <h4>Найдено библиотек: {data.count}</h4>
            <div className="libraries-grid">
              {data.results.map(library => (
                <div key={library.id} className="library-card">
                  <div className="library-header">
                    <h5>{library.name}</h5>
                  </div>
                  
                  <p className="library-description">
                    {library.description || 'Описание отсутствует'}
                  </p>
                  
                  {library.tags && library.tags.length > 0 && (
                    <div className="library-tags">
                      {library.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="library-details">
                    {library.website && (
                      <span className="website">
                        <a href={library.website} target="_blank" rel="noopener noreferrer">
                          Сайт
                        </a>
                      </span>
                    )}
                  </div>
                  
                  <div className="library-actions">
                    <button 
                      onClick={() => handleAddLibrary(library)}
                      className="add-library-btn"
                    >
                      Добавить в трекер
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {data?.results?.length === 0 && !loading && (
          <div className="no-results">
            <p>По выбранным тегам ничего не найдено</p>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeLibraries;
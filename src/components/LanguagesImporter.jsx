import { useState } from 'react';
import useLanguagesApi from '../hooks/useLanguagesApi';
import './LanguagesImporter.css';

function LanguagesImporter() {
  const { languages, loading, error, refetch, searchTerm, setSearchTerm } = useLanguagesApi();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddLanguage = (language) => {
    const existingTech = JSON.parse(localStorage.getItem('techTrackerData') || '[]');
    
    const categoryMap = {
      'programming': 'language',
      'database': 'database'
    };

    const newTech = {
      id: Date.now(),
      title: language.name,
      description: `${language.name} - ${language.languageType === 'programming' ? 'Язык программирования' : 'База данных'}`,
      status: 'not-started',
      notes: '',
      category: categoryMap[language.languageType] || 'other',
      languageType: language.languageType,
      apiId: language.id
    };

    const updatedTech = [...existingTech, newTech];
    localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));
    
    alert(`Язык "${language.name}" добавлен в трекер!`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddMultiple = (langList) => {
    const existingTech = JSON.parse(localStorage.getItem('techTrackerData') || '[]');
    
    const newTechs = langList.map(language => {
      const categoryMap = {
        'programming': 'language',
        'database': 'database'
      };

      return {
        id: Date.now() + Math.random(),
        title: language.name,
        description: `${language.name} - ${language.languageType === 'programming' ? 'Язык программирования' : 'База данных'}`,
        status: 'not-started',
        notes: '',
        category: categoryMap[language.languageType] || 'other',
        languageType: language.languageType,
        apiId: language.id
      };
    });

    const updatedTech = [...existingTech, ...newTechs];
    localStorage.setItem('techTrackerData', JSON.stringify(updatedTech));
    
    alert(`Добавлено ${langList.length} языков в трекер!`);
    window.dispatchEvent(new Event('storage'));
  };

  const filteredLanguages = selectedCategory === 'all' 
    ? languages 
    : languages.filter(lang => lang.languageType === selectedCategory);

  const programmingCount = languages.filter(lang => lang.languageType === 'programming').length;
  const databaseCount = languages.filter(lang => lang.languageType === 'database').length;

  if (loading) {
    return (
      <div className="languages-importer loading">
        <div className="spinner"></div>
        <p>Загрузка языков программирования...</p>
      </div>
    );
  }

  return (
    <div className="languages-importer">
      <h3>Импорт языков программирования</h3>
      
      <div className="importer-stats">
        <div className="stat-item">
          <span className="stat-number">{languages.length}</span>
          <span className="stat-label">Всего языков</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{programmingCount}</span>
          <span className="stat-label">Языки программирования</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{databaseCount}</span>
          <span className="stat-label">Базы данных</span>
        </div>
      </div>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Поиск языков..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">Все категории</option>
          <option value="programming">Языки программирования</option>
          <option value="database">Базы данных</option>
        </select>

        <button onClick={refetch} className="refresh-btn">
          🔄
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
          <button onClick={refetch} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      )}

      <div className="bulk-actions">
        <button 
          onClick={() => handleAddMultiple(filteredLanguages.slice(0, 5))}
          disabled={filteredLanguages.length === 0}
          className="bulk-btn"
        >
          Добавить первые 5
        </button>
        <button 
          onClick={() => handleAddMultiple(filteredLanguages.filter(lang => 
            ['javascript', 'python', 'java', 'typescript', 'go'].includes(lang.id)
          ))}
          className="bulk-btn popular"
        >
          Добавить популярные
        </button>
      </div>

      <div className="languages-grid">
        {filteredLanguages.map(language => (
          <div key={language.id} className="language-card">
            <div className="language-header">
              <h4>{language.name}</h4>
              <span className={`language-badge ${language.languageType}`}>
                {language.languageType === 'programming' ? '💻' : '🗄️'}
                {language.languageType}
              </span>
            </div>
            
            <div className="language-id">ID: {language.id}</div>
            
            <div className="language-actions">
              <button 
                onClick={() => handleAddLanguage(language)}
                className="add-btn"
              >
                Добавить в трекер
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLanguages.length === 0 && searchTerm && (
        <div className="no-results">
          <p>По запросу "{searchTerm}" ничего не найдено</p>
        </div>
      )}
    </div>
  );
}

export default LanguagesImporter;
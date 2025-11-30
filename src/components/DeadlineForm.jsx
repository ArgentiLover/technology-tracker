import { useState, useEffect } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technologies, onUpdateDeadlines }) {
  const [selectedTech, setSelectedTech] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (selectedTech.length === 0) {
      newErrors.selectedTech = 'Выберите хотя бы одну технологию';
    }

    if (!deadline) {
      newErrors.deadline = 'Укажите дедлайн';
    } else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      }
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Валидация при изменении данных
  useEffect(() => {
    validateForm();
  }, [selectedTech, deadline]);

  // Обработчик выбора технологии
  const handleTechSelect = (techId) => {
    setSelectedTech(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isFormValid) {
      const updates = selectedTech.map(techId => ({
        techId,
        deadline
      }));
      
      onUpdateDeadlines(updates);
      
      // Сброс формы
      setSelectedTech([]);
      setDeadline('');
      setErrors({});
    }
  };

  // Выбор всех технологий
  const selectAllTechs = () => {
    setSelectedTech(technologies.map(tech => tech.id));
  };

  // Сброс выбора
  const clearSelection = () => {
    setSelectedTech([]);
  };

  return (
    <form onSubmit={handleSubmit} className="deadline-form" noValidate>
      <h2>Установка дедлайнов изучения</h2>

      {/* Область для скринридера */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {errors.selectedTech && `Ошибка выбора технологий: ${errors.selectedTech}`}
        {errors.deadline && `Ошибка дедлайна: ${errors.deadline}`}
      </div>

      {/* Список технологий для выбора */}
      <div className="form-section">
        <fieldset>
          <legend>
            Выберите технологии <span className="required">*</span>
          </legend>
          
          <div className="selection-actions">
            <button type="button" onClick={selectAllTechs} className="btn-outline">
              Выбрать все
            </button>
            <button type="button" onClick={clearSelection} className="btn-outline">
              Сбросить выбор
            </button>
          </div>

          <div 
            className={`tech-selection-grid ${errors.selectedTech ? 'error' : ''}`}
            aria-describedby={errors.selectedTech ? 'tech-error' : undefined}
          >
            {technologies.map(tech => (
              <label key={tech.id} className="tech-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTech.includes(tech.id)}
                  onChange={() => handleTechSelect(tech.id)}
                  aria-describedby={`tech-desc-${tech.id}`}
                />
                <span className="checkbox-custom"></span>
                <div className="tech-info">
                  <span className="tech-title">{tech.title}</span>
                  <span 
                    id={`tech-desc-${tech.id}`}
                    className="tech-status"
                  >
                    Статус: {tech.status === 'completed' ? '✅ Завершено' : 
                            tech.status === 'in-progress' ? '🔄 В процессе' : '⏳ Не начато'}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {errors.selectedTech && (
            <span id="tech-error" className="error-message" role="alert">
              {errors.selectedTech}
            </span>
          )}
        </fieldset>
      </div>

      {/* Поле дедлайна */}
      <div className="form-section">
        <label htmlFor="deadline" className="required">
          Дедлайн изучения
        </label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={errors.deadline ? 'error' : ''}
          aria-required="true"
          aria-invalid={!!errors.deadline}
          aria-describedby={errors.deadline ? 'deadline-error' : undefined}
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.deadline && (
          <span id="deadline-error" className="error-message" role="alert">
            {errors.deadline}
          </span>
        )}
      </div>

      {/* Статистика выбора */}
      {selectedTech.length > 0 && (
        <div className="selection-stats" role="status">
          Выбрано технологий: {selectedTech.length}
        </div>
      )}

      {/* Кнопки действий */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={!isFormValid}
          className="btn-primary"
        >
          Установить дедлайны
        </button>
      </div>
    </form>
  );
}

export default DeadlineForm;
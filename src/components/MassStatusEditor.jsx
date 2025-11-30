import { useState, useEffect, useRef } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './MassStatusEditor.css';

function MassStatusEditor() {
  const { technologies, setTechnologies } = useTechnologies();
  const [selectedIds, setSelectedIds] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (selectedIds.length === 0) setError('Выберите хотя бы одну технологию.');
    else if (!status) setError('Выберите новый статус для выбранных технологий.');
    else setError('');
  }, [selectedIds, status]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const toggleId = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedIds(technologies.map(t => t.id));
  const clearAll = () => setSelectedIds([]);

  const handleApply = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0 || !status) return setError('Пожалуйста, исправьте ошибки формы.');

    setTechnologies(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status } : t));
    setSuccess(`Статус обновлён для ${selectedIds.length} технологий.`);
    setSelectedIds([]);
    setStatus('');
  };

  return (
    <form className="mass-status-editor" onSubmit={handleApply} aria-labelledby="mass-status-legend">
      <fieldset>
        <legend id="mass-status-legend">Массовое изменение статусов</legend>

        <div className="mse-controls">
          <div className="mse-actions">
            <button type="button" className="btn-outline" onClick={selectAll}>Выбрать все</button>
            <button type="button" className="btn-outline" onClick={clearAll}>Очистить</button>
          </div>

          <div className="mse-status">
            <label htmlFor="mse-status-select">Новый статус</label>
            <select
              id="mse-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-required="true"
            >
              <option value="">-- Выберите статус --</option>
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
            </select>
          </div>

          <div className="mse-submit">
            <button type="submit" className="btn-primary" disabled={selectedIds.length === 0 || !status}>Применить</button>
          </div>
        </div>

        <div className="mse-list" ref={listRef} role="list" aria-label="Список технологий для выбора">
          {technologies.map(tech => (
            <label key={tech.id} className="mse-item" role="listitem">
              <input
                type="checkbox"
                checked={selectedIds.includes(tech.id)}
                onChange={() => toggleId(tech.id)}
                aria-checked={selectedIds.includes(tech.id)}
              />
              <span className="mse-item-title">{tech.title}</span>
              <span className="mse-item-meta">{tech.category} — {tech.status}</span>
            </label>
          ))}
        </div>

        <div className="mse-messages" aria-live="polite">
          {error && <div className="mse-error" role="alert">{error}</div>}
          {success && <div className="mse-success">{success}</div>}
        </div>
      </fieldset>
    </form>
  );
}

export default MassStatusEditor;

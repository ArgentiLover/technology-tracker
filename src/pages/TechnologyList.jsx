import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyList.css';
import '../components/LanguagesImporter.css';
import LanguagesImporter from '../components/LanguagesImporter';

function TechnologyList() {
    const { technologies, deleteTechnology } = useTechnologies();
    const [toasts, setToasts] = useState([]);

    const addToast = (text, type = 'info', timeout = 4000, actions = null) => {
        const id = Date.now() + Math.random();
        setToasts(t => [...t, { id, text, type, actions }]);
        if (timeout > 0) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), timeout);
        return id;
    };

    const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

    const getStatusText = (status) => {
        switch(status) {
            case 'completed': return 'Завершено';
            case 'in-progress': return 'В процессе';
            default: return 'Не начато';
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    Добавить технологию
                </Link>
            </div>

            <div className="technologies-grid">
                {technologies.map(tech => (
                    <div key={tech.id} className="technology-item">
                        <h3>{tech.title}</h3>
                        <p>{tech.description}</p>
                        {tech.deadline && (() => {
                            try {
                                const d = new Date(tech.deadline);
                                if (!isNaN(d.getTime())) {
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    const diff = Math.ceil((d - today) / (1000*60*60*24));
                                    const dateStr = d.toLocaleDateString('ru-RU');
                                    return (
                                        <div className="tech-deadline">Дедлайн: {dateStr} {diff > 0 ? `(через ${diff} дн.)` : diff === 0 ? '(сегодня)' : `(просрочено ${Math.abs(diff)} дн.)`}</div>
                                    );
                                }
                            } catch (e) {
                                // ignore invalid date
                            }
                            return null;
                        })()}
                        <div className="technology-meta">
                            <span className={`status status-${tech.status}`}>
                                {getStatusText(tech.status)}
                            </span>
                            <div className="meta-actions">
                                <Link to={`/technology/${tech.id}`} className="btn-link">
                                    Подробнее
                                </Link>
                                <button
                                    className="btn-delete"
                                    onClick={() => {
                                        const id = addToast(`Удалить "${tech.title}"?`, 'info', 0, [
                                            { label: 'Удалить', handler: () => { deleteTechnology(tech.id); removeToast(id); addToast('Технология удалена', 'success'); } },
                                            { label: 'Отмена', handler: () => removeToast(id) }
                                        ]);
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {technologies.length === 0 && (
                <div className="empty-state">
                    <p>Технологий пока нет.</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        Добавить первую технологию
                    </Link>
                </div>
            )}

        <LanguagesImporter />
        <div className="toasts">
            {toasts.map(t => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <div className="toast-text">{t.text}</div>
                    <div style={{display: 'flex', gap: 8}}>
                        {t.actions ? t.actions.map((a, i) => (
                            <button key={i} onClick={() => { try { a.handler(); } catch (e) { console.error(e); } }} className="toast-action">{a.label}</button>
                        )) : <button onClick={() => removeToast(t.id)}>×</button>}
                    </div>
                </div>
            ))}
        </div>
        </div>
        
    );
}

export default TechnologyList;
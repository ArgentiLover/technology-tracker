import { Link } from 'react-router-dom';
import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyList.css';
import '../components/LanguagesImporter.css';
import LanguagesImporter from '../components/LanguagesImporter';
import TechnologyCard from '../components/TechnologyCard';
import SimpleTechCard from '../components/SimpleTechCard';
import DeadlineForm from '../components/DeadlineForm';
import { useNotifications } from '../contexts/NotificationContext';

function TechnologyList() {
    const { technologies, deleteTechnology, updateStatus, updateDeadline } = useTechnologies();
    const { notifications, addNotification, removeNotification, markAsRead } = useNotifications();
    const [showDeadlineForm, setShowDeadlineForm] = useState(false);

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

            <div className="page-section">
                <button
                    className="btn-outline"
                    aria-expanded={showDeadlineForm}
                    aria-controls="deadline-form-section"
                    onClick={() => setShowDeadlineForm(s => !s)}
                >
                    {showDeadlineForm ? 'Свернуть форму дедлайнов' : 'Развернуть форму дедлайнов'}
                </button>

                {showDeadlineForm && (
                    <div id="deadline-form-section">
                        <DeadlineForm
                            technologies={technologies}
                            onUpdateDeadlines={(updates) => {
                                // updates: [{ techId, deadline }]
                                updates.forEach(u => updateDeadline(u.techId, u.deadline));
                                addNotification(`Дедлайны обновлены для ${updates.length} технологий`, 'success');
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="technologies-grid">
                {technologies.map(tech => (
                    <div key={tech.id} className="technology-item">
                        <SimpleTechCard
                            technology={tech}
                            onStatusChange={updateStatus}
                        />

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
                                        const id = addNotification(`Удалить "${tech.title}"?`, 'info', 0, [
                                            { label: 'Удалить', handler: () => { deleteTechnology(tech.id); removeNotification(id); addNotification('Технология удалена', 'success'); } },
                                            { label: 'Отмена', handler: () => removeNotification(id) }
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
        {/* Global Snackbars in NotificationProvider handle rendering of notifications */}
        </div>
        
    );
}

export default TechnologyList;
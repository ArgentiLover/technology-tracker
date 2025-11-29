import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyNotes from '../components/TechnologyNotes';
import './TechnologyDetail.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const { technologies, updateStatus, updateNotes } = useTechnologies();
    const [technology, setTechnology] = useState(null);
    const [editingNotes, setEditingNotes] = useState(false);

    useEffect(() => {
        const tech = technologies.find(t => t.id === parseInt(techId));
        setTechnology(tech);
    }, [techId, technologies]);

    const handleUpdateStatus = (newStatus) => {
        updateStatus(parseInt(techId), newStatus);
    };

    const handleSaveNotes = (newNotes) => {
        updateNotes(parseInt(techId), newNotes);
        setEditingNotes(false);
    };

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn">
                    Назад к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    Назад к списку
                </Link>
                <h1>{technology.title}</h1>
            </div>

            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => handleUpdateStatus('not-started')}
                            className={technology.status === 'not-started' ? 'active' : ''}
                        >
                            Не начато
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('in-progress')}
                            className={technology.status === 'in-progress' ? 'active' : ''}
                        >
                            В процессе
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('completed')}
                            className={technology.status === 'completed' ? 'active' : ''}
                        >
                            Завершено
                        </button>
                    </div>
                </div>

                <div className="detail-section">
                    <div className="notes-header">
                        <h3>Мои заметки</h3>
                        <button 
                            onClick={() => setEditingNotes(!editingNotes)}
                            className="btn-edit"
                        >
                            {editingNotes ? 'Отмена' : 'Редактировать'}
                        </button>
                    </div>
                    
                    {editingNotes ? (
                        <TechnologyNotes
                            notes={technology.notes}
                            onSave={handleSaveNotes}
                            onCancel={() => setEditingNotes(false)}
                        />
                    ) : (
                        <div className="notes-content">
                            {technology.notes ? (
                                <p>{technology.notes}</p>
                            ) : (
                                <p className="no-notes">Заметок пока нет</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyList.css';

function TechnologyList() {
    const { technologies, deleteTechnology } = useTechnologies();

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
                                        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
                                            deleteTechnology(tech.id);
                                        }
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
        </div>
    );
}

export default TechnologyList;
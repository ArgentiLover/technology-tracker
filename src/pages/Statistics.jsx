import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import './Statistics.css';

function Statistics() {
    const { technologies, progress } = useTechnologies();

    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;

    const getCategoryStats = () => {
        const categories = {};
        technologies.forEach(tech => {
            const category = tech.category || 'other';
            if (!categories[category]) {
                categories[category] = { total: 0, completed: 0 };
            }
            categories[category].total++;
            if (tech.status === 'completed') {
                categories[category].completed++;
            }
        });
        return categories;
    };

    const getCategoryName = (category) => {
        const categoryNames = {
            'frontend': 'Frontend',
            'backend': 'Backend', 
            'database': 'Базы данных',
            'tools': 'Инструменты',
            'other': 'Другое'
        };
        return categoryNames[category] || category;
    };

    const categoryStats = getCategoryStats();

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/" className="back-link">
                    На главную
                </Link>
                <h1>Статистика прогресса</h1>
            </div>

            <div className="statistics-content">
                <div className="stats-overview">
                    <div className="stat-card">
                        <h3>Общий прогресс</h3>
                        <div className="stat-value">{progress}%</div>
                        <ProgressBar
                            progress={progress}
                            height={20}
                            color="#667eea"
                            animated={true}
                        />
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">{completed}</span>
                            <span className="stat-label">Завершено</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{inProgress}</span>
                            <span className="stat-label">В процессе</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{notStarted}</span>
                            <span className="stat-label">Не начато</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{technologies.length}</span>
                            <span className="stat-label">Всего</span>
                        </div>
                    </div>
                </div>

                <div className="category-stats">
                    <h3>Прогресс по категориям</h3>
                    {Object.keys(categoryStats).map(category => {
                        const stats = categoryStats[category];
                        const categoryProgress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                        
                        return (
                            <div key={category} className="category-item">
                                <div className="category-header">
                                    <span className="category-name">{getCategoryName(category)}</span>
                                    <span className="category-progress">{categoryProgress}%</span>
                                </div>
                                <ProgressBar
                                    progress={categoryProgress}
                                    height={12}
                                    color="#4CAF50"
                                    showPercentage={false}
                                />
                                <div className="category-details">
                                    <span>{stats.completed} из {stats.total} завершено</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="recent-activity">
                    <h3>Недавняя активность</h3>
                    {technologies.filter(tech => tech.status === 'completed').slice(0, 5).map(tech => (
                        <div key={tech.id} className="activity-item">
                            <span className="activity-tech">{tech.title}</span>
                            <span className="activity-status">Завершено</span>
                        </div>
                    ))}
                    {technologies.filter(tech => tech.status === 'completed').length === 0 && (
                        <p className="no-activity">Завершенных технологий пока нет</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Statistics;
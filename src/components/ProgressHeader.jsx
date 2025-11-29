import './ProgressHeader.css';

function ProgressHeader({ technologies, progress }) {
    // Рассчитываем расширенную статистику
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    // Используем переданный progress из хука вместо расчета
    const percentage = progress;

    // Функции для расчета ширины визуальных индикаторов
    const getVisualWidth = (count) => {
        return total > 0 ? (count / total) * 100 : 0;
    };

    // Определяем самую популярную категорию (статус)
    const getMostPopularStatus = () => {
        const statusCounts = {
            'completed': completed,
            'in-progress': inProgress,
            'not-started': notStarted
        };
        
        const mostPopular = Object.keys(statusCounts).reduce((a, b) => 
            statusCounts[a] > statusCounts[b] ? a : b
        );
        
        const statusNames = {
            'completed': 'Завершенные',
            'in-progress': 'В процессе',
            'not-started': 'Не начатые'
        };
        
        return statusNames[mostPopular];
    };

    return (
        <div className="progress-header">
            <h2>Статистика изучения технологий</h2>
            
            {/* Основная статистика */}
            <div className="progress-stats">
                <div className="stat">
                    <span className="stat-value">{total}</span>
                    <span className="stat-label">всего</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{completed}</span>
                    <span className="stat-label">изучено</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{percentage}%</span>
                    <span className="stat-label">выполнено</span>
                </div>
            </div>
            
            {/* Прогресс-бар */}
            <div className="progress-section">
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="progress-text">Прогресс: {percentage}%</div>
            </div>
            
            {/* Детальная статистика по статусам */}
            <div className="detailed-stats">
                <h3>Распределение по статусам:</h3>
                <div className="status-bars">
                    <div className="status-bar">
                        <div className="status-label">Завершено:</div>
                        <div className="status-count">{completed}</div>
                        <div className="status-visual-container">
                            <div 
                                className="status-visual completed-visual"
                                style={{ width: `${getVisualWidth(completed)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="status-bar">
                        <div className="status-label">В процессе:</div>
                        <div className="status-count">{inProgress}</div>
                        <div className="status-visual-container">
                            <div 
                                className="status-visual in-progress-visual"
                                style={{ width: `${getVisualWidth(inProgress)}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="status-bar">
                        <div className="status-label">Не начато:</div>
                        <div className="status-count">{notStarted}</div>
                        <div className="status-visual-container">
                            <div 
                                className="status-visual not-started-visual"
                                style={{ width: `${getVisualWidth(notStarted)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Самая популярная категория */}
            <div className="popular-category">
                <h3>Самая популярная категория:</h3>
                <div className="category-badge">{getMostPopularStatus()}</div>
            </div>
        </div>
    );
}

export default ProgressHeader;
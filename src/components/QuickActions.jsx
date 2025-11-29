import './QuickActions.css';

function QuickActions({ technologies, onUpdateAllStatuses, onRandomSelect }) {
    const markAllCompleted = () => {
        onUpdateAllStatuses('completed');
    };

    const resetAll = () => {
        onUpdateAllStatuses('not-started');
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button 
                    className="action-btn complete-all"
                    onClick={markAllCompleted}
                >
                    Отметить все как выполненные
                </button>
                <button 
                    className="action-btn reset-all"
                    onClick={resetAll}
                >
                    Сбросить все статусы
                </button>
                <button 
                    className="action-btn random-select"
                    onClick={onRandomSelect}
                >
                    Случайный выбор следующей технологии
                </button>
            </div>
        </div>
    );
}

export default QuickActions;
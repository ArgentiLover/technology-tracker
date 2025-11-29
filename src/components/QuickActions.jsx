import { useState } from 'react';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import './QuickActions.css';

function QuickActions({ technologies, onUpdateAllStatuses, onRandomSelect }) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState('');

    const markAllCompleted = () => {
        onUpdateAllStatuses('completed');
    };

    const resetAll = () => {
        onUpdateAllStatuses('not-started');
    };

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            totalTechnologies: technologies.length,
            completed: technologies.filter(tech => tech.status === 'completed').length,
            inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
            notStarted: technologies.filter(tech => tech.status === 'not-started').length,
            technologies: technologies
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setShowExportModal(true);
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importData);
            if (data.technologies && Array.isArray(data.technologies)) {
                localStorage.setItem('techTrackerData', JSON.stringify(data.technologies));
                window.location.reload();
            } else {
                alert('Неверный формат данных');
            }
        } catch (error) {
            alert('Ошибка при импорте данных: ' + error.message);
        }
    };

    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const total = technologies.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button 
                    className="action-btn complete-all"
                    onClick={markAllCompleted}
                    disabled={technologies.length === 0}
                >
                    Отметить все как выполненные
                </button>
                <button 
                    className="action-btn reset-all"
                    onClick={resetAll}
                    disabled={technologies.length === 0}
                >
                    Сбросить все статусы
                </button>
                <button 
                    className="action-btn random-select"
                    onClick={onRandomSelect}
                    disabled={technologies.filter(tech => tech.status === 'not-started').length === 0}
                >
                    Случайный выбор следующей технологии
                </button>
                <button 
                    className="action-btn export-btn"
                    onClick={handleExport}
                    disabled={technologies.length === 0}
                >
                    Экспорт
                </button>
                <button 
                    className="action-btn import-btn"
                    onClick={() => setShowImportModal(true)}
                >
                    Импорт
                </button>
            </div>

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <div className="modal-export">
                    <p>Данные успешно экспортированы!</p>
                    <p>Файл сохранен в папке загрузок.</p>
                    <div className="export-stats">
                        <p>Статистика экспорта:</p>
                        <ProgressBar
                            progress={progress}
                            label="Общий прогресс"
                            color="#4CAF50"
                            height={15}
                            showPercentage={true}
                        />
                        <div className="stats-details">
                            <span>Всего: {total}</span>
                            <span>Завершено: {completed}</span>
                            <span>В процессе: {technologies.filter(tech => tech.status === 'in-progress').length}</span>
                            <span>Не начато: {technologies.filter(tech => tech.status === 'not-started').length}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowExportModal(false)} 
                        className="btn btn-primary"
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Импорт данных"
            >
                <div className="modal-import">
                    <p>Вставьте данные JSON для импорта:</p>
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='{"technologies": [...]}'
                        rows="8"
                        className="import-textarea"
                    />
                    <div className="import-actions">
                        <button 
                            onClick={() => setShowImportModal(false)} 
                            className="btn btn-cancel"
                        >
                            Отмена
                        </button>
                        <button 
                            onClick={handleImport}
                            disabled={!importData.trim()}
                            className="btn btn-primary"
                        >
                            Импортировать
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default QuickActions;
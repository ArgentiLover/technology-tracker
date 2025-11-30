import { useState } from 'react';
import Modal from './Modal';
import ProgressBar from './ProgressBar';
import './QuickActions.css';
import MassStatusEditor from './MassStatusEditor';
import useTechnologies from '../hooks/useTechnologies';
import validateTechnologies from '../utils/validateTechnologies';

function QuickActions({ technologies, onUpdateAllStatuses, onRandomSelect }) {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState('');

    const { setTechnologies } = useTechnologies();

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
            // support both full export objects and raw arrays
            const arr = data && Array.isArray(data.technologies) ? data.technologies : (Array.isArray(data) ? data : null);
            if (!arr) {
                alert('Неверный формат данных: ожидается массив technologies');
                return;
            }

            const result = validateTechnologies(arr);
            if (!result.valid) {
                alert('Ошибка при импорте данных:\n' + result.errors.join('\n'));
                return;
            }

            // apply via hook so UI updates immediately
            setTechnologies(arr);
            setShowImportModal(false);
        } catch (error) {
            alert('Ошибка при импорте данных: ' + error.message);
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const text = reader.result;
                const data = JSON.parse(text);
                const arr = data && Array.isArray(data.technologies) ? data.technologies : (Array.isArray(data) ? data : null);
                if (!arr) {
                    alert('Неверный формат файла: ожидается массив technologies');
                    return;
                }

                const result = validateTechnologies(arr);
                if (!result.valid) {
                    alert('Ошибка при импорте файла:\n' + result.errors.join('\n'));
                    return;
                }

                setTechnologies(arr);
                setShowImportModal(false);
            } catch (err) {
                alert('Ошибка при чтении файла: ' + (err && err.message ? err.message : String(err)));
            }
        };
        reader.readAsText(file);
        // clear the input so user can re-upload same file if needed
        e.target.value = null;
    };

    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const total = technologies.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const [showMassEditor, setShowMassEditor] = useState(false);

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

            <div className="mass-editor-section">
                <button
                    className="btn-outline"
                    aria-expanded={showMassEditor}
                    aria-controls="mass-status-editor"
                    onClick={() => setShowMassEditor(s => !s)}
                >
                    {showMassEditor ? 'Свернуть массовый редактор' : 'Развернуть массовый редактор'}
                </button>

                {showMassEditor && (
                    <div id="mass-status-editor">
                        <MassStatusEditor />
                    </div>
                )}
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
                            <span>Всего: {total} </span>
                            <span>Завершено: {completed} </span>
                            <span>В процессе: {technologies.filter(tech => tech.status === 'in-progress').length}</span>
                            <span> Не начато: {technologies.filter(tech => tech.status === 'not-started').length}</span>
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
                    <p>Загрузите JSON-файл экспорта или вставьте JSON для импорта:</p>
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleFileImport}
                        className="import-file-input"
                        aria-label="Загрузить JSON файл с технологиями"
                    />
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
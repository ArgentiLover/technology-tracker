import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const { technologies, setTechnologies } = useTechnologies();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setSelectedFile(file || null);
    };

    const handleImport = () => {
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.technologies && Array.isArray(data.technologies)) {
                    setTechnologies(data.technologies);
                    alert('Данные успешно импортированы!');
                    setSelectedFile(null);
                } else {
                    alert('Неверный формат данных: отсутствует поле technologies');
                }
            } catch (error) {
                alert('Ошибка при импорте данных: ' + error.message);
            }
        };
        reader.onerror = () => {
            alert('Не удалось прочитать файл');
        };
        reader.readAsText(selectedFile);
    };

    const handleResetAll = () => {
        const resetTechnologies = technologies.map(tech => ({
            ...tech,
            status: 'not-started',
            notes: ''
        }));
        setTechnologies(resetTechnologies);
        setShowConfirmModal(false);
    };

    const handleDeleteAll = () => {
        setTechnologies([]);
        setShowConfirmModal(false);
    };

    const handleResetToDefault = () => {
        localStorage.removeItem('techTrackerData');
        window.location.reload();
    };

    const getStorageSize = () => {
        const data = localStorage.getItem('techTrackerData');
        return data ? (new Blob([data]).size / 1024).toFixed(2) + ' KB' : '0 KB';
    };

    const openModal = (action) => {
        setModalAction(action);
        setShowConfirmModal(true);
    };

    const getModalConfig = () => {
        const configs = {
            reset: {
                title: 'Сброс прогрессов',
                message: 'Вы уверены, что хотите сбросить все прогрессы? Все технологии будут помечены как "Не начато", а заметки очищены.',
                buttonText: 'Сбросить',
                buttonClass: 'btn-warning'
            },
            delete: {
                title: 'Удаление данных',
                message: 'Вы уверены, что хотите удалить ВСЕ данные? Это действие нельзя отменить!',
                buttonText: 'Удалить',
                buttonClass: 'btn-danger'
            },
            resetDefault: {
                title: 'Сброс к начальным данным',
                message: 'Вы уверены, что хотите сбросить все данные к исходному состоянию? Все текущие технологии будут заменены начальными данными.',
                buttonText: 'Сбросить',
                buttonClass: 'btn-warning'
            }
        };
        return configs[modalAction] || configs.reset;
    };

    const executeAction = () => {
        if (modalAction === 'reset') handleResetAll();
        if (modalAction === 'delete') handleDeleteAll();
        if (modalAction === 'resetDefault') handleResetToDefault();
    };

    const modalConfig = getModalConfig();

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/" className="back-link">
                    На главную
                </Link>
                <h1>Настройки приложения</h1>
            </div>

            <div className="settings-content">
                <div className="settings-section">
                    <h3>Управление данными</h3>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Экспорт данных</h4>
                            <p>Скачайте резервную копию ваших технологий</p>
                        </div>
                        <div className="setting-actions">
                            <button onClick={handleExport} className="btn btn-primary">
                                Создать резервную копию
                            </button>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Импорт данных</h4>
                            <p>Восстановите данные из JSON-файла-резервной копии</p>
                        </div>
                        <div className="setting-actions">
                            <input
                                type="file"
                                accept="application/json,.json"
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={handleImport}
                                disabled={!selectedFile}
                                className="btn btn-primary"
                            >
                                Импортировать файл
                            </button>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Опасные действия</h3>
                    
                    <div className="danger-actions">
                        <div className="danger-item">
                            <div className="danger-info">
                                <h4>Сбросить все прогрессы</h4>
                                <p>Установит все технологии в статус "Не начато" и очистит заметки</p>
                            </div>
                            <button 
                                onClick={() => openModal('reset')}
                                className="btn btn-warning"
                            >
                                Сбросить прогрессы
                            </button>
                        </div>

                        <div className="danger-item">
                            <div className="danger-info">
                                <h4>Сбросить к начальным данным</h4>
                                <p>Вернет все технологии к исходному состоянию с разными категориями</p>
                            </div>
                            <button 
                                onClick={() => openModal('resetDefault')}
                                className="btn btn-warning"
                            >
                                Сбросить данные
                            </button>
                        </div>

                        <div className="danger-item">
                            <div className="danger-info">
                                <h4>Удалить все данные</h4>
                                <p>Полностью очистит все технологии. Это действие нельзя отменить!</p>
                            </div>
                            <button 
                                onClick={() => openModal('delete')}
                                className="btn btn-danger"
                            >
                                Удалить все
                            </button>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Информация о приложении</h3>
                    
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Всего технологий:</span>
                            <span className="info-value">{technologies.length}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Размер данных:</span>
                            <span className="info-value">{getStorageSize()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Версия:</span>
                            <span className="info-value">1.0.0</span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title={modalConfig.title}
            >
                <div className="modal-confirm">
                    <p>{modalConfig.message}</p>
                    <div className="modal-actions">
                        <button 
                            onClick={() => setShowConfirmModal(false)} 
                            className="btn btn-cancel"
                        >
                            Отмена
                        </button>
                        <button 
                            onClick={executeAction} 
                            className={`btn ${modalConfig.buttonClass}`}
                        >
                            {modalConfig.buttonText}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Settings;
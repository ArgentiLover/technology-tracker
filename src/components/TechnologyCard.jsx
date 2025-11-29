import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
    const handleClick = () => {
        // Определяем следующий статус в цикле
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];
        
        // Вызываем функцию из props для обновления статуса
        onStatusChange(id, nextStatus);
    };

    return (
        <div 
            className={`technology-card status-${status}`}
            onClick={handleClick}
        >
            <h3>{title}</h3>
            <p>{description}</p>
            <span>Статус: {getStatusText(status)}</span>
        </div>
    );
}

// Вспомогательная функция для отображения статуса
function getStatusText(status) {
    const statusMap = {
        'not-started': 'Не начато',
        'in-progress': 'В процессе',
        'completed': 'Завершено'
    };
    return statusMap[status] || status;
}

export default TechnologyCard;
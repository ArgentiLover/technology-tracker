import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ id, title, description, status, notes, deadline, onStatusChange, onNotesChange }) {
    const handleCardClick = () => {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];
        
        onStatusChange(id, nextStatus);
    };

    return (
        <div className={`technology-card status-${status}`}>
            <div className="card-content" onClick={handleCardClick}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>Статус: {getStatusText(status)}</span>
                {deadline && (() => {
                    try {
                        const d = new Date(deadline);
                        if (!isNaN(d.getTime())) {
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const diff = Math.ceil((d - today) / (1000*60*60*24));
                            const dateStr = d.toLocaleDateString('ru-RU');
                            return (
                                <div className="tech-deadline">Дедлайн: {dateStr} {diff > 0 ? `(через ${diff} дн.)` : diff === 0 ? '(сегодня)' : `(просрочено ${Math.abs(diff)} дн.)`}</div>
                            );
                        }
                    } catch (e) {
                        // ignore invalid date
                    }
                    return null;
                })()}
            </div>
            
            <TechnologyNotes 
                notes={notes}
                onNotesChange={onNotesChange}
                techId={id}
            />
        </div>
    );
}

function getStatusText(status) {
    const statusMap = {
        'not-started': 'Не начато',
        'in-progress': 'В процессе',
        'completed': 'Завершено'
    };
    return statusMap[status] || status;
}

export default TechnologyCard;
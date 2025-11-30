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

    let deadlineNode = null;
    if (deadline) {
        try {
            const d = new Date(deadline);
            if (!isNaN(d.getTime())) {
                const today = new Date();
                today.setHours(0,0,0,0);
                const diff = Math.ceil((d - today) / (1000*60*60*24));
                const dateStr = d.toLocaleDateString('ru-RU');
                let label;
                if (diff > 1) label = `до ${dateStr} (${diff} дн.)`;
                else if (diff === 1) label = `до ${dateStr} (завтра)`;
                else if (diff === 0) label = `сегодня ${dateStr}`;
                else label = `просрочено ${Math.abs(diff)} дн. (до ${dateStr})`;

                const severity = diff < 0 ? 'overdue' : (diff <= 3 ? 'urgent' : 'muted');
                deadlineNode = (
                    <div className={`tech-deadline ${severity}`} aria-label={`Дедлайн: ${label}`}>
                        📅 {label}
                    </div>
                );
            }
        } catch (e) {
            // ignore invalid date
        }
    }

    return (
        <div className={`technology-card status-${status}`}>
            <div className="card-content" onClick={handleCardClick}>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>Статус: {getStatusText(status)}</span>
                {deadlineNode}
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
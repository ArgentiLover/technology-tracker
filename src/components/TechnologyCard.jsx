import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
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
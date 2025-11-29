import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import './components/TechnologyCard.css';
import './components/ProgressHeader.css';

function App() {
    const [technologies, setTechnologies] = useState([
        { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'not-started' },
        { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'not-started' },
        { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
        { id: 4, title: 'React Hooks', description: 'Изучение хуков useState, useEffect', status: 'not-started' }
    ]);

    // Функция для изменения статуса
    const handleStatusChange = (id, newStatus) => {
        setTechnologies(prevTechnologies => 
            prevTechnologies.map(tech => 
                tech.id === id ? { ...tech, status: newStatus } : tech
            )
        );
    };

    return (
        <div className="App">
            <h1>Трекер изучения технологий</h1>
            <ProgressHeader technologies={technologies} />
            {technologies.map(tech => (
                <TechnologyCard
                    key={tech.id}
                    id={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onStatusChange={handleStatusChange}
                />
            ))}
        </div>
    );
}

export default App;
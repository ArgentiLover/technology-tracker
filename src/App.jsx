import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import './components/TechnologyCard.css';
import './components/ProgressHeader.css';
import './components/QuickActions.css';
import './components/TechnologyFilter.css';

function App() {
    const [technologies, setTechnologies] = useState([
        { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
        { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
        { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' },
        { id: 4, title: 'React Hooks', description: 'Изучение хуков useState, useEffect', status: 'not-started' }
    ]);

    const [activeFilter, setActiveFilter] = useState('all');

    const handleStatusChange = (id, newStatus) => {
        setTechnologies(prevTechnologies => 
            prevTechnologies.map(tech => 
                tech.id === id ? { ...tech, status: newStatus } : tech
            )
        );
    };

    const handleUpdateAllStatuses = (newStatus) => {
        setTechnologies(prevTechnologies => 
            prevTechnologies.map(tech => ({ ...tech, status: newStatus }))
        );
    };

    const handleRandomSelect = () => {
        const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTechs.length === 0) {
            alert('Все технологии уже начаты или завершены!');
            return;
        }
        
        const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
        handleStatusChange(randomTech.id, 'in-progress');
        alert(`Следующая технология: ${randomTech.title}`);
    };

    const filteredTechnologies = technologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    return (
        <div className="App">
            <h1>Трекер изучения технологий</h1>
            
            <ProgressHeader technologies={technologies} />
            <QuickActions 
                technologies={technologies}
                onUpdateAllStatuses={handleUpdateAllStatuses}
                onRandomSelect={handleRandomSelect}
            />
            <TechnologyFilter 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                filteredCount={filteredTechnologies.length}
                totalCount={technologies.length}
            />
            
            {filteredTechnologies.map(tech => (
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
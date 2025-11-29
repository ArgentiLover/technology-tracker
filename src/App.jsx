import { useState, useEffect } from 'react';
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
    const [technologies, setTechnologies] = useState(() => {
        const savedData = localStorage.getItem('techTrackerData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        }
        return [
            { 
                id: 1, 
                title: 'React Components', 
                description: 'Изучение базовых компонентов', 
                status: 'completed',
                notes: ''
            },
            { 
                id: 2, 
                title: 'JSX Syntax', 
                description: 'Освоение синтаксиса JSX', 
                status: 'in-progress',
                notes: ''
            },
            { 
                id: 3, 
                title: 'State Management', 
                description: 'Работа с состоянием компонентов', 
                status: 'not-started',
                notes: ''
            },
            { 
                id: 4, 
                title: 'React Hooks', 
                description: 'Изучение хуков useState, useEffect', 
                status: 'not-started',
                notes: ''
            }
        ];
    });

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    }, [technologies]);

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

    const updateTechnologyNotes = (techId, newNotes) => {
        setTechnologies(prevTechnologies => 
            prevTechnologies.map(tech => 
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    const filteredTechnologies = technologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    const searchedTechnologies = filteredTechnologies.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="App">
            <h1>Трекер изучения технологий</h1>
            
            <ProgressHeader technologies={technologies} />
            <QuickActions 
                technologies={technologies}
                onUpdateAllStatuses={handleUpdateAllStatuses}
                onRandomSelect={handleRandomSelect}
            />
            
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span>Найдено: {searchedTechnologies.length}</span>
            </div>
            
            <TechnologyFilter 
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                filteredCount={searchedTechnologies.length}
                totalCount={technologies.length}
            />
            
            {searchedTechnologies.map(tech => (
                <TechnologyCard
                    key={tech.id}
                    id={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    notes={tech.notes}
                    onStatusChange={handleStatusChange}
                    onNotesChange={updateTechnologyNotes}
                />
            ))}
        </div>
    );
}

export default App;
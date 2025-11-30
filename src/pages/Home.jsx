import { Link } from 'react-router-dom';
import { useState } from 'react';
import TechnologyCard from '../components/TechnologyCard.jsx';
import ProgressHeader from '../components/ProgressHeader.jsx';
import QuickActions from '../components/QuickActions.jsx';
import TechnologyFilter from '../components/TechnologyFilter.jsx';
import useTechnologies from '../hooks/useTechnologies';
import '../components/TechnologyCard.css';
import '../components/ProgressHeader.css';
import '../components/QuickActions.css';
import '../components/TechnologyFilter.css';
import './Home.css';

function Home() {
  const { 
    technologies, 
    updateStatus, 
    updateNotes, 
    updateAllStatuses, 
    progress 
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (id, newStatus) => {
    updateStatus(id, newStatus);
  };

  const handleUpdateAllStatuses = (newStatus) => {
    updateAllStatuses(newStatus);
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
    updateNotes(techId, newNotes);
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
    <div className="home-page">
      <h1>Трекер изучения технологий</h1>
      
      <ProgressHeader technologies={technologies} progress={progress} />
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
      
      <div className="technologies-list">
        {searchedTechnologies.length === 0 ? (
          <div className="no-results">
            <p>Технологии не найдены</p>
            <Link to="/add-technology" className="btn btn-primary">
              Добавить технологию
            </Link>
          </div>
        ) : (
          searchedTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              notes={tech.notes}
              deadline={tech.deadline}
              onStatusChange={handleStatusChange}
              onNotesChange={updateTechnologyNotes}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
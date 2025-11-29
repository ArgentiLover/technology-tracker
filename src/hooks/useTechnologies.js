import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов', 
    status: 'completed',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX', 
    status: 'in-progress',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 4, 
    title: 'React Hooks', 
    description: 'Изучение хуков useState, useEffect', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 5, 
    title: 'Node.js Basics', 
    description: 'Основы серверного JavaScript', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 6, 
    title: 'Express.js', 
    description: 'Создание REST API', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 7, 
    title: 'MongoDB', 
    description: 'Работа с NoSQL базой данных', 
    status: 'not-started',
    notes: '',
    category: 'database'
  },
  { 
    id: 8, 
    title: 'Git & GitHub', 
    description: 'Система контроля версий', 
    status: 'completed',
    notes: '',
    category: 'tools'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);

  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const updateAllStatuses = (newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  const deleteTechnology = (techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  };

  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    updateAllStatuses,
    deleteTechnology,
    progress: calculateProgress()
  };
}

export default useTechnologies;
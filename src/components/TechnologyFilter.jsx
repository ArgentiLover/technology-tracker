import './TechnologyFilter.css';

function TechnologyFilter({ activeFilter, onFilterChange, filteredCount, totalCount }) {
    const filters = [
        { key: 'all', label: 'Все технологии' },
        { key: 'not-started', label: 'Не начатые' },
        { key: 'in-progress', label: 'В процессе' },
        { key: 'completed', label: 'Завершенные' }
    ];

    return (
        <div className="technology-filter">
            <h3>Фильтр по статусу</h3>
            <div className="filter-buttons">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <div className="technologies-count">
                Показано: {filteredCount} из {totalCount} технологий
            </div>
        </div>
    );
}

export default TechnologyFilter;
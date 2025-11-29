import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './AddTechnology.css';

function AddTechnology() {
    const { technologies, setTechnologies } = useTechnologies();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Введите название технологии');
            return;
        }

        const newTechnology = {
            id: Date.now(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            status: formData.status,
            notes: formData.notes.trim(),
            category: formData.category
        };

        const updatedTechnologies = [...technologies, newTechnology];
        setTechnologies(updatedTechnologies);
        
        navigate('/technologies');
    };

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    Назад к списку
                </Link>
                <h1>Добавить технологию</h1>
            </div>

            <div className="add-technology-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Название технологии *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Например: React Hooks"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Краткое описание технологии..."
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Категория</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">Базы данных</option>
                            <option value="tools">Инструменты</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Статус изучения</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="not-started">Не начато</option>
                            <option value="in-progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Заметки</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Ваши заметки по изучению..."
                            rows="3"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Добавить технологию
                        </button>
                        <Link to="/technologies" className="btn btn-secondary">
                            Отмена
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTechnology;
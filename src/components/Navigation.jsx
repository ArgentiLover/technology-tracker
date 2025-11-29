import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';

function Navigation() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen(v => !v);
    const closeMenu = () => setOpen(false);

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/" onClick={closeMenu}>
                    <h2>Трекер технологий</h2>
                </Link>
            </div>

            <button
                className="nav-toggle"
                aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={open}
                onClick={toggleMenu}
            >
                ☰
            </button>

            <ul className={`nav-menu ${open ? 'open' : ''}`}>
                <li>
                    <Link 
                        to="/"
                        onClick={closeMenu}
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        Главная
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/technologies"
                        className={location.pathname === '/technologies' ? 'active' : ''}
                    >
                        Все технологии
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/statistics"
                        className={location.pathname === '/statistics' ? 'active' : ''}
                    >
                        Статистика
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/add-technology"
                        className={location.pathname === '/add-technology' ? 'active' : ''}
                    >
                        Добавить технологию
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/settings"
                        onClick={closeMenu}
                        className={location.pathname === '/settings' ? 'active' : ''}
                    >
                        Настройки
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
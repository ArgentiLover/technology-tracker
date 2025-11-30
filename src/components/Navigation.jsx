import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../contexts/ThemeContext';

function Navigation() {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen(v => !v);
    const closeMenu = () => setOpen(false);
    const { mode, toggleMode } = useThemeMode();

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/" onClick={closeMenu}>
                    <h2>Трекер технологий</h2>
                </Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Tooltip title={mode === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}>
                                        <IconButton onClick={() => { console.log('toggleMode clicked'); toggleMode(); }} size="small" sx={{ ml: 1 }} aria-label="переключить тему">
                                            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <span style={{ fontSize: 12, color: 'var(--nav-text, #666)' }}>{mode === 'light' ? 'Светлая' : 'Тёмная'}</span>
                                </div>
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
                        to="/dashboard"
                        className={location.pathname === '/dashboard' ? 'active' : ''}
                    >
                        Панель
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
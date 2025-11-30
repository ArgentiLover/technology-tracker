import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import './App.css';
import { NotificationProvider } from './contexts/NotificationContext';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProviderCustom, { useThemeMode } from './contexts/ThemeContext';

function ThemedAppWrapper({ children }) {
    const { mode } = useThemeMode();

    const muiTheme = createTheme({
        palette: {
            mode: mode,
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: { default: mode === 'light' ? '#f5f5f5' : '#121212', paper: mode === 'light' ? '#ffffff' : '#1e1e1e' }
        }
    });

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

function App() {
    return (
        <ThemeProviderCustom>
            <ThemedAppWrapper>
                <Router>
                    <NotificationProvider>
                        <div className="app">
                            <Navigation />
                            <main className="main-content">
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/" element={<Home />} />
                                    <Route path="/technologies" element={<TechnologyList />} />
                                    <Route path="/technology/:techId" element={<TechnologyDetail />} />
                                    <Route path="/add-technology" element={<AddTechnology />} />
                                    <Route path="/statistics" element={<Statistics />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </main>
                        </div>
                    </NotificationProvider>
                </Router>
            </ThemedAppWrapper>
        </ThemeProviderCustom>
    );
}

export default App;
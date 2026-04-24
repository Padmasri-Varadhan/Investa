import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GuidedJourney from './pages/GuidedJourney';
import InvestmentIdeas from './pages/InvestmentIdeas';
import Articles from './pages/Articles';
import MyGoals from './pages/MyGoals';
import VideoAdvisory from './pages/VideoAdvisory';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import IdeaDetail from './pages/IdeaDetail';

// Theme Context
export const ColorModeContext = createContext({ toggleColorMode: () => { }, mode: 'light' });

function AppLayout({ children, user, onLogout, onUpdateUser, currentPage, setCurrentPage }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} toggleSidebar={toggleSidebar} />
      <Box sx={{ display: 'flex', flex: 1, pt: '64px' }}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isCollapsed={isSidebarCollapsed} />
        <Box
          component="main"
          sx={{
            flex: 1,
            ml: isSidebarCollapsed ? '64px' : '220px',
            p: 3,
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
            transition: 'margin-left 0.2s ease',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('investaTheme') || 'light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('investaTheme', newMode);
          document.documentElement.setAttribute('data-theme', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#007DA3', dark: '#005b7a', light: '#e6f5fa' },
          secondary: { main: '#00897b' },
          background: {
            default: mode === 'light' ? '#f0f4f8' : '#0a1929',
            paper: mode === 'light' ? '#ffffff' : '#1a2027',
          },
        },
        typography: {
          fontFamily: '"Noto Sans", sans-serif',
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { 
                textTransform: 'none', 
                fontWeight: 700,
                borderRadius: '12px',
                padding: '10px 24px'
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' 
                  : '0 4px 20px rgba(0,0,0,0.4)',
                borderRadius: '24px',
                border: mode === 'light' ? '1px solid #F1F5F9' : '1px solid rgba(255,255,255,0.05)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode],
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('investaUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [currentPage, setCurrentPage] = useState('Guided Journey');
  const [showLoginToast, setShowLoginToast] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('investaUser', JSON.stringify(userData));
    localStorage.setItem('investaToken', userData.token);
    setShowLoginToast(true);
  };

  const handleUpdateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('investaUser', JSON.stringify(userData));
    localStorage.setItem('investaToken', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('investaUser');
    localStorage.removeItem('investaToken');
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {/* Global Login Toast */}
          <Snackbar
            open={showLoginToast}
            autoHideDuration={4000}
            onClose={() => setShowLoginToast(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              severity="success"
              onClose={() => setShowLoginToast(false)}
              variant="filled"
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                background: 'linear-gradient(45deg, #007DA3, #00897b)'
              }}
            >
              Successful Login – Welcome back {user?.name}!
            </Alert>
          </Snackbar>

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/guided-journey" /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/guided-journey" /> : <Register onLogin={handleLogin} />}
            />

            {/* Protected routes */}
            <Route
              path="/guided-journey"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Guided Journey" setCurrentPage={setCurrentPage}>
                    <GuidedJourney user={user} />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Dashboard" setCurrentPage={setCurrentPage}>
                    <Dashboard />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/investment-ideas"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Investment Ideas" setCurrentPage={setCurrentPage}>
                    <InvestmentIdeas user={user} />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/idea/:id"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Investment Ideas" setCurrentPage={setCurrentPage}>
                    <IdeaDetail />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/articles"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Articles" setCurrentPage={setCurrentPage}>
                    <Articles />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/blogs"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Articles" setCurrentPage={setCurrentPage}>
                    <Articles />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/my-goals"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="My Goals" setCurrentPage={setCurrentPage}>
                    <MyGoals user={user} onUpdateUser={handleUpdateUser} />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/video-advisory"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Video Advisory" setCurrentPage={setCurrentPage}>
                    <VideoAdvisory />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/chatbot"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Chatbot" setCurrentPage={setCurrentPage}>
                    <Chatbot user={user} />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Profile" setCurrentPage={setCurrentPage}>
                    <Profile user={user} onUpdateUser={handleUpdateUser} />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/settings"
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentPage="Settings" setCurrentPage={setCurrentPage}>
                    <Settings user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
                  </AppLayout>
                ) : <Navigate to="/login" />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

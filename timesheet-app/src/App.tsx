import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth on mount and when returning from OAuth
    checkAuth();
    
    // Set up interval to check auth status
    const interval = setInterval(() => {
      if (!isAuthenticated) {
        checkAuth();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated && user ? <Dashboard /> : <Login />;
}

export default App;
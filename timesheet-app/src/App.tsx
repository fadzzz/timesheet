import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { useAuthStore } from './store/authStore';
import type { User } from './types';

function App() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for auth token in URL
      const urlParams = new URLSearchParams(window.location.search);
      const authToken = urlParams.get('auth');
      
      if (authToken) {
        try {
          // Decode the user data from the token
          const userData: User = JSON.parse(atob(authToken));
          console.log('Parsed user data:', userData);
          
          // Store in localStorage for persistence
          localStorage.setItem('timesheet_user', JSON.stringify(userData));
          
          // Update auth store
          useAuthStore.setState({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Failed to parse auth token:', error);
          useAuthStore.setState({ isLoading: false });
        }
      } else {
        // Check for existing auth
        const storedUser = localStorage.getItem('timesheet_user');
        if (storedUser) {
          try {
            const userData: User = JSON.parse(storedUser);
            console.log('Found stored user:', userData);
            
            useAuthStore.setState({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            localStorage.removeItem('timesheet_user');
            useAuthStore.setState({ isLoading: false });
          }
        } else {
          useAuthStore.setState({ isLoading: false });
        }
      }
      
      setInitializing(false);
    };

    initializeAuth();
  }, []);

  if (initializing || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated && user ? <Dashboard /> : <Login />;
}

export default App;
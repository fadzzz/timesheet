import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check for auth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('auth');
    
    if (authToken) {
      try {
        // Decode the user data from the token
        const userData = JSON.parse(atob(authToken));
        // Store user data and mark as authenticated
        const authStore = useAuthStore.getState();
        authStore.user = userData;
        authStore.isAuthenticated = true;
        authStore.isLoading = false;
        
        // Store in localStorage for persistence
        localStorage.setItem('timesheet_user', JSON.stringify(userData));
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Failed to parse auth token:', error);
      }
    } else {
      // Check for existing auth
      const storedUser = localStorage.getItem('timesheet_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const authStore = useAuthStore.getState();
          authStore.user = userData;
          authStore.isAuthenticated = true;
          authStore.isLoading = false;
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          checkAuth();
        }
      } else {
        checkAuth();
      }
    }
  }, []);

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
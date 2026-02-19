// SessionManager.js
// Utility for managing session state and route protection

import AuthService from '../services/AuthService';

class SessionManager {
  setupStorageListener(callback) {
    window.addEventListener('localStorageUpdate', callback);
    window.addEventListener('storage', callback);
    
    return () => {
      window.removeEventListener('localStorageUpdate', callback);
      window.removeEventListener('storage', callback);
    };
  }

  getRedirectPath(role) {
    if (role === 'admin') {
      return '/admin/dashboard';
    }
    if (role === 'teacher') {
      return '/teacher/dashboard';
    }
    return '/';
  }

  requireAuth(navigate) {
    if (!AuthService.isAuthenticated()) {
      navigate('/');
      return false;
    }
    return true;
  }

  requireRole(role, navigate) {
    if (!AuthService.isAuthenticated()) {
      navigate('/');
      return false;
    }
    
    const userRole = AuthService.getUserRole();
    if (userRole !== role) {
      navigate(this.getRedirectPath(userRole));
      return false;
    }
    
    return true;
  }
}

export default new SessionManager();

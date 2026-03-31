// Mock user database (in production, this would be a real backend)
const USERS_KEY = 'ecosafe_users';

// Initialize with demo users if none exist
const initializeDemoUsers = () => {
  try {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      const demoUsers = [
        {
          id: '1',
          name: 'Demo User',
          email: 'demo@ecosafe.com',
          password: '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeYhQGYhQGYhQGYhQGYhQGYhQGYhQGYhQ', // hashed 'demo123'
          role: 'user',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Admin User',
          email: 'admin@ecosafe.com',
          password: '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeYhQGYhQGYhQGYhQGYhQGYhQGYhQGYhQ', // hashed 'admin123'
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    }
  } catch (error) {
    console.error('Error initializing demo users:', error);
  }
};

// Call initialization safely
try {
  initializeDemoUsers();
} catch (error) {
  console.error('Failed to initialize auth:', error);
}

export const authAPI = {
  // Sign up new user
  signUp: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
          
          // Check if email already exists
          if (users.find(u => u.email === userData.email)) {
            reject({ message: 'Email already registered' });
            return;
          }

          const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // In production, hash this!
            role: 'user',
            createdAt: new Date().toISOString()
          };

          users.push(newUser);
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          
          resolve({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          });
        } catch (error) {
          reject({ message: 'Registration failed' });
        }
      }, 800);
    });
  },

  // Sign in user
  signIn: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
          const user = users.find(u => u.email === email && u.password === password);

          if (!user) {
            reject({ message: 'Invalid email or password' });
            return;
          }

          // Create JWT token (simplified for demo)
          const token = btoa(JSON.stringify({
            id: user.id,
            email: user.email,
            exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
          }));

          resolve({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        } catch (error) {
          reject({ message: 'Sign in failed' });
        }
      }, 800);
    });
  },

  // Get current user from token
  getCurrentUser: (token) => {
    try {
      if (!token) return null;
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        return null; // Token expired
      }
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find(u => u.id === decoded.id);
      
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
          const userIndex = users.findIndex(u => u.id === userId);

          if (userIndex === -1) {
            reject({ message: 'User not found' });
            return;
          }

          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          
          resolve(users[userIndex]);
        } catch (error) {
          reject({ message: 'Update failed' });
        }
      }, 800);
    });
  }
};

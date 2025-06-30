import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { AuthUser, CommitteeMember } from '../types';
import { MOCK_COMMITTEE_SECTIONS } from '../constants';

// --- Mock User Database ---
// In a real application, this would be handled by a secure backend.
const INITIAL_MOCK_USERS: (AuthUser & { password?: string })[] = MOCK_COMMITTEE_SECTIONS.flatMap(section =>
  section.members.map(member => ({
    ...member,
    permissionLevel: section.name.includes('(Current)') ? 'current' : 'past',
    password: 'password123',
  }))
);
// --- End Mock User Database ---

type RegisterResult = {
  success: boolean;
  message: string;
  user?: AuthUser;
};

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (details: Omit<CommitteeMember, 'id'>, password: string, permissionLevel: 'current' | 'past') => Promise<RegisterResult>;
  superAdminLogin: (password: string) => Promise<boolean>;
  users: (AuthUser & { password?: string })[]; // For admin
  deleteUser: (userId: string) => void; // For admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const item = window.localStorage.getItem('astro-user');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });
  
  const [users, setUsers] = useState<(AuthUser & { password?: string })[]>(() => {
    try {
        const item = window.localStorage.getItem('astro-users-db');
        return item ? JSON.parse(item) : INITIAL_MOCK_USERS;
    } catch (error) {
        return INITIAL_MOCK_USERS;
    }
  });

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('astro-user', JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem('astro-user');
    }
  }, [currentUser]);

  useEffect(() => {
    window.localStorage.setItem('astro-users-db', JSON.stringify(users));
  }, [users]);


  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    if (user && user.password === password) {
      // remove password before setting current user
      const { password: _, ...userToAuth } = user;
      setCurrentUser(userToAuth);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const register = async (details: Omit<CommitteeMember, 'id'>, password: string, permissionLevel: 'current' | 'past'): Promise<RegisterResult> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    
    if (users.find(u => u.email.toLowerCase() === details.email.toLowerCase())) {
        return { success: false, message: 'Email is already registered.' };
    }

    const newUserWithPassword = {
        ...details,
        id: `c-${Date.now()}`,
        permissionLevel: permissionLevel,
        password: password,
    };
    
    setUsers(prev => [...prev, newUserWithPassword]);

    const { password: _, ...newUserToReturn } = newUserWithPassword;
    
    return { success: true, message: 'Registration successful!', user: newUserToReturn };
  };

  const deleteUser = (userId: string) => {
    // Prevent deleting the currently logged-in user for safety
    if(currentUser?.id === userId) {
        alert("You cannot delete your own account while logged in.");
        return;
    }
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  };

  const superAdminLogin = async (password: string): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    
    if (password === '4321') {
      const adminUser: AuthUser = {
        id: 'super-admin-001',
        name: 'Super Administrator',
        role: 'President',
        email: 'admin@site.local',
        permissionLevel: 'current'
      };
      setCurrentUser(adminUser);
      return true;
    }
    return false;
  }


  const value = {
    isAuthenticated: !!currentUser,
    currentUser,
    login,
    logout,
    register,
    users,
    deleteUser,
    superAdminLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/auth';
import { db } from '../services/db';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (e: string, p: string) => Promise<void>;
    register: (e: string, p: string, n: string, ph: string, sq: string, sa: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Init check
    useEffect(() => {
        const initAuth = async () => {
            try {
                const session = await authService.verifySession();
                if (session) {
                    setUser(session.user);
                }
            } catch (e) {
                console.error("Session restore failed", e);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        const response = await authService.login(email, pass);
        setUser(response.user);
        db.setSession(response.user.id);
    };

    const register = async (email: string, pass: string, name: string, phone: string, securityQuestion: string, securityAnswer: string) => {
        const response = await authService.register(email, pass, name, phone, securityQuestion, securityAnswer);
        setUser(response.user);
        db.setSession(response.user.id);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        db.clearSession();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';

const SuperAdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { superAdminLogin, isAuthenticated } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        const success = await superAdminLogin(password);

        setIsLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('Incorrect administrator password.');
        }
    };
    
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-secondary">
            <div className="w-full max-w-sm animate-fade-in">
                <Card>
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-brand-text">Super Admin Access</h1>
                        <p className="text-brand-text-dark">Enter the password to log in.</p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password"className="text-sm font-bold text-brand-text-dark block mb-2">Password</label>
                            <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-slate-100 rounded-md border border-slate-300 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"
                            placeholder="••••"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                            <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent-dark disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                'Log In'
                            )}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
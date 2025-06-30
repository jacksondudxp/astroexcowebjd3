import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AccountManagement from './AccountManagement';
import Card from '../ui/Card';

const AdminAuthGate: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate a small delay
        setTimeout(() => {
            if (password === 'IAMTHEADMINOFWEBSITE') {
                setIsAuthenticated(true);
            } else {
                setError('Incorrect admin password.');
            }
            setIsLoading(false);
        }, 500);
    };

    if (isAuthenticated) {
        return <AccountManagement />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-secondary">
            <div className="w-full max-w-md animate-fade-in">
                <Card>
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-brand-text">Admin Panel Access</h1>
                        <p className="text-brand-text-dark">Enter the administrator password to continue.</p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="password"className="text-sm font-bold text-brand-text-dark block mb-2">Admin Password</label>
                            <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-slate-100 rounded-md border border-slate-300 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"
                            placeholder="••••••••"
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
                                'Authenticate'
                            )}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <Link to="/" className="text-sm font-medium text-brand-accent hover:text-brand-accent-dark">
                            &larr; Back to Main Portal
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminAuthGate;
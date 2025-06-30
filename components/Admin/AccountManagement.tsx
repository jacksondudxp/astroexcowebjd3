import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import type { AuthUser } from '../../types';

const AccountManagement: React.FC = () => {
    const { users, deleteUser } = useAuth();

    const handleDelete = (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            deleteUser(userId);
        }
    }

    return (
        <div className="bg-brand-secondary min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-brand-text">Account Management</h1>
                        <p className="text-lg text-brand-text-dark">Viewing all registered users in the system.</p>
                    </div>
                    <Link to="/" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                        &larr; Back to Portal
                    </Link>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Name</th>
                                    <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Email</th>
                                    <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Role</th>
                                    <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Permission</th>
                                    <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user: AuthUser & { password?: string }) => (
                                    <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-3 font-medium text-brand-text">{user.name}</td>
                                        <td className="p-3 text-brand-text-dark">{user.email}</td>
                                        <td className="p-3 text-brand-text-dark">{user.role}</td>
                                        <td className="p-3">
                                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.permissionLevel === 'current' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {user.permissionLevel}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button 
                                                onClick={() => handleDelete(user.id, user.name)} 
                                                className="bg-red-100 text-red-700 hover:bg-red-200 font-semibold px-3 py-1 rounded-md text-sm transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-brand-text-dark">No registered users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AccountManagement;
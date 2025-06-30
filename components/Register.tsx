import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { CommitteeMember } from '../types';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'General Secretary' as CommitteeMember['role'],
        password: '',
        confirmPassword: '',
        passcode: '',
        sectionId: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();
    const { addCommitteeMember, committeeSections } = useData();
    
    useEffect(() => {
        document.body.classList.add('login-bg');
        return () => {
            document.body.classList.remove('login-bg');
        };
    }, []);
    
    const roles: CommitteeMember['role'][] = [
      'President', 
      'Internal Vice President', 
      'External Vice President', 
      'General Secretary',
      'Financial Secretary',
      'Internal Secretary',
      'External Secretary',
      'Promotion Secretary',
      'Academic Secretary',
      'IT Secretary',
      'Material Secretary',
      'Marketing Secretary'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // --- Frontend Validation ---
        if (!formData.sectionId) {
            setError('Please select a committee section.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (formData.passcode !== 'IAMEXCOOFASTRO') {
            setError('The registration code is incorrect.');
            return;
        }

        setIsLoading(true);
        
        const selectedSection = committeeSections.find(sec => sec.id === formData.sectionId);
        if (!selectedSection) {
            setError('Invalid committee section selected.');
            setIsLoading(false);
            return;
        }

        const permissionLevel = selectedSection.name.includes('(Current)') ? 'current' : 'past';

        const { name, email, role } = formData;
        const result = await register({ name, email, role }, formData.password, permissionLevel);

        if (result.success && result.user) {
            addCommitteeMember(formData.sectionId, result.user);
            navigate('/login?registered=true');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="content-on-top flex items-center justify-center min-h-screen">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl animate-fade-in border border-white/20">
                <div className="text-center">
                    <img src="https://ik.imagekit.io/xr12i05xn/astro%20logo.png?updatedAt=1751123974369" alt="AstroClub Logo" className="w-24 h-24 mx-auto mb-4 bg-slate-800/50 rounded-full p-3" />
                    <h1 className="text-3xl font-bold text-white">Create Exco Account</h1>
                    <p className="text-slate-300">Fill in your details to get started</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-300 block mb-1">Full Name</label>
                            <input name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400" />
                        </div>
                         <div>
                            <label className="text-sm font-bold text-slate-300 block mb-1">Committee Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white" style={{colorScheme: 'dark'}}>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-bold text-slate-300 block mb-1">Email Address</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-300 block mb-1">Committee Section</label>
                        <select name="sectionId" value={formData.sectionId} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white" style={{colorScheme: 'dark'}}>
                            <option value="" disabled>Select a session...</option>
                            {committeeSections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-slate-300 block mb-1">Password</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-300 block mb-1">Confirm Password</label>
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-300 block mb-1">Registration Code</label>
                        <input name="passcode" type="password" value={formData.passcode} onChange={handleChange} required className="w-full p-2 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400" placeholder="Enter the registration code" />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent-dark disabled:bg-slate-500 disabled:cursor-not-allowed">
                            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Register Account'}
                        </button>
                    </div>
                </form>

                 <div className="text-center text-sm text-slate-300">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-brand-accent hover:text-sky-400">
                    Sign in here
                  </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
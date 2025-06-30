import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
        setSuccessMessage('Registration successful! Please sign in.');
        // Clean up URL
        navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    document.body.classList.add('login-bg');
    return () => {
        document.body.classList.remove('login-bg');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };
  
  // If user is already logged in, redirect to dashboard
  if(isAuthenticated) {
      return <Navigate to="/" replace />
  }

  return (
    <div className="content-on-top flex items-center justify-center min-h-screen">
      <Link to="/super-admin" className="secret-saturn-button" aria-label="Super Admin Login">🪐</Link>
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl animate-fade-in border border-white/20 relative z-10">
        <div className="text-center">
            <img src="https://ik.imagekit.io/xr12i05xn/astro%20logo.png?updatedAt=1751123974369" alt="AstroClub Logo" className="w-32 h-32 mx-auto mb-4 bg-slate-800/50 rounded-full p-4" />
            <h1 className="text-3xl font-bold text-white">AstroClub Exco Portal</h1>
            <p className="text-slate-300">Please sign in to continue</p>
        </div>

        {successMessage && <div className="p-3 bg-green-500/50 text-white border border-green-400 rounded-md text-center">{successMessage}</div>}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-slate-300 block mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400"
              placeholder="exco@astro.su.ust.hk"
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-bold text-slate-300 block mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-slate-900/50 rounded-md border border-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none text-white placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent-dark disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
          <p className="text-center text-xs text-slate-400">Demo password is 'password123' for all accounts.</p>
        </form>
         <div className="text-center text-sm text-slate-300">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-accent hover:text-sky-400">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
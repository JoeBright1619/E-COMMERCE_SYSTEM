import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const demoAdminEmail = import.meta.env.VITE_DEMO_ADMIN_EMAIL as string | undefined;
  const demoAdminPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD as string | undefined;
  const demoUserEmail = import.meta.env.VITE_DEMO_USER_EMAIL as string | undefined;
  const demoUserPassword = import.meta.env.VITE_DEMO_USER_PASSWORD as string | undefined;
  const showDemoButtons = !!(demoAdminEmail && demoUserEmail);

  if (authLoading) return null;
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'Admin' ? '/admin' : '/'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = (await api.post('/auth/login', { email, password })) as any;
      login(data);
      
      if (data.user?.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-panel">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your CAGURA account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cagura.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {showDemoButtons && (
            <div className="demo-credentials" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                onClick={() => { setEmail(demoAdminEmail!); setPassword(demoAdminPassword!); }}
              >
                Demo: Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}
                onClick={() => { setEmail(demoUserEmail!); setPassword(demoUserPassword!); }}
              >
                Demo: User
              </button>
            </div>
          )}
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

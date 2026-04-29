import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter username and password');
      return;
    }
    const success = await login(username, password);
    if (success) {
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '440px', marginTop: '80px' }}>
      <div className="form-header">
        <div className="logo-mark">
          <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 22L15 5L27 22H3Z" fill="url(#grad2)" opacity="0.95"/>
            <circle cx="15" cy="18" r="4" fill="url(#grad2)" opacity="0.6"/>
            <path d="M10 22Q15 16 20 22" stroke="url(#grad2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0057FF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#4D88FF', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1>Admin Login</h1>
        <p>AeroBay Dashboard Access</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="field" style={{ marginBottom: '24px' }}>
            <label htmlFor="admin-username">Username</label>
            <input
              type="text"
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
          <div className="field" style={{ marginBottom: '32px' }}>
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

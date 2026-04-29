import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auth is disabled for now, bypass directly to dashboard
    navigate('/admin/dashboard');
  }, [navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter' }}>
      Redirecting to dashboard...
    </div>
  );
}

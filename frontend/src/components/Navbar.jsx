import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { LogOut, Bell, Shield, Radio } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="badge-tag">
          <Radio size={14} style={{ color: '#22d3ee', animation: 'pulse 2s infinite' }} />
          Cluster Online
        </div>
        <div className="badge-tag" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
          v1.0.0 Enterprise
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-icon" title="Notifications">
          <Bell size={18} />
        </button>

        <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: 'white',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
            }}
          >
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{user?.username || 'Admin'}</div>
            <div style={{ fontSize: 11, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={10} /> {user?.role || 'ADMIN'}
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-icon" title="Logout" style={{ color: '#fb7185' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Cpu, Activity, FileText, PlusCircle, Layers } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Scheduled Jobs', path: '/jobs', icon: Calendar },
    { label: 'Create Job', path: '/jobs/create', icon: PlusCircle },
    { label: 'Worker Nodes', path: '/workers', icon: Cpu },
    { label: 'Execution History', path: '/executions', icon: Activity },
    { label: 'Audit Logs', path: '/audit-logs', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <div>
          <div className="brand-title">TaskScheduler</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>Distributed Engine</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Coordinator Health
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#34d399', fontWeight: 600 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          gRPC :9090 & HTTP :8080
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

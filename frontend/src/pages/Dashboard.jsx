import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Cpu, Activity, CheckCircle, AlertTriangle, PlayCircle, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { stats, loading, error } = useDashboardData();

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: '#fb7185' }}>Error loading stats: {error}</div>;

  const statCards = [
    { title: 'Total Scheduled Jobs', value: stats?.totalJobs || 0, icon: Calendar, color: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)' },
    { title: 'Active Jobs', value: stats?.activeJobs || 0, icon: PlayCircle, color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' },
    { title: 'Cluster Workers', value: stats?.totalWorkers || 0, icon: Cpu, color: '#38bdf8', bg: 'rgba(14, 165, 233, 0.15)' },
    { title: 'Online Workers', value: stats?.onlineWorkers || 0, icon: CheckCircle, color: '#4ade80', bg: 'rgba(34, 197, 94, 0.15)' },
    { title: 'Total Executions', value: stats?.totalExecutions || 0, icon: Activity, color: '#c084fc', bg: 'rgba(168, 85, 247, 0.15)' },
    { title: 'Failed Executions', value: stats?.failedExecutions || 0, icon: AlertTriangle, color: '#fb7185', bg: 'rgba(244, 63, 94, 0.15)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            System Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Real-time telemetry and task orchestration metrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/jobs/create" className="btn btn-primary">
            <Zap size={16} /> New Job
          </Link>
          <Link to="/workers" className="btn btn-secondary">
            <Cpu size={16} /> View Cluster
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: card.bg, color: card.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className="stat-title">{card.title}</div>
                <div className="stat-value">{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cluster Quick Status Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>Task Scheduler Dispatch Engine Active</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Auto-polling database every 5,000ms with failover reassignment</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Running Tasks: </span>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{stats?.runningExecutions || 0}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Successful Tasks: </span>
            <span style={{ fontWeight: 700, color: '#34d399' }}>{stats?.successfulExecutions || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

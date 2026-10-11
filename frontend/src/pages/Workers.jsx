import React, { useState, useEffect } from 'react';
import { getWorkers } from '../services/workerService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/dateFormatter';
import { Cpu, Server, Activity, HardDrive, RefreshCw } from 'lucide-react';

export const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      const data = await getWorkers();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    const interval = setInterval(fetchWorkers, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Worker Nodes Cluster
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Live gRPC heartbeat monitoring and node load metrics
          </p>
        </div>

        <button onClick={fetchWorkers} className="btn btn-secondary" style={{ fontSize: 13 }}>
          <RefreshCw size={14} /> Refresh Nodes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {workers.map((worker) => {
          const loadPercent = Math.min(100, Math.round((worker.activeTasksCount / (worker.maxConcurrentTasks || 1)) * 100));
          return (
            <div key={worker.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <Server size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{worker.workerId}</div>
                    <div className="font-mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      {worker.hostname}:{worker.port}
                    </div>
                  </div>
                </div>
                <StatusBadge status={worker.status} />
              </div>

              {/* Concurrency Load Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-dim)' }}>Concurrency Capacity</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {worker.activeTasksCount} / {worker.maxConcurrentTasks} tasks ({loadPercent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 9999, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${loadPercent}%`,
                      height: '100%',
                      borderRadius: 9999,
                      background: loadPercent > 80 ? '#fb7185' : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'rgba(0,0,0,0.25)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Activity size={12} /> Memory Usage
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#38bdf8', marginTop: 2 }}>
                    {worker.memoryUsageMB ? `${worker.memoryUsageMB.toFixed(1)} MB` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <HardDrive size={12} /> Supported Handlers
                  </div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {worker.supportedTaskTypes || 'ALL'}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'right' }}>
                Heartbeat: {formatDate(worker.lastHeartbeatAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Workers;

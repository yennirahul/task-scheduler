import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExecutions } from '../services/executionService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/dateFormatter';
import { Eye, Clock, Activity } from 'lucide-react';

export const ExecutionHistory = () => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const data = await getExecutions();
        setExecutions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExecutions();
    const interval = setInterval(fetchExecutions, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Execution History
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Audit trace and timeline of task dispatches across cluster workers
        </p>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Execution ID</th>
              <th>Job Name</th>
              <th>Worker Node</th>
              <th>Status</th>
              <th>Attempt</th>
              <th>Dispatched At</th>
              <th style={{ textAlign: 'right' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {executions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                  No execution records logged yet.
                </td>
              </tr>
            ) : (
              executions.map((exec) => (
                <tr key={exec.id}>
                  <td>
                    <span className="font-mono" style={{ fontSize: 12, color: '#818cf8' }}>
                      {exec.id.substring(0, 8)}...
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{exec.jobName}</span>
                  </td>
                  <td>
                    <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {exec.workerId || 'Unassigned'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={exec.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>#{exec.attemptNumber}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-dim)' }}>
                      <Clock size={13} />
                      {formatDate(exec.createdAt)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/executions/${exec.id}`}
                      className="btn-icon"
                      title="Inspect Execution"
                      style={{ color: '#818cf8', display: 'inline-flex' }}
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionHistory;

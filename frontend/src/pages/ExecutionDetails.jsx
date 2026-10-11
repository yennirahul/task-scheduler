import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExecutionById, getExecutionEvents } from '../services/executionService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/dateFormatter';
import { ArrowLeft, CheckCircle, Clock, Server, Terminal, AlertTriangle } from 'lucide-react';

export const ExecutionDetails = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [execData, eventData] = await Promise.all([
          getExecutionById(id),
          getExecutionEvents(id),
        ]);
        setExecution(execData);
        setEvents(eventData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!execution) return <div style={{ color: 'var(--text-dim)' }}>Execution record not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Link to="/executions" className="btn btn-secondary" style={{ width: 'fit-content', padding: '6px 14px', fontSize: 13 }}>
        <ArrowLeft size={16} /> Back to History
      </Link>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Execution Details
            </h1>
            <div className="font-mono" style={{ fontSize: 13, color: '#818cf8', marginTop: 4 }}>
              UUID: {execution.id}
            </div>
          </div>
          <StatusBadge status={execution.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Job Name</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>{execution.jobName}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Worker Assigned</div>
            <div className="font-mono" style={{ fontSize: 13, color: '#38bdf8', marginTop: 4 }}>{execution.workerId || 'None'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dispatch Attempt</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>#{execution.attemptNumber}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Started At</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{formatDate(execution.startedAt)}</div>
          </div>
        </div>

        {execution.resultOutput && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={14} /> Execution Result Output
            </div>
            <pre style={{ background: '#0b101d', padding: 16, borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: 12, border: '1px solid rgba(16, 185, 129, 0.25)', overflowX: 'auto' }}>
              {execution.resultOutput}
            </pre>
          </div>
        )}

        {execution.errorMessage && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fb7185', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} /> Failure Trace / Error
            </div>
            <pre style={{ background: '#0b101d', padding: 16, borderRadius: 'var(--radius-md)', color: '#fb7185', fontSize: 12, border: '1px solid rgba(244, 63, 94, 0.25)', overflowX: 'auto' }}>
              {execution.errorMessage}
            </pre>
          </div>
        )}
      </div>

      {/* Events Timeline */}
      <div className="glass-card">
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 20 }}>
          Execution Lifecycle Events
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {events.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>No events logged for this execution.</div>
          ) : (
            events.map((evt) => (
              <div key={evt.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', marginTop: 6, boxShadow: '0 0 8px #6366f1' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>
                      {evt.eventType}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{formatDate(evt.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{evt.message}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionDetails;

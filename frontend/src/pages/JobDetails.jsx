import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/jobService';
import { getExecutionsByJobId } from '../services/executionService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/dateFormatter';
import { ArrowLeft, Clock, Calendar, Eye, Activity, HardDrive } from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, execData] = await Promise.all([
          getJobById(id),
          getExecutionsByJobId(id),
        ]);
        setJob(jobData);
        setExecutions(execData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!job) return <div style={{ color: 'var(--text-dim)' }}>Job not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Link to="/jobs" className="btn btn-secondary" style={{ width: 'fit-content', padding: '6px 14px', fontSize: 13 }}>
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{job.name}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{job.description || 'No description provided'}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Task Handler</div>
            <div className="font-mono" style={{ fontSize: 14, color: '#818cf8', marginTop: 4 }}>{job.taskType}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Schedule Type</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>{job.scheduleType}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Next Scheduled Run</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{formatDate(job.nextRunAt)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Last Run At</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{formatDate(job.lastRunAt)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Recent Executions</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Execution ID</th>
                <th>Worker ID</th>
                <th>Status</th>
                <th>Attempt</th>
                <th>Started At</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-dim)' }}>
                    No executions recorded for this job yet.
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
                      <span className="font-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {exec.workerId || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={exec.status} />
                    </td>
                    <td>#{exec.attemptNumber}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-dim)' }}>{formatDate(exec.startedAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/executions/${exec.id}`}
                        className="btn-icon"
                        title="View Details"
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
    </div>
  );
};

export default JobDetails;

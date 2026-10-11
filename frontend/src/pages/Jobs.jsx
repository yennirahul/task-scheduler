import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, updateJobStatus, deleteJob } from '../services/jobService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/dateFormatter';
import { Plus, Play, Pause, Trash2, Eye, Calendar, Clock } from 'lucide-react';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    await updateJobStatus(job.id, newStatus);
    fetchJobs();
  };

  const handleDeleteConfirm = async () => {
    if (selectedJobId) {
      await deleteJob(selectedJobId);
      setShowDeleteModal(false);
      fetchJobs();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Scheduled Jobs
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Manage recurring CRON schedules and fixed-rate tasks
          </p>
        </div>
        <Link to="/jobs/create" className="btn btn-primary">
          <Plus size={16} /> Create Job
        </Link>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Job Name</th>
              <th>Task Handler</th>
              <th>Schedule Type</th>
              <th>Status</th>
              <th>Next Run</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                  No scheduled jobs configured. Click "Create Job" to get started.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{job.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{job.description || 'No description'}</div>
                  </td>
                  <td>
                    <span className="font-mono" style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#818cf8' }}>
                      {job.taskType}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {job.scheduleType === 'FIXED_RATE' ? `Every ${job.fixedRateMs / 1000}s` : job.scheduleType}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} style={{ color: 'var(--text-dim)' }} />
                      {formatDate(job.nextRunAt)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className="btn-icon"
                        title={job.status === 'ACTIVE' ? 'Pause Job' : 'Resume Job'}
                        style={{ color: job.status === 'ACTIVE' ? '#fbbf24' : '#34d399' }}
                      >
                        {job.status === 'ACTIVE' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn-icon"
                        title="View Details"
                        style={{ color: '#818cf8', display: 'inline-flex' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => { setSelectedJobId(job.id); setShowDeleteModal(true); }}
                        className="btn-icon"
                        title="Delete Job"
                        style={{ color: '#fb7185' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Job"
        message="Are you sure you want to delete this scheduled job? Any associated execution records will be retained."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Jobs;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/jobService';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    taskType: 'LOGGING',
    taskData: '',
    scheduleType: 'FIXED_RATE',
    cronExpression: '',
    fixedRateMs: 5000,
    maxRetries: 3,
    timeoutSeconds: 60,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      navigate('/jobs');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create job');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button
        onClick={() => navigate('/jobs')}
        className="btn btn-secondary"
        style={{ width: 'fit-content', padding: '6px 14px', fontSize: 13 }}
      >
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Create Scheduled Job
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Define the job parameters, task handler, and trigger schedule
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="form-group">
          <label className="form-label">Job Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-control"
            placeholder="e.g. Daily Data Sync"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-control"
            placeholder="Brief explanation of the task"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Task Handler Type *</label>
            <select
              value={formData.taskType}
              onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
              className="form-control"
            >
              <option value="LOGGING">LOGGING (System Log)</option>
              <option value="ARITHMETIC">ARITHMETIC (Computation)</option>
              <option value="REPORT">REPORT (PDF / Export)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Schedule Trigger *</label>
            <select
              value={formData.scheduleType}
              onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
              className="form-control"
            >
              <option value="FIXED_RATE">FIXED_RATE (Periodic Interval)</option>
              <option value="CRON">CRON (Cron Expression)</option>
              <option value="ONE_TIME">ONE_TIME (Immediate Dispatch)</option>
            </select>
          </div>
        </div>

        {formData.scheduleType === 'FIXED_RATE' && (
          <div className="form-group">
            <label className="form-label">Fixed Rate Interval (milliseconds)</label>
            <input
              type="number"
              value={formData.fixedRateMs}
              onChange={(e) => setFormData({ ...formData, fixedRateMs: Number(e.target.value) })}
              className="form-control"
              placeholder="e.g. 5000 (5 seconds)"
            />
          </div>
        )}

        {formData.scheduleType === 'CRON' && (
          <div className="form-group">
            <label className="form-label">Cron Expression</label>
            <input
              type="text"
              value={formData.cronExpression}
              onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
              className="form-control font-mono"
              placeholder="0 0 12 * * ?"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Task Payload (JSON / String)</label>
          <textarea
            value={formData.taskData}
            onChange={(e) => setFormData({ ...formData, taskData: e.target.value })}
            className="form-control font-mono"
            style={{ height: 100, resize: 'vertical' }}
            placeholder='{"key": "value"}'
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Max Retries</label>
            <input
              type="number"
              value={formData.maxRetries}
              onChange={(e) => setFormData({ ...formData, maxRetries: Number(e.target.value) })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Timeout (seconds)</label>
            <input
              type="number"
              value={formData.timeoutSeconds}
              onChange={(e) => setFormData({ ...formData, timeoutSeconds: Number(e.target.value) })}
              className="form-control"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" onClick={() => navigate('/jobs')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save & Schedule Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;

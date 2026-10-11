import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: 20
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: 440,
          width: '100%',
          padding: 28,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{message}</p>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onCancel} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 13 }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

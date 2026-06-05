import React, { useState, useEffect } from 'react';

// ─── DEMO CHANGE THIS for the final demo ────────────────────────────────────
const APP_VERSION   = "v1.0.0";
const BANNER_COLOR  = "#16a34a";  // change to any hex for demo
const BANNER_TEXT   = "Polyglot Cloud Migration — Live";
// ────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [status, setStatus]     = useState(null);
  const [tasks, setTasks]       = useState([]);
  const [newTask, setNewTask]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    fetchStatus();
    fetchTasks();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({ status: 'unreachable', message: 'API not reachable' });
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch(`${API_BASE}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch {
      setError('Could not load tasks.');
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const created = await res.json();
      setTasks(prev => [...prev, created]);
      setNewTask('');
    } catch {
      setError('Error creating task. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  const statusColor = status?.status === 'healthy' ? '#22c55e' : '#ef4444';

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
      {/* Banner — change BANNER_COLOR and BANNER_TEXT above for demo */}
      <div style={{ background: BANNER_COLOR, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{BANNER_TEXT}</span>
        <span style={{ background: 'rgba(0,0,0,0.25)', color: '#fff', borderRadius: '999px', padding: '2px 12px', fontSize: '0.85rem' }}>{APP_VERSION}</span>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* API Status Card */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #334155' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>API Status</h2>
          {status ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: statusColor, display: 'inline-block', boxShadow: `0 0 8px ${statusColor}` }} />
              <span style={{ fontWeight: 600, color: statusColor }}>{status.status?.toUpperCase()}</span>
              <span style={{ color: '#64748b' }}>—</span>
              <span>{status.message}</span>
              {status.version && <span style={{ marginLeft: 'auto', color: '#475569', fontSize: '0.85rem' }}>API {status.version}</span>}
            </div>
          ) : (
            <span style={{ color: '#64748b' }}>Connecting…</span>
          )}
        </div>

        {/* Task Manager */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Task Queue</h2>

          <form onSubmit={addTask} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Enter a task title…"
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '8px',
                background: '#0f172a', border: '1px solid #334155',
                color: '#e2e8f0', fontSize: '1rem', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px', borderRadius: '8px', border: 'none',
                background: BANNER_COLOR, color: '#fff', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Adding…' : 'Add Task'}
            </button>
          </form>

          {error && <div style={{ color: '#f87171', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}

          {tasks.length === 0 ? (
            <div style={{ color: '#475569', textAlign: 'center', padding: '32px' }}>No tasks yet. Add one above.</div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map(task => (
                <li key={task.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b'
                }}>
                  <span>{task.title}</span>
                  <span style={{
                    fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px',
                    background: task.status === 'pending' ? '#854d0e' : '#166534',
                    color: task.status === 'pending' ? '#fef08a' : '#bbf7d0'
                  }}>{task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#334155', marginTop: '32px', fontSize: '0.8rem' }}>
          .NET Backend · Python Worker · Redis Queue · Deployed via GitHub Actions + Jenkins + Terraform
        </p>
      </div>
    </div>
  );
}

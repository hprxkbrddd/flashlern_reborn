import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/friendship/requests');
      setRequests(res.data || []);
    } catch (e) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadRequests();
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const act = async (id, action) => {
    try {
      await api.put(`/friendship/${action}`, { id });
      await loadRequests();
    } catch (e) {
      // silently ignore for now
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Notifications"
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e5e7eb',
          background: '#ffffff',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 17H9" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22c1.104 0 2-.672 2-1.5h-4c0 .828.896 1.5 2 1.5z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {requests.length > 0 && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#f97316'
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 44,
          width: 320,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          padding: 12,
          zIndex: 120,
          transition: 'opacity .18s ease, transform .18s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontSize: 14 }}>Уведомления</strong>
            <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {loading ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '12px 0', margin: 0 }}>Загрузка...</p>
            ) : requests.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '18px 0', margin: 0 }}>Новых заявок нет</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} style={{ padding: 10, borderRadius: 8, background: '#f9fafb', marginBottom: 8, border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {req.requesterUsername?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{req.requesterUsername}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>Запрос в друзья</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => act(req.id, 'accept')}
                        style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#10b981', color: '#fff', fontSize: 12, cursor: 'pointer' }}
                      >
                        Принять
                      </button>
                      <button
                        onClick={() => act(req.id, 'decline')}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#111827', fontSize: 12, cursor: 'pointer' }}
                      >
                        Отклонить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;


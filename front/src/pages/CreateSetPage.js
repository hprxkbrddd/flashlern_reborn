import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../utils/auth';
import api from '../utils/api';
import '../styles/Dashboard.css';

function CreateSetPage() {
  const navigate = useNavigate();
  const username = getUsername();

  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PRIVATE');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [cards, setCards] = useState([]);
  const [saving, setSaving] = useState(false);


  const addCard = () => {
    if (!question.trim() && !answer.trim()) return;
    setCards((c) => [...c, { question: question.trim(), answer: answer.trim() }]);
    setQuestion('');
    setAnswer('');
  };

  const removeCard = (idx) => {
    setCards((c) => c.filter((_, i) => i !== idx));
  };

  const handleCreate = async () => {
    if (!title.trim() || cards.length === 0) {
      alert('Please provide a title and at least one card');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        username,
        title: title.trim(),
        description: description.trim(),
        visibility,
        tags,
        flashCards: cards
      };
      const res = await api.post('/flashcards/create', payload);
      const created = res && res.data ? res.data : { id: `new-${Date.now()}`, title, description, cards };
      // navigate back to dashboard and pass created set so it appears instantly
      navigate(`/${username}/dashboard`, { state: { createdSet: created } });
    } catch (err) {
      console.error('Failed to save set', err);
      alert('Failed to create set');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div style={{ padding: 16 }}>
          <button onClick={() => navigate(`/${username}/dashboard`)} style={{ padding: '8px 10px', borderRadius: 6 }}>Back</button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">Create new set</div>
          <div className="header-right" />
        </header>

        <main className="dashboard-content" style={{ padding: 24 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 20, borderRadius: 8 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter set title" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 12 }} />

            <label style={{ display: 'block', marginBottom: 8 }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)" rows={3} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 12 }} />

            <label style={{ display: 'block', marginBottom: 8 }}>Visibility</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 12 }}>
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
              <option value="FRIENDS">Friends</option>
            </select>

            <label style={{ display: 'block', marginBottom: 8 }}>Tags</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const val = tagInput.trim(); if (val && !tags.includes(val)) { setTags((t) => [...t, val]); setTagInput(''); } } }}
                placeholder="Type tag and press Enter"
                style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #e5e7eb' }}
              />
              <button
                onClick={() => {
                  const val = tagInput.trim();
                  if (!val) return;
                  if (!tags.includes(val)) setTags((t) => [...t, val]);
                  setTagInput('');
                }}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' }}
              >Добавить тег</button>
            </div>

            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {tags.map((t, idx) => (
                  <div key={idx} className="tag-pill">
                    <span>{t}</span>
                    <button className="remove" onClick={() => setTags((old) => old.filter((_, i) => i !== idx))}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <label style={{ display: 'block', marginBottom: 8 }}>Add cards</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Front" style={{ padding: 10, borderRadius: 6, border: '1px solid #e5e7eb' }} />
              <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Back" style={{ padding: 10, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={addCard} style={{ padding: '8px 12px', borderRadius: 6, background: '#10b981', color: '#fff', border: 'none' }}>Add card</button>
              <div style={{ alignSelf: 'center', color: '#6b7280' }}>{cards.length} cards</div>
            </div>

            {cards.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <h4>Cards</h4>
                <div style={{ display: 'grid', gap: 8 }}>
                  {cards.map((c, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.question}</div>
                        <div style={{ color: '#6b7280' }}>{c.answer}</div>
                      </div>
                      <div>
                        <button onClick={() => removeCard(idx)} style={{ padding: '6px 8px', borderRadius: 6 }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => navigate(`/${username}/dashboard`)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving} style={{ padding: '8px 12px', borderRadius: 6, background: '#f97316', color: '#fff', border: 'none' }}>{saving ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateSetPage;

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getUsername, getAvatar } from '../utils/auth';
import api from '../utils/api';
import NotificationBell from '../components/NotificationBell';
import TopBar from '../components/TopBar';
import {
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
  LightningIcon
} from '../components/Icons';
import '../styles/StudySession.css';

function StudySessionPage() {
  const { setId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const username = getUsername();

  const passedSet = state?.set;

  const [set, setSet] = useState(passedSet || null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Session state
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [responses, setResponses] = useState([]); // array of { cardIdx, response: 'correct'|'forgot'|'skip' }
  const [sessionFinished, setSessionFinished] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(false);

  // Load set and cards
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (passedSet) {
          setSet(passedSet);
          setCards(passedSet.flashCards || passedSet.cards || []);
        } else {
          const res = await api.get(`/flashcards/getSet/${setId}`);
          const data = res.data;
          setSet(data);
          setCards((data && (data.flashCards || data.cards)) || []);
        }
      } catch (err) {
        console.error('Failed to load set', err);
        setSet(null);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [passedSet, setId]);

  const startSession = () => {
    setSessionStarted(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setResponses([]);
    setSessionFinished(false);
    setShowExitConfirm(false);
  };

  const handleResponse = (response) => {
    // Record response locally
    setResponses((prev) => [...prev, { cardIdx: currentIndex, response }]);

    // Move to next card or finish
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      // Session finished
      setSessionFinished(true);
    }
  };

  const restartSession = () => {
    startSession();
  };

  const goBack = () => {
    if (sessionStarted && !sessionFinished) {
      setShowExitConfirm(true);
    } else {
      navigate(`/${username}/dashboard`);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    setSessionStarted(false);
    setSessionFinished(false);
    setResponses([]);
    navigate(`/${username}/dashboard`);
  };

  const cancelExit = () => setShowExitConfirm(false);

  const cancelDelete = () => setShowDeleteConfirm(false);

  const deleteSet = async () => {
    // close modal immediately to avoid UI race with navigation
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      const res = await api.delete(`/flashcards/delete/${setId}`);
      console.log('delete response', res);
      alert('Набор удалён');
      navigate(`/${username}/dashboard`);
    } catch (err) {
      console.error('Failed to delete set', err);
      alert(err?.response?.data?.message || 'Не удалось удалить набор');
    } finally {
      setDeleting(false);
    }
  };

  const sendProgress = async (reviewed) => {
    if (!reviewed) return;
    try {
      setSendingProgress(true);
      await api.post('/user-stats/progress', { reviewed });
    } catch (e) {
      // ignore errors, don't block UI
    } finally {
      setSendingProgress(false);
    }
  };

  useEffect(() => {
    if (sessionFinished) {
      // send total reviewed once on completion
      const totalReviewed = responses.length;
      if (totalReviewed > 0) {
        sendProgress(totalReviewed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionFinished]);

  // Compute stats
  const correct = responses.filter((r) => r.response === 'correct').length;
  const forgot = responses.filter((r) => r.response === 'forgot').length;
  const skipped = responses.filter((r) => r.response === 'skip').length;
  const reviewed = responses.length;
  const remaining = Math.max(cards.length - reviewed, 0);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!set) return <div style={{ padding: 20 }}>Set not found.</div>;
  if (!cards || cards.length === 0) return <div style={{ padding: 20 }}>No cards in this set.</div>;

  // Use shared TopBar instead of inline header for consistency
  // headerLayout is kept for places that need it; prefer <TopBar /> in the returned layout
  const headerLayout = <TopBar />;

  const sidebarLayout = (
    <aside className="dashboard-sidebar">
      <div className="sidebar-icon-group">
        <button className="sidebar-icon-btn" onClick={() => navigate(`/${username}/dashboard`)} title="Главная страница">
          <HomeIcon />
        </button>
        <button className="sidebar-icon-btn" onClick={() => navigate(`/${username}`)} title="Профиль">
          <ProfileIcon />
        </button>
        <button className="sidebar-icon-btn" onClick={() => navigate(`/${username}/settings`)} title="Настройки">
          <SettingsIcon />
        </button>
      </div>
      <div className="sidebar-icon-group-bottom">
        <button className="sidebar-icon-btn" onClick={() => { localStorage.clear(); navigate('/login'); }} title="Выход">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );

  if (!sessionStarted) {
    return (
      <div className="dashboard-container study-layout">
        {sidebarLayout}
        <div className="dashboard-main">
          {headerLayout}
          <main className="dashboard-content study-main-content">
            <div className="study-intro-card">
              <div>
                <p className="study-label">Набор карточек</p>
                <h1 className="study-title">{set.title}</h1>
                <p className="study-intro-desc">{set.description || 'Начните изучение прямо сейчас!'}</p>
                { (set && (set.tags || set.tagsList) && (set.tags || set.tagsList).length > 0) && (
                  <div className="tag-list">
                    {(set.tags || set.tagsList || []).map((t, i) => (
                      <div key={i} className="tag-pill">{t}</div>
                    ))}
                  </div>
                )}
                <div className="study-intro-stats">
                  <div className="stat-item">
                    <span className="stat-label">Cards</span>
                    <span className="stat-value">{cards.length}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button className="study-start-btn" onClick={startSession}>
                  Start learning
                </button>
                <button className="edit-btn" onClick={() => navigate(`/${username}/edit-set/${setId}`)}>Редактировать</button>
                <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)} disabled={deleting}>{deleting ? 'Удаление...' : 'Удалить'}</button>
              </div>
            </div>
          </main>
        </div>

        {/* delete confirmation modal (accessible from intro before session starts) */}
        {showDeleteConfirm && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Удалить набор?</h3>
              <p>Это действие необратимо. Вы уверены, что хотите удалить этот набор?</p>
              <div className="modal-actions">
                <button className="edit-btn secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Отмена</button>
                <button className="edit-btn primary" onClick={deleteSet} disabled={deleting}>{deleting ? 'Удаление...' : 'Удалить'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sessionFinished) {
    return (
      <div className="dashboard-container study-layout">
        {sidebarLayout}
        <div className="dashboard-main">
          {headerLayout}
          <main className="dashboard-content study-main-content">
            <div className="study-results-card">
              <div className="results-head">
                <div>
                  <p className="study-label">Сессия завершена</p>
                  <h1>Great job!</h1>
                </div>
                <button className="study-back-btn subtle" onClick={() => navigate(`/${username}/dashboard`)}>← Back</button>
              </div>
              <div className="results-grid">
                <div className="result-card correct-bg">
                  <div className="result-icon">✓</div>
                  <div className="result-label">Remembered</div>
                  <div className="result-count">{correct}</div>
                </div>
                <div className="result-card forgot-bg">
                  <div className="result-icon">✗</div>
                  <div className="result-label">Forgot</div>
                  <div className="result-count">{forgot}</div>
                </div>
                <div className="result-card skip-bg">
                  <div className="result-icon">⊘</div>
                  <div className="result-label">Skipped</div>
                  <div className="result-count">{skipped}</div>
                </div>
              </div>
              <div className="results-summary">
                <p>You reviewed {reviewed} of {cards.length} cards</p>
                {reviewed > 0 && (
                  <p className="results-accuracy">
              <button
                className="back-button"
                onClick={() => {
                  // simple back behavior: navigate to user's dashboard
                  navigate(`/${username}/dashboard`);
                }}
              >
                Назад
              </button>
                    Accuracy: {correct + forgot > 0 ? Math.round((correct / (correct + forgot)) * 100) : 0}%
                  </p>
                )}
              </div>
              <div className="results-actions">
                <button className="study-restart-btn" onClick={restartSession}>
                  Restart session
                </button>
                <button className="study-close-btn" onClick={() => navigate(`/${username}/dashboard`)}>
                  Exit
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const overallProgress = (reviewed / cards.length) * 100;

  return (
    <div className="dashboard-container study-layout">
      {sidebarLayout}
      <div className="dashboard-main">
        {headerLayout}
        <main className="dashboard-content study-main-content two-col">
          <div className="study-left">
            <div className="study-top-bar">
              <button className="study-back-btn subtle" onClick={goBack}>← Exit</button>
              <div className="study-progress">
                <span className="progress-text">{currentIndex + 1} / {cards.length}</span>
                <div className="progress-bar-container thin">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div
              className={`study-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped((f) => !f)}
            >
              <div className="study-card-inner">
                <div className="study-card-front">
                  <div className="study-card-label">Question</div>
                  <div className="study-card-text">{currentCard.question || currentCard.front || '—'}</div>
                </div>
                <div className="study-card-back">
                  <div className="study-card-label">Answer</div>
                  <div className="study-card-text">{currentCard.answer || currentCard.back || '—'}</div>
                </div>
              </div>
            </div>

            <div className="study-hint">Click card to reveal answer</div>

            <div className="study-actions">
              <button
                className="study-action-btn correct-btn"
                onClick={() => handleResponse('correct')}
              >
                ✓ Remembered
              </button>
              <button
                className="study-action-btn forgot-btn"
                onClick={() => handleResponse('forgot')}
              >
                ✗ Forgot
              </button>
              <button
                className="study-action-btn skip-btn"
                onClick={() => handleResponse('skip')}
              >
                ⊘ Skip
              </button>
            </div>
          </div>

          <aside className="study-side">
            <div className="side-card">
              <div className="side-header">
                <span>Progress</span>
                <span className="side-count">{reviewed}/{cards.length}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${overallProgress}%` }} />
              </div>
              <div className="side-stats-grid">
                <div className="side-stat">
                  <p className="side-stat-label">Correct</p>
                  <p className="side-stat-value">{correct}</p>
                </div>
                <div className="side-stat">
                  <p className="side-stat-label">Forgot</p>
                  <p className="side-stat-value">{forgot}</p>
                </div>
                <div className="side-stat">
                  <p className="side-stat-label">Skipped</p>
                  <p className="side-stat-value">{skipped}</p>
                </div>
                <div className="side-stat">
                  <p className="side-stat-label">Remaining</p>
                  <p className="side-stat-value">{remaining}</p>
                </div>
              </div>
            </div>
            <div className="side-card tips">
              <h4>Tip</h4>
              <p>Try to recall before flipping. Use "Skip" when unsure to revisit later.</p>
            </div>
          </aside>
        </main>
      </div>

      {showExitConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Выйти из сессии?</h3>
            <p>Прогресс этой сессии не будет сохранён, если выйти сейчас.</p>
            <div className="modal-actions">
              <button className="edit-btn secondary" onClick={cancelExit}>Отмена</button>
              <button className="edit-btn primary" onClick={confirmExit}>Выйти</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Удалить набор?</h3>
            <p>Это действие необратимо. Вы уверены, что хотите удалить этот набор?</p>
            <div className="modal-actions">
              <button className="edit-btn secondary" onClick={cancelDelete} disabled={deleting}>Отмена</button>
              <button className="edit-btn primary" onClick={deleteSet} disabled={deleting}>{deleting ? 'Удаление...' : 'Удалить'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudySessionPage;

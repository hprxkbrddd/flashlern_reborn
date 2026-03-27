import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, clearAuthData, getUsername, getAvatar } from '../utils/auth';
import usePing from '../hooks/usePing';
import api from '../utils/api';
import NotificationBell from '../components/NotificationBell';
import {
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
  LightningIcon,
  FlameIcon,
  BookIcon,
  AtomIcon,
  LanguageIcon,
  CodeIcon,
  BrainIcon,
  GlobeIcon,
  HashIcon,
  PenIcon,
  ScalesIcon,
  MicroscopeIcon,
  CalculatorIcon,
  DocumentIcon,
  FilterIcon
} from '../components/Icons';
import '../styles/Dashboard.css';
import TopBar from '../components/TopBar';

function Dashboard() {
  const navigate = useNavigate();
  const username = getUsername();
  const [flashCards, setFlashCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayReviewed: 0,
    dailyGoal: 50,
    timeSpent: 0,
    accuracy: 0,
    streak: 0,
    dailyGoalCompleted: false
  });

  // Вызываем ping при загрузке страницы
  usePing();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Загружаем данные о флешкартах и статистике
    const fetchFlashCards = async () => {
      try {
        setLoading(true);
        
        // Получаем данные с эндпоинта dashboard
        const dashboardResponse = await api.get(`/dashboard/${username}`);
        const dashboardData = dashboardResponse.data;
        
        // Обновляем статистику из полученных данных
        setStats({
          todayReviewed: dashboardData.reviewedToday ?? dashboardData.todayReviewed ?? 0,
          dailyGoal: dashboardData.dailyGoal || 50,
          timeSpent: dashboardData.timeSpent || 0,
          accuracy: dashboardData.accuracy   || 0,
          streak: dashboardData.streak || 0,
          dailyGoalCompleted: dashboardData.dailyGoalCompleted || false
        });
        
        // Используем флешкарты, если бэк вернул их в dashboard response
        // backend may return `flashCards` or `flashcards` — accept both
        setFlashCards(dashboardData.flashCards || dashboardData.flashcards || []);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setFlashCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashCards();
  }, [username, navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const currentUsername = getUsername();
  const base = currentUsername ? `/${currentUsername}` : '';

  const goProfile = () => {
    if (currentUsername) {
      navigate(`${base}`);
    }
  };

  const goSettings = () => {
    navigate(`${base}/settings`);
  };

  const handleNewSet = () => {
    // Navigate to the Create Set page
    navigate(`${base}/create-set`);
  };

  const handleReviewNow = () => {
    // TODO: Начать сессию повторения
    console.log('Start review session');
  };

  // Categories and sample Basic sets (starter content for new users)
  const flashcardSetsByCategoryInitial = {
    Popular: [],
    Saved: [],
    Basic: [
      {
        id: 'basic-1',
        title: 'English Basics: Everyday Words',
        icon: BookIcon,
        cards: 12,
        accuracy: 0,
        type: 'BASIC',
        cardsData: [
          { front: 'Car', back: 'Машина' },
          { front: 'House', back: 'Дом' },
          { front: 'Book', back: 'Книга' }
        ]
      },
      {
        id: 'basic-2',
        title: 'Spanish Basics: Greetings',
        icon: GlobeIcon,
        cards: 8,
        accuracy: 0,
        type: 'BASIC',
        cardsData: [
          { front: 'Hola', back: 'Привет' },
          { front: 'Adiós', back: 'До свидания' }
        ]
      }
    ]
  };

  const [flashcardSetsByCategoryState, setFlashcardSetsByCategoryState] = useState(flashcardSetsByCategoryInitial);
  const [setsTab, setSetsTab] = useState('My');
  const [setsDisplayTab, setSetsDisplayTab] = useState('My');
  const location = useLocation();

  // Organize flashCards into category tabs
  const setSectionsByTab = {
    My: flashCards || [],
    Saved: (flashCards || []).filter((s) => !!(s.isSaved)),
    Popular: []
  };

  // Toggle saved (favorite) status for a set (uses `isSaved` field)
  const toggleSaved = async (e, setObj) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const id = setObj.id || setObj._id;

    // optimistic UI update
    setFlashCards((prev) => prev.map((s) => {
      const sid = s.id || s._id;
      if (sid === id) return { ...s, isSaved: !s.isSaved };
      return s;
    }));

    // attempt to persist to backend if endpoint exists
    try {
      // Try a POST that backend might implement; ignore errors
      await api.post(`/flashcards/save/${id}`, { isSaved: !setObj.isSaved });
    } catch (err) {
      // not critical; log for debugging
      // console.warn('Persisting saved state failed', err);
    }
  };

  // Search state and derived filtered sets
  const [searchQuery, setSearchQuery] = useState('');

  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filterTags, setFilterTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [minCards, setMinCards] = useState('');
  const [maxCards, setMaxCards] = useState('');
  const [dateOrder, setDateOrder] = useState(''); // 'newest' | 'oldest' | ''

  // available tags from all sets
  const availableTags = useMemo(() => {
    const s = new Set();
    (flashCards || []).forEach((st) => {
      const tags = st.tags || st.tagsList || st.tags || [];
      if (!tags) return;
      if (typeof tags === 'string') {
        tags.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => s.add(t));
      } else if (Array.isArray(tags)) {
        tags.forEach((t) => t && s.add(t));
      }
    });
    return Array.from(s).sort();
  }, [flashCards]);

  const tagSuggestions = useMemo(() => {
    const q = (tagInput || '').trim().toLowerCase();
    if (!q) return availableTags.filter(a => !filterTags.includes(a)).slice(0, 6);
    return availableTags.filter(a => !filterTags.includes(a) && a.toLowerCase().includes(q)).slice(0, 6);
  }, [availableTags, tagInput, filterTags]);

  const filteredSets = useMemo(() => {
    let list = setSectionsByTab[setsDisplayTab] || [];
    const q = (searchQuery || '').trim().toLowerCase();
    if (q) {
      list = list.filter((s) => ((s.title || s.name || '') + '').toLowerCase().includes(q));
    }

    // filter by tags (include set if it contains ALL selected tags)
    if (filterTags && filterTags.length > 0) {
      list = list.filter((s) => {
        const tagsRaw = s.tags || s.tagsList || s.tags || [];
        let tags = [];
        if (typeof tagsRaw === 'string') tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
        else if (Array.isArray(tagsRaw)) tags = tagsRaw.map(t => (t || '').toString());
        const lowTags = tags.map(t => t.toLowerCase());
        return filterTags.every(ft => lowTags.includes(ft.toLowerCase()));
      });
    }

    // filter by card count
    const parseCount = (s) => (s.flashCards && s.flashCards.length) || (s.cards && s.cards) || 0;
    const min = parseInt(minCards || '', 10);
    const max = parseInt(maxCards || '', 10);
    if (!isNaN(min)) {
      list = list.filter((s) => parseCount(s) >= min);
    }
    if (!isNaN(max)) {
      list = list.filter((s) => parseCount(s) <= max);
    }

    // sort by date if requested
    if (dateOrder === 'newest' || dateOrder === 'oldest') {
      list = list.slice().sort((a, b) => {
        const ad = new Date(a.createdAt || a.created || 0).getTime() || 0;
        const bd = new Date(b.createdAt || b.created || 0).getTime() || 0;
        return ad - bd;
      });
      if (dateOrder === 'newest') list = list.reverse();
    }

    return list;
  }, [setSectionsByTab, setsDisplayTab, searchQuery, filterTags, minCards, maxCards, dateOrder]);

  const progressPercentage = Math.min(100, (stats.todayReviewed / stats.dailyGoal) * 100);

  // State for Set Goal modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(stats.dailyGoal);

  const goalOptions = [10, 20, 35, 50, 100];

  const openGoalModal = () => {
    setSelectedGoal(stats.dailyGoal || 50);
    setShowGoalModal(true);
  };

  const closeGoalModal = () => setShowGoalModal(false);

  const handleSaveGoal = async () => {
    try {
      // send update to backend
      const res = await api.put(`/dashboard/update_daily_goal/${username}`, { dailyGoal: selectedGoal });
      // merge backend-returned stats into local state if present
      if (res && res.data) {
        // backend may return { stats: { ... } } or updated object directly
        const returned = res.data.stats || res.data;
        setStats((s) => ({ ...s, ...returned, dailyGoal: selectedGoal }));
      } else {
        // optimistic fallback
        setStats((s) => ({ ...s, dailyGoal: selectedGoal }));
      }
      setShowGoalModal(false);
    } catch (err) {
      console.error('Failed to update daily goal', err);
      // could show notification to user
    }
  };

  // If navigated here with a newly created set, insert it into Saved and flashCards list
  useEffect(() => {
    if (location && location.state && location.state.createdSet) {
      const created = location.state.createdSet;
      setFlashcardSetsByCategoryState((prev) => {
        const next = { ...prev };
        next.Saved = [
          {
            id: created.id || `new-${Date.now()}`,
            title: created.title || 'New set',
            icon: created.icon || BookIcon,
            cards: (created.cards && created.cards.length) || (created.cardsData && created.cardsData.length) || 0,
            accuracy: created.accuracy || 0,
            type: created.type || 'CUSTOM',
            cardsData: created.cards || created.cardsData || []
          },
          ...next.Saved
        ];
        return next;
      });
      // also prepend to backend flashCards list for immediate display
      setFlashCards((prev) => {
        const norm = {
          id: created.id || `new-${Date.now()}`,
          title: created.title || 'New set',
          description: created.description || created.desc || '',
          flashCards: created.flashCards || created.cards || created.cardsData || [],
        };
        return [norm, ...prev];
      });
      // clear location state to avoid duplicate insertion on refresh
      try { window.history.replaceState({}, document.title); } catch (e) {}
    }
  }, [location]);

  return (
    <div className="dashboard-container">
      {/* Левая боковая панель */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-icon-group">
          <button 
            className="sidebar-icon-btn active" 
            onClick={() => {}} 
            title="Главная страница"
          >
            <HomeIcon active={true} />
          </button>
          <button 
            className="sidebar-icon-btn" 
            onClick={goProfile}
            title="Профиль"
          >
            <ProfileIcon />
          </button>
          <button 
            className="sidebar-icon-btn" 
            onClick={goSettings}
            title="Настройки"
          >
            <SettingsIcon />
          </button>
        </div>
        <div className="sidebar-icon-group-bottom">
          <button 
            className="sidebar-icon-btn" 
            onClick={handleLogout}
            title="Выход"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <div className="dashboard-main">
        {/* Верхняя панель */}
        <TopBar showNewSet={true} onNewSet={handleNewSet} />

        {/* Основной контент */}
        <main className="dashboard-content">
          {/* Today's goal и Streak */}
          <div className="stats-row">
            {/* Today's goal карточка */}
            <div className="stats-card goal-card">
              <h3 className="stats-card-title">Today's goal</h3>
              <div className="goal-progress">
                <span className="goal-progress-text">
                  {stats.todayReviewed}/{stats.dailyGoal} cards reviewed
                </span>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="goal-tags">
                <span className="goal-tag">Daily: {stats.dailyGoal} cards</span>
                <span className="goal-tag">Time spent: {stats.timeSpent}m</span>
                <span className="goal-tag">Accuracy: {stats.accuracy}%</span>
              </div>
              <div className="goal-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="new-set-btn" onClick={openGoalModal} style={{ background: '#f97316', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px' }}>
                  Set a goal
                </button>
              </div>
            </div>

            {/* Streak карточка */}
            <div className="stats-card streak-card">
              <h3 className="stats-card-title">Streak</h3>
              <div className="streak-content">
                <div className="streak-number">{stats.streak}</div>
                <p className="streak-label">Consecutive days</p>
                <p className="streak-message">
                  Keep it up! Review at least 10 cards today to maintain your streak.
                </p>
                <div className="streak-actions">
                  <button className="streak-tips-btn">
                    <FlameIcon /> Streak tips
                  </button>
                  <button className="review-now-btn" onClick={handleReviewNow}>
                    Review now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard sets by section */}
          <div className="sets-section" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="sets-title">Flashcard sets</h2>
              <button className="customize-btn" onClick={() => setShowFilters(true)}>
                <FilterIcon /> Фильтры
              </button>
            </div>

            {/* Tabs + search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <div className="sets-tabs" style={{ display: 'flex', gap: 8 }}>
                {['My', 'Saved', 'Popular'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSetsDisplayTab(tab)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: setsDisplayTab === tab ? '2px solid #f97316' : '1px solid #e5e7eb',
                      background: setsDisplayTab === tab ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: setsDisplayTab === tab ? 600 : 500,
                      transition: 'all 0.2s',
                      fontSize: 14
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="sets-search" style={{ marginLeft: 12 }}>
                <input
                  type="text"
                  aria-label="Search sets by title"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', width: 220, outline: 'none' }}
                />
              </div>
            </div>

            {/* Display sets for selected tab (filtered by search) */}
            {filteredSets && filteredSets.length > 0 ? (
              <div className="sets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 220px))', gap: 16, alignItems: 'start' }}>
                {filteredSets.map((set) => {
                  const id = set.id || set._id || `${set.title}-${Math.random().toString(36).slice(2,8)}`;
                  const title = set.title || set.name || 'Untitled set';
                  const description = set.description || set.desc || set.summary || '';
                  return (
                    <div key={id} className="set-card" onClick={() => navigate(`${base}/study-session/${id}`, { state: { set } })} style={{ cursor: 'pointer', padding: 14, borderRadius: 8, background: '#fff', border: '1px solid #e5e7eb', height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(16,24,40,0.04)', transition: 'all 0.2s' }}>
                      {/* Save star */}
                      <button
                        className={"save-star" + (set.isSaved ? ' active' : '')}
                        onClick={(e) => toggleSaved(e, set)}
                        aria-label={set.isSaved ? 'Unsave set' : 'Save set'}
                        title={set.isSaved ? 'Убрать из избранного' : 'Добавить в избранное'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <h4 className="set-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h4>
                        <p className="set-desc" style={{ margin: 0, color: '#6b7280', fontSize: 13, lineHeight: '1.2', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{description || 'No description'}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{(set.flashCards && set.flashCards.length) || (set.cards && set.cards) || 0} cards</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                <p style={{ fontSize: 14 }}>{searchQuery ? 'No sets match your search.' : 'No sets in this section yet.'}</p>
              </div>
            )}
          </div>
          {/* Filters modal */}
          {showFilters && (
            <div className="filters-modal-backdrop">
              <div className="filters-modal">
                <h3 style={{ marginTop: 0 }}>Фильтры</h3>

                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Теги</label>
                  <div className="filter-tags-input">
                    {filterTags.map((t) => (
                      <span key={t} className="filter-tag">
                        {t}
                        <button className="filter-tag-remove" onClick={() => setFilterTags((prev) => prev.filter(x => x !== t))}>✕</button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (tagInput || '').trim();
                          if (val && !filterTags.includes(val)) {
                            setFilterTags((prev) => [...prev, val]);
                          }
                          setTagInput('');
                        }
                      }}
                      placeholder="Добавьте тег и нажмите Enter"
                      className="filter-tag-input"
                    />
                  </div>
                  {tagSuggestions && tagSuggestions.length > 0 && (
                    <div className="filter-suggestions">
                      {tagSuggestions.map((sugg) => (
                        <button key={sugg} className="filter-sugg-btn" onClick={() => { setFilterTags((prev) => [...prev, sugg]); setTagInput(''); }}>
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Количество карточек</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" min="0" placeholder="От (min)" value={minCards} onChange={(e) => setMinCards(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e6e6', width: 120 }} />
                    <input type="number" min="0" placeholder="До (max)" value={maxCards} onChange={(e) => setMaxCards(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e6e6', width: 120 }} />
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#444', marginBottom: 6 }}>Дата добавления</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={dateOrder} onChange={(e) => setDateOrder(e.target.value)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e6e6e6' }}>
                      <option value="">По умолчанию</option>
                      <option value="newest">Сначала новые</option>
                      <option value="oldest">Сначала старые</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                  <button className="customize-btn" onClick={() => { setFilterTags([]); setTagInput(''); setMinCards(''); setMaxCards(''); setDateOrder(''); }}>
                    Сбросить
                  </button>
                  <button className="new-set-btn" onClick={() => setShowFilters(false)}>
                    Применить
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Goal modal */}
          {showGoalModal && (
            <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
              <div className="modal" style={{ background: '#fff', borderRadius: 8, padding: 20, width: 360, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <h3 style={{ marginTop: 0 }}>Set your daily goal</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginTop: 12 }}>
                  {goalOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedGoal(opt)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 6,
                        border: selectedGoal === opt ? '2px solid #f97316' : '1px solid #e5e7eb',
                        background: selectedGoal === opt ? '#fff7ed' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {opt} cards
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                  <button onClick={closeGoalModal} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' }}>Cancel</button>
                  <button onClick={handleSaveGoal} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#f97316', color: '#fff' }}>Save</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

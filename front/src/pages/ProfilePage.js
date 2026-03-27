import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../utils/api';
import usePing from '../hooks/usePing';
import { isLoggedIn, clearAuthData, getUsername, getAvatar, setAvatar } from '../utils/auth';
import NotificationBell from '../components/NotificationBell';
import {
  HomeIcon,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
  LightningIcon
} from '../components/Icons';
import '../styles/ProfilePage.css';
import '../styles/Dashboard.css';
import AvatarUploader from '../components/AvatarUploader';
import TopBar from '../components/TopBar';

function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchFriendQuery, setSearchFriendQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendActionStatus, setFriendActionStatus] = useState(null);
  const [friendActionLoading, setFriendActionLoading] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('about');

  const debouncedSearch = useRef(null);

  // Вызываем ping при загрузке страницы
  usePing();

  useEffect(() => {
    // Проверяем, аутентифицирован ли пользователь
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        // Получаем информацию о профиле с контроллера profile
            const response = await api.get(`/profile/${username}`);
            setProfile(response.data);
            // persist avatar for TopBar across pages ONLY if this is the logged-in user's profile
            try {
              const logged = getUsername();
              if (response.data && response.data.avatarUrl && response.data.username === logged) {
                setAvatar(response.data.avatarUrl);
              }
            } catch (e) { /* ignore */ }
        // Загружаем друзей
        const friendsRes = await api.get('/friendship/friends');
        setFriends(friendsRes.data || []);
        setLoading(false);
      } catch (err) {
        // Обрабатываем различные типы ошибок
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            // 401 обрабатывается в interceptor, просто перенаправляем
            navigate('/login');
          } else if (status === 403) {
            setError('У вас нет прав для просмотра этого профиля');
          } else if (status === 404) {
            setError('Пользователь не найден');
          } else {
            setError('Ошибка загрузки профиля: ' + (err.response?.data?.message || 'Неизвестная ошибка'));
          }
        } else {
          setError('Ошибка сети. Проверьте подключение к интернету.');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  const handleLogout = () => {
    // Очищаем данные аутентификации
    clearAuthData();
    navigate('/login');
  };

  const currentUsername = getUsername();
  const base = currentUsername ? `/${currentUsername}` : '';
  const goHome = () => navigate(`${base}/dashboard`);
  const goToEdit = () => navigate(`/${username}/edit`);
  const goSettings = () => navigate(`${base}/settings`);
  const isOwnProfile = currentUsername === username;
  const location = useLocation();
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);

  const handleAvatarClick = () => {
    if (!currentUsername) return;
    // If viewing your own profile, open uploader to change avatar
    if (isOwnProfile) {
      setShowAvatarUploader(true);
      return;
    }
    const profilePath = `/${currentUsername}/profile`;
    const altProfilePath = `/${currentUsername}`;
    if (location.pathname === profilePath || location.pathname === altProfilePath) return;
    navigate(profilePath);
  };

  const searchUsers = (value) => {
    const q = value.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    api.get(`/friendship/search?query=${encodeURIComponent(q)}`)
      .then((res) => setSearchResults(res.data || []))
      .catch(() => setSearchResults([]));
  };
  const handleAvatarUploaded = async (avatarUrl) => {
    // Refresh profile to reflect new avatar from backend
    try {
      const res = await api.get(`/profile/${username}`);
      setProfile(res.data);
      if (res.data && res.data.avatarUrl) {
        try { setAvatar(res.data.avatarUrl); } catch (e) { /* ignore */ }
      }
    } catch (err) {
      // ignore failures here
    }
    setShowAvatarUploader(false);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchFriendQuery(val);
    if (debouncedSearch.current) clearTimeout(debouncedSearch.current);
    debouncedSearch.current = setTimeout(() => searchUsers(val), 250);
  };

  const handleSendFriendRequest = async (candidate) => {
    const usernameToAdd = (candidate || searchFriendQuery).trim();
    if (!usernameToAdd) {
      setFriendActionStatus({ type: 'error', message: 'Введите username друга' });
      return;
    }
    try {
      setFriendActionLoading(true);
      setFriendActionStatus(null);
      await api.post('/friendship/send', { receiver: usernameToAdd });
      setFriendActionStatus({ type: 'success', message: 'Заявка отправлена' });
      setSearchFriendQuery('');
      setSearchResults([]);
      // Обновляем список друзей после успешного действия
      try {
        const friendsRes = await api.get('/friendship/friends');
        setFriends(friendsRes.data || []);
      } catch (_) {
        // ignore
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Не удалось отправить заявку';
      setFriendActionStatus({ type: 'error', message: msg });
    } finally {
      setFriendActionLoading(false);
    }
  };

  // Generate friend code removed — search will use username directly

  if (loading) {
    return (
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-icon-group">
            <button className="sidebar-icon-btn" onClick={goHome} title="Главная страница">
              <HomeIcon />
            </button>
            <button className="sidebar-icon-btn active" onClick={() => {}} title="Профиль">
              <ProfileIcon active={true} />
            </button>
            <button className="sidebar-icon-btn" onClick={goSettings} title="Настройки">
              <SettingsIcon />
            </button>
          </div>
          <div className="sidebar-icon-group-bottom">
            <button className="sidebar-icon-btn" onClick={handleLogout} title="Выход">
              <LogoutIcon />
            </button>
          </div>
        </aside>
        <div className="dashboard-main">
          <TopBar showNewSet={false} onAvatarClick={handleAvatarClick} />
          <main className="dashboard-content">
            <div className="stats-card">
              <p>Загрузка...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-icon-group">
            <button className="sidebar-icon-btn" onClick={goHome} title="Главная страница">
              <HomeIcon />
            </button>
            <button className="sidebar-icon-btn active" onClick={() => {}} title="Профиль">
              <ProfileIcon active={true} />
            </button>
            <button className="sidebar-icon-btn" onClick={goSettings} title="Настройки">
              <SettingsIcon />
            </button>

          </div>
          <div className="sidebar-icon-group-bottom">

            <button className="sidebar-icon-btn" onClick={handleLogout} title="Выход">
              <LogoutIcon />
            </button>
          </div>
        </aside>
        <div className="dashboard-main">
          <TopBar showNewSet={false} onAvatarClick={handleAvatarClick} />
          <main className="dashboard-content">
            <div className="stats-card">
              <p className="profile-error">{error || 'Профиль не найден'}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-icon-group">
          <button className="sidebar-icon-btn" onClick={goHome} title="Главная страница">
            <HomeIcon />
          </button>
          <button className="sidebar-icon-btn active" onClick={() => {}} title="Профиль">
            <ProfileIcon active={true} />
          </button>
          <button className="sidebar-icon-btn" onClick={goSettings} title="Настройки">
            <SettingsIcon />
          </button>

        </div>
        <div className="sidebar-icon-group-bottom">

          <button className="sidebar-icon-btn" onClick={handleLogout} title="Выход">
            <LogoutIcon />
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <TopBar showNewSet={false} onAvatarClick={handleAvatarClick} />
        <main className="dashboard-content" style={{ display: 'flex', gap: 20, paddingRight: 20 }}>
          {/* Main profile section */}
          <div style={{ flex: 1 }}>
            {/* Profile header with avatar and username */}
            <div className="profile-header" style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div className="profile-avatar-large" style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  (profile.username ? profile.username.charAt(0).toUpperCase() : 'U')
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                  <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#111827' }}>{profile.username}</h1>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{profile.aboutMe || 'No description provided yet.'}</p>
                {isOwnProfile && (
                  <button className="profile-edit-btn" onClick={goToEdit} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 6, background: '#f97316', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    Edit profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile tabs */}
            <div className="profile-tabs" style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              {['about', 'statistics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveProfileTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: activeProfileTab === tab ? '2px solid #f97316' : '1px solid #e5e7eb',
                    background: activeProfileTab === tab ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    fontWeight: activeProfileTab === tab ? 600 : 500,
                    fontSize: 14,
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* About tab */}
            {activeProfileTab === 'about' && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 700, color: '#111827' }}>About</h3>
                  <p style={{ margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
                    {profile.aboutMe || 'No description provided yet.'}
                  </p>
                </div>
                {/* User ID removed - not needed */}
              </div>
            )}

            {/* Statistics tab */}
            {activeProfileTab === 'statistics' && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: 16, borderRadius: 8, background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>0</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Sets created</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, borderRadius: 8, background: '#f0f9ff', border: '1px solid #e0f2fe' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>0</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Cards learned</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, borderRadius: 8, background: '#fef3c7', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>0</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Day streak</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar - Friends section */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: 20 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700, color: '#111827' }}>Friends</h3>
              
              {/* Search bar (search by username) */}
              <input
                type="text"
                placeholder="Search friends by username..."
                value={searchFriendQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                  marginBottom: 12,
                  boxSizing: 'border-box'
                }}
              />

              {/* Friends list */}
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {searchFriendQuery && searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div key={user.username} style={{ padding: 10, borderRadius: 6, background: '#f9fafb', marginBottom: 8, border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{user.username}</span>
                      </div>
                      <button
                        onClick={() => handleSendFriendRequest(user.username)}
                        disabled={friendActionLoading}
                        style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#10b981', color: '#fff', fontSize: 12, cursor: friendActionLoading ? 'not-allowed' : 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : friends.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
                    No friends yet
                  </p>
                ) : (
                  friends.map((friend, idx) => (
                    <div key={idx} style={{ padding: 10, borderRadius: 6, background: '#f9fafb', marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                          {friend.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{friend}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {friendActionStatus && (
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: 12,
                  color: friendActionStatus.type === 'success' ? '#16a34a' : '#dc2626'
                }}>
                  {friendActionStatus.message}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
      {showAvatarUploader && (
        <AvatarUploader
          initialImage={profile?.avatarUrl || null}
          onClose={() => setShowAvatarUploader(false)}
          onUploaded={handleAvatarUploaded}
        />
      )}
    </div>
  );
}

export default ProfilePage;

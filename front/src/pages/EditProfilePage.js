import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import usePing from '../hooks/usePing';
import { isLoggedIn, getUsername, clearAuthData, getAvatar } from '../utils/auth';
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
import TopBar from '../components/TopBar';
import '../styles/EditProfile.css';

function EditProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    aboutMe: ''
  });
  const [saving, setSaving] = useState(false);

  // Вызываем ping при загрузке страницы
  usePing();

  useEffect(() => {
    // Проверяем, аутентифицирован ли пользователь
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Проверяем, что пользователь редактирует свой собственный профиль
    const currentUsername = getUsername();
    if (currentUsername && currentUsername !== username) {
      setError('Вы можете редактировать только свой профиль');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Получаем информацию о профиле с контроллера profile
        const response = await api.get(`/profile/${username}`);
        setProfile(response.data);
        setFormData({
          username: response.data.username || '',
          aboutMe: response.data.aboutMe || ''
        });
        setLoading(false);
      } catch (err) {
        // Обрабатываем различные типы ошибок
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            // 401 обрабатывается в interceptor, просто перенаправляем
            navigate('/login');
          } else if (status === 403) {
            setError('У вас нет прав для редактирования этого профиля');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Используем api instance для отправки запроса
      const response = await api.put(`/profile/update/${username}`, {
        username: formData.username,
        aboutMe: formData.aboutMe
      });

      // Обновляем имя пользователя в localStorage, если оно изменилось
      if (response.data.username && response.data.username !== username) {
        localStorage.setItem('username', response.data.username);
        navigate(`/${response.data.username}`);
      } else {
        navigate(`/${username}`);
      }
    } catch (err) {
      // Обрабатываем различные типы ошибок
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          // 401 обрабатывается в interceptor
          navigate('/login');
        } else if (status === 403) {
          setError('У вас нет прав для обновления этого профиля');
        } else {
          setError('Ошибка сохранения: ' + (err.response?.data?.message || 'Не удалось обновить профиль'));
        }
      } else {
        setError('Ошибка сети. Проверьте подключение к интернету.');
      }
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/${username}`);
  };

  const handleLogout = () => {
    // Очищаем данные аутентификации
    clearAuthData();
    navigate('/login');
  };

  const currentUsername = getUsername();
  const base = currentUsername ? `/${currentUsername}` : '';
  const goHome = () => navigate(`${base}/dashboard`);
  const goProfile = () => {
    if (currentUsername) {
      navigate(`${base}`);
    }
  };
  const goSettings = () => navigate(`${base}/settings`);

  if (loading) {
    return (
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-icon-group">
            <button className="sidebar-icon-btn" onClick={goHome} title="Главная страница">
              <HomeIcon />
            </button>
            <button className="sidebar-icon-btn active" onClick={goProfile} title="Профиль">
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
          <header className="dashboard-header">
            <div className="header-left">
              <LightningIcon />
              <span className="header-logo">Flashlearn</span>
            </div>
            <div className="header-right">
              <div className="user-avatar">
                { getAvatar() ? (
                  <img src={getAvatar()} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  (currentUsername ? currentUsername.charAt(0).toUpperCase() : 'U')
                ) }
              </div>
            </div>
          </header>
          <main className="dashboard-content">
            <div className="stats-card">
              <p>Загрузка...</p>
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
          <button className="sidebar-icon-btn active" onClick={goProfile} title="Профиль">
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
        <TopBar />
        <main className="dashboard-content edit-profile-content">
          <div className="edit-profile-grid">
            <div className="edit-card">
              <div className="edit-card-header">
                <div className="edit-avatar">
                  {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="edit-label-muted">Редактирование профиля</p>
                  <h2 className="edit-title">{formData.username || 'Ваше имя'}</h2>
                </div>
              </div>
              {error && <p className="profile-error" style={{ marginTop: 8 }}>{error}</p>}
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="edit-field">
                  <label className="edit-label">Имя пользователя</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="edit-input"
                    required
                    placeholder="Введите новое имя"
                  />
                </div>
                <div className="edit-field">
                  <label className="edit-label">О себе</label>
                  <textarea
                    value={formData.aboutMe}
                    onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                    className="edit-textarea"
                    rows="5"
                    placeholder="Коротко о себе, интересы, цели..."
                  />
                  <p className="edit-hint">Расскажите о себе — это увидят ваши друзья.</p>
                </div>
                <div className="edit-actions">
                  <button type="submit" className="edit-btn primary" disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                  <button type="button" className="edit-btn secondary" onClick={handleCancel}>
                    Отмена
                  </button>
                </div>
              </form>
            </div>

            <div className="edit-sidecard">
              <h3>Советы по профилю</h3>
              <ul>
                <li>Сделайте имя узнаваемым для друзей.</li>
                <li>Добавьте пару предложений о своих целях или интересах.</li>
                <li>Обновляйте информацию, когда меняются планы.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditProfilePage;


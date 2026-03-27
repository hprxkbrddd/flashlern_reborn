import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { LightningIcon } from './Icons';
import { getAvatar, getUsername } from '../utils/auth';

export default function TopBar({ showNewSet = true, onNewSet, onAvatarClick }) {
  const navigate = useNavigate();
  const username = getUsername();
  // Only show stored avatar image for the special user 'dock'
  const avatar = username === 'dock' ? getAvatar() : null;
  const base = username ? `/${username}` : '';

  const goHome = () => navigate(`${base}/dashboard`);
  const goProfile = () => navigate(`${base}`);

  const handleAvatar = () => {
    if (onAvatarClick) return onAvatarClick();
    return goProfile();
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <LightningIcon />
        <span className="header-logo" style={{ cursor: 'pointer' }} onClick={goHome}>Flashlearn</span>
      </div>
      <div className="header-right">
        <NotificationBell />
        {showNewSet && (
          <button
            className="new-set-btn"
            onClick={() => {
              if (onNewSet) onNewSet();
              else navigate(`${base}/create-set`);
            }}
          >
            + New set
          </button>
        )}
        <div className="user-avatar" role="button" tabIndex={0} onClick={handleAvatar} onKeyDown={(e) => { if (e.key === 'Enter') handleAvatar(); }} title={username || 'User'}>
          { avatar ? (
            <img src={avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            (username ? username.charAt(0).toUpperCase() : 'U')
          ) }
        </div>
      </div>
    </header>
  );
}

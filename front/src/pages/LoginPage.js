import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { saveAuthData } from '../utils/auth';
import '../styles/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущие ошибки
    
    try {
      // Используем прямой axios запрос для логина (без interceptor, т.к. это публичный endpoint)
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      
      // Сохраняем данные аутентификации
      const savedUsername = response.data.username || username;
      saveAuthData(response.data.token, savedUsername);
      // Навигация на приватную страницу с префиксом username
      navigate(`/${savedUsername}/dashboard`);
    } catch (err) {
      // Обрабатываем ошибки логина
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          setError('Неверное имя пользователя или пароль');
        } else {
          setError('Ошибка логина: ' + (err.response?.data?.message || 'Проверьте данные'));
        }
      } else {
        setError('Ошибка сети. Проверьте подключение к интернету.');
      }
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-title">Вход</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Имя пользователя" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="login-form-input"
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="login-form-input"
        />
        <button type="submit" className="login-btn login-btn-primary">Войти</button>
      </form>
      <p className="login-form-link">Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
    </div>
  );
}

export default LoginPage;
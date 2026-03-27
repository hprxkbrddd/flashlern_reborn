import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { saveAuthData } from '../utils/auth';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущие ошибки
    
    try {
      // Используем api instance для регистрации (это публичный endpoint)
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      
      // Регистрация успешна - показываем сообщение о необходимости подтверждения email
      setSuccess(true);
      setError('');
      
      // Перенаправляем на страницу логина через 3 секунды
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setSuccess(false);
      // Обрабатываем ошибки регистрации
      if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response?.data?.message || 'Не удалось зарегистрироваться';
        
        if (status === 400 || status === 409) {
          // 400 - неверные данные, 409 - пользователь уже существует
          setError(errorMessage);
        } else if (status === 500) {
          // 500 - внутренняя ошибка сервера (возможно, проблема с отправкой email)
          if (err.response?.data?.error === 'EMAIL_SENDING_FAILED') {
            setError('Регистрация прошла успешно, но не удалось отправить email подтверждения. Пожалуйста, попробуйте войти в систему.');
          } else {
            setError('Ошибка сервера: ' + errorMessage);
          }
        } else {
          setError('Ошибка регистрации: ' + errorMessage);
        }
      } else {
        setError('Ошибка сети. Проверьте подключение к интернету.');
      }
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="register-title">Регистрация</h2>
      {success && (
        <p style={{ color: 'green', marginBottom: '10px' }}>
          Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения email. Вы будете перенаправлены на страницу входа...
        </p>
      )}
      {error && <p className="register-error">{error}</p>}
      {!success && (
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Имя пользователя" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="register-form-input"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="register-form-input"
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="register-form-input"
        />
        <button type="submit" className="register-btn register-btn-primary">Зарегистрироваться</button>
      </form>
      )}
      <p className="register-form-link">Уже есть аккаунт? <a href="/login">Войти</a></p>
    </div>
  );
}

export default RegisterPage;
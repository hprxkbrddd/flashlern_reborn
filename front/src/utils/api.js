import axios from 'axios';
import { clearAuthData } from './auth';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена авторизации к каждому запросу
api.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    // Если токен существует, добавляем его в заголовок Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Обработка ошибки при формировании запроса
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов и ошибок
api.interceptors.response.use(
  (response) => {
    // Если запрос успешен, просто возвращаем ответ
    return response;
  },
  (error) => {
    // Обрабатываем ошибки ответа
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Обработка ошибки 401 (Unauthorized) - токен недействителен или отсутствует
      // Не обрабатываем 401 для публичных эндпоинтов (логин и регистрация)
      const isPublicEndpoint = error.config?.url?.includes('/auth/login') || 
                               error.config?.url?.includes('/auth/register');
      
      if (status === 401 && !isPublicEndpoint) {
        // Очищаем данные аутентификации из localStorage
        clearAuthData();
        // Перенаправляем на страницу логина (только если мы не на странице логина/регистрации)
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }

      // Обработка ошибки 403 (Forbidden) - недостаточно прав доступа
      if (status === 403) {
        // Можно показать сообщение пользователю о недостатке прав
        console.error('Доступ запрещен:', data?.message || 'У вас нет прав для выполнения этого действия');
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (например, проблемы с сетью)
      console.error('Ошибка сети:', error.request);
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка:', error.message);
    }

    // Пробрасываем ошибку дальше для обработки в компонентах
    return Promise.reject(error);
  }
);

export default api;


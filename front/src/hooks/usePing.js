import { useEffect } from 'react';
import api from '../utils/api';

/**
 * Hook для обновления streak пользователя при первой загрузке защищённой страницы
 * Отправляет ping на /api/ping для проверки и обновления streak
 */
export function usePing() {
  useEffect(() => {
    const pingServer = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await api.get('/ping');
        }
      } catch (err) {
        // Ошибка ping не критична, не будем блокировать загрузку
        console.debug('Ping failed (non-critical):', err);
      }
    };

    pingServer();
  }, []);
}

export default usePing;

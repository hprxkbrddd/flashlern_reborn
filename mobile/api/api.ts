import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          console.log('Не авторизован');
          break;

        case 403:
          console.log('Нет доступа');
          break;

        case 404:
          console.log('Не найдено');
          break;

        case 500:
          console.log('Ошибка сервера');
          break;

        default:
          console.log('Ошибка:', status);
      }
      console.log(error.response?.data || error.message);
    } 
    else {
      console.log('Сетевая ошибка:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

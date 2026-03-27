/**
 * Сохраняет данные аутентификации в localStorage
 * @param {string} token - JWT токен
 * @param {string} username - имя пользователя
 */
export function saveAuthData(token, username) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
}

/**
 * Получает JWT токен из localStorage
 * @returns {string|null} токен или null, если токен отсутствует
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Получает имя пользователя из localStorage
 * @returns {string|null} имя пользователя или null, если отсутствует
 */
export function getUsername() {
  return localStorage.getItem("username");
}

/**
 * Сохраняет URL аватарки в localStorage
 * @param {string} url
 */
export function setAvatar(url) {
  if (url) localStorage.setItem('avatarUrl', url);
  else localStorage.removeItem('avatarUrl');
}

/**
 * Возвращает URL аватарки из localStorage
 * @returns {string|null}
 */
export function getAvatar() {
  return localStorage.getItem('avatarUrl');
}

/**
 * Очищает данные аутентификации из localStorage
 */
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem('avatarUrl');
}

/**
 * Проверяет, аутентифицирован ли пользователь
 * @returns {boolean} true, если пользователь аутентифицирован
 */
export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

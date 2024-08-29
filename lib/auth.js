// File: lib/auth.js
import Cookies from 'js-cookie';

const COOKIE_NAME = 'auth_token';

// Simulated user database
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

export const login = async (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = btoa(JSON.stringify({ userId: user.id, username: user.username }));
    Cookies.set(COOKIE_NAME, token, { expires: 1 });
    return true;
  }
  return false; // Return false for invalid credentials
};

export const logout = async () => {
  Cookies.remove(COOKIE_NAME);
};

export const getSession = async () => {
  const token = Cookies.get(COOKIE_NAME);
  if (token) {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      console.error('Invalid token', error);
    }
  }
  return null; // Return null if no token
};

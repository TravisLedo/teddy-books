import {jwtDecode} from 'jwt-decode';

export const getLocalUser = () => {
  return localStorage.getItem('jwtToken');
};

export const setLocalUser = (userData) => {
  localStorage.setItem('jwtToken', JSON.stringify(userData));
};

export const getUserObjectFromJwt = (jwt) => {
  try {
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
};

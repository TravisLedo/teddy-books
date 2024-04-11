import {jwtDecode} from 'jwt-decode';

export const getLocalUser = () => {
  return localStorage.getItem('jwtToken');
};

export const setLocalUser = (userData) => {
  localStorage.setItem('jwtToken', userData);
};

export const removeLocalUser = () => {
  localStorage.removeItem('jwtToken');
};


export const setOfflineSettings = (settings) => {
  localStorage.setItem('offlineSettings', JSON.stringify(settings));
};

export const getOfflineSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('offlineSettings'));
  } catch (error) {
    removeLocalUser();
    return JSON.parse(localStorage.getItem('offlineSettings'));
  }
};


export const decodeJwtToken = (jwt) => {
  try {
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
};

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
  console.log(settings);
  localStorage.setItem('offlineSettings', JSON.stringify(settings));
};

export const getOfflineSettings = () => {
  return JSON.parse(localStorage.getItem('offlineSettings'));
};


export const getUserObjectFromJwt = (jwt) => {
  try {
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
};

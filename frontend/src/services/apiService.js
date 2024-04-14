import axios from 'axios';
import {getLocalUser, removeLocalUser, setLocalUser} from './localStorageService';
import {LoginModalType} from '../Enums/LoginModalType';

export const apiServiceUnsecure = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiServiceSecure = axios.create({// Any requests made with this endpoint requires authenthication. Make user log back in if they are not.
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const activateApiServiceSecureInterceptors = (handleLoginModalShow)=>{
  apiServiceSecure.interceptors.request.use(
      (config) => {
        const token = getLocalUser();
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
  );

  apiServiceSecure.interceptors.response.use(
      function(response) {
        return response;
      },
      async function(error) {
        const originalRequest = error.config;
        if (
          error.response.status === 401 && originalRequest._retry
        ) {
          console.log('Access Token and Refresh Token both expired.');
          removeLocalUser();
          handleLoginModalShow(LoginModalType.EXPIRED, false);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          console.log('Access Token expired.');
          originalRequest._retry = true;
          try {
            const newAccessToken = await apiServiceUnsecure.post('/user/refresh', {token: getLocalUser()});
            setLocalUser(newAccessToken.data);
            console.log('Using new Access Token.');
          } catch (error) {
            // console.log(error);
          }
          return apiServiceSecure(originalRequest);
        }
      },
  );
};


export const loginUser = async (userData) => {
  try {
    const response = await apiServiceUnsecure.post('/user/login', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const autoLoginUser = async (userData) => {
  try {
    const response = await apiServiceSecure.post('/user/autologin', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getUserById = async (_id) => {
  try {
    const response = await apiServiceUnsecure.get('/user/id/' + _id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsersByEmailSubstring = async (email) => {
  try {
    const response = await apiServiceSecure.get('/users/email/' + email);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await apiServiceUnsecure.get('/user/email/' + email);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsersByNameSubstring = async (name) => {
  try {
    const response = await apiServiceUnsecure.get('/users/name/'+ name);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewestUsers = async () => {
  try {
    const response = await apiServiceSecure.get('/users/newest');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentUsers = async () => {
  try {
    const response = await apiServiceSecure.get('/users/recent');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewUser = async (userData) => {
  try {
    const response = await apiServiceUnsecure.post('/user/add', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBooks = async () => {
  try {
    const response = await apiServiceUnsecure.get('/books/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateUser = async (userData) => {
  try {
    const response = await apiServiceSecure.put('/user/update', {userData});
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (userData) => {
  try {
    const response = await apiServiceSecure.put('/user/update-password', {userData});
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUserById = async (userId) => { // For admin purposes, users will use the deactivate endpoint
  try {
    const response = await apiServiceSecure.delete('/user/delete/' + userId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (userData) => {
  try {
    const response = await apiServiceSecure.delete('/user/deactivate/' + userData._id + '/' + userData.deletePassword);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (_id) => {
  try {
    const response = await apiServiceUnsecure.get('/book/id/' + _id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookByTitle= async (name) => {
  try {
    const response = await apiServiceSecure.get('/book/title/'+ name);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewBook = async (bookData) => {
  try {
    const response = await apiServiceSecure.post('/book/add', bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBook = async (bookData) => {
  try {
    const response = await apiServiceSecure.put('/book/update', {bookData});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBookById = async (bookId) => {
  try {
    const response = await apiServiceSecure.delete('/book/delete/' + bookId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTextsForBook= async (title) => {
  try {
    const response = await apiServiceSecure.get('/book/generate/'+ title);
    return response;
  } catch (error) {
    throw error;
  }
};

export const generateImageLink = (book, pageNumber) => {
  return (
    process.env.REACT_APP_IMAGE_BASE_URL +
    '%2F' +
    book.folder +
    '%2Fpages%2F' +
    pageNumber +
    '.png?alt=media&token=' +
    process.env.REACT_APP_STORAGE_TOKEN
  );
};

export const requestEmailResetCode = async (data) => {
  try {
    const response = await apiServiceUnsecure.post('/user/reset/request', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkPasswordResetTokenLink = async (resetToken) => {
  try {
    const response = await apiServiceUnsecure.get('/user/reset/check/' + resetToken);
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) => {
  const tempApiServiceSecure = axios.create(
      {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + data.token,
        },
      },
  );

  try {
    const response = await tempApiServiceSecure.post('/user/reset/verify', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAudioForPage = async (
    book,
    leftPage,
    rightPage,
    voiceSelection,
) => {
  try {
    const response = await apiServiceUnsecure.post('/witai/speak', {
      book: book,
      leftPage: leftPage,
      rightPage: rightPage,
      voiceSelected: voiceSelection,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeTempAudioFromServer = async (audioSource) => {
  try {
    const file = audioSource.replace(process.env.REACT_APP_BACKEND_URL + '/', '');
    const response = await apiServiceUnsecure.post('/witai/removeaudio', {
      file: file,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

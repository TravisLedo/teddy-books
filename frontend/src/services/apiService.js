import axios from 'axios';
import {getLocalUser, removeLocalUser, setLocalUser} from './localStorageService';

export const apiServiceUnsecure = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiServiceSecure = axios.create({
  baseURL: process.env.REACT_APP_URL,
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
          handleLoginModalShow(false);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          console.log('Access Token expired.');
          originalRequest._retry = true;
          try {
            const newAccessToken = await apiServiceUnsecure.post('/token/refresh', {token: getLocalUser()});
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
    const response = await apiServiceUnsecure.post('/users/login', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const autoLoginUser = async (userData) => {
  try {
    const response = await apiServiceSecure.post('/users/autologin', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getUserById = async (_id) => {
  try {
    const response = await apiServiceSecure.get('/users/id/' + _id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await apiServiceSecure.get('/users/email/' + email);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewestUsers = async () => {
  try {
    const response = await apiServiceUnsecure.get('/users/newest');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getRecentUsers = async () => {
  try {
    const response = await apiServiceUnsecure.get('/users/recent');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewUser = async (userData) => {
  try {
    const response = await apiServiceUnsecure.post('/users/add', userData);
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


export const updateUserById = async (userData) => {
  try {
    const response = await apiServiceSecure.put('/users/update', {userData});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (_id) => {
  try {
    const response = await apiServiceUnsecure.get('/books/' + _id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewBook = async (bookData) => {
  try {
    const response = await apiServiceSecure.post('/books/add', bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookById = async (bookData) => {
  try {
    const response = await apiServiceSecure.put('/books/update', {bookData});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBookById = async (bookId) => {
  try {
    const response = await apiServiceSecure.delete('/books/delete/' + bookId);
    return response.data;
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

export const getAudioForPage = async (
    book,
    leftPage,
    rightPage,
    voiceSelection,
) => {
  try {
    const response = await apiServiceUnsecure.post('/books/witai/speak', {
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
    const file = audioSource.replace(process.env.REACT_APP_URL + '/', '');
    const response = await apiServiceUnsecure.post('/books/removeaudio', {
      file: file,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

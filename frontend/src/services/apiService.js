// apiService.js
import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

export const getAllBooks = async () => {
  try {
    const response = await apiService.get('/books/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (_id) => {
  try {
    const response = await apiService.get('/books/' + _id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNewBook = async (bookData) => {
  try {
    const response = await apiService.post('/books/add', bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBookById = async (bookData) => {
  try {
    const response = await apiService.put('/books/update', {bookData});
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
    const response = await apiService.post('/books/witai/speak', {
      book: book,
      leftPage: leftPage,
      rightPage: rightPage,
      voiceSelected: voiceSelection,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeTempAudioFromServer = async (audioSource) => {
  try {
    const file = audioSource.replace(process.env.REACT_APP_URL + '/', '');
    const response = await apiService.post('/books/removeaudio', {
      file: file,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

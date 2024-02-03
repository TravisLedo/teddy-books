// apiService.js
import axios from "axios";

const apiService = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

export const getAllBooks = async () => {
  try {
    const response = await apiService.get("/books/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const response = await apiService.get("/books/" + bookId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateImageLink = (book, pageNumber) => {
  return (
    process.env.REACT_APP_IMAGE_BASE_URL +
    "%2F" +
    book.folder +
    "%2Fpages%2F" +
    pageNumber +
    ".png?alt=media&token=" +
    process.env.REACT_APP_STORAGE_TOKEN
  );
};

export const getAudioForPage = async (book, leftPage, rightPage) => {
  console.log("test");
  try {
    const response = await apiService.post("/books/witai/speak", {
      book: book,
      leftPage: leftPage,
      rightPage: rightPage,
      voiceSelected: "Rebecca",
    });
    return response;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const removeTempAudioFromServer = async (file) => {
  console.log("test " + file);
  try {
    const response = await apiService.post("/books/removeaudio", {
      file: file,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

import {ProfileIcon} from '../Enums/ProfileIcon';
import {Voices} from '../Enums/Voices';
import {getBookByTitle, getUserByEmail} from './apiService';

export const validateUsername = async (userName)=>{
  const errors = [];
  if (isInputBlank(userName)) {
    errors.push('Username cannot be blank.');
  } else {
    if (userName.length < 5) {
      errors.push('Username must be at least 5 characters.');
    } else if (userName.length >50) {
      errors.push('Email must be less than 51 characters.');
    }
  }

  return errors;
};

export const validateEmail = async (email, checkForExisting)=>{
  const errors = [];
  if (isInputBlank(email)) {
    errors.push('Email cannot be blank.');
  } else {
    if (!email.trim().toLowerCase()
        .match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        )) {
      errors.push('Email not a valid format.');
    } else if (email.length < 5) {
      errors.push('Email must be at least 5 characters.');
    } else if (email.length >256) {
      errors.push('Email must be less than 257 characters.');
    }

    if (checkForExisting) {
      const user = await getUserByEmail(email);

      if (user) {
        errors.push('Email is already taken.');
      }
    }
  }

  return errors;
};

export const validatePasswordFormat = async (password)=>{
  const errors = [];
  if (isInputBlank(password) ) {
    errors.push('Password cannot be blank.');
  } else {
    if (password.length < 3) {
      errors.push('Password must be at least 3 characters.');
    } else if (password.length > 20) {
      errors.push('Email must be less than 21 characters.');
    }
  }

  return errors;
};

export const validateIsAdmin = async (value)=>{
  const errors = [];
  if (!isInputABoolean(value)) {
    errors.push('isAdmin must be true or false.');
  }
  return errors;
};

export const validateIsBlocked = async (value)=>{
  const errors = [];
  if (!isInputABoolean(value)) {
    errors.push('isBlocked must be true or false.');
  }
  return errors;
};

export const validateBookTitle = async (title)=>{
  const errors = [];
  if (isInputBlank(title)) {
    errors.push('Book title cannot be blank.');
  } else {
    if (title.length < 2) {
      errors.push('Book title must be at least 2 characters.');
    } else if (title.length > 50) {
      errors.push('Email must be less than 51 characters.');
    }
    const book = await getBookByTitle(title);
    if (book) {
      errors.push('Book title is already taken.');
    }
  }
  return errors;
};


export const validateBookAuthor = async (author)=>{
  const errors = [];
  if (isInputBlank(author)) {
    errors.push('Author name cannot be blank.');
  } else {
    if (author.length < 3) {
      errors.push('Author name must be at least 3 characters.');
    } else if (author.length > 50) {
      errors.push('Author name must be less than 51 characters.');
    }
  }
  return errors;
};

export const validateBookText = async (value)=>{
  const errors = [];

  if (value && value.length > 5000) {
    errors.push('Text must be less than 5000');
  }
  return errors;
};

export const isInputBlank = (input)=>{
  if (!input || input.length < 1) {
    return true;
  } else {
    return false;
  }
};

export const isInputABoolean = (input)=>{
  if (!isInputBlank(input) && input.toString().trim().toLowerCase() === 'true' || input.toString().trim().toLowerCase() === 'false') {
    return true;
  } else {
    false;
  }
};

export const validateIconName = async (input)=>{
  const errors = [];

  if (isInputBlank(input)) {
    errors.push('Icon cannot be blank.');
  } else {
    const existsInEnum = (iconName)=>{
      const exists = Object.values(ProfileIcon).find((icon)=> icon.name.toLocaleLowerCase() === iconName.trim().toLowerCase());
      return exists;
    };

    if (!existsInEnum(input)) {
      errors.push('Icon does not exist.');
    }
  }
  return errors;
};

export const validateVoiceName = async (input)=>{
  const errors = [];
  if (isInputBlank(input)) {
    errors.push('Voice cannot be blank.');
  } else {
    const existsInEnum = (voiceName)=>{
      const exists = Object.values(Voices).find((voice)=> voice.alt.toLocaleLowerCase() === voiceName.trim().toLowerCase());
      return exists;
    };

    if (!existsInEnum(input)) {
      errors.push('Voice does not exist.');
    }
  }
  return errors;
};

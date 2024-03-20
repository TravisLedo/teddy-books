import {getUserByExactName} from './apiService';

export const validateUsername = async (userName)=>{
  const errors = [];
  if (isInputBlank(userName)) {
    errors.push('Username cannot be blank.');
  } else {
    if (userName.length < 5) {
      errors.push('Username must be at least 5 charactersa');
    }
    const user = await getUserByExactName(userName);
    if (user !== null) {
      errors.push('Username is already taken.');
    }
  }

  return errors;
};

export const validateEmail = async (email)=>{
  const errors = [];
  if (isInputBlank(email)) {
    errors.push('Email cannot be blank.');
  } else {
    if (!email.trim().toLowerCase()
        .match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        )) {
      errors.push('Email not a valid format.');
    } else if (email.length < 5) {
      errors.push('Email must be at least 5 charactersa');
    } else if (email.length >256) {
      errors.push('Email must be less than 257 charactersa');
    }
    const user = await getUserByExactName(email);
    if (user !== null) {
      errors.push('Email is already taken.');
    }
  }

  return errors;
};

export const isInputBlank = (input)=>{
  if (input.length < 1) {
    return true;
  } else {
    return false;
  }
};

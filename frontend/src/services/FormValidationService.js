import {getUserByEmailExact, getUserByExactName} from './apiService';

export const validateUsername = async (userName)=>{
  const errors = [];
  if (isInputBlank(userName)) {
    errors.push('Username cannot be blank.');
  } else {
    if (userName.length < 5) {
      errors.push('Username must be at least 5 characters.');
    }
    const user = await getUserByExactName(userName);
    if (user !== null) {
      errors.push('Username is already taken.');
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
      const user = await getUserByEmailExact(email);

      if (user !== null) {
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
      errors.push('{Password} must be at least 3 characters.');
    } else if (password.length > 20) {
      errors.push('Email must be less than 21 characters.');
    }
  }

  return errors;
};

export const validateIsAdmin = async (value)=>{
  const errors = [];
  if (isInputABoolean(value)) {
    errors.push('isAdmin must be true or false.');
  }
  return errors;
};

export const validateIsBlocked = async (value)=>{
  const errors = [];
  if (isInputABoolean(value)) {
    errors.push('isBlocked must be true or false.');
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

export const Types = {
    LOGIN: 'LOGIN',
    ADD_USER: 'ADD_USER',
    UPDATE_USER: 'UPDATE_USER',
    UPDATE_PROFILE_PICTURE: 'UPDATE_PROFILE_PICTURE',
    FORM_SUBMITION_STATUS: 'FORM_SUBMITION_STATUS'
  }

  function createRequestTypes(base, types = defaultTypes) {
    const res = {};
    types.forEach(type => (res[type] = `${base}_${type}`));
    // console.log(res);
    return res;
  }
  
  
  export const APP = createRequestTypes('APP', ['INIT', 'START', 'ERROR', 'SET_UP_INTRO']);
  export const USER = createRequestTypes('USER', ['SET_USER_TOKEN', 'UPDATE_USER', 'UPDATE_USER_NOTIFICATION']);
  export const USERS = createRequestTypes('USERS', ['GET_USERS', 'SET_USERS', 'TOGGLE_USER', 'TOGGLE_UPDATE']);
  export const GARAGE = createRequestTypes('GARAGE', ['GET_GARAGE', 'SET_GARAGE']);

  export const AUTH = createRequestTypes('AUTH', [
    'LOGIN', 'LOGIN_ERROR', 'LOGIN_SUCCESS', 'RESET_LOGIN',
    'SIGN_UP', 'SIGN_UP_SUCCESS', 'SIGN_UP_ERROR', 'RESET_SIGN_UP',
    'SIGN_OUT', 'DELETE_ACCOUNT'
  ]);
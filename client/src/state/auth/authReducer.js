import { REGISTER_SUCCESS, REGISTER_FAIL, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_ERRORS, USER_LOADED } from './types';

const initialState = {
  user: null,
  authenticated: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        authenticated: true
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        authenticated: false
      };
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        authenticated: true
      };
    default:
      return state;
  }
};

export default authReducer;

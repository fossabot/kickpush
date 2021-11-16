import { REGISTER_SUCCESS, REGISTER_FAIL, AUTH_ERROR, USER_LOADED, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_ERRORS } from './types';
import store from '../store';
import axios from 'axios';

import setAuthToken from '../../utils/setAuthToken';

const defaultPostConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const register = async (userData) => {
  try {
    const res = await axios.post('/register', userData, defaultPostConfig);
    store.dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (err) {
    store.dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg });
  }
};

const logout = () => store.dispatch({ type: LOGOUT });

const loadUser = async (token) => {
  setAuthToken(localStorage.token);

  try {
    const res = await axios.get('/loadUser');
    store.dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    store.dispatch({ type: AUTH_ERROR });
  }
};

export { register, logout, loadUser };

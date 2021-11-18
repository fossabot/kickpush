import { FcHome } from 'react-icons/fc';
import { NAV_HOME, NAV_PEOPLE, NAV_PAYMENTS, NAV_MESSAGES, NAV_PROFILE } from './types';

const initialState = {
  activePage: null
};

const navReducer = (state = initialState, action) => {
  switch (action.type) {
    case NAV_HOME:
      return {
        ...state,
        activePage: 'home'
      };
    default:
      return state;
  }
};

export default navReducer;

import * as Type from './Type';

const initialState = {
  isLoading: false,
  token: '',
  userData: [],
  registerError: '',
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.INIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case Type.INIT_SUCCESS:
      return {
        ...state,
        userData: action.payload.data,
        isLoading: false,
      };
    case Type.INIT_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case Type.USER_REGISTER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case Type.USER_REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case Type.USER_REGISTER_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case Type.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case Type.LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.payload.data,
        isLoading: false,
      };
    case Type.LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default AuthReducer;

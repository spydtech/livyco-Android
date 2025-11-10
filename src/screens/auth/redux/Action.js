import * as Type from './Type';

export const registerRequest = (params, navigation) => ({
  type: Type.USER_REGISTER_REQUEST,
  payload: {data: params, nav: navigation},
});

export const loginRequest = (params, navigation) => ({
  type: Type.LOGIN_REQUEST,
  payload: {data: params, nav: navigation},
});

export const initAppRequest = navigation => ({
  type: Type.INIT_REQUEST,
  payload: {nav: navigation},
});

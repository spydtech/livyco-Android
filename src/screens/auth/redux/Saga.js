import {takeLatest, put} from 'redux-saga/effects';
import {showMessage} from 'react-native-flash-message';
import {CommonActions} from '@react-navigation/native';
import * as Type from './Type';
import Api from '../../../utils/Api';

function* callInitAppAPI(action) {
  const navigation = action.payload.nav;
  try {
    const initRes = yield Api.get('').then(res => {
      return res;
    });
    if (initRes.status) {
      yield put({type: Type.INIT_SUCCESS, payload: initRes});
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Tab'}],
        }),
      );
    } else {
      yield put({type: Type.INIT_FAIL, error});
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Login'}],
        }),
      );
    }
  } catch (error) {
    yield put({type: Type.INIT_FAIL, error});
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Login'}],
      }),
    );
  }
}

function* callRegisterAPI(action) {
  const navigation = action.payload.nav;
  console.log('in print=>', action.payload.data);
  try {
    const registerRes = yield Api.post(
      'auth/register',
      action.payload.data,
    ).then(res => {
      return res;
    });
    console.log('prin tthe registerRes==>', registerRes.data.success);
    if (registerRes.data.success) {
      const params = {
        phone: action.payload.data.phone,
      };
      console.log('in print otp params===>', params);
      const otpRes = yield Api.post('auth/send-otp', params).then(res => {
        return res;
      });
      console.log('in print otpRes=>', otpRes);
    } else {
    }
  } catch (error) {
    yield put({type: Type.USER_REGISTER_FAIL, error});
  }
}

function* callLoginAPI(action) {
  const navigation = action.payload.nav;
  try {
    const loginRes = yield Api.post('', action.payload.data).then(res => {
      return res;
    });
    console.log('in print=> loginRes', loginRes.data.message);
    if (loginRes.status) {
      if (loginRes.status === 401) {
        yield put({type: Type.LOGIN_FAIL, payload: loginRes});
        showMessage({
          message: loginRes.data.message,
          type: 'danger',
          floating: true,
          statusBarHeight: 40,
          icon: 'auto',
          autoHide: true,
        });
      } else {
        global.userToken = loginRes.token;
        showMessage({
          message: loginRes.message,
          type: 'success',
          floating: true,
          statusBarHeight: 40,
          icon: 'auto',
          autoHide: true,
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Tab',
              },
            ],
          }),
        );
        yield put({type: Type.LOGIN_SUCCESS, payload: loginRes});
      }
    } else {
      console.log('in print= wlskjhghgu>');
      yield put({type: Type.LOGIN_FAIL, payload: loginRes});
    }
  } catch (error) {
    yield put({type: Type.LOGIN_FAIL, error});
  }
}

export default function* watchAuthSaga() {
  yield takeLatest(Type.INIT_REQUEST, callInitAppAPI);
  yield takeLatest(Type.USER_REGISTER_REQUEST, callRegisterAPI);
  yield takeLatest(Type.LOGIN_REQUEST, callLoginAPI);
}

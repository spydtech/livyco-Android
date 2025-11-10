import {all, fork} from 'redux-saga/effects';
import watchProductSaga from '../screens/redux/Saga';

export default function* RootSaga() {
  yield all([fork(watchProductSaga)]);
}

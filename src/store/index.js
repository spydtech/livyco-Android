import createSagaMiddleware from 'redux-saga';
import {createStore, applyMiddleware} from 'redux';

import RootReducer from './RootReducer';
import RootSaga from './RootSaga';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const store = createStore(RootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(RootSaga);

export {store};

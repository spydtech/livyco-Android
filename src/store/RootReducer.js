import {combineReducers} from 'redux';
import ProductReducer from '../screens/redux/Reducer';

const RootReducer = combineReducers({
  Product: ProductReducer,
});

export default RootReducer;

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';

import {orderbookReducer} from './modules/orderbook/orderbookReducer';

import saga from './sagas/saga';

const reducers = combineReducers({
  orderbook: orderbookReducer,
});

const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware);

const store = createStore(reducers, compose(middleware));

sagaMiddleware.run(saga);

export default store;

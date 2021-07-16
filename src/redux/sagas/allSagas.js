import {put, takeLatest} from 'redux-saga/effects';
import {ORDERBOOK_ACTIONS} from '../actionTypes';
import {PRODUCTS} from '../../config/consts';

const $A = (type, payload) => ({
  type,
  payload,
});

const websocketSendSubscribeMessageSaga = function* (action) {
  const {message, webSocketRef} = action.payload;

  try {
    const currentProductId = message.product_ids[0];
    const currentProductDefaultGroup = PRODUCTS.find(
      item => item.name == currentProductId,
    ).groupOptions[0];

    yield put($A(ORDERBOOK_ACTIONS.RESET_BIDS_AND_ASKS_DATA));
    yield put(
      $A(ORDERBOOK_ACTIONS.TOGGLE_PRODUCT_GROUP, currentProductDefaultGroup),
    );
    webSocketRef.current.sendJsonMessage(message);
  } catch (err) {
    console.log('websocketSendSubscribeMessageSaga err => ', err);
  }
};

const websocketSendUnSubscribeMessageSaga = function* (action) {
  const {message, webSocketRef} = action.payload;

  try {
    webSocketRef.current.sendJsonMessage(message);
  } catch (err) {
    console.log('websocketSendUnSubscribeMessageSaga err => ', err);
  }
};

export default function* rootSaga() {
  yield takeLatest(
    ORDERBOOK_ACTIONS.WEBSOCKET_SEND_SUBSCRIBE_MESSAGE,
    websocketSendSubscribeMessageSaga,
  );
  yield takeLatest(
    ORDERBOOK_ACTIONS.WEBSOCKET_SEND_UNSUBSCRIBE_MESSAGE,
    websocketSendUnSubscribeMessageSaga,
  );
}

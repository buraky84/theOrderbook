import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {CommonButton} from '../../components/CommonButton';
// @ts-ignore
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {OrderBookItem} from './components/OrderBookItem';
import {ErrorHighlighter} from '../../components/ErrorHighlighter';
import {ORDERBOOK_ACTIONS} from '../../../redux/actionTypes';
import WebSocketService from '../../../services/WebSocketService';
import {PRODUCTS} from '../../../config/consts';

let _bidsAsksBuffer: any = new Map();
let intervalReference: any;

export const OrderBook: React.FC = () => {
  const [loadingStreamInProgress, setLoadingStreamInProgress] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const _startStreamCallBack = () => {
    _startStream(activeProductIndex);
  };

  const webSocket = WebSocketService(_startStreamCallBack);
  const webSocketRef = useRef(webSocket);
  const {lastMessage} = webSocket;

  const [hasError, setHasError] = useState(false);
  const {bidsArr, asksArr} = useSelector((state: any) => state.orderbook);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (lastMessage && lastMessage.data) {
        const {data} = lastMessage;
        const myData = JSON.parse(data);
        const {bids, asks} = myData;
        if (bids && bids.length > 0) {
          bids.forEach((bid: any) => {
            if (bid[1] == 0 && _bidsAsksBuffer.has(bid[0])) {
              _bidsAsksBuffer.delete('b' + bid[0]);
            } else {
              _bidsAsksBuffer.set('b' + bid[0], bid[1]);
            }
          });
        }
        if (asks && asks.length > 0) {
          asks.forEach((ask: any) => {
            //console.log('ask => ', ask);
            if (ask[1] == 0 && _bidsAsksBuffer.has(ask[0])) {
              _bidsAsksBuffer.delete('a' + ask[0]);
            } else {
              _bidsAsksBuffer.set('a' + ask[0], ask[1]);
            }
          });
        }
      }
    } catch (err) {
      console.log('websocket sent abnormal message but caught => ', err);
    }
  }, [lastMessage]);

  const _switchStream = () => {
    _resetStream();

    setTimeout(() => {
      const newProductIndex = (activeProductIndex + 1) % 2;
      setActiveProductIndex(newProductIndex);
      _startStream(newProductIndex);
    }, 500);
  };

  const _startStream = (productIndex: number) => {
    console.log('Registering for product => ', PRODUCTS[productIndex].name);

    setLoadingStreamInProgress(true);
    setHasError(false);
    _bidsAsksBuffer.clear();

    dispatch({
      type: ORDERBOOK_ACTIONS.WEBSOCKET_SEND_SUBSCRIBE_MESSAGE,
      payload: {
        message: {
          event: 'subscribe',
          feed: 'book_ui_1',
          product_ids: [PRODUCTS[productIndex].name],
        },
        webSocketRef,
      },
    });

    intervalReference = setInterval(() => {
      const _copyOfBidsAsksBuffer = new Map(_bidsAsksBuffer);
      _bidsAsksBuffer.clear();

      dispatch({
        type: ORDERBOOK_ACTIONS.BATCH_UPDATE_BIDS_AND_ASKS_DATA,
        payload: {
          newBidsAsksData: _copyOfBidsAsksBuffer,
        },
      });
    }, 1500);

    setTimeout(() => {
      setLoadingStreamInProgress(false);
    }, 1500);
  };

  const _resetStream = () => {
    clearInterval(intervalReference);

    dispatch({
      type: ORDERBOOK_ACTIONS.WEBSOCKET_SEND_UNSUBSCRIBE_MESSAGE,
      payload: {
        message: {
          event: 'unsubscribe',
          feed: 'book_ui_1',
          product_ids: [PRODUCTS[activeProductIndex].name],
        },
        webSocketRef,
      },
    });
  };

  const _websocketError = () => {
    try {
      if (!hasError) {
        throw new Error('An unexpected error occured!');
      } else {
        setHasError(false);
        _startStream(activeProductIndex);
      }
    } catch {
      _resetStream();
      setHasError(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerContainerText}>
          Order Book{' '}
          <Text style={{fontSize: 10}}>
            ({PRODUCTS[activeProductIndex].name})
          </Text>
        </Text>
        <View style={{marginRight: 20}}>
          <SelectDropdown
            data={PRODUCTS[activeProductIndex].groupOptions}
            defaultValue={PRODUCTS[activeProductIndex].groupOptions[0]}
            onSelect={(selectedItem: number) => {
              dispatch({
                type: ORDERBOOK_ACTIONS.TOGGLE_PRODUCT_GROUP,
                payload: selectedItem,
              });
            }}
            renderDropdownIcon={() => (
              <Icon
                name="keyboard-arrow-down"
                size={30}
                color="rgb(182, 184, 188)"
              />
            )}
            buttonTextAfterSelection={(selectedItem: string) => {
              return 'Group ' + selectedItem;
            }}
            rowTextForSelection={(item: string) => {
              return 'Group ' + item;
            }}
            buttonStyle={{
              height: 28,
              width: 140,
              borderRadius: 6,
              backgroundColor: 'rgb(55, 65, 81)',
            }}
            buttonTextStyle={{
              fontSize: 14,
              color: 'rgb(182, 184, 188)',
              fontWeight: '500',
            }}
            rowStyle={{height: 30}}
            rowTextStyle={{fontSize: 14}}
          />
        </View>
      </View>
      {loadingStreamInProgress ? (
        <View style={styles.orderbookActivityIndicatorContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <View style={styles.orderbookContainer}>
          <View style={styles.orderbookTextContainer}>
            <Text style={styles.orderbookHeaderText}>PRICE</Text>
            <Text style={styles.orderbookHeaderText}>SIZE</Text>
            <Text style={styles.orderbookHeaderText}>TOTAL</Text>
            <View style={{flex: 0.05}} />
          </View>
          <View style={styles.orderbookDataBidContainer}>
            <FlatList
              keyExtractor={(item, index) => 'bid' + index}
              style={{marginTop: 20}}
              data={bidsArr}
              renderItem={({item}) => (
                <OrderBookItem item={item} isBid={true} />
              )}
              inverted
            />
          </View>
          <View style={styles.orderbookDataAskContainer}>
            <FlatList
              keyExtractor={(item, index) => 'ask' + index}
              style={{marginTop: 20}}
              data={asksArr}
              renderItem={({item}) => (
                <OrderBookItem item={item} isBid={false} />
              )}
            />
          </View>
        </View>
      )}
      <View style={styles.bottomContainer}>
        <CommonButton
          fontSize={15}
          buttonText="Toggle Feed"
          backgroundColor="rgb(75, 56, 187)"
          textColor="rgb(182, 184, 188)"
          fontWeight="500"
          icon="multiple-stop"
          iconSize={20}
          iconColor="white"
          buttonPress={_switchStream}
          testID="toggleButton"
        />
        <CommonButton
          fontSize={15}
          buttonText="Kill Feed"
          backgroundColor="rgb(160, 25, 25)"
          textColor="rgb(182, 184, 188)"
          fontWeight="500"
          icon="error-outline"
          iconSize={20}
          iconColor="white"
          buttonPress={_websocketError}
          testID="websocketErrorButton"
        />
      </View>
      {hasError ? (
        <ErrorHighlighter
          errorText={
            'An unknown error occured on Websocket! Unsubscribed from feed automatically.' +
            'Pressing the Kill Feed button 2nd time will recover!'
          }
        />
      ) : undefined}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(33, 46, 69)',
    paddingHorizontal: 4,
    paddingTop: 6,
  },
  headerContainer: {
    flex: 0.06,
    backgroundColor: 'rgb(12, 20, 38)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainerText: {
    color: 'rgb(182, 184, 188)',
    fontSize: 20,
    fontWeight: '500',
    paddingLeft: 20,
  },
  orderbookActivityIndicatorContainer: {
    flex: 0.86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderbookContainer: {
    flex: 0.86,
    backgroundColor: 'rgb(12, 20, 38)',
    marginTop: 2,
  },
  orderbookTextContainer: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  orderbookDataBidContainer: {
    flex: 0.5,
    paddingTop: 5,
  },
  orderbookDataAskContainer: {
    flex: 0.5,
    paddingTop: 5,
  },
  orderbookHeaderText: {
    flex: 0.3,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgb(70, 88, 116)',
  },
  bottomContainer: {
    flex: 0.08,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

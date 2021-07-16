import React from 'react';
import {SafeAreaView} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/configureStore';
import {OrderBook} from './src/ui/pages/orderbook';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={{flex: 1}}>
        <OrderBook />
      </SafeAreaView>
    </Provider>
  );
};

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {
  item: any;
  isBid: boolean;
};

export const OrderBookItem: React.FC<Props> = ({item, isBid}) => {
  return (
    <>
      <View
        style={{
          right: 0,
          position: 'absolute',
          backgroundColor: isBid ? 'rgb(18, 56, 57)' : 'rgb(62, 33, 44)',
          width: item[3],
          height: 30,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          padding: 4,
        }}>
        <Text
          style={
            isBid ? styles.orderbookBidPriceText : styles.orderbookAskPriceText
          }>
          {item[0]}
        </Text>
        <Text style={styles.orderbookSizeText}>{item[1]}</Text>
        <Text style={styles.orderbookGeneralNumText}>{item[2]}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  orderbookBidPriceText: {
    flex: 0.3,
    textAlign: 'right',
    color: 'rgb(14, 136, 101)',
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: '500',
  },
  orderbookGeneralNumText: {
    flex: 0.3,
    textAlign: 'right',
    color: 'rgb(202, 204, 209)',
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: '500',
  },
  orderbookAskPriceText: {
    flex: 0.3,
    textAlign: 'right',
    color: 'rgb(194, 59, 62)',
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: '500',
  },
  orderbookSizeText: {
    flex: 0.3,
    textAlign: 'right',
    color: 'rgb(202, 204, 209)',
    fontSize: 16,
    letterSpacing: 1,
    fontWeight: '500',
  },
});

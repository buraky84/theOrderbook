import * as Animatable from 'react-native-animatable';
import {StyleSheet, View} from 'react-native';
import React from 'react';

type Props = {
  errorText: string;
};

export const ErrorHighlighter: React.FC<Props> = ({errorText}) => {
  return (
    <View style={styles.errorContainer}>
      <Animatable.Text
        animation="fadeIn"
        iterationCount="infinite"
        direction="alternate"
        style={styles.errorText}>
        {errorText}
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    alignSelf: 'center',
    position: 'absolute',
    top: 60,
    marginHorizontal: 50,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ddd',
  },
  errorText: {
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'transparent',
    padding: 5,
    fontSize: 11,
  },
});

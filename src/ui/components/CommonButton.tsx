import React, {useState} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  height?: number;
  fontWeight?: any;
  icon?: any;
  iconSize?: number;
  iconColor?: string;
  buttonPress: () => void;
  testID?: string;
};

export const CommonButton: React.FC<Props> = ({
  buttonText,
  backgroundColor,
  textColor,
  fontSize,
  height = 40,
  fontWeight = 'normal',
  icon,
  iconSize,
  iconColor,
  buttonPress,
  testID,
}) => {
  const [inProgress, setInProgress] = useState(false);

  // @ts-ignore
  return (
    <TouchableOpacity
      style={{
        ...styles.buttonContainer,
        height: height,
        backgroundColor: backgroundColor,
      }}
      disabled={inProgress}
      testID={testID}
      onPress={() => {
        /*Prevent double click*/
        setInProgress(true);
        buttonPress();
        setTimeout(() => {
          setInProgress(false);
        }, 400);
      }}>
      {icon ? (
        <Icon
          name={icon}
          size={iconSize}
          color={iconColor}
          style={{paddingRight: 5}}
        />
      ) : undefined}
      <Text
        style={{color: textColor, fontSize: fontSize, fontWeight: fontWeight}}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
});

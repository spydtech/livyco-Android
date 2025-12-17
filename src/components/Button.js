import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import LayoutStyle from '../styles/LayoutStyle';
import Colors from '../styles/Colors';
import FontFamily from '../assets/FontFamily';
import { deviceHight } from '../utils/DeviceInfo';

const Button = ({
  btnName,
  onPress,
  bgColor,
  btnTextColor,
  btnStyle,
  flexContainer,
  disabled
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[flexContainer]} disabled={disabled}>
      <View
        style={[
          styles.btnContainer,
          {backgroundColor: bgColor ? bgColor : Colors.secondary},
          btnStyle,
        ]}>
        <Text
          style={[
            styles.btnText,
            {color: btnTextColor ? btnTextColor : Colors.whiteText},
          ]}>
          {btnName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default Button;

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 40,
    paddingVertical: deviceHight / 50,
   
  },
  btnText: {
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.whiteText,
    ...LayoutStyle.fontSize12,
    textAlign: 'center',
  },
});

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CommonStyles from "../styles/CommonStyles";
import Colors from "../styles/Colors";
import LayoutStyle from "../styles/LayoutStyle";
import FontFamily from "../assets/FontFamily";
import Icons from "./Icons";

const Input = ({
  forwardRef,
  value,
  placeholder,
  maxLength,
  secureTextEntry,
  onChangeText,
  onSubmitEditing,
  multiline,
  numberOfLines,
  isValidationShow,
  validationMessage,
  keyboardType,
  returnKeyType,
  blurOnSubmit,
  onChange,
  onFocus,
  onBlur,
  inputStyle,
  onKeyPress,
  InputLabel,
  rightIcon,
  rightIconSet,
  rightIconName,
  rightIconColor,
  rightIconSize,
  leftIcon,
  leftIconSet,
  leftIconName,
  leftIconColor,
  leftIconSize,
  textInContainer,
  props,
}) => {
  return (
    <View>
      {InputLabel && <Text style={[styles.inputLabel]}>{InputLabel}</Text>}
      <View
        style={[
          styles.textInputContainer,
          {
            borderBottomColor: isValidationShow
              ? Colors.danger
              : Colors.grayBorder,
          },
          textInContainer,
        ]}
      >
        <View style={{ ...CommonStyles.directionRowCenter }}>
          {leftIcon && (
            <TouchableOpacity style={{ ...LayoutStyle.marginLeft10 }}>
              <Icons
                iconSetName={leftIconSet}
                iconName={leftIconName}
                iconColor={leftIconColor}
                iconSize={leftIconSize}
              />
            </TouchableOpacity>
          )}
          <TextInput
            style={[
              styles.textInput,
              {
                color: Colors.inputBlackText,
              },
              inputStyle,
            ]}
            cursorColor={Colors.inputBlackText}
            ref={forwardRef}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={Colors.placeholder}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            blurOnSubmit={blurOnSubmit}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyPress={onKeyPress}
          />
        </View>
        {rightIcon && (
          <TouchableOpacity style={{ ...LayoutStyle.marginRight10 }}>
            <Icons
              iconSetName={rightIconSet}
              iconName={rightIconName}
              iconColor={rightIconColor}
              iconSize={rightIconSize}
            />
          </TouchableOpacity>
        )}
      </View>
      {isValidationShow ? (
        <Text style={[styles.validationMsg]}>{validationMessage}</Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  textInputContainer: {
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: 10,
    ...CommonStyles.directionRowSB,
  },
  textInput: {
    height: 50,
    width: "80%",
    fontFamily: FontFamily.PoppinsRegular,
    ...LayoutStyle.fontSize14,
    ...LayoutStyle.marginLeft10,
    marginTop: Platform.OS === "android" ? 2 : 0,
  },
  inputLabel: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
    ...LayoutStyle.marginBottom10,
    ...LayoutStyle.marginTop20,
  },
  focusOutView: {
    backgroundColor: Colors.inputfillBG,
    height: 50,
    fontFamily: FontFamily.PoppinsRegular,
    ...LayoutStyle.fontSize14,
    borderRadius: 25,
    ...LayoutStyle.paddingHorizontal20,
  },
  validationMsg: {
    color: Colors.danger,
    fontFamily: FontFamily.PoppinsRegular,
    ...LayoutStyle.fontSize8,
    ...LayoutStyle.marginTop10,
  },
});

export default Input;

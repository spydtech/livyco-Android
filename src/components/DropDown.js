import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CommonStyles from "../styles/CommonStyles";
import LayoutStyle from "../styles/LayoutStyle";
import Colors from "../styles/Colors";
import FontFamily from "../assets/FontFamily";

const DropDown = ({
  placeholder,
  searchPlaceholder,
  dropdownData,
  onChange,
  renderLeftIcon,
  renderRightIcon,
  value,
  onFocus,
  onBlur,
  labelField,
  valueField,
  maxHeight,
  mainDropdownStyle,
  isValidationShow,
  validationMessage,
}) => {
  return (
    <View style={[mainDropdownStyle]}>
      <Dropdown
        containerStyle={{
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
        searchPlaceholderTextColor={Colors.blackText}
        activeColor={Colors.lightBlue}
        itemTextStyle={[styles.listStyle]}
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemContainerStyle={{
          paddingHorizontal: 10,
        }}
        data={dropdownData}
        search
        maxHeight={maxHeight}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        renderLeftIcon={renderLeftIcon}
        renderRightIcon={renderRightIcon}
        fontFamily={FontFamily.PoppinsRegular}
      />

      {isValidationShow && (
        <Text style={[styles.validationMsg]}>{validationMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    paddingHorizontal: 5,
    borderColor: Colors.grayBorder,
    borderRadius: 10,
  },
  placeholderStyle: {
    color: Colors.placeholder,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    ...LayoutStyle.paddingLeft10,
    alignItems: "center",
  },
  container: {
    padding: 1,
  },
  listStyle: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
  },
  selectedTextStyle: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    ...LayoutStyle.paddingLeft10,
  },
  inputSearchStyle: {
    ...LayoutStyle.fontSize12,
    padding: 0,
    margin: 0,
    color: Colors.blackText,
  },
  dropdownFocusOutView: {
    backgroundColor: Colors.black,
    height: 50,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize14,
    borderRadius: 25,
    ...LayoutStyle.marginTop20,
    color: Colors.blackText,
  },
  validationMsg: {
    ...LayoutStyle.fontSize12,
  },
});
export default DropDown;

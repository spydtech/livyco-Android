import {StyleSheet} from 'react-native';
import LayoutStyle from './LayoutStyle';
import Colors from './Colors';
import {deviceHight, deviceWidth} from '../utils/DeviceInfo';
import FontFamily from '../assets/FontFamily';
import CommonStyles from './CommonStyles';

const ProfileStyle = StyleSheet.create({
  mainContainer: {},
  headerTitle: {
    ...LayoutStyle.fontSize12,
    color: Colors.white,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginLeft10,
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  userName: {
    ...LayoutStyle.fontSize10,
    color: Colors.black,
    fontFamily: FontFamily.RobotoSemiBold,
  },
  fontLite: {
    ...LayoutStyle.fontSize10,
    color: Colors.gray,
    fontFamily: FontFamily.RobotoRegular,
  },
  userNameContainer: {
    ...CommonStyles.directionRowCenter,
  },
  imageContaienr: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray,
    alignItems: 'center',
  },
  accountInfoTitle: {
    ...LayoutStyle.fontSize12,
    color: Colors.black,
    fontFamily: FontFamily.RobotoBold,
  },
  listOption: {
    ...LayoutStyle.fontSize12,
    color: Colors.black,
    fontFamily: FontFamily.RobotoRegular,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 10,
  },
  logoutText: {
    ...LayoutStyle.fontSize14,
    color: Colors.red,
    fontFamily: FontFamily.RobotoRegular,
  },
});

export default ProfileStyle;

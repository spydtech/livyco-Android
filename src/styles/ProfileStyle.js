import {StyleSheet} from 'react-native';
import LayoutStyle from './LayoutStyle';
import Colors from './Colors';
import {deviceHight, deviceWidth} from '../utils/DeviceInfo';
import FontFamily from '../assets/FontFamily';
import CommonStyles from './CommonStyles';

const ProfileStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingTop20,
  },
  headerTitle: {
    ...LayoutStyle.fontSize14,
    color: Colors.white,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginLeft10,
  },
  profileSection: {
    ...CommonStyles.directionRowSB,
    alignItems: 'center',
    ...LayoutStyle.paddingVertical20,
    backgroundColor: Colors.white,
  },
  profileImg: {
    height: 40,
    width: 40,
    borderRadius: 30,
    resizeMode: 'contain',
  },
  userName: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoSemiBold,
    ...LayoutStyle.marginBottom5,
  },
  fontLite: {
    ...LayoutStyle.fontSize12,
    color: Colors.gray,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginBottom3,
  },
  userNameContainer: {
    ...CommonStyles.directionRowCenter,
    flex: 1,
  },
  imageContaienr: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  accountInfoHeader: {
    ...LayoutStyle.marginBottom15,
  },
  accountInfoTitle: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoBold,
  },
  accountOptionRow: {
    ...CommonStyles.directionRowSB,
    alignItems: 'center',
    ...LayoutStyle.paddingVertical15,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.lightGray,
  },
  listOption: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    ...LayoutStyle.paddingVertical15,
    ...LayoutStyle.marginBottom20,
    ...LayoutStyle.marginTop10,
  },
  logoutText: {
    ...LayoutStyle.fontSize14,
    color: Colors.red,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginRight8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...LayoutStyle.paddingVertical40,
  },
});

export default ProfileStyle;

import {StyleSheet} from 'react-native';
import LayoutStyle from './LayoutStyle';
import Colors from './Colors';
import {deviceHight, deviceWidth} from '../utils/DeviceInfo';
import FontFamily from '../assets/FontFamily';
import CommonStyles from './CommonStyles';

const PaymentStyle = StyleSheet.create({
  mainContainer: {},
  homeContainer: {
    backgroundColor: Colors.goastWhite,
  },
  headerContainerBlue: {
    backgroundColor: Colors.secondary,
  },
  titleText: {
    ...LayoutStyle.fontSize16,
    color: Colors.white,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginLeft10,
  },
  payContainer: {},
  pgImg: {
    width: deviceWidth - 40,
    height: 160,
    borderRadius: 10,
  },
  propName: {
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    ...LayoutStyle.marginTop20,
  },
  checkDate: {
    ...CommonStyles.directionRowSB,
  },
  checkIn: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
    ...LayoutStyle.marginTop20,
  },
  amountPaid: {
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize16,
    color: Colors.blackText,
    ...LayoutStyle.marginTop20,
  },
  cancelBtn: {},
  amountContainer: {
    ...CommonStyles.directionRowCenter,
    ...LayoutStyle.marginBottom20,
  },
  descText: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
    color: Colors.blackText,
    ...LayoutStyle.marginLeft10,
    width: deviceWidth / 1.2,
  },
  cancel: {
    backgroundColor: Colors.goastWhite,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
  },
  btnRadius: {
    borderRadius: 10,
    ...LayoutStyle.padding15,
  },
  reviewText: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    ...LayoutStyle.marginVertical10,
  },
  rateImg: {
    ...CommonStyles.directionRowCenter,
  },
  textarea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: 'top',
    ...LayoutStyle.marginTop20,
    ...LayoutStyle.paddingHorizontal10,
  },
  textCount: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
    textAlign: 'right',
    ...LayoutStyle.marginTop5,
  },
  historyText: {
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
    ...LayoutStyle.marginTop5,
  },
  arrowIcon: {
    ...LayoutStyle.padding5,
    ...LayoutStyle.marginTop20,
    backgroundColor: Colors.paleBlue,
    borderRadius: 30,
  },
  alphabateContainer: {
    backgroundColor: Colors.purple,
    borderRadius: 10,
    height: 50,
    width: 50,

    alignItems: 'center',
  },
  alphabateText: {
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize12,
    color: Colors.goastWhite,
  },
  listContainer: {
    ...CommonStyles.directionRowCenter,
  },
  paymentSender: {
    ...LayoutStyle.marginLeft10,
  },
  paidToText: {
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    ...LayoutStyle.fontSize10,
  },
  senderName: {
    fontFamily: FontFamily.RobotoBold,
    color: Colors.blackText,
    ...LayoutStyle.fontSize12,
    ...LayoutStyle.marginTop5,
  },
  payArrow: {
    backgroundColor: '#0080001A',
    ...LayoutStyle.padding15,
    borderRadius: 30,
  },
  mainPayContainer: {
    ...CommonStyles.directionRowSB,
  },
  historyList: {
    borderWidth: 1,
    borderRadius: 20,
    ...LayoutStyle.marginBottom20,
    borderColor: Colors.grayBorder,
  },
  dateAmount: {
    ...LayoutStyle.marginTop5,
  },
  amountText: {
    fontFamily: FontFamily.RobotoBold,
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
  },
  dateText: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
    ...LayoutStyle.marginTop5,
  },
  historyDetailsList: {
    borderRadius: 20,
    ...LayoutStyle.marginBottom20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  invoiceTextContainer: {},
  invoiceText: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
  },
});

export default PaymentStyle;

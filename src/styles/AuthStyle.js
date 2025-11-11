import { StyleSheet } from "react-native";
import LayoutStyle from "./LayoutStyle";
import Colors from "./Colors";
import { deviceHight, deviceWidth } from "../utils/DeviceInfo";
import FontFamily from "../assets/FontFamily";
import CommonStyles from "./CommonStyles";

const AuthStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bgImage: {
    height: deviceHight,
    width: deviceWidth,
    alignItems: "center",
  },
  opacityImgBlue: {
    height: deviceHight,
    width: deviceWidth,
    backgroundColor: Colors.secondary,
  },
  logo: {
    flex: 1,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: deviceHight / 10,
    height: deviceWidth / 1.5,
    width: deviceWidth / 1.5,
   
  },
  bgImageWel: {
    height: deviceHight,
    width: deviceWidth,
    alignItems: "center",
  },
  opacityImgWhite: {
    height: deviceHight,
    width: deviceWidth,
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFillObject,
  },
  welScrImg: {
    height: deviceHight / 2.9,
    width: deviceWidth,
    resizeMode: "contain",
  },
  formContainer: {
    paddingTop: deviceHight / 5.6,
  },
  welScrDesc: {
    textAlign: "center",
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoSemiBold,
    ...LayoutStyle.fontSize20,
    lineHeight: 34,
    ...LayoutStyle.paddingTop30,
  },
  btnPadding: {
    ...LayoutStyle.marginHorizontal20,
    marginTop: "30%",
  },
  boardingImgContainer: {
    ...LayoutStyle.paddingTop30,
    justifyContent: "space-between"
  },
  boarding1Img: {
    height: deviceHight / 2,
    width: deviceWidth,
    resizeMode: "contain",
  },
  dotsPadding: {
    ...LayoutStyle.marginHorizontal20,
    marginTop: "20%",
  },
  dotsContainer: {
    ...CommonStyles.directionRowCenter,
    ...LayoutStyle.paddingBottom30,
    alignItems: "center",
  },
  dots: {
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "center",
    alignItems: "center",
    ...LayoutStyle.marginHorizontal5,
  },
  nextArrow: {
    backgroundColor: Colors.secondary,
    ...LayoutStyle.padding15,
    borderRadius: 8,
    elevation: 3,
  },
  skipText: {
    color: Colors.blackText,
    ...LayoutStyle.fontSize14,
  },
  // Login screen start
  loginContainer: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  loginLogoContainer: {
    alignItems: "center",
    ...LayoutStyle.paddingBottom30,
  },
  loginLogo: {
    height: 160,
    width: 160,
    resizeMode: "contain",
    ...LayoutStyle.marginTop20,
  },
  loginWhiteCard: {
    backgroundColor: Colors.goastWhite,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    width: "100%",
    height: "100%",
    ...LayoutStyle.paddingHorizontal30,

    ...LayoutStyle.marginTop10,
    alignSelf: "flex-end"
  },
  loginForm: {
    ...LayoutStyle.marginVertical30,

    alignItems: "center",
  },
  loginTitle: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoSemiBold,
    ...LayoutStyle.fontSize20,
  },
  loginSubtitle: {
    color: Colors.blackText,
    ...LayoutStyle.fontSize10,
  },
  inputContainer: {
    ...LayoutStyle.marginTop20,
  },
  inputLabel: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
  },
  toggleContainer: {
    ...LayoutStyle.marginVertical5,
  },
  toggleText: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize8,
    ...LayoutStyle.marginRight10,
  },
  mobileInputContainer: {
    ...CommonStyles.directionRowCenter,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.grayBorder,
    ...LayoutStyle.paddingHorizontal10,
  },
  countryCode: {
    ...CommonStyles.directionRowCenter,

    borderRightWidth: 1,
    borderRightColor: Colors.grayBorder,
  },
  flag: {
    width: 24,
    height: 16,
    ...LayoutStyle.marginRight10,
  },
  code: {
    color: Colors.grayText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
    ...LayoutStyle.marginRight10,
  },
  input: {
    height: 50,
    width: "75%",
  },
  dividerContainer: {
    ...LayoutStyle.paddingHorizontal30,
    ...LayoutStyle.marginVertical20,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.darkBorder,
    width: "20%",
  },
  orText: {
    ...LayoutStyle.marginHorizontal10,
    color: Colors.darkBorder,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
  },
  googleButtonContainer: {
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: 30,
    ...LayoutStyle.paddingVertical10,
    ...LayoutStyle.marginBottom20,
    alignItems: "center",
    ...LayoutStyle.marginHorizontal30,
    flexDirection: "row",
    justifyContent: "center",
  },
  googleImg: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  googleButtonText: {
    color: Colors.darkBorder,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
  },
  termsText: {
    color: Colors.darkBorder,
    ...LayoutStyle.fontSize10,
    textAlign: "center",
  },
  linkText: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize10,
  },
  guestButton: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 30,

    alignSelf: "center",
    alignItems: "center",
    ...LayoutStyle.paddingHorizontal30,
    ...LayoutStyle.paddingVertical10,
    ...LayoutStyle.marginTop30,
    ...LayoutStyle.marginBottom20,
  },
  guestText: {
    color: Colors.secondary,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
  },
  otpBoxContainer: {
    ...CommonStyles.directionRowCenter,
    alignContent: "center",
    justifyContent: "center",
    ...LayoutStyle.marginVertical20,
    paddingHorizontal: 5,
  },
  otpBox: {
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    width: Math.max(45, (deviceWidth - 120) / 6), // Calculate width: deviceWidth - container padding (~80) - margins (~40), min 45px
    marginHorizontal: 2.5,
    color: Colors.secondary,
    fontFamily: FontFamily.RobotoLight,
    ...LayoutStyle.fontSize26,
    borderColor: Colors.grayBorder,
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: Colors.goastWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    ...LayoutStyle.marginTop30,
  },
  successGrayText: {
    color: Colors.grayText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize12,
    ...LayoutStyle.marginTop10,
  },
  successLogo: {
    height: deviceWidth / 1.8,
    width: deviceWidth / 1.8,
    marginTop: -40,
  },
  // Register screen
  registerContainer: {
    backgroundColor: Colors.goastWhite,
    flex:1
  },
  photoContainer: {},
  photoView: {
    height: 120,
    width: 120,
    backgroundColor: Colors.lightGray,
    borderRadius: 100,
justifyContent: "center",
    alignItems: "center",
    ...LayoutStyle.marginTop20,
    alignSelf: "center",
  },
  profileImg: {
    height: 120,
    width: 120,
    borderRadius: 100,

    alignItems: "center",
    ...LayoutStyle.marginTop20,
    alignSelf: "center",
  },
  plusIcon: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: "36%",
    alignSelf: "flex-end",
    marginTop: -30,
  },
  registerTitle: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize18,
    ...LayoutStyle.marginTop10,
    borderBottomWidth: 5,
    ...LayoutStyle.paddingBottom5,
    alignSelf: "flex-start",
    borderBottomColor: Colors.primary,
  },
  registerTitleGray: {
    color: Colors.lightGray,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize18,
    borderBottomWidth: 5,
    ...LayoutStyle.marginTop10,
    ...LayoutStyle.paddingBottom5,
    alignSelf: "flex-start",
    borderBottomColor: Colors.goastWhite,
  },
  contactDetailsText: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize20,
    ...LayoutStyle.marginVertical20,
  },
  radioText: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize10,
    ...LayoutStyle.marginRight10,
  },
  radioContainer: {
    ...CommonStyles.directionRowCenter,
    ...LayoutStyle.marginVertical5,
  },
  radioTextLabel: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
    ...LayoutStyle.marginHorizontal10,
  },
  buttonContainer: {
    ...LayoutStyle.marginTop20,
  },

  dateView: {
    borderWidth: 1,
    ...LayoutStyle.padding15,
    borderRadius: 6,
    ...LayoutStyle.marginTop10,
    borderColor: Colors.grayBorder,
    height: 55,
  },
  textDate: {
    ...LayoutStyle.fontSize12,
    color: Colors.grayText,
    fontFamily: FontFamily.RobotoRegular,
  },
  inputText: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
    ...LayoutStyle.marginTop20,
  },
  uploadImgContainer: {
    borderWidth: 1,
    height: 55,
    borderColor: Colors.grayBorder,
    borderRadius: 10,
    ...LayoutStyle.marginTop10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...LayoutStyle.paddingLeft30,
  },
  uploadIcon: {
    alignSelf: "flex-end",
    ...LayoutStyle.marginRight10,
    ...LayoutStyle.padding10,
  },
  bottomSheetHeight: {
    height: deviceHight / 2.5,
  },
  bottomSheetContent: {
    ...LayoutStyle.paddingHorizontal30,
    ...LayoutStyle.paddingVertical20,
    paddingBottom: 30,
  },
  imgOpenName: {
    color: Colors.secondary,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize14,
    ...LayoutStyle.marginTop10,
    textAlign: "center",
  },
  imgOptionContainer: {
    ...CommonStyles.directionRowSB,
    ...LayoutStyle.marginTop30,
    paddingHorizontal: 10,
  },
  optionView: {
    width: deviceWidth / 3,
    borderWidth: 1,
    borderColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    ...LayoutStyle.paddingVertical20,
    ...LayoutStyle.paddingHorizontal10,
    minHeight: 120,
  },
  selectOption: {
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize16,
    textAlign: "center",
    ...LayoutStyle.marginBottom10,
  },
});

export default AuthStyle;

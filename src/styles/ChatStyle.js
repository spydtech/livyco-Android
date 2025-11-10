import { StyleSheet } from "react-native";
import LayoutStyle from "./LayoutStyle";
import Colors from "./Colors";
import { deviceHight, deviceWidth } from "../utils/DeviceInfo";
import FontFamily from "../assets/FontFamily";
import CommonStyles from "./CommonStyles";

const ChatStyle = StyleSheet.create({
  mainContainer: {},
  homeContainer: {
    backgroundColor: Colors.goastWhite,
  },
  headerContainerBlue: {
    backgroundColor: Colors.secondary,
    ...LayoutStyle.paddingVertical20,
    ...LayoutStyle.paddingHorizontal20,
  },

  profileImgContainer: {
    ...CommonStyles.directionRowCenter,
  },
  iconContainer: { ...CommonStyles.directionRowCenter },

  formContainer: {
    height: deviceHight,
    width: deviceWidth,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.paleBlue,
  },
  tab: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.paleBlue,

    ...LayoutStyle.marginHorizontal20,
    ...LayoutStyle.marginBottom10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,

    ...LayoutStyle.marginHorizontal20,
    ...LayoutStyle.marginBottom10,
  },
  tabText: {
    color: Colors.tabText,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginBottom5,
    ...LayoutStyle.marginTop10,
    ...LayoutStyle.marginHorizontal20,
    ...LayoutStyle.padding10,
  },
  tabActiveText: {
    color: Colors.black,
    ...LayoutStyle.fontSize12,
    ...LayoutStyle.marginTop10,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.marginBottom5,
    ...LayoutStyle.padding10,
  },
  ownerName: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.black,
  },
  dateText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
    ...LayoutStyle.marginBottom5,
  },
  profileImg: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  headerImg: {
    height: 45,
    width: 45,
    borderRadius: 50,
  },
  msgText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
    ...LayoutStyle.marginTop5,
  },
  chatListContainer: {
    ...LayoutStyle.paddingVertical20,
    borderBottomWidth: 1,
    ...LayoutStyle.marginHorizontal20,
    borderBottomColor: Colors.grayBorder,
  },
  chatName: {
    ...CommonStyles.directionRowCenter,
  },
  chatContainer: {
    ...CommonStyles.directionRowSB,
  },
  chatEndDate: {
    alignItems: "flex-end",
  },
  smallRound: {
    borderRadius: 20,
    backgroundColor: Colors.red,
    alignSelf: "center",
    alignItems: "center",
    marginTop: -22,
    padding: 3.5,
    ...LayoutStyle.marginBottom20,
    ...LayoutStyle.marginLeft10,
  },
  profileRound: {
    borderRadius: 20,
    backgroundColor: Colors.red,
    padding: 5,
    marginTop: 40,
    marginLeft: -10,
  },
  callIcon: {
    backgroundColor: Colors.primary,
    ...LayoutStyle.padding10,
    borderRadius: 30,
  },
  topHeader: {
    backgroundColor: Colors.paleBlue,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical10,
  },
  messagesContainer: {
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  messageReceiverText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
  },
  messageSenderText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
  },
  messageSenderView: {
    ...LayoutStyle.padding10,
    alignSelf: "flex-start",
    ...LayoutStyle.margin20,
    backgroundColor: Colors.paleBlue,
    borderRadius: 10,
    width: deviceWidth / 1.6,
  },
  messageReceiverView: {
    alignSelf: "flex-end",
    ...LayoutStyle.padding10,
    backgroundColor: Colors.paleYellow,
    ...LayoutStyle.margin20,
    borderRadius: 10,
    width: deviceWidth / 1.6,
  },
  chatDateContainer: {
    backgroundColor: Colors.lightGray,
    ...LayoutStyle.paddingVertical10,
    ...LayoutStyle.paddingHorizontal20,
    alignSelf: "center",
    borderRadius: 20,
  },
  chatdateCenter: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
  },
  inputMsg: {
    paddingBottom: "30%",

    ...CommonStyles.directionRowCenter,
  },
  msgInput: {
    borderRadius: 30,
    borderColor: Colors.black,
    height: 50,
    ...LayoutStyle.marginRight20,
  },
  sendIcon: {
    backgroundColor: Colors.primary,
    ...LayoutStyle.padding15,
    borderRadius: 30,
    ...LayoutStyle.marginRight20,
  },
  screenNameWhite: {
    color: Colors.white,
    ...LayoutStyle.fontSize16,
    fontFamily: FontFamily.RobotoSemiBold,
    ...LayoutStyle.paddingLeft15,
  },
  contactedList: {
    ...LayoutStyle.marginHorizontal20,
    ...LayoutStyle.paddingVertical15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorder,
  },
  timeDateText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.grayText,
  },
  contactedImg: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  callContainerModal: {
    height: deviceHight / 5.5,
    backgroundColor: Colors.modalBlue,
    borderRadius: 10,

    alignItems: "center",
  },
  qusText: {
    ...LayoutStyle.fontSize16,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.goastWhite,
  },
  yesBtn: {
    backgroundColor: Colors.selectedGreen,
    ...LayoutStyle.padding5,
    borderRadius: 10,
    ...LayoutStyle.marginRight15,
  },
  yesBtnText: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.goastWhite,
    alignSelf: "center",
  },
  modalBnts: {
    ...CommonStyles.directionRowSB,
    ...LayoutStyle.paddingTop20,
  },
  noBtn: {
    ...LayoutStyle.padding5,
    borderRadius: 10,
    ...LayoutStyle.marginLeft15,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  noBtnText: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.goastWhite,
    alignSelf: "center",
  },
});

export default ChatStyle;

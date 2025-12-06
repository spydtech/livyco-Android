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
    ...LayoutStyle.paddingTop10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.paleBlue,
    ...LayoutStyle.paddingVertical10,
  },
  activeTab: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
    ...LayoutStyle.paddingVertical10,
  },
  tabText: {
    color: Colors.tabText,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
  },
  tabActiveText: {
    color: Colors.black,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoMedium,
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    // ...CommonStyles.directionRowSB,
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
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileRoundYellow: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.orange,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatProfileImgContainer: {
    position: 'relative',
  },
  unreadBadge: {
    backgroundColor: Colors.green,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...LayoutStyle.paddingHorizontal5,
    ...LayoutStyle.marginTop5,
  },
  unreadBadgeText: {
    color: Colors.white,
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoMedium,
  },
  callIcon: {
    backgroundColor: Colors.primary,
    ...LayoutStyle.padding10,
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIconInactive: {
    backgroundColor: Colors.lightGray,
    ...LayoutStyle.padding10,
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeader: {
    backgroundColor: Colors.paleBlue,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical10,
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingTop: 10,
  },
  messageReceiverText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.black,
  },
  messageSenderText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.black,
  },
  messageSenderView: {
    ...LayoutStyle.padding10,
    alignSelf: "flex-end",
    ...LayoutStyle.marginLeft20,
    ...LayoutStyle.marginRight20,
    ...LayoutStyle.marginVertical5,
    backgroundColor: Colors.paleYellow,
    borderRadius: 15,
    maxWidth: deviceWidth * 0.75,
    minWidth: 50,
  },
  messageReceiverView: {
    alignSelf: "flex-start",
    ...LayoutStyle.padding10,
    backgroundColor: Colors.paleBlue,
    ...LayoutStyle.marginLeft20,
    ...LayoutStyle.marginRight20,
    ...LayoutStyle.marginVertical5,
    borderRadius: 15,
    maxWidth: deviceWidth * 0.75,
    minWidth: 50,
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
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical10,
    backgroundColor: Colors.white,
    ...CommonStyles.directionRowCenter,
  },
  msgInput: {
    flex: 1,
    borderRadius: 25,
    borderColor: Colors.grayBorder,
    borderWidth: 1,
    height: 45,
    ...LayoutStyle.paddingHorizontal15,
    ...LayoutStyle.marginRight10,
    backgroundColor: Colors.white,
  },
  inputIconContainer: {
    ...LayoutStyle.marginRight10,
    ...LayoutStyle.padding10,
  },
  sendIcon: {
    backgroundColor: Colors.primary,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBanner: {
    backgroundColor: Colors.lightGray,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical15,
    ...LayoutStyle.marginHorizontal20,
    ...LayoutStyle.marginBottom20,
    borderRadius: 10,
    ...CommonStyles.directionRowCenter,
  },
  checkoutBannerIcon: {
    ...LayoutStyle.marginRight10,
  },
  checkoutBannerText: {
    flex: 1,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.black,
    lineHeight: 18,
  },
  chatBackground: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    opacity: 0.3,
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

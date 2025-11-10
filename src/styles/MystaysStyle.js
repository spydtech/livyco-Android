import {StyleSheet} from 'react-native';
import LayoutStyle from './LayoutStyle';
import Colors from './Colors';
import {deviceHight, deviceWidth} from '../utils/DeviceInfo';
import FontFamily from '../assets/FontFamily';
import CommonStyles from './CommonStyles';

const MystaysStyle = StyleSheet.create({
  mainContainer: {},
  homeContainer: {
    backgroundColor: Colors.goastWhite,
  },
  headerContainerBlue: {
    ...CommonStyles.directionRowSB,
    backgroundColor: Colors.secondary,
    ...LayoutStyle.paddingVertical20,
    ...LayoutStyle.paddingHorizontal20,
  },
  profileImgContainer: {
    ...CommonStyles.directionRowCenter,
  },
  iconContainer: {...CommonStyles.directionRowCenter},
  smallRound: {
    borderRadius: 20,
    backgroundColor: Colors.red,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: -22,
    padding: 3.5,
    ...LayoutStyle.marginBottom20,
    ...LayoutStyle.marginLeft10,
  },
  formContainer: {
    height: deviceHight,
    width: deviceWidth,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.paleBlue,
  },
  tab: {
    alignItems: 'center',
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
  tabListcontainer: {
    ...LayoutStyle.padding15,
  },
  staysListContainer: {
    ...CommonStyles.directionRowSB,
    ...LayoutStyle.padding10,
    ...LayoutStyle.marginTop15,
    elevation: 4,
    backgroundColor: Colors.white,
    margin: 4,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: Colors.grayBorder,
  },
  staysImg: {
    height: 120,
    width: 100,
    resizeMode: 'contain',
  },
  staysText: {
    color: Colors.black,
    ...LayoutStyle.fontSize16,
    fontFamily: FontFamily.RobotoMedium,
    width: deviceWidth / 2,
  },
  staysAddress: {
    color: Colors.black,
    ...LayoutStyle.fontSize10,
    ...LayoutStyle.marginLeft10,
    fontFamily: FontFamily.RobotoRegular,
    width: deviceWidth / 2,
  },
  checkDate: {
    color: Colors.black,
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoBold,
    ...LayoutStyle.marginVertical5,
  },
  checkDateAns: {
    color: Colors.black,
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    width: deviceWidth / 2,
  },
  iconAddress: {
    ...CommonStyles.directionRowCenter,
    ...LayoutStyle.marginVertical5,
  },
  timeSheetText: {
    color: Colors.black,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoMedium,
  },
  timesheetAddress: {
    color: Colors.black,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginLeft10,
    ...LayoutStyle.marginVertical5,
  },
  calenderContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    ...LayoutStyle.margin15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    ...LayoutStyle.paddingBottom10,
    borderWidth: 0.1,
    borderColor: Colors.gray,
  },
  calenderTextDate: {
    borderBottomWidth: 2,
    ...LayoutStyle.fontSize30,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.black,
    ...LayoutStyle.paddingBottom10,

    borderColor: Colors.gray,
  },
  calenderButton: {
    alignSelf: 'center',
    marginTop: '20%',
  },
  btnStyle: {
    backgroundColor: Colors.goastWhite,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.secondary,
    ...LayoutStyle.padding15,
  },
  checkDateText: {
    color: Colors.grayText,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginVertical10,
  },
  checkDateTextBlack: {
    color: Colors.blackText,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.marginVertical10,
  },
  checkDateValue: {
    color: Colors.black,
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    width: deviceWidth / 2,
  },
  detailsRoom: {
    ...LayoutStyle.padding10,
    backgroundColor: Colors.paleBlue,
    borderRadius: 20,
    ...LayoutStyle.marginLeft10,
    ...LayoutStyle.marginTop20,
  },
  detailsView: {
    flexDirection: 'row',
  },
  detailsViewMystay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsText: {
    color: Colors.blue,
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    textAlign: 'center',
  },
  addressText: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    width: deviceWidth / 1.5,
    ...LayoutStyle.marginLeft20,
  },
  btnFood: {
    ...CommonStyles.directionRowSB,
    borderWidth: 1,
    ...LayoutStyle.padding10,
    ...LayoutStyle.marginTop20,
    borderRadius: 10,
    borderColor: Colors.secondary,
  },
  foodText: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.secondary,
  },
  btnRoomContainer: {
    ...CommonStyles.directionRowSB,
    flexGrow: 1,
    ...LayoutStyle.marginTop20,
  },
  RadiusBtnStyle: {
    borderRadius: 10,
  },
  RadiusRoomBtnStyle: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
  },
  imgFood: {
    height: deviceHight / 3.5,
    width: deviceWidth - 10,
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  itemContainerFood: {
    ...LayoutStyle.marginBottom20,
  },
  mealTitle: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
  },
  mealText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.grayText,
    ...LayoutStyle.marginTop10,
  },
  foodListContainer: {
    ...LayoutStyle.padding15,
  },
  header: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    ...LayoutStyle.marginBottom10,
  },
  listContent: {
    ...LayoutStyle.paddingBottom15,
  },
  pageHeader: {
    ...LayoutStyle.fontSize14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.whiteText,
    ...LayoutStyle.marginLeft10,
  },
  container: {
    backgroundColor: Colors.goastWhite,
  },
  textarea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: 'top',
    ...LayoutStyle.marginTop20,
    ...LayoutStyle.paddingHorizontal10,
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
  },
  roomBox: {
    width: 70,
    height: 45,
    borderRadius: 12,

    alignItems: 'center',
    position: 'relative',
    ...LayoutStyle.marginBottom10,
  },
  roomText: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
  },
  greenStripContainer: {
    position: 'absolute',
    right: 4,
    top: '25%',
    bottom: '25%',
    width: 6,
    backgroundColor: 'transparent',

    alignItems: 'center',
  },
  greenStrip: {
    width: 4,
    height: '100%',
    backgroundColor: Colors.selectedGreen,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  available: {
    backgroundColor: Colors.lightGray,
  },
  grayStrip: {
    width: 4,
    height: '100%',
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  legendRow: {
    ...CommonStyles.directionRowCenter,
    ...LayoutStyle.marginVertical30,
  },
  legendBox: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  legendLabel: {
    ...LayoutStyle.fontSize10,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
  },
  btnStylesmall: {
    ...LayoutStyle.marginHorizontal30,
    borderRadius: 10,
  },
  successContainer: {
    alignItems: 'center',
  },
  thumbUpImg: {
    height: deviceHight / 3,
    width: deviceWidth - 100,
    marginTop: deviceWidth / 3,
  },
  updateText: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    ...LayoutStyle.marginTop20,
    width: deviceWidth - 50,
    textAlign: 'center',
  },
  viewStatusText: {
    ...LayoutStyle.fontSize12,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.secondary,
    ...LayoutStyle.marginRight10,
  },
  btnStatus: {
    ...CommonStyles.directionRowCenter,
    alignSelf: 'center',
    ...LayoutStyle.paddingBottom30,
  },
  statusContainer: {},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    position: 'relative',
  },
  iconColumn: {
    alignItems: 'center',
    width: 40,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 2,
  },
  verticalLine: {
    width: 1,

    backgroundColor: '#999',
    marginTop: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  textColumn: {
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  labelBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },
});

export default MystaysStyle;

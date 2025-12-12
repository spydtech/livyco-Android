import { StyleSheet } from 'react-native';
import Colors from './Colors';
import LayoutStyle from './LayoutStyle';
import { deviceWidth } from '../utils/DeviceInfo';
import FontFamily from '../assets/FontFamily';

const HelpStyle = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: Colors.goastWhite,
  },
  headerContainerBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.RobotoBold,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingTop20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: (deviceWidth - 60) / 2, // 2 columns with margins
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  optionText: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
    textAlign: 'center',
  },
});

export default HelpStyle;


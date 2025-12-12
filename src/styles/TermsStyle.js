import { StyleSheet } from 'react-native';
import Colors from './Colors';
import LayoutStyle from './LayoutStyle';
import FontFamily from '../assets/FontFamily';

const TermsStyle = StyleSheet.create({
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
    marginHorizontal: 20,
  },
  headerSpacer: {
    width: 26, // Same width as back icon to center the title
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingTop20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamily.RobotoBold,
    color: Colors.blackText,
    marginBottom: 15,
  },
  listContainer: {
    // No background - content directly on light gray background
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  listNumber: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
    marginRight: 10,
    minWidth: 20,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    lineHeight: 20,
  },
});

export default TermsStyle;


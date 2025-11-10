import {Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from './ResponsiveScreens';
import {RFPercentage} from './ResponsiveFonts';

const LayoutStyle = StyleSheet.create({
  //margin 5 for all sides

  margin5: {
    margin: hp(0.5),
  },
  marginTop5: {
    marginTop: hp(0.5),
  },
  marginBottom5: {
    marginBottom: hp(0.5),
  },
  marginVertical5: {
    marginVertical: hp(0.5),
  },
  marginLeft5: {
    marginLeft: hp(0.5),
  },
  marginRight5: {
    marginRight: hp(0.5),
  },
  marginHorizontal5: {
    marginHorizontal: hp(0.5),
  },

  //margin 10 for all sides

  margin10: {
    margin: hp(1),
  },
  marginTop10: {
    marginTop: hp(1),
  },
  marginBottom10: {
    marginBottom: hp(1),
  },
  marginVertical10: {
    marginVertical: hp(1),
  },
  marginLeft10: {
    marginLeft: hp(1),
  },
  marginRight10: {
    marginRight: hp(1),
  },
  marginHorizontal10: {
    marginHorizontal: hp(1),
  },

  //margin 15 for all sides

  margin15: {
    margin: hp(1.5),
  },
  marginTop15: {
    marginTop: hp(1.5),
  },
  marginBottom15: {
    marginBottom: hp(1.5),
  },
  marginVertical15: {
    marginVertical: hp(1.5),
  },
  marginLeft15: {
    marginLeft: hp(1.5),
  },
  marginRight15: {
    marginRight: hp(1.5),
  },
  marginHorizontal15: {
    marginHorizontal: hp(1.5),
  },

  //margin 20 for all sides

  margin20: {
    margin: hp(2),
  },
  marginTop20: {
    marginTop: hp(2),
  },
  marginBottom20: {
    marginBottom: hp(2),
  },
  marginVertical20: {
    marginVertical: hp(2),
  },
  marginLeft20: {
    marginLeft: hp(2),
  },
  marginRight20: {
    marginRight: hp(2),
  },
  marginHorizontal20: {
    marginHorizontal: hp(2),
  },

  //margin 30 for all sides

  margin30: {
    margin: hp(3),
  },
  marginTop30: {
    marginTop: hp(3),
  },
  marginBottom30: {
    marginBottom: hp(3),
  },
  marginVertical30: {
    marginVertical: hp(3),
  },
  marginLeft30: {
    marginLeft: hp(3),
  },
  marginRight30: {
    marginRight: hp(3),
  },
  marginHorizontal30: {
    marginHorizontal: hp(3),
  },

  // Padding 5 for all sides

  padding5: {
    padding: hp(0.5),
  },
  paddingTop5: {
    paddingTop: hp(0.5),
  },
  paddingBottom5: {
    paddingBottom: hp(0.5),
  },
  paddingVertical5: {
    paddingVertical: hp(0.5),
  },
  paddingRight5: {
    paddingRight: hp(0.5),
  },
  paddingLeft5: {
    paddingLeft: hp(0.5),
  },
  paddingHorizontal5: {
    paddingHorizontal: hp(0.5),
  },

  // Padding 10 for all sides

  padding10: {
    padding: hp(1),
  },
  paddingTop10: {
    paddingTop: hp(1),
  },
  paddingBottom10: {
    paddingBottom: hp(1),
  },
  paddingVertical10: {
    paddingVertical: hp(1),
  },
  paddingLeft10: {
    paddingLeft: hp(1),
  },
  paddingRight10: {
    paddingRight: hp(1),
  },
  paddingHorizontal10: {
    paddingHorizontal: hp(1),
  },

  // Padding 15 for all sides

  padding15: {
    padding: hp(1.5),
  },
  paddingTop15: {
    paddingTop: hp(1.5),
  },
  paddingBottom15: {
    paddingBottom: hp(1.5),
  },
  paddingVertical15: {
    paddingVertical: hp(1.5),
  },
  paddingLeft15: {
    paddingLeft: hp(1.5),
  },
  paddingRight15: {
    paddingRight: hp(1.5),
  },
  paddingHorizontal15: {
    paddingHorizontal: hp(1.5),
  },

  // Padding 20 for all sides

  padding20: {
    padding: hp(2),
  },
  paddingTop20: {
    paddingTop: hp(2),
  },
  paddingBottom20: {
    paddingBottom: hp(2),
  },
  paddingVertical20: {
    paddingVertical: hp(2),
  },
  paddingLeft20: {
    paddingLeft: hp(2),
  },
  paddingRight20: {
    paddingRight: hp(2),
  },
  paddingHorizontal20: {
    paddingHorizontal: hp(2),
  },

  // Padding 30 for all sides

  padding30: {
    padding: hp(3.5),
  },
  paddingTop30: {
    paddingTop: hp(3.5),
  },
  paddingBottom30: {
    paddingBottom: hp(3.5),
  },
  paddingVertical30: {
    paddingVertical: hp(3.5),
  },
  paddingLeft30: {
    paddingLeft: hp(3.5),
  },
  paddingRight30: {
    paddingRight: hp(3.5),
  },
  paddingHorizontal30: {
    paddingHorizontal: hp(3.5),
  },

  fontSize4: {
    fontSize: RFPercentage(1),
  },
  fontSize6: {
    fontSize: RFPercentage(1.2),
  },
  fontSize8: {
    fontSize: RFPercentage(1.4),
  },
  fontSize10: {
    // fontSize: Platform.OS === "android" ? RFPercentage(1.4) : RFPercentage(1.2),
    fontSize: RFPercentage(1.6),
  },
  fontSize12: {
    fontSize: RFPercentage(1.8),
  },
  fontSize14: {
    fontSize: RFPercentage(2),
  },
  fontSize16: {
    fontSize: RFPercentage(2.2),
  },
  fontSize18: {
    fontSize: RFPercentage(2.4),
  },
  fontSize20: {
    fontSize: RFPercentage(2.6),
  },
  fontSize22: {
    fontSize: RFPercentage(2.8),
  },
  fontSize24: {
    fontSize: RFPercentage(3),
  },
  fontSize26: {
    fontSize: RFPercentage(3.2),
  },
  fontSize28: {
    fontSize: RFPercentage(3.4),
  },
  fontSize30: {
    fontSize: RFPercentage(3.6),
  },
  fontSize32: {
    fontSize: RFPercentage(3.8),
  },
  fontSize34: {
    fontSize: RFPercentage(4),
  },
  fontSize36: {
    fontSize: RFPercentage(4.2),
  },
  fontSize38: {
    fontSize: RFPercentage(4.4),
  },
  fontSize40: {
    fontSize: RFPercentage(4.8),
  },
  fontSize42: {
    fontSize: RFPercentage(5),
  },
  fontSize44: {
    fontSize: RFPercentage(5.2),
  },
  fontSize46: {
    fontSize: RFPercentage(5.4),
  },
  fontSize48: {
    fontSize: RFPercentage(5.6),
  },
  fontSize50: {
    fontSize: RFPercentage(5.8),
  },
  fontSize52: {
    fontSize: RFPercentage(6),
  },
  fontSize80: {
    fontSize: RFPercentage(8),
  },
});

export default LayoutStyle;

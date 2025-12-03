import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';
import IMAGES from '../../assets/Images';
import MystaysStyle from '../../styles/MystaysStyle';
import Colors from '../../styles/Colors';
import FontFamily from '../../assets/FontFamily';
import {Icons} from '../../components';

const VacateSuccessScreen = props => {
  const requestId = props.route?.params?.requestId;
  const bookingId = props.route?.params?.bookingId;
  const vacateData = props.route?.params?.vacateData;

  const gotoViewStatus = () => {
    props.navigation.navigate('VacateStatus', {
      requestId: requestId,
      bookingId: bookingId,
      vacateData: vacateData,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: FontFamily.RobotoRegular,
              color: Colors.black,
              textAlign: 'center',
              marginBottom: 30,
              lineHeight: 24,
            }}>
            {
              "We've notified the PG owner about your vacating request. Please wait for their action. You'll be updated once they respond."
            }
          </Text>
          <View style={{marginBottom: 40}}>
          <Image source={IMAGES.thumbsUp} style={[MystaysStyle.thumbUpImg, { tintColor: Colors.darkYellowButton }]} />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.secondary,
          paddingVertical: 16,
          marginHorizontal: 20,
          marginBottom: 30,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => gotoViewStatus()}>
        <Text
          style={{
            color: Colors.white,
            fontSize: 16,
            fontFamily: FontFamily.RobotoMedium,
          }}>
          {'Okay, Got it!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VacateSuccessScreen;


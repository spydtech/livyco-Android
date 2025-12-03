import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React from 'react';
import IMAGES from '../../assets/Images';
import MystaysStyle from '../../styles/MystaysStyle';
import { Icons } from '../../components';
import Colors from '../../styles/Colors';

const SuccessRequestScreen = props => {
  // Get concern data from route params
  const concernId = props.route?.params?.concernId;
  const concern = props.route?.params?.concern;

  // Extract request ID from concern ID (use last 5 characters or full ID)
  const requestId = concernId
    ? `#${concernId.toString().slice(-5).toUpperCase()}`
    : '#12345';

  const gotoViewStatus = () => {
    props.navigation.navigate('ViewStatus', {
      concernId: concernId || concern?._id || concern?.id,
      concern: concern,
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView
        contentContainerStyle={MystaysStyle.successScrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={[MystaysStyle.successContainer]}>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Image source={IMAGES.thumbsUp} style={[MystaysStyle.thumbUpImg, { tintColor: Colors.darkYellowButton }]} />
            <Text style={[MystaysStyle.updateText]}>
              {'Your room change request has been submitted successfully!'}
            </Text>
            <Text style={[MystaysStyle.requestIdText]}>
              {`Request ID: ${requestId}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[MystaysStyle.btnStatus, { marginTop: 20 }]}
          onPress={() => gotoViewStatus()}>
          <Text style={[MystaysStyle.viewStatusText, { marginRight: 5 }]}>{'View Status'}</Text>
          <Icons
            iconSetName={'Ionicons'}
            iconName={'arrow-forward'}
            iconColor={Colors.secondary}
            iconSize={20}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SuccessRequestScreen;

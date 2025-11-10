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
import {Icons} from '../../components';
import Colors from '../../styles/Colors';
import {CommonActions} from '@react-navigation/native';

const SuccessRequestScreen = props => {
  const gotoViewStatus = () => {
    props.navigation.navigate('ViewStatus');
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.goastWhite} />
      <ScrollView>
        <View style={[MystaysStyle.successContainer]}>
          <Image source={IMAGES.thumbsUp} style={[MystaysStyle.thumbUpImg]} />
          <Text style={[MystaysStyle.updateText]}>
            {'Your room change request has been submitted successfully!'}
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[MystaysStyle.btnStatus]}
        onPress={() => gotoViewStatus()}>
        <Text style={[MystaysStyle.viewStatusText]}>{'View Status'}</Text>
        <Icons
          iconSetName={'Ionicons'}
          iconName={'arrow-forward'}
          iconColor={Colors.secondary}
          iconSize={24}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SuccessRequestScreen;

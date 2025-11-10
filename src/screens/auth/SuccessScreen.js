import {View, Text, StatusBar, ImageBackground, Image} from 'react-native';
import React, {useEffect} from 'react';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';

const SuccessScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Register');
    }, 3000);
  }, []);
  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.goastWhite} />
      <View style={[AuthStyle.successContainer]}>
        <Image style={AuthStyle.successLogo} source={IMAGES.successCheck} />
        <Text style={[AuthStyle.successText]}>{'Logged in successfully'}</Text>
      </View>
    </View>
  );
};

export default SuccessScreen;

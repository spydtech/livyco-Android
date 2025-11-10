import {View, Text, StatusBar, ImageBackground, Image} from 'react-native';
import React, {useEffect} from 'react';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';

const SplashScreen = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Welcome');
    }, 2000);
  }, []);
  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={[AuthStyle.opacityImgBlue]}>
        <ImageBackground source={IMAGES.primaryBG} style={[AuthStyle.bgImage]}>
          <Image style={AuthStyle.logo} source={IMAGES.logo} />
        </ImageBackground>
      </View>
    </View>
  );
};

export default SplashScreen;

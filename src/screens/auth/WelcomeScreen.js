import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';
import {Button} from '../../components';

const WelcomeScreen = props => {
  const gotoOnBordingScreen = () => {
    props.navigation.navigate('Onboarding');
  };

  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[AuthStyle.opacityImgWhite]}>
        <ImageBackground
          source={IMAGES.primaryBG}
          style={[AuthStyle.bgImageWel]}>
          <View style={[AuthStyle.formContainer]}>
            <Image style={AuthStyle.welScrImg} source={IMAGES.welscreenImg} />
            <Text style={[AuthStyle.welScrDesc]}>
              {
                "Need a Safe, Affordable \nHostel or PG? \nWe've Got You Covered!"
              }
            </Text>
            <View style={[AuthStyle.btnPadding]}>
              <Button
                btnName={'Find a Hostel/PG'}
                onPress={() => gotoOnBordingScreen()}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default WelcomeScreen;

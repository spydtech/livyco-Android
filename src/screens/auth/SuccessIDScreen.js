import {View, Text, StatusBar, ImageBackground, Image} from 'react-native';
import React, {useEffect} from 'react';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';
import {Button} from '../../components';
import {deviceWidth} from '../../utils/DeviceInfo';

const SuccessIDScreen = props => {
  useEffect(() => {
    // setTimeout(() => {
    //   props.navigation.navigate('Tab');
    // }, 3000);
  }, []);
  const gotoHomeScreen = () => {
    props.navigation.navigate('Tab');
  };
  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.goastWhite} />
      <View style={[AuthStyle.successContainer, {height: "100%", width: "100%"}]}>
        <Image style={AuthStyle.successLogo} source={IMAGES.successCheck} />
        <Text style={[AuthStyle.successText]}>
          {'Your account has been verified successfully'}
        </Text>
        <Text Text style={[AuthStyle.successGrayText]}>
          {'your Livyco ID is : LVC0000000'}
        </Text>
        <View style={{marginTop: '10%'}}>
          <Button
            onPress={() => gotoHomeScreen()}
            btnStyle={{backgroundColor: Colors.primary}}
            flexContainer={{width: deviceWidth - 100}}
            btnName={'Done'}
            btnTextColor={Colors.blackText}
          />
        </View>
      </View>
    </View>
  );
};

export default SuccessIDScreen;

import {View, Text, StatusBar, ImageBackground, Image} from 'react-native';
import React, {useEffect} from 'react';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';
import {getUserToken} from '../../utils/Api';
import {getUser} from '../../services/authService';

const SuccessScreen = props => {
  useEffect(() => {
    const checkUserRegistrationAndNavigate = async () => {
      try {
        // Get user token from storage
        const token = await getUserToken();
        
        if (!token) {
          props.navigation.replace('Welcome');
          return;
        }

        // Token exists, check user profile
        const userResponse = await getUser(token);
        
        if (userResponse.success && userResponse.data?.user) {
          const user = userResponse.data.user;
          
          // Check if user has completed profile (only check location)
          // Name and email are collected during registration, but location may be missing
          const hasLocation = user.location && user.location.trim() !== '';
          
          if (hasLocation) {
            // User has completed profile, navigate to home screen
            setTimeout(() => {
              props.navigation.replace('Tab');
            }, 3000);
          } else {
            // User is missing location, navigate to Register screen for profile completion
            setTimeout(() => {
              props.navigation.replace('Register', { isProfileCompletion: true });
            }, 3000);
          }
        } else {
          // Failed to get user data, navigate to Register screen
          setTimeout(() => {
            props.navigation.replace('Register');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
        // On error, navigate to Register screen
        setTimeout(() => {
          props.navigation.replace('Register');
        }, 3000);
      }
    };

    checkUserRegistrationAndNavigate();
  }, []);

  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.goastWhite} />
      <View style={[AuthStyle.successContainer, {height: "100%", width: "100%"}]}>
        <Image style={AuthStyle.successLogo} source={IMAGES.successCheck} />
        <Text style={[AuthStyle.successText]}>{'Logged in successfully'}</Text>
      </View>
    </View>
  );
};

export default SuccessScreen;

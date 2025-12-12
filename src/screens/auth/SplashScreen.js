import {View, StatusBar, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import {initializeToken} from '../../utils/Api';
import {getUser} from '../../services/authService';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';
import IntroLogoAnimation from '../../components/IntroLogoAnimation';

const isProfileComplete = (user) => {
  if (!user) return false;
  
  // Check if userType is set
  if (!user.userType) return false;
  
  // Check userType-specific fields
  if (user.userType === 'student') {
    if (!user.instituteName || !user.guardianName || !user.guardianContact) {
      return false;
    }
  } else if (user.userType === 'professional') {
    if (!user.organizationName || !user.emergencyContactName || !user.emergencyContactNumber) {
      return false;
    }
  }
  
  // Check KYC fields (aadhaarNumber is required)
  if (!user.aadhaarNumber) {
    return false;
  }
  
  return true;
};

const SplashScreen = props => {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // Initialize token from AsyncStorage into global variable
        const token = await initializeToken();
        console.log(" token", token);
        
        // Wait a bit for splash screen to show
        await new Promise(resolve => setTimeout(resolve, 2600));
        
        if (token) {
          // Token exists, check user profile
          try {
            const userResponse = await getUser(token);
            console.log("User response", userResponse);
            
            if (userResponse.success && userResponse.data?.user) {
              // User is logged in, always navigate to home
              props.navigation.replace('Tab');
            } else {
              // Failed to get user data, navigate to welcome screen
              props.navigation.replace('Welcome');
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // On error fetching profile, navigate to welcome screen
            props.navigation.replace('Welcome');
          }
        } else {
          // No token, navigate to welcome/login screen
          props.navigation.replace('Welcome');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // On error, navigate to welcome screen
        props.navigation.replace('Welcome');
      }
    };

    checkAuthAndNavigate();
  }, []);
  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={[AuthStyle.opacityImgBlue]}>
        <ImageBackground source={IMAGES.primaryBG} style={[AuthStyle.bgImage]}>
          <View style={AuthStyle.logoAnimationContainer}>
            <IntroLogoAnimation />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default SplashScreen;

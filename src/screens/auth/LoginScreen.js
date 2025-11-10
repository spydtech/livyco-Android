import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import IMAGES from '../../assets/Images';
import {Button, Icons} from '../../components';
import Colors from '../../styles/Colors';
import AuthStyle from '../../styles/AuthStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import {checkUserExists} from '../../services/authService';
import {sendFirebaseOTP} from '../../config/firebase';

const LoginScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate phone number
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Handle login/OTP send
  const handleSendOTP = async () => {
    // Clear previous error
    setError('');

    // Validate phone number
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // First check if user exists
//       const checkResponse = await checkUserExists({
//         phone: phoneNumber.trim(),
//         role: 'user', // You can make this dynamic if needed
//       });
// console.log("Chheck response", checkResponse);

//       if (!checkResponse.success) {
//         Alert.alert(
//           'User Not Found',
//           checkResponse.message || 'This phone number is not registered. Please register first.',
//           [
//             {
//               text: 'Register',
//               onPress: () => props.navigation.navigate('Registerotp'),
//             },
//             {text: 'Cancel', style: 'cancel'},
//           ],
//         );
//         setLoading(false);
//         return;
//       }

      // User exists, send OTP using Firebase
      const otpResponse = await sendFirebaseOTP(phoneNumber.trim());
console.log("otpResponse", otpResponse);
      if (otpResponse.success) {
        // Navigate to OTP screen with phone number and confirmation object
        props.navigation.navigate('Otp', {
          phoneNumber: phoneNumber.trim(),
          confirmation: otpResponse.confirmation,
          isLogin: true, // Flag to indicate this is login flow
        });
      } else {
        Alert.alert('Error', otpResponse.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const gotoGuest = () => {
    props.navigation.navigate('Tab');
  };

  const gotoVerifyregister = () => {
    props.navigation.navigate('Registerotp');
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={AuthStyle.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <View style={[AuthStyle.loginLogoContainer]}>
        <Image source={IMAGES.logo} style={AuthStyle.loginLogo} />
      </View>
      <View style={AuthStyle.loginWhiteCard}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={AuthStyle.loginForm}>
            <Text style={AuthStyle.loginTitle}>
              {'Enter your Phone Number'}
            </Text>
            <Text style={AuthStyle.loginSubtitle}>
              {'We will send you a 4 digit verification code'}
            </Text>
          </View>
          <View style={[AuthStyle.inputContainer]}>
            <Text style={[AuthStyle.inputLabel]}>{'Mobile Number'}</Text>
          </View>
          <View style={AuthStyle.mobileInputContainer}>
            <TouchableOpacity style={AuthStyle.countryCode}>
              <Image source={IMAGES.indianFlag} style={AuthStyle.flag} />
              <Text style={AuthStyle.code}>{'+91'}</Text>
              <Icons
                iconSetName={'FontAwesome6'}
                iconName={'caret-down'}
                iconColor={Colors.gray}
                iconSize={18}
              />
            </TouchableOpacity>
            <TextInput
              style={AuthStyle.input}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                // Only allow numbers
                const numericText = text.replace(/[^0-9]/g, '');
                // Limit to 10 digits
                const limitedText = numericText.slice(0, 10);
                setPhoneNumber(limitedText);
                if (error) {
                  setError('');
                }
              }}
              placeholder="Enter 10-digit phone number"
              placeholderTextColor={Colors.placeholder}
              maxLength={10}
              cursorColor={Colors.secondary}
            />
          </View>
          {error ? (
            <Text style={[AuthStyle.inputLabel, {color: Colors.danger, fontSize: 12, marginTop: 5}]}>
              {error}
            </Text>
          ) : null}
          <View style={{...LayoutStyle.paddingTop30}}>
            <Button
              onPress={handleSendOTP}
              btnName={loading ? 'SENDING...' : 'SEND OTP'}
              bgColor={loading ? Colors.gray : Colors.primary}
              btnTextColor={Colors.blackText}
              disabled={loading}
            />
          </View>
          {loading && (
            <View style={{...LayoutStyle.marginTop10, alignItems: 'center'}}>
              <ActivityIndicator size="small" color={Colors.secondary} />
            </View>
          )}
          <View style={AuthStyle.dividerContainer}>
            <View style={AuthStyle.divider} />
            <Text style={AuthStyle.orText}>OR</Text>
            <View style={AuthStyle.divider} />
          </View>
          <TouchableOpacity style={AuthStyle.googleButtonContainer}>
            <Image source={IMAGES.google} style={AuthStyle.googleImg} />
            <Text style={AuthStyle.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>
          <View style={{...LayoutStyle.marginVertical10}}>
            <Text style={AuthStyle.termsText}>
              {'By signing up, you agree to our '}
              <Text style={AuthStyle.linkText}>{'Terms of Use'}</Text> {'and'}
              <Text style={AuthStyle.linkText}>{'Privacy Policy'}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={AuthStyle.guestButton}
            onPress={() => gotoGuest()}>
            <Text style={AuthStyle.guestText}>{'Join as a Guest'}</Text>
          </TouchableOpacity>
          <View style={{...LayoutStyle.paddingTop30}}>
            <Button
              onPress={() => gotoVerifyregister()}
              btnName={'REGISTER WITH OTP'}
              bgColor={Colors.primary}
              btnTextColor={Colors.blackText}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

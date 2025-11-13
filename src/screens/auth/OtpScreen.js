import React, {useRef, useState, useEffect} from 'react';
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
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import IMAGES from '../../assets/Images';
import {Button, Icons} from '../../components';
import Colors from '../../styles/Colors';
import AuthStyle from '../../styles/AuthStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import CommonStyles from '../../styles/CommonStyles';
import {verifyFirebaseOTP, verifyOTP} from '../../services/authService';
import {setUserToken} from '../../utils/Api';
import {verifyFirebaseOTPCode, sendFirebaseOTP} from '../../config/firebase';
import {isDevelopment} from '../../utils/Environment';
import { deviceHight } from '../../utils/DeviceInfo';

const OtpScreen = props => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Firebase OTP is 6 digits
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Get phone number and confirmation from navigation params
  useEffect(() => {
    const phone = props.route?.params?.phoneNumber || '';
    const confirm = props.route?.params?.confirmation || null;
    const login = props.route?.params?.isLogin || false;
    const regData = props.route?.params?.registrationData || null;
    setPhoneNumber(phone);
    setConfirmation(confirm);
    setIsLogin(login);
    setRegistrationData(regData);
  }, [props.route?.params]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    newOtp[index] = numericText.slice(0, 1);

    setOtp(newOtp);
    setError(''); // Clear error on input

    if (numericText && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
    if (!numericText && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    if (!confirmation && !isDevelopment()) {
      setError('OTP session expired. Please request a new OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In development, use backend API directly
      if (isDevelopment() && confirmation?.isDevelopment) {
        const formattedPhone = phoneNumber.startsWith('+') 
          ? phoneNumber.replace('+91', '') 
          : phoneNumber;
        
        const backendResponse = await verifyOTP({
          phone: formattedPhone,
          otp: otpString,
        });
        
        console.log("Backend Response (Dev)", backendResponse);

        if (backendResponse.success && backendResponse.data?.token) {
          // Store token
          await setUserToken(backendResponse.data.token);

          Alert.alert('Success', backendResponse.message || 'Verification successful!', [
            {
              text: 'OK',
              onPress: () => {
                props.navigation.replace('Success');
              },
            },
          ]);
        } else {
          const errorMessage = backendResponse.message || 'Verification failed. Please try again.';
          setError(errorMessage);
          console.error('Backend verification error:', backendResponse);
        }
        setLoading(false);
        return;
      }
console.log("confirmation", confirmation);

      // In production, use Firebase flow
      // Step 1: Verify OTP with Firebase
      const firebaseResult = await verifyFirebaseOTPCode(
        confirmation, 
        otpString,
        phoneNumber ? (phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`) : null
      );
      console.log('firebaseresult', firebaseResult);

      if (!firebaseResult.success) {
        setError(firebaseResult.message || 'Invalid OTP. Please try again.');
        setLoading(false);
        return;
      }

      // Step 2: Send ID token to backend for verification and login
      // Use /verify-firebase-otp endpoint in production
      const backendResponse = await verifyFirebaseOTP({
        idToken: firebaseResult.idToken,
        // role is not sent - backend will verify token and return user's actual role
      });
      console.log("Backend Response (Prod)", backendResponse);

      if (backendResponse.success && backendResponse.data?.token) {
        // Store token
        await setUserToken(backendResponse.data.token);

        Alert.alert('Success', backendResponse.message || 'Verification successful!', [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.replace('Success');
            },
          },
        ]);
      } else {
        // Handle error response
        const errorMessage = backendResponse.message || backendResponse.data?.message || 'Verification failed. Please try again.';
        setError(errorMessage);
        console.error('Backend verification error:', backendResponse);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not found.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For login flow, check if user exists first
      if (isLogin) {
        const {checkUserExists} = require('../../services/authService');
        const checkResponse = await checkUserExists({
          phone: phoneNumber.trim(),
          role: 'user',
        });

        if (!checkResponse.success) {
          Alert.alert('Error', checkResponse.message || 'User not found.');
          setLoading(false);
          return;
        }
      }

      // Send OTP using Firebase
      const otpResponse = await sendFirebaseOTP(phoneNumber.trim());

      if (otpResponse.success) {
        setConfirmation(otpResponse.confirmation);
        Alert.alert('Success', 'OTP sent successfully!');
        // Reset OTP fields
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Error', otpResponse.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={AuthStyle.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <View style={[AuthStyle.loginLogoContainer]}>
        <Image source={IMAGES.logo} style={AuthStyle.loginLogo} />
      </View>
      <View style={[AuthStyle.loginWhiteCard, {height: deviceHight}]}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={AuthStyle.loginForm}>
            <Text style={AuthStyle.loginTitle}>{'OTP Verification'}</Text>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Text style={AuthStyle.loginSubtitle}>
                {`Enter 6 digit OTP sent to +91 ${phoneNumber || '******'}`}
              </Text>
            </View>
          </View>
          <View style={[AuthStyle.otpBoxContainer]}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                value={digit}
                cursorColor={Colors.secondary}
                style={[AuthStyle.otpBox]}
                keyboardType="numeric"
                maxLength={1}
                returnKeyType="next"
                autoFocus={index === 0}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                selectTextOnFocus={true}
              />
            ))}
          </View>
          {error ? (
            <Text style={[AuthStyle.inputLabel, {color: Colors.danger, fontSize: 12, textAlign: 'center', marginTop: 10}]}>
              {error}
            </Text>
          ) : null}
          <View style={{...LayoutStyle.paddingTop30}}>
            <Button
              onPress={handleVerifyOTP}
              btnName={loading ? 'VERIFYING...' : 'VERIFY OTP'}
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
          <View style={{...LayoutStyle.marginVertical30, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <Text style={AuthStyle.termsText}>
              {`Didn't receive OTP?`}
            </Text>
            <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                <Text style={[AuthStyle.linkText, {color: Colors.secondary, marginLeft: 5}]}>
                  {'Resend'}
                </Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpScreen;

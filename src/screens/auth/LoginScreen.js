import React, { useState, useEffect } from 'react';
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import IMAGES from '../../assets/Images';
import { Button, Icons } from '../../components';
import Colors from '../../styles/Colors';
import AuthStyle from '../../styles/AuthStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import { checkUserExists, googleSignIn } from '../../services/authService';
import { sendFirebaseOTP } from '../../config/firebase';
import { setUserToken } from '../../utils/Api';

const LoginScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Configure Google Sign-In on component mount
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "948960032829-e0101c3o4f1dci47tf45q0e19uq5rcth.apps.googleusercontent.com",
      webClientId: '948960032829-u4a5t24tob5qp9p8ksc2ibe90beah108.apps.googleusercontent.com', // From google-services.json (client_type: 3)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      scopes: ['profile', 'email'], // Request profile and email scopes
    });
  }, []);

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
      const checkResponse = await checkUserExists({
        phone: phoneNumber.trim(),
        role: 'user', // You can make this dynamic if needed
      });
      console.log("Chheck response", checkResponse);

      if (!checkResponse.success) {
        Alert.alert(
          'User Not Found',
          checkResponse.message || 'This phone number is not registered. Please register first.',
          [
            {
              text: 'Register',
              onPress: () => props.navigation.navigate('Registerotp'),
            },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
        setLoading(false);
        return;
      }

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

  // Handle Google Sign-In using GoogleSignin API
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');

      // Check if your device supports Google Play
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      } catch (playServicesError) {
        console.error('Google Play Services error:', playServicesError);
        throw new Error('Google Play Services is not available. Please install or update Google Play Services.');
      }
      
      // Sign in the user
      let signInResult;
      try {
        signInResult = await GoogleSignin.signIn();
        console.log('Google Sign-In result:', JSON.stringify(signInResult, null, 2));
      } catch (googleSignInError) {
        console.error('Google Sign-In error:', googleSignInError);
        
        // Handle user cancellation
        const errorCode = googleSignInError?.code || googleSignInError?.error?.code;
        if (errorCode === 'sign_in_cancelled' || errorCode === 'SIGN_IN_CANCELLED' || errorCode === '12501') {
          // User cancelled, don't show error
          setGoogleLoading(false);
          return;
        }
        
        // Re-throw with context
        throw {
          ...googleSignInError,
          source: 'google_signin',
          originalError: googleSignInError,
        };
      }
      
      // Extract idToken from the response
      // The idToken is typically in signInResult.data.idToken
      let idToken = null;
      let userData = null;
      
      if (signInResult?.data?.idToken) {
        // idToken is in data.idToken (most common structure)
        idToken = signInResult.data.idToken;
        userData = signInResult.data;
        console.log('Found idToken in signInResult.data.idToken');
      } else if (signInResult?.idToken) {
        // idToken is directly in signInResult
        idToken = signInResult.idToken;
        userData = signInResult;
        console.log('Found idToken in signInResult.idToken');
      } else {
        // If idToken is not in the signIn result, try to get it using getTokens()
        console.log('idToken not found in signIn result, trying getTokens()...');
        try {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens?.idToken;
          if (idToken) {
            console.log('Got idToken from getTokens()');
            // Get user data separately
            const currentUser = await GoogleSignin.getCurrentUser();
            userData = currentUser?.data || currentUser;
          } else {
            console.log('getTokens() returned no idToken');
          }
        } catch (tokenError) {
          console.error('Error getting tokens:', tokenError);
        }
      }
      
      if (!idToken) {
        console.error('No idToken found. signInResult structure:', JSON.stringify(signInResult, null, 2));
        throw new Error('Failed to get Google ID token. Please try again.');
      }
      
      console.log('Google ID token received successfully');
      
      // Create a Google credential with the token
      let googleCredential;
      try {
        googleCredential = auth.GoogleAuthProvider.credential(idToken);
      } catch (credError) {
        console.error('Error creating Google credential:', credError);
        throw new Error('Failed to create Google credential. Please try again.');
      }
      
      if (!googleCredential) {
        throw new Error('Failed to create Google credential. Please try again.');
      }
      
      // Sign-in the user with the credential
      let userCredential;
      try {
        userCredential = await auth().signInWithCredential(googleCredential);
      } catch (firebaseError) {
        console.error('Firebase sign-in error:', firebaseError);
        // Re-throw with more context
        throw {
          ...firebaseError,
          source: 'firebase_signin',
          originalError: firebaseError,
        };
      }
      
      if (!userCredential || !userCredential.user) {
        throw new Error('Failed to sign in with Firebase. Please try again.');
      }
      
      // Get the Firebase ID token
      let firebaseIdToken;
      try {
        firebaseIdToken = await userCredential.user.getIdToken();
      } catch (tokenError) {
        console.error('Error getting Firebase ID token:', tokenError);
        throw new Error('Failed to get Firebase ID token. Please try again.');
      }
      
      if (!firebaseIdToken) {
        throw new Error('Failed to get Firebase ID token. Please try again.');
      }
      
      console.log('Firebase ID token received');
      
      // Extract user info from Google response or Firebase user
      // GoogleSignin returns user data in userData.user object
      const googleUser = userData?.user || userData;
      const email = googleUser?.email || userCredential.user.email;
      const name = googleUser?.name || googleUser?.givenName || userCredential.user.displayName;
      const photo = googleUser?.photo || googleUser?.photoUrl || userCredential.user.photoURL;
      
      console.log('Google Sign-In successful:', {
        email,
        name,
        photo,
      });

      // Call backend API with Firebase ID token
      const response = await googleSignIn({
        token: firebaseIdToken,
        role: 'user', // Default role, can be made dynamic if needed
        email,
        name,
        photo,
      });

      console.log('Google Sign-In API response:', response);

      // Handle response - token can be in response.data.token or response.data (if data is the whole response)
      const token = response.data?.token || response.data?.data?.token || response.token;
      
      if (response.success && token) {
        // Save token
        await setUserToken(token);
        
        // Navigate to success screen - it will handle the rest of the flow
        props.navigation.navigate('Success');
      } else {
        Alert.alert(
          'Sign In Failed',
          response.message || response.data?.message || 'Google sign-in failed. Please try again.',
        );
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      console.error('Error type:', typeof error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        error: error?.error,
        name: error?.name,
        stack: error?.stack,
        toString: error?.toString?.(),
      });
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      // Handle different error types safely
      if (!error) {
        errorMessage = 'An unknown error occurred. Please try again.';
      } else {
        // Safely check error code - handle both direct code and nested error.code
        let errorCode = null;
        try {
          errorCode = error?.code || error?.error?.code || error?.nativeError?.code;
        } catch (e) {
          console.error('Error accessing error.code:', e);
        }
        
        // Handle specific error codes
        if (errorCode === 'auth/account-exists-with-different-credential') {
          errorMessage = 'An account already exists with this email. Please use a different sign-in method.';
        } else if (errorCode === 'auth/invalid-credential') {
          errorMessage = 'Invalid credentials. Please try again.';
        } else if (errorCode === 'sign_in_cancelled' || errorCode === 'SIGN_IN_CANCELLED' || errorCode === '12501') {
          // 12501 is the Android error code for user cancellation
          errorMessage = 'Sign-in was cancelled.';
          // Don't show alert for user cancellation
          setGoogleLoading(false);
          return;
        } else if (errorCode === 'auth/network-request-failed') {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (errorCode === 'auth/internal-error') {
          errorMessage = 'An internal error occurred. Please try again.';
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.nativeError?.message) {
          errorMessage = error.nativeError.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.toString) {
          errorMessage = error.toString();
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setGoogleLoading(false);
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
                iconSetName={'Ionicons'}
                iconName={'chevron-down'}
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
            <Text style={[AuthStyle.inputLabel, { color: Colors.danger, fontSize: 12, marginTop: 5 }]}>
              {error}
            </Text>
          ) : null}
          <View style={{ ...LayoutStyle.paddingTop30 }}>
            <Button
              onPress={handleSendOTP}
              btnName={loading ? 'SENDING...' : 'SEND OTP'}
              bgColor={loading ? Colors.gray : Colors.primary}
              btnTextColor={Colors.blackText}
              disabled={loading}
            />
          </View>
          {loading && (
            <View style={{ ...LayoutStyle.marginTop10, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={Colors.secondary} />
            </View>
          )}
          <View style={AuthStyle.dividerContainer}>
            <View style={AuthStyle.divider} />
            <Text style={AuthStyle.orText}>OR</Text>
            <View style={AuthStyle.divider} />
          </View>
          <TouchableOpacity 
            style={[
              AuthStyle.googleButtonContainer,
              googleLoading && { opacity: 0.6 }
            ]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading || loading}>
            {googleLoading ? (
              <ActivityIndicator size="small" color={Colors.secondary} />
            ) : (
              <Image source={IMAGES.google} style={AuthStyle.googleImg} />
            )}
            <Text style={AuthStyle.googleButtonText}>
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>
          <View style={{ ...LayoutStyle.marginVertical10 }}>
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
          <View style={{ ...LayoutStyle.paddingTop30 }}>
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

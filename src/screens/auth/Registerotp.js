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
import {register} from '../../services/authService';
import {sendFirebaseOTP} from '../../config/firebase';
import {setUserToken} from '../../utils/Api';

const Registerotp = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    name: '',
    email: '',
  });

  // Validate phone number
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      phone: '',
      name: '',
      email: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(phoneNumber)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle registration
  const handleRegister = async () => {
    // Clear previous errors
    setErrors({phone: '', name: '', email: ''});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register user with backend
      const response = await register({
        name: name.trim(),
        phone: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        role: 'user', // Default role
      });

      console.log("Registration response", response);

      if (!response.success) {
        Alert.alert(
          'Registration Failed',
          response.message || 'Registration failed. Please try again.',
        );
        setLoading(false);
        return;
      }

      // Step 2: Send OTP via Firebase for phone verification
      const otpResponse = await sendFirebaseOTP(phoneNumber.trim());

      if (otpResponse.success) {
        // Navigate to OTP screen for phone verification
        props.navigation.navigate('Otp', {
          phoneNumber: phoneNumber.trim(),
          confirmation: otpResponse.confirmation,
          isLogin: false, // This is registration flow
          registrationData: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phoneNumber.trim(),
            token: response.data.token, // Store token temporarily
          },
        });
      } else {
        // If OTP sending fails, still allow registration but show warning
        Alert.alert(
          'Registration Successful',
          'Your account has been created, but phone verification failed. You can verify your phone later.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (response.data.token) {
                  setUserToken(response.data.token);
                  props.navigation.navigate('Success');
                }
              },
            },
          ],
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
      );
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const gotoGuest = () => {
    props.navigation.navigate('Tab');
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
              {'Register Your Account'}
            </Text>
            <Text style={AuthStyle.loginSubtitle}>
              {'Enter your details to create an account'}
            </Text>
          </View>
          <View style={[AuthStyle.inputContainer]}>
            <Text style={[AuthStyle.inputLabel]}>{'Mobile Number'}</Text>
          </View>
          <View style={[
            AuthStyle.mobileInputContainer,
            errors.phone && {borderColor: Colors.danger}
          ]}>
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
                if (errors.phone) {
                  setErrors({...errors, phone: ''});
                }
              }}
              placeholder="Enter 10-digit phone number"
              placeholderTextColor={Colors.placeholder}
              maxLength={10}
              cursorColor={Colors.secondary}
            />
          </View>
          {errors.phone ? (
            <Text style={[AuthStyle.inputLabel, {color: Colors.danger, fontSize: 12}]}>
              {errors.phone}
            </Text>
          ) : null}
          <View style={[AuthStyle.inputContainer]}>
            <Text style={[AuthStyle.inputLabel]}>{'Name'}</Text>
          </View>
          <View style={[
            AuthStyle.mobileInputContainer,
            errors.name && {borderColor: Colors.danger}
          ]}>
            <TextInput
              style={AuthStyle.input}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({...errors, name: ''});
                }
              }}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.placeholder}
              cursorColor={Colors.secondary}
            />
          </View>
          {errors.name ? (
            <Text style={[AuthStyle.inputLabel, {color: Colors.danger, fontSize: 12}]}>
              {errors.name}
            </Text>
          ) : null}

          <View style={[AuthStyle.inputContainer]}>
            <Text style={[AuthStyle.inputLabel]}>{'Email'}</Text>
          </View>
          <View style={[
            AuthStyle.mobileInputContainer,
            errors.email && {borderColor: Colors.danger}
          ]}>
            <TextInput
              style={AuthStyle.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({...errors, email: ''});
                }
              }}
              placeholder="Enter your email address"
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              cursorColor={Colors.secondary}
            />
          </View>
          {errors.email ? (
            <Text style={[AuthStyle.inputLabel, {color: Colors.danger, fontSize: 12}]}>
              {errors.email}
            </Text>
          ) : null}

          <View style={{...LayoutStyle.paddingTop30}}>
            <Button
              onPress={handleRegister}
              btnName={loading ? 'REGISTERING...' : 'REGISTER'}
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
          
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Registerotp;

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
} from 'react-native';
import IMAGES from '../../assets/Images';
import {Button, Icons, Input} from '../../components';
import Colors from '../../styles/Colors';
import AuthStyle from '../../styles/AuthStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import {isEmail, isEmpty} from '../../utils/Validation';
import {MESSAGES} from '../../utils/Messages';
import {registerRequest} from './redux/Action';
import {useDispatch} from 'react-redux';

const UserRegisterScreen = props => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [isNameValid, setIsnameValid] = useState('');
  const [nameError, setNameError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [location, setLocation] = useState('');
  const [isLocationValid, setIsLocationValid] = useState('');
  const [locationError, setLocationError] = useState('');

  const onChangeName = text => {
    setName(text);
    setIsnameValid(false);
  };

  const onChnageMobileNumb = text => {
    setPhoneNumber(text);
    setIsPhoneValid(false);
  };

  const onChangeLocation = text => {
    setLocation(text);
    setIsLocationValid(false);
  };

  const gotoRegisterOtp = () => {
    if (isEmpty(name)) {
      setIsnameValid(true);
      setNameError(MESSAGES.firstname);
    } else if (isEmpty(phoneNumber)) {
      setIsPhoneValid(true);
      setPhoneError(MESSAGES.phoneNumb);
    } else if (isEmpty(location)) {
      setIsLocationValid(true);
      setLocationError(MESSAGES.location);
    }
    const data = {
      name: name,
      phone: phoneNumber,
      location: location,
      role: 'user',
    };
    dispatch(registerRequest(data, props.navigation));
  };

  const gotoLogin = () => {
    props.navigation.navigate('Login');
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
          <View>
            <Text style={AuthStyle.loginTitle}>{'Register'}</Text>
            <Input
              InputLabel={'Name*'}
              onChangeText={text => onChangeName(text)}
              value={name}
              placeholder={'Name'}
              placeholderTextColor={Colors.fontGray}
              keyboardType={'default'}
              isValidationShow={isNameValid}
              errorMsg={nameError}
            />
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
                onChangeText={text => onChnageMobileNumb(text)}
                cursorColor={Colors.secondary}
              />
            </View>
            {isPhoneValid && (
              <Text style={[AuthStyle.errorPhone]}>{phoneError}</Text>
            )}
            <Input
              InputLabel={'Location*'}
              onChangeText={text => onChangeLocation(text)}
              value={location}
              placeholder={'Location'}
              placeholderTextColor={Colors.fontGray}
              keyboardType={'default'}
              isValidationShow={isLocationValid}
              errorMsg={locationError}
            />
            {/* <Input
              InputLabel={'Role*'}
              onChangeText={text => onChangeRole(text)}
              value={role}
              placeholder={'Role'}
              placeholderTextColor={Colors.fontGray}
              keyboardType={'default'}
              isValidationShow={isRoleValid}
              errorMsg={roleError}
            /> */}
          </View>
          <View>
            <View style={{...LayoutStyle.paddingTop30}}>
              <Button
                onPress={() => gotoRegisterOtp()}
                btnName={'Register with OTP'}
                bgColor={Colors.primary}
                btnTextColor={Colors.blackText}
              />
            </View>
          </View>
          <View style={{...LayoutStyle.marginVertical30}}>
            <Text style={AuthStyle.termsText}>
              {'By signing up, you agree to our '}
              <Text style={AuthStyle.linkText}>{'Terms of Use'}</Text> {'and'}
              <Text style={AuthStyle.linkText}>{' Privacy Policy'}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={AuthStyle.guestButton}
            onPress={() => gotoLogin()}>
            <Text style={AuthStyle.guestText}>{'Login'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserRegisterScreen;

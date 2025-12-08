import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  // SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import {Button, Icons, Input} from '../../components';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import { isGuestUser, showGuestRestrictionAlert } from '../../utils/authUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

const PayRentScreen = props => {
  const [rating, setRating] = useState(4);
  const [reason, setReason] = useState('');

  const gotoHistory = () => {
    props.navigation.navigate('PayTab', {screen: 'History'});
  };
  
  // Check guest status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkGuestStatus = async () => {
        const isGuest = await isGuestUser();
        if (isGuest) {
          // Redirect to HomeTab if guest
          props.navigation.navigate('HomeTab');
          showGuestRestrictionAlert(props.navigation);
        }
      };
      checkGuestStatus();
    }, [props.navigation])
  );

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={PaymentStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          // paddingTop: 10,
          backgroundColor: Colors.secondary,
        }} edges={['top']}>
        <View style={PaymentStyle.headerContainerBlue}>
          <TouchableOpacity onPress={() => gotoBack()}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}>
        <View style={[PaymentStyle.payContainer]}>
          <Image source={IMAGES.bed} style={[PaymentStyle.pgImg]} />
          <Text style={[PaymentStyle.propName]}>{'Property Name'}</Text>
          <View style={[PaymentStyle.checkDate]}>
            <Text style={[PaymentStyle.checkIn]}>{'Check in Date - '}</Text>
            <Text style={[PaymentStyle.checkIn]}>{'00/00/0000'}</Text>
          </View>
          <View>
            <Text style={[PaymentStyle.reviewText]}>{'Drop a review'}</Text>
            <View style={[PaymentStyle.rateImg]}>
              {Array.from({length: 5}, (_, index) => (
                <TouchableOpacity
                  key={'rate' + index}
                  onPress={() => handleRating(index + 1)}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={index < rating ? 'star' : 'star-outline'}
                    iconColor={Colors.rating}
                    iconSize={18}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={PaymentStyle.textarea}
              multiline={true}
              numberOfLines={4}
              placeholder="Type something here..."
              value={reason}
              onChangeText={text => setReason(text)}
            />
            <Text style={[PaymentStyle.textCount]}>{'0/n'}</Text>
            <View style={{...CommonStyles.directionRowSB}}>
              <Text style={[PaymentStyle.historyText]}>
                {'Payment History'}
              </Text>
              <TouchableOpacity onPress={() => gotoHistory()}>
                <View style={[PaymentStyle.arrowIcon]}>
                  <Icons
                    iconSetName={'MaterialIcons'}
                    iconName={'arrow-forward-ios'}
                    iconColor={Colors.black}
                    iconSize={16}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[PaymentStyle.cancelBtn]}>
        <Button btnName={'Pay Rent'} btnStyle={PaymentStyle.btnRadius} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default PayRentScreen;

import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import {Button, Icons} from '../../components';
import IMAGES from '../../assets/Images';
import HomeStyle from '../../styles/HomeStyle';
import {CommonActions} from '@react-navigation/native';

const CancelScreen = () => {
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={PaymentStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}>
          <View style={[PaymentStyle.payContainer]}>
            <Image source={IMAGES.bed} style={[PaymentStyle.pgImg]} />
            <Text style={[PaymentStyle.propName]}>{'Property Name'}</Text>
            <View style={[PaymentStyle.checkDate]}>
              <Text style={[PaymentStyle.checkIn]}>{'Check in Date - '}</Text>
              <Text style={[PaymentStyle.checkIn]}>{'00/00/0000'}</Text>
            </View>
            <View style={[PaymentStyle.checkDate]}>
              <Text style={[PaymentStyle.amountPaid]}>{'Amount Paid'}</Text>
              <Text style={[PaymentStyle.amountPaid]}>{'0000.00'}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={[PaymentStyle.cancelBtn]}>
          <View style={[PaymentStyle.amountContainer]}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'circle'}
              iconColor={Colors.lightWhite}
              iconSize={40}
            />
            <Text style={[PaymentStyle.descText]}>
              {
                'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. T&C'
              }
            </Text>
          </View>
          <Button
            btnTextColor={Colors.secondary}
            btnStyle={PaymentStyle.cancel}
            btnName={'Cancel booking'}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CancelScreen;

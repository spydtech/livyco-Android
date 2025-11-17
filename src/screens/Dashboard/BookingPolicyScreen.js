import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import { Icons } from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import { CommonActions } from '@react-navigation/native';

const BookingPolicyScreen = props => {
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={HomeStyle.homeContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
        <View style={[HomeStyle.headerContainerBlue, {}]}>
          <View style={HomeStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={HomeStyle.screenNameWhite}>
              {'Guest Booking Policy'}
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[HomeStyle.policyContainer, { paddingHorizontal: 20, paddingTop: 20 }]}>
            <Text style={[HomeStyle.policyTitle]}>{'Guest Policies'}</Text>
            <View>
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={HomeStyle.listItem}>
                  <Text style={HomeStyle.number}>{index + 1}.</Text>
                  <Text key={index} style={[HomeStyle.text, { flex: 1 }]}>
                    Sapiente asperiores ut inventore. Voluptatem molestiae atque
                    minima corrupti adipisci fugit a. Earum assumenda qui beatae
                    aperiam quaerat est quis hic sit.
                  </Text>
                </View>
              ))}
            </View>

            <Text
              style={[HomeStyle.policyTitle, { ...LayoutStyle.marginVertical15 }]}>
              Cancellation & Refund
            </Text>
            <View>
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={HomeStyle.listItem}>
                  <Text style={HomeStyle.number}>{index + 1}.</Text>
                  <Text key={index} style={[HomeStyle.text, { flex: 1 }]}>
                    Sapiente asperiores ut inventore. Voluptatem molestiae atque
                    minima corrupti adipisci fugit a. Earum assumenda qui beatae
                    aperiam quaerat est quis hic sit.
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[HomeStyle.policyTitle]}>
              Other ....................
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BookingPolicyScreen;

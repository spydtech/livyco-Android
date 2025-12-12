import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Colors from '../../styles/Colors';
import { Icons } from '../../components';
import TermsStyle from '../../styles/TermsStyle';

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  const gotoBack = () => {
    navigation.dispatch(CommonActions.goBack());
  };

  // Sample content - replace with actual terms and conditions
  const guestPolicies = [
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
  ];

  const cancellationRefund = [
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
  ];

  const otherPolicies = [
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
    'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.',
  ];

  const renderListItem = (item, index) => {
    return (
      <View key={index} style={TermsStyle.listItem}>
        <Text style={TermsStyle.listNumber}>{index + 1}.</Text>
        <Text style={TermsStyle.listText}>{item}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={TermsStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}
        edges={['top']}>
        <View style={TermsStyle.headerContainerBlue}>
          <TouchableOpacity onPress={gotoBack}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={TermsStyle.headerTitle}>{'Terms & Conditions'}</Text>
          <View style={TermsStyle.headerSpacer} />
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={TermsStyle.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={TermsStyle.contentContainer}>
          {/* Guest Policies Section */}
          <View style={TermsStyle.section}>
            <Text style={TermsStyle.sectionTitle}>Guest Policies</Text>
            <View style={TermsStyle.listContainer}>
              {guestPolicies.map((item, index) => renderListItem(item, index))}
            </View>
          </View>

          {/* Cancellation & Refund Section */}
          <View style={TermsStyle.section}>
            <Text style={TermsStyle.sectionTitle}>Cancellation & Refund</Text>
            <View style={TermsStyle.listContainer}>
              {cancellationRefund.map((item, index) => renderListItem(item, index))}
            </View>
          </View>

          {/* Other Section */}
          <View style={TermsStyle.section}>
            <Text style={TermsStyle.sectionTitle}>Other</Text>
            <View style={TermsStyle.listContainer}>
              {otherPolicies.map((item, index) => renderListItem(item, index))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TermsAndConditionsScreen;


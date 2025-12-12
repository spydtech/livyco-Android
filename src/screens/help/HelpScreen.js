import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Colors from '../../styles/Colors';
import { Icons } from '../../components';
import IMAGES from '../../assets/Images';
import HelpStyle from '../../styles/HelpStyle';

const HelpScreen = () => {
  const navigation = useNavigation();

  const gotoBack = () => {
    navigation.dispatch(CommonActions.goBack());
  };

  const handleSupportOption = (option) => {
    console.log('Selected support option:', option);
    // Add navigation or action handlers here
    switch (option) {
      case 'ticket':
        // Navigate to ticket status screen
        break;
      case 'chat':
        // Navigate to chat support screen
        break;
      case 'voice':
        // Navigate to voice support screen
        break;
      case 'email':
        // Navigate to email support screen
        break;
      default:
        break;
    }
  };

  const supportOptions = [
    {
      id: 'ticket',
      title: 'Ticket Status',
      image: IMAGES.ticketStatus,
    },
    {
      id: 'chat',
      title: 'Chat Support',
      image: IMAGES.chatSupport,
    },
    {
      id: 'voice',
      title: 'Voice Support',
      image: IMAGES.voiceSupport,
    },
    {
      id: 'email',
      title: 'Email Support',
      image: IMAGES.emailSupport,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HelpStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}
        edges={['top']}>
        <View style={HelpStyle.headerContainerBlue}>
          <TouchableOpacity onPress={gotoBack}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={HelpStyle.headerTitle}>{'Help'}</Text>
          <View style={HelpStyle.headerRightContainer}>
            <TouchableOpacity style={HelpStyle.headerIcon}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'search-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <TouchableOpacity style={HelpStyle.headerIcon}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'notifications-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
              <View style={HelpStyle.notificationDot}></View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={HelpStyle.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={HelpStyle.contentContainer}>
          <View style={HelpStyle.optionsGrid}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={HelpStyle.optionCard}
                onPress={() => handleSupportOption(option.id)}
                activeOpacity={0.7}>
                <View style={HelpStyle.iconContainer}>
                  <Image
                    source={option.image}
                    style={HelpStyle.optionImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={HelpStyle.optionText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HelpScreen;


import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import {Icons} from '../../components';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import MystayScreen from './MystayScreen';
import TimeSheetScreen from './TimeSheetScreen';
import {CommonActions} from '@react-navigation/native';

const MystaysScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Mystay');
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Mystay':
        return <MystayScreen />;
      case 'TimeSheet':
        return <TimeSheetScreen />;
      default:
        return <MystayScreen />;
    }
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={MystaysStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View style={MystaysStyle.headerContainerBlue}>
          <View style={MystaysStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
          <View style={MystaysStyle.iconContainer}>
            <TouchableOpacity>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'search'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'notifications-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
              <View style={MystaysStyle.smallRound}></View>
            </TouchableOpacity>

            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'FontAwesome6'}
                iconName={'circle-question'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ImageBackground
        source={IMAGES.primaryBG}
        style={[MystaysStyle.formContainer, {flex: 1}]}
        resizeMode="cover">
        <View style={MystaysStyle.tabContainer}>
          <TouchableOpacity
            style={[
              MystaysStyle.tab,
              selectedTab === 'Mystay' && MystaysStyle.activeTab,
            ]}
            onPress={() => setSelectedTab('Mystay')}>
            <Text
              style={[
                MystaysStyle.tabText,
                selectedTab === 'Mystay' && MystaysStyle.tabActiveText,
              ]}>
              {'My Stay'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              MystaysStyle.tab,
              selectedTab === 'TimeSheet' && MystaysStyle.activeTab,
            ]}
            onPress={() => setSelectedTab('TimeSheet')}>
            <Text
              style={[
                MystaysStyle.tabText,
                selectedTab === 'TimeSheet' && MystaysStyle.tabActiveText,
              ]}>
              {'Timesheet'}
            </Text>
          </TouchableOpacity>
        </View>
        {renderTabContent()}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default MystaysScreen;

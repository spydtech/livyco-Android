import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import ChatStyle from '../../styles/ChatStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import ChatListScreen from './ChatListScreen';
import ContactedScreen from './ContactedScreen';

const ChatsScreen = props => {
  const [selectedTab, setSelectedTab] = useState('ChatList');
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'ChatList':
        return <ChatListScreen props={props} />;
      case 'Contacted':
        return <ContactedScreen />;
      default:
        return <ChatListScreen props={props} />;
    }
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={ChatStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View style={ChatStyle.headerContainerBlue}>
          <View style={ChatStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={ChatStyle.screenNameWhite}>{'Chats'}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ImageBackground
        source={IMAGES.primaryBG}
        style={[ChatStyle.formContainer, {flex: 1}]}
        resizeMode="cover">
        <View style={ChatStyle.tabContainer}>
          <TouchableOpacity
            style={[
              ChatStyle.tab,
              selectedTab === 'ChatList' && ChatStyle.activeTab,
            ]}
            onPress={() => setSelectedTab('ChatList')}>
            <Text
              style={[
                ChatStyle.tabText,
                selectedTab === 'ChatList' && ChatStyle.tabActiveText,
              ]}>
              {'Chats'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              ChatStyle.tab,
              selectedTab === 'Contacted' && ChatStyle.activeTab,
            ]}
            onPress={() => setSelectedTab('Contacted')}>
            <Text
              style={[
                ChatStyle.tabText,
                selectedTab === 'Contacted' && ChatStyle.tabActiveText,
              ]}>
              {'Contacted'}
            </Text>
          </TouchableOpacity>
        </View>
        {renderTabContent()}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default ChatsScreen;

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import React, {useRef} from 'react';
import IMAGES from '../../assets/Images';
import {Icons, Input} from '../../components';
import FastImage from 'react-native-fast-image';
import Colors from '../../styles/Colors';
import ChatStyle from '../../styles/ChatStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import {CommonActions} from '@react-navigation/native';

const MessageListScreen = props => {
  const chatList = [
    {
      id: 1,
      name: 'Owner Name',
      senderId: 1,
      message:
        'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a.',
      chatDate: 'DD/MM/YYYY',
    },
    {
      id: 2,
      name: 'Owner Name',
      senderId: 2,
      message:
        'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a.',
    },
    {
      id: 3,
      name: 'Owner Name',
      senderId: 1,
      message:
        'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a.Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a.',
    },
  ];

  const flatListRef = useRef(null); // useRef for FlatList
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const renderChatItem = (chatItem, i) => {
    return (
      <View>
        {chatItem.chatDate && (
          <View style={[ChatStyle.chatDateContainer]}>
            <Text style={[ChatStyle.chatdateCenter]}>{chatItem.chatDate}</Text>
          </View>
        )}
        <View
          style={[
            chatItem.senderId === 1
              ? ChatStyle.messageSenderView
              : ChatStyle.messageReceiverView,
          ]}>
          <Text
            style={[
              chatItem.senderId === 1
                ? ChatStyle.messageSenderText
                : ChatStyle.messageReceiverText,
            ]}>
            {chatItem.message}
          </Text>
        </View>
      </View>
    );
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
        style={[ChatStyle.formContainer]}
        resizeMode="cover">
        <View style={ChatStyle.topHeader}>
          <View style={[ChatStyle.chatContainer]}>
            <View style={[ChatStyle.chatName]}>
              <FastImage
                style={ChatStyle.headerImg}
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2021/02/22/16/34/portrait-6040876_1280.jpg',
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View style={{...LayoutStyle.marginLeft10}}>
                <Text style={[ChatStyle.ownerName]}>{'Owner Name'}</Text>
                <Text style={[ChatStyle.msgText]}>{'Tag'}</Text>
              </View>
            </View>
            <View style={[ChatStyle.callIcon]}>
              <Icons
                iconName={'call-outline'}
                iconSetName={'Ionicons'}
                iconColor={Colors.black}
                iconSize={20}
              />
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef} // Assign ref to FlatList
          data={chatList}
          renderItem={({item: chats, index}) => renderChatItem(chats, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={ChatStyle.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({animated: true})
          }
          onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
        />
        <View style={[ChatStyle.inputMsg]}>
          <Input
            textInContainer={ChatStyle.msgInput}
            leftIcon={false}
            rightIcon={true}
            rightIconSet={'MaterialIcons'}
            rightIconName={'attach-file'}
            rightIconColor={Colors.black}
            rightIconSize={22}
          />
          <View style={[ChatStyle.sendIcon]}>
            <Icons
              iconName={'send'}
              iconSetName={'Ionicons'}
              iconColor={Colors.black}
              iconSize={20}
            />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default MessageListScreen;

import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import ChatStyle from '../../styles/ChatStyle';
import FastImage from 'react-native-fast-image';
import {Icons} from '../../components';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import {useNavigation} from '@react-navigation/native';

const ChatListScreen = props => {
  const navigation = useNavigation();
  const chatList = [
    {
      id: 1,
      name: 'Owner Name',
    },
    {
      id: 2,
      name: 'Owner Name',
    },
    {
      id: 3,
      name: 'Owner Name',
    },
  ];
  const gotoMessageScreen = () => {
    navigation.navigate('MessageList');
  };
  const renderChatList = () => {
    return (
      <TouchableOpacity
        style={[ChatStyle.chatListContainer]}
        onPress={() => gotoMessageScreen()}>
        <View style={[ChatStyle.chatContainer]}>
          <View style={[ChatStyle.chatName]}>
            <FastImage
              style={ChatStyle.profileImg}
              source={{
                uri: 'https://cdn.pixabay.com/photo/2021/02/22/16/34/portrait-6040876_1280.jpg',
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={[ChatStyle.profileRound]}></View>

            <View style={{...LayoutStyle.marginLeft10}}>
              <Text style={[ChatStyle.ownerName]}>{'Owner Name'}</Text>
              <Text style={[ChatStyle.msgText]}>
                {'voluptas earum voluptas?'}
              </Text>
            </View>
          </View>

          <View style={[ChatStyle.chatEndDate]}>
            <Text style={[ChatStyle.dateText]}>{'DD/MM/YYY'}</Text>
            <Icons
              iconName={'checkmark-outline'}
              iconSetName={'Ionicons'}
              iconColor={Colors.gray}
              iconSize={20}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        data={chatList}
        renderItem={({item: chatItem}) => renderChatList(chatItem)}
        scrollEnabled={false}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ChatListScreen;

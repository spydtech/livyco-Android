import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import ChatStyle from '../../styles/ChatStyle';
import {Button, Icons, Overlay} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
import Dialog from 'react-native-dialog';

const ContactedScreen = props => {
  const navigation = useNavigation();
  const [isCallModal, setIsCallModal] = useState(false);

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
  const openCallModal = () => {
    setIsCallModal(true);
  };
  const clickOnYes = () => {
    navigation.navigate('Call');
    setIsCallModal(false);
  };
  const clickOnNo = () => {
    setIsCallModal(false);
  };
  const renderContacted = () => {
    return (
      <View style={ChatStyle.contactedList}>
        <View style={[ChatStyle.chatContainer]}>
          <View style={[ChatStyle.chatName]}>
            <FastImage
              style={ChatStyle.contactedImg}
              source={{
                uri: 'https://cdn.pixabay.com/photo/2021/02/22/16/34/portrait-6040876_1280.jpg',
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={{...LayoutStyle.marginLeft10}}>
              <Text style={[ChatStyle.ownerName]}>{'Owner Name'}</Text>
              <Text style={[ChatStyle.timeDateText]}>{'DD/MM/YYY HH:MM'}</Text>
            </View>
          </View>
          <View style={{...CommonStyles.directionRowCenter}}>
            <TouchableOpacity
              style={[ChatStyle.callIcon]}
              onPress={() => openCallModal()}>
              <Icons
                iconName={'call-outline'}
                iconSetName={'Ionicons'}
                iconColor={Colors.black}
                iconSize={22}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[ChatStyle.callIcon, {...LayoutStyle.marginLeft20}]}>
              <Icons
                iconName={'chatbubble-outline'}
                iconSetName={'Ionicons'}
                iconColor={Colors.black}
                iconSize={22}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={chatList}
        renderItem={({item: chatItem}) => renderContacted(chatItem)}
        scrollEnabled={false}
        keyExtractor={item => item.id}
      />
      <Overlay visible={isCallModal}>
        <View style={[ChatStyle.callContainerModal]}>
          <Text style={[ChatStyle.qusText]}>
            {'Do you want to call this number ?'}
          </Text>
          <View style={[ChatStyle.modalBnts]}>
            <TouchableOpacity
              style={{flex: 0.345}}
              onPress={() => clickOnYes()}>
              <View style={[ChatStyle.yesBtn]}>
                <Text style={[ChatStyle.yesBtnText]}>{'Yes'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 0.345}} onPress={() => clickOnNo()}>
              <View style={[ChatStyle.noBtn]}>
                <Text style={[ChatStyle.noBtnText]}>{'No'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </View>
  );
};

export default ContactedScreen;

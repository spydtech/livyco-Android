import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import {Button, Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import {CommonActions} from '@react-navigation/native';

const BookingOptionScreen = props => {
  const [moveDate, setMoveDate] = useState('DD/MM/YYYY');
  const [open, setOpen] = useState(false);
  const [selectedSharing, setSelectedSharing] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const optionList = [
    {
      id: 1,
      optionName: 'Single Sharing',
    },
    {
      id: 2,
      optionName: 'Double Sharing',
    },
    {
      id: 3,
      optionName: 'Triple Sharing',
    },
    {
      id: 4,
      optionName: 'Four \nSharing',
    },
    {
      id: 5,
      optionName: 'Five  \nSharing',
    },
    {
      id: 6,
      optionName: 'Six  \nSharing',
    },
  ];

  const floors = [
    {
      id: 'floor1',
      name: 'First Floor',
      rooms: ['101', '102', '103', '104', '105', '106', '111', '111'],
    },
    {
      id: 'floor2',
      name: '2nd Floor',
      rooms: ['101', '102', '103', '104', '105', '106', '111', '111'],
    },
    {
      id: 'floor3',
      name: '3rd Floor',
      rooms: ['101', '102', '103', '104', '105', '106', '111', '111'],
    },
  ];

  const availableRooms = ['101', '102', '111'];

  const handleSharingSelect = index => {
    setSelectedSharing(index);
  };
  const gotoPolicy = () => {
    props.navigation.navigate('BookingPolicy');
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const renderOptionList = (item, index) => {
    return (
      <TouchableOpacity onPress={() => handleSharingSelect(index)}>
        <View
          style={[
            HomeStyle.optionListContainer,

            selectedSharing === index && HomeStyle.selectOptionListContainer,
          ]}>
          <Text
            style={[
              HomeStyle.optionListText,
              selectedSharing === index && HomeStyle.selectOptionListText,
            ]}>
            {item.optionName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const handleSelectRoom = room => {
    setSelectedRoom(room === selectedRoom ? null : room);
  };
  const renderRoom =
    floorName =>
    ({item}) => {
      const isAvailable = availableRooms.includes(item);
      const isSelected = selectedRoom === `${floorName}-${item}`;
      return (
        <TouchableOpacity
          style={[
            HomeStyle.roomBox,
            isAvailable && isSelected
              ? HomeStyle.selectedStyle
              : isAvailable
              ? HomeStyle.available
              : HomeStyle.unavailable,
          ]}
          onPress={() => isAvailable && handleSelectRoom(item)}>
          <Text style={HomeStyle.roomText}>{item}</Text>
          <View style={[HomeStyle.greenStripContainer]}>
            <View
              style={[
                !isAvailable ? HomeStyle.greenStrip : HomeStyle.grayStrip,
              ]}
            />
          </View>
        </TouchableOpacity>
      );
    };
  const renderFloor = ({item}) => (
    <View style={HomeStyle.floorContainer}>
      <Text style={HomeStyle.floorTitle}>{item.name}</Text>
      <FlatList
        data={item.rooms}
        keyExtractor={(room, index) => `${item.id}-${room}-${index}`}
        horizontal={false}
        numColumns={4}
        columnWrapperStyle={{gap: 8}}
        contentContainerStyle={{gap: 8}}
        renderItem={renderRoom(item.name)}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}>
        <View style={HomeStyle.headerContainerBlue}>
          <View style={HomeStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={HomeStyle.screenNameWhite}>{'Book My Stay'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{flexGrow: 1}}
        scrollEnabled>
        <View style={{...LayoutStyle.paddingHorizontal20}}>
          <View style={[HomeStyle.optionContainer]}>
            <Text style={[HomeStyle.optionBoldText]}>
              {'Select your preferred Sharing'}
            </Text>
          </View>
          <FlatList
            numColumns={3}
            data={optionList}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              ...LayoutStyle.marginTop20,
            }}
            renderItem={({item: optionItem, index}) =>
              renderOptionList(optionItem, index)
            }
            scrollEnabled={false}
            keyExtractor={item => item.id}
          />
          <View style={HomeStyle.legendRow}>
            <View style={{alignItems: 'center'}}>
              <View style={[HomeStyle.legendBox, {backgroundColor: 'green'}]} />
              <Text style={HomeStyle.legendLabel}>Available</Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                ...LayoutStyle.paddingLeft15,
              }}>
              <View style={[HomeStyle.legendBox, {backgroundColor: 'gray'}]} />
              <Text style={HomeStyle.legendLabel}>Not Available</Text>
            </View>
          </View>
          <FlatList
            data={floors}
            keyExtractor={item => item.id}
            renderItem={renderFloor}
            scrollEnabled={false}
          />
        </View>

        <View style={[HomeStyle.bottomTextContainer]}>
          <TouchableOpacity onPress={() => gotoPolicy()}>
            <Text style={[HomeStyle.bottomText]}>
              {'Click here'}
              <Text style={[HomeStyle.bottomTextMid]}>
                {'for Booking & Refund '}
              </Text>
              <Text>{'Continue'}</Text>
            </Text>
          </TouchableOpacity>
          <Button onPress={() => gotoPayrent()} btnName={'Continue'} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingOptionScreen;

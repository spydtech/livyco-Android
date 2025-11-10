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
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import {Button, Icons} from '../../components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {CommonActions} from '@react-navigation/native';

const MySelfBookingScreen = props => {
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
      name: 'First Floor',
      rooms: ['101', '102', '103', '104', '105', '106', '111', '111'],
    },
    {
      name: '2nd Floor',
      rooms: ['101', '102', '103', '104', '105', '106', '111', '111'],
    },
    {
      name: '3rd Floor',
      rooms: ['101', '102', '103', '104', '105', '106', '111', '111'],
    },
  ];

  const availableRooms = ['101', '102', '111']; // Mark these as available
  const isAvailable = room => availableRooms.includes(room);

  const handleSharingSelect = index => {
    setSelectedSharing(index);
    props.navigation.navigate('BookingOption');
  };

  const handleMovingDate = date => {
    setOpen(false);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    console.log('in press date=>date', formattedDate);

    setMoveDate(formattedDate);
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

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const gotoPayrent = () => {
    props.navigation.navigate('Tab', {screen: 'PayTab'});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
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
      <ImageBackground
        source={IMAGES.primaryBG}
        style={HomeStyle.formContainer}
        resizeMode="cover">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[HomeStyle.myselfContainer]}>
            <View style={[HomeStyle.selfBookingContainer]}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'bed-king-outline'}
                iconColor={Colors.gray}
                iconSize={28}
              />
              <Text style={[HomeStyle.bookingTitle]}>
                {'Figma Deluxe Hostel'}
              </Text>
            </View>
            <View style={[HomeStyle.radioBtn]}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'radio-button-off-outline'}
                iconColor={Colors.gray}
                iconSize={24}
              />
              <Text style={[HomeStyle.visitText]}>{'Short Visit'}</Text>
            </View>
            <View style={[HomeStyle.dateContainer]}>
              <Text style={[HomeStyle.dateText]}>{'Move In Date *'}</Text>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'calendar-clear-outline'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={[HomeStyle.dateView]}>
              <Text style={[HomeStyle.textDate]}>{moveDate}</Text>
              <DatePicker
                mode={'date'}
                modal
                open={open}
                date={new Date()}
                onConfirm={selectedDate => {
                  handleMovingDate(selectedDate);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </TouchableOpacity>
            <View style={[HomeStyle.optionContainer]}>
              <Text style={[HomeStyle.optionBoldText]}>
                {'Select your preferred Sharing'}
              </Text>
            </View>
            <View>
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
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default MySelfBookingScreen;

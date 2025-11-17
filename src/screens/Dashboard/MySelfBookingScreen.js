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
import React, { useState, useEffect } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import { Button, Icons } from '../../components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';

const MySelfBookingScreen = props => {
  // Get property data from route params (similar to PGBookingScreen)
  const propertyData = props.route?.params?.propertyData;
  const property = propertyData?.property || {};
  const rooms = propertyData?.rooms || { roomTypes: [] };
  const roomTypes = rooms?.roomTypes || [];

  const [moveDate, setMoveDate] = useState('DD/MM/YYYY');
  const [open, setOpen] = useState(false);
  const [selectedSharing, setSelectedSharing] = useState(null);
  const [selectedSharingIndex, setSelectedSharingIndex] = useState(null);
  const [isShortVisit, setIsShortVisit] = useState(false);

  // Convert room types to option list format
  const getSharingLabel = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('single') || typeLower === '1') return 'Single Sharing';
    if (typeLower.includes('double') || typeLower === '2') return 'Double Sharing';
    if (typeLower.includes('triple') || typeLower === '3') return 'Triple Sharing';
    if (typeLower.includes('four') || typeLower === '4') return 'Four Sharing';
    if (typeLower.includes('five') || typeLower === '5') return 'Five Sharing';
    if (typeLower.includes('six') || typeLower === '6') return 'Six Sharing';
    return type || 'Sharing';
  };

  // Build option list from room types or use default
  const optionList = roomTypes.length > 0
    ? roomTypes.map((rt, index) => ({
      id: rt._id || index + 1,
      optionName: getSharingLabel(rt.type || rt.label),
      roomType: rt,
    }))
    : [
      { id: 1, optionName: 'Single Sharing' },
      { id: 2, optionName: 'Double Sharing' },
      { id: 3, optionName: 'Triple Sharing' },
      { id: 4, optionName: 'Four Sharing' },
      { id: 5, optionName: 'Five Sharing' },
      { id: 6, optionName: 'Six Sharing' },
    ];

  const handleSharingSelect = index => {
    setSelectedSharingIndex(index);
    setSelectedSharing(optionList[index]);
  };

  const handleMovingDate = date => {
    setOpen(false);
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setMoveDate(formattedDate);
  };

  const renderOptionList = (item, index) => {
    const isSelected = selectedSharingIndex === index;
    return (
      <TouchableOpacity onPress={() => handleSharingSelect(index)}>
        <View
          style={[
            HomeStyle.optionListContainer,
            isSelected && HomeStyle.selectOptionListContainer,
          ]}>
          <Text
            style={[
              HomeStyle.optionListText,
              isSelected && HomeStyle.selectOptionListText,
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

  const gotoPolicy = () => {
    props.navigation.navigate('BookingPolicy', { propertyData });
  };

  const handleContinue = () => {
    if (!selectedSharing) {
      // Show error or alert
      return;
    }
    if (moveDate === 'DD/MM/YYYY') {
      // Show error or alert
      return;
    }
    // Navigate to BookingOption screen with selected data
    props.navigation.navigate('BookingOption', {
      propertyData,
      selectedSharing,
      moveInDate: moveDate,
    });
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: 10,
        backgroundColor: Colors.secondary,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={HomeStyle.homeContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
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
        <ImageBackground
          source={IMAGES.primaryBG}
          style={HomeStyle.formContainer}
          resizeMode="cover">
          <View style={{ flex: 1 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}>
              <View style={[HomeStyle.myselfContainer ]}>
                <View style={[HomeStyle.selfBookingContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Icons
                    iconSetName={'MaterialCommunityIcons'}
                    iconName={'bed-king-outline'}
                    iconColor={Colors.gray}
                    iconSize={28}
                  />
                  <Text style={[HomeStyle.bookingTitle]}>
                    {property.name || 'Figma Deluxe Hostel'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsShortVisit(!isShortVisit)}
                  style={[HomeStyle.radioBtn, { marginTop: 15 }]}
                  activeOpacity={0.7}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={isShortVisit ? 'radio-button-on' : 'radio-button-off-outline'}
                    iconColor={isShortVisit ? Colors.secondary : Colors.gray}
                    iconSize={24}
                  />
                  <Text style={[HomeStyle.visitText]}>{'Short Visit'}</Text>
                </TouchableOpacity>
                <View style={[HomeStyle.dateContainer, { flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}>
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
                    minimumDate={new Date()}
                    onConfirm={selectedDate => {
                      handleMovingDate(selectedDate);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </TouchableOpacity>
                <View style={[HomeStyle.optionContainer, { marginTop: 20 }]}>
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
                    renderItem={({ item: optionItem, index }) =>
                      renderOptionList(optionItem, index)
                    }
                    scrollEnabled={false}
                    keyExtractor={item => item.id?.toString() || Math.random().toString()}
                  />
                </View>
              </View>
              <View style={{ justifyContent: "flex-end", height: "100%", paddingVertical: 10}}>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => gotoPolicy()}>
                    <Text style={[HomeStyle.bottomText]}>
                      {'Click here for Booking & Refund Policies'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Button
                  onPress={handleContinue}
                  btnStyle={[HomeStyle.btnRadius]}
                  btnName={'Continue'}
                />
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MySelfBookingScreen;

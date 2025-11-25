import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import { Button, Icons, DropDown, Input } from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import DatePicker from 'react-native-date-picker';
import CommonStyles from '../../styles/CommonStyles';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import { Dropdown } from 'react-native-element-dropdown';
import { deviceHight } from '../../utils/DeviceInfo';

const GroupBookingScreen = props => {
  const propertyData = props.route?.params?.propertyData;
  const property = propertyData?.property || {};
  const rooms = propertyData?.rooms || {};
  const roomTypes = rooms?.roomTypes || [];
  const propertyId = property?._id || property?.id;

  // Room Booking State
  const [moveInDate, setMoveInDate] = useState(null);
  const [moveInDateText, setMoveInDateText] = useState('DD/MM/YYYY');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedSharing, setSelectedSharing] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(null);
  const [isShortVisit, setIsShortVisit] = useState(true);
  const [durationType, setDurationType] = useState('monthly');
  const [durationValue, setDurationValue] = useState('1');

  // Number of Guests Options
  const numberOfGuestsOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  // Get sharing options from room types or use default
  const getSharingOptions = () => {
    if (roomTypes && roomTypes.length > 0) {
      return roomTypes.map(rt => ({
        id: rt.type || rt._id,
        optionName: rt.label || getSharingLabel(rt.type),
        type: rt.type,
      }));
    }
    return [
      { id: 1, optionName: 'Single Sharing', type: 'single' },
      { id: 2, optionName: 'Double Sharing', type: 'double' },
      { id: 3, optionName: 'Triple Sharing', type: 'triple' },
      { id: 4, optionName: 'Four Sharing', type: 'four' },
      { id: 5, optionName: 'Five Sharing', type: 'five' },
      { id: 6, optionName: 'Six Sharing', type: 'six' },
    ];
  };

  const getSharingLabel = type => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('single') || typeLower === '1')
      return 'Single Sharing';
    if (typeLower.includes('double') || typeLower === '2')
      return 'Double Sharing';
    if (typeLower.includes('triple') || typeLower === '3')
      return 'Triple Sharing';
    if (typeLower.includes('four') || typeLower === '4') return 'Four Sharing';
    if (typeLower.includes('five') || typeLower === '5') return 'Five Sharing';
    if (typeLower.includes('six') || typeLower === '6') return 'Six Sharing';
    return type || 'Sharing';
  };


  const handleDateSelect = date => {
    setDatePickerOpen(false);
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setMoveInDateText(formattedDate);
    setMoveInDate(date);
  };

  const handleSharingSelect = item => {
    setSelectedSharing(item);
  };

  const validateRoomBooking = () => {
    if (!moveInDate) {
      showMessage({
        message: 'Please select move-in date',
        type: 'danger',
        floating: true,
      });
      return false;
    }
    if (!selectedSharing) {
      showMessage({
        message: 'Please select sharing type',
        type: 'danger',
        floating: true,
      });
      return false;
    }
    if (!numberOfGuests) {
      showMessage({
        message: 'Please select number of guests',
        type: 'danger',
        floating: true,
      });
      return false;
    }
    if (!durationValue || parseInt(durationValue) < 1) {
      showMessage({
        message: 'Please enter a valid duration',
        type: 'danger',
        floating: true,
      });
      return false;
    }
    return true;
  };


  const handleContinue = () => {
    if (validateRoomBooking()) {
      // Prepare duration data
      const durationMonths = durationType === 'monthly' ? parseInt(durationValue) : null;
      const durationDays = durationType === 'daily' ? parseInt(durationValue) : null;
      const durationWeeks = durationType === 'weekly' ? parseInt(durationValue) : null;
      
      // Navigate to BookingOptionScreen for bed selection
      props.navigation.navigate('BookingOption', {
        propertyData,
        selectedSharing: selectedSharing,
        moveInDate: moveInDateText,
        numberOfGuests: numberOfGuests,
        isShortVisit: isShortVisit,
        durationType,
        durationMonths,
        durationDays,
        durationWeeks,
        bookingType: 'group', // Flag to indicate this is group booking
      });
    }
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const renderSharingOption = (item, index) => {
    const isSelected = selectedSharing?.id === item.id;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleSharingSelect(item)}
        style={[
          HomeStyle.optionListContainer,
          isSelected && {
            backgroundColor: Colors.secondary,
            borderColor: Colors.secondary,
          },
        ]}
      >
        <Text
          style={[
            HomeStyle.optionListText,
            isSelected && { color: Colors.white },
          ]}
        >
          {item.optionName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRoomBookingScreen = () => {
    const sharingOptions = getSharingOptions();
    // const currentGuest = guests[guestType === 'Self' ? 0 : currentGuestIndex];

    return (
      <View style={[HomeStyle.homePadding20]}>
        <Text
          style={[HomeStyle.blackTextSmall, { ...LayoutStyle.marginBottom15 }]}
        >
          {'Please fill the below details for a smooth transaction'}
        </Text>

        {/* Short Visit Radio Button */}
        <View style={[HomeStyle.radioBtn]}>
          <TouchableOpacity
            onPress={() => setIsShortVisit(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Icons
              iconSetName={'Ionicons'}
              iconName={
                isShortVisit ? 'radio-button-on' : 'radio-button-off-outline'
              }
              iconColor={isShortVisit ? Colors.secondary : Colors.gray}
              iconSize={24}
            />
            <Text style={[HomeStyle.visitText, { marginLeft: 10 }]}>
              {'Short Visit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Move In Date */}
        <View
          style={[
            HomeStyle.dateContainer,
            { flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          <Text style={[HomeStyle.dateText]}>{'Move In Date *'}</Text>
          <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'calendar-clear-outline'}
              iconColor={Colors.gray}
              iconSize={24}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setDatePickerOpen(true)}
          style={[HomeStyle.dateView]}
        >
          <Text style={[HomeStyle.textDate]}>{moveInDateText}</Text>
        </TouchableOpacity>
        <DatePicker
          mode={'date'}
          modal
          open={datePickerOpen}
          date={moveInDate || new Date()}
          minimumDate={new Date()}
          onConfirm={handleDateSelect}
          onCancel={() => setDatePickerOpen(false)}
        />

        {/* Sharing Selection */}
        <Text
          style={[HomeStyle.optionSelectText, { ...LayoutStyle.marginTop20 }]}
        >
          {'Select your preferred Sharing'}
        </Text>
        <FlatList
          numColumns={3}
          data={sharingOptions}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            // ...LayoutStyle.marginTop20,
          }}
          renderItem={({ item, index }) => renderSharingOption(item, index)}
          scrollEnabled={false}
          keyExtractor={item => item.id?.toString() || item.type}
        />

        {/* Number Of Guest */}
        <Text style={[HomeStyle.numbOf, { ...LayoutStyle.marginTop20 }]}>
          {'Number Of Guest'}
        </Text>
        <Dropdown
          data={numberOfGuestsOptions}
          value={numberOfGuests}
          placeholder="Select from below options"
          onChange={item => {
            setNumberOfGuests(item.value);
          }}
          labelField="label"
          valueField="value"
          style={{
            height: 45,
            borderColor: Colors.grayBorder,
            borderWidth: 0.5,
            borderRadius: 8,
            paddingHorizontal: 15,
          }}
          placeholderStyle={{
            color: Colors.grayBorder,
          }}
          renderRightIcon={() => (
            <Icons
              iconSetName={'Ionicons'}
              iconName={'chevron-down'}
              iconColor={Colors.grayBorder}
              iconSize={18}
            />
          )}
        />

        {/* Duration Type and Value */}
        <View style={[HomeStyle.dateContainer, { flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}>
          <Text style={[HomeStyle.dateText]}>{'Duration *'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 }}>
          {/* Duration Type Dropdown */}
          <View style={{ flex: 1 }}>
            <Dropdown
              style={{
                height: 45,
                borderColor: Colors.grayBorder,
                borderWidth: 0.5,
                borderRadius: 8,
                paddingHorizontal: 15,
              }}
              placeholderStyle={{ color: Colors.grayBorder, fontSize: 16 }}
              selectedTextStyle={{ color: Colors.blackText, fontSize: 16 }}
              data={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select type"
              value={durationType}
              onChange={item => {
                setDurationType(item.value);
              }}
              renderLeftIcon={() => (
                <Icons
                  iconSetName={'MaterialIcons'}
                  iconName={'calendar-today'}
                  iconColor={Colors.gray}
                  iconSize={20}
                />
              )}
            />
          </View>

          {/* Duration Value Input */}
          <View style={{ flex: 0.5 }}>
            <TextInput
              style={{
                height: 45,
                borderColor: Colors.grayBorder,
                borderWidth: 0.5,
                borderRadius: 8,
                paddingHorizontal: 15,
                textAlign: 'center',
              }}
              placeholder="1"
              placeholderTextColor={Colors.grayText}
              keyboardType="numeric"
              value={durationValue}
              onChangeText={setDurationValue}
            />
          </View>

          {/* Duration Unit Label */}
          <View style={{ flex: 0.5, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={[HomeStyle.dateText, { marginTop: 0 }]}>
              {durationType === 'monthly' ? 'Months' : durationType === 'weekly' ? 'Weeks' : 'Days'}
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View
          style={[HomeStyle.bottomTextGroup, { ...LayoutStyle.marginTop30 }]}
        >
          <Button onPress={handleContinue} btnName={'Continue'} />
          <Text
            style={[
              HomeStyle.bottomLabel,
              { textAlign: 'center', marginTop: 10 },
            ]}
          >
            {'Id is mandatory during the check-in'}
          </Text>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.goastWhite,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.secondary}
      />
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
          <Text style={HomeStyle.screenNameWhite}>
            {'Room Bookings'}
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: Colors.goastWhite,
            padding: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {renderRoomBookingScreen()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GroupBookingScreen;

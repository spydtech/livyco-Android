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
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import {CommonActions} from '@react-navigation/native';
import {getAvailableRoomsAndBeds} from '../../services/bookingService';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';

const BookingOptionScreen = props => {
  // Get data from route params
  const propertyData = props.route?.params?.propertyData;
  const selectedSharing = props.route?.params?.selectedSharing;
  const moveInDate = props.route?.params?.moveInDate;
  const bookingType = props.route?.params?.bookingType; // 'group' or undefined (self booking)
  const property = propertyData?.property || {};
  const propertyId = property?._id || property?.id;
  const rooms = propertyData?.rooms || {roomTypes: []};
  const roomTypes = rooms?.roomTypes || [];

  const [selectedSharingIndex, setSelectedSharingIndex] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floors, setFloors] = useState([]);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const optionList = roomTypes.length > 0
    ? roomTypes.map((rt, index) => ({
        id: rt._id || index + 1,
        optionName: getSharingLabel(rt.label || rt.type),
        roomType: rt,
      }))
    : [
        {id: 1, optionName: 'Single Sharing'},
        {id: 2, optionName: 'Double Sharing'},
        {id: 3, optionName: 'Triple Sharing'},
        {id: 4, optionName: 'Four Sharing'},
        {id: 5, optionName: 'Five Sharing'},
        {id: 6, optionName: 'Six Sharing'},
      ];

  // Set selected sharing index based on passed data
  useEffect(() => {
    if (selectedSharing) {
      const index = optionList.findIndex(
        opt => opt.optionName === selectedSharing.optionName || opt.id === selectedSharing.id
      );
      if (index !== -1) {
        setSelectedSharingIndex(index);
      }
    }
  }, [selectedSharing]);

  // Check if we're coming back from GroupBookingScreen (user clicked back from guest details)
  // and restore the selected room if it was previously selected
  useEffect(() => {
    const previouslySelectedRoom = props.route?.params?.previouslySelectedRoom;
    if (previouslySelectedRoom) {
      setSelectedRoom(previouslySelectedRoom);
      // Clear the param to avoid re-triggering
      props.navigation.setParams({ previouslySelectedRoom: undefined });
    }
  }, [props.route?.params?.previouslySelectedRoom]);

  
  console.log("Property Id", propertyId, propertyData);
  
  // Fetch room availability
  useEffect(() => {
    if (propertyId && moveInDate) {
      fetchRoomAvailability();
    } else {
      setLoading(false);
    }
  }, [propertyId, moveInDate]);

  const fetchRoomAvailability = async () => {
    try {
      setLoading(true);
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const dateParts = moveInDate.split('/');
      const formattedDate = dateParts.length === 3 
        ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        : moment(moveInDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const response = await getAvailableRoomsAndBeds(propertyId, formattedDate);
      
      if (response.success && response.data) {
        // Process the availability data
        const availabilityData = response.data;
        const unavailable = [];
        
        // Extract unavailable room identifiers
        if (availabilityData.unavailableBeds) {
          unavailable.push(...availabilityData.unavailableBeds);
        }
        
        // Process floor configuration
        if (availabilityData.availabilityByFloor) {
          const floorList = Object.keys(availabilityData.availabilityByFloor).map((floorName, index) => {
            const floorData = availabilityData.availabilityByFloor[floorName];
            const roomNumbers = [];
            
            // Extract room numbers from the floor data
            if (floorData.rooms) {
              Object.keys(floorData.rooms).forEach(roomNum => {
                const roomData = floorData.rooms[roomNum];
                if (roomData.beds) {
                  Object.keys(roomData.beds).forEach(bed => {
                    roomNumbers.push(roomNum);
                  });
                }
              });
            }
            
            return {
              id: `floor${index + 1}`,
              name: floorName,
              rooms: roomNumbers.length > 0 ? [...new Set(roomNumbers)] : [],
            };
          });
          
          setFloors(floorList);
        } else {
          // Fallback: use default floors structure
          setFloors([
            {id: 'floor1', name: 'First Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
            {id: 'floor2', name: '2nd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
            {id: 'floor3', name: '3rd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
          ]);
        }
        
        setUnavailableRooms(unavailable);
      } else {
        // Fallback to default structure
        setFloors([
          {id: 'floor1', name: 'First Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
          {id: 'floor2', name: '2nd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
          {id: 'floor3', name: '3rd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
        ]);
      }
    } catch (error) {
      console.error('Error fetching room availability:', error);
      // Fallback to default structure
      setFloors([
        {id: 'floor1', name: 'First Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
        {id: 'floor2', name: '2nd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
        {id: 'floor3', name: '3rd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSharingSelect = index => {
    setSelectedSharingIndex(index);
  };

  const gotoPolicy = () => {
    props.navigation.navigate('BookingPolicy', {propertyData});
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleContinue = () => {
    if (!selectedRoom) {
      // Show error or alert
      showMessage({
        message: 'Please select a room',
        type: 'danger',
        floating: true,
      });
      return;
    }
    
    // Check if this is a group booking flow
    if (bookingType === 'group') {
      // Navigate to GuestDetailsScreen with selected room data
      const numberOfGuests = props.route?.params?.numberOfGuests;
      const isShortVisit = props.route?.params?.isShortVisit;
      const selectedSharing = props.route?.params?.selectedSharing;
      
      props.navigation.navigate('GuestDetails', {
        propertyData,
        selectedRoom,
        selectedSharingIndex,
        moveInDate,
        numberOfGuests,
        isShortVisit,
        selectedSharing,
      });
    } else {
      // Navigate to payment screen with booking data (self booking flow)
      const bookingData = {
        propertyData,
        selectedRoom,
        selectedSharingIndex,
        moveInDate,
      };
      props.navigation.navigate('PayRentBooking', {bookingData});
    }
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

  const handleSelectRoom = (room, floorName) => {
    const roomKey = `${floorName}-${room}`;
    setSelectedRoom(selectedRoom === roomKey ? null : roomKey);
  };

  const isRoomAvailable = (roomNumber) => {
    // Check if room is in unavailable list
    // The unavailable list contains room identifiers like "single-101-bed1"
    // We need to check if any unavailable room starts with this room number
    return !unavailableRooms.some(unavailable => 
      unavailable.includes(roomNumber) || unavailable.startsWith(roomNumber)
    );
  };

  const renderRoom = (floorName) => ({item}) => {
    const isAvailable = isRoomAvailable(item);
    const roomKey = `${floorName}-${item}`;
    const isSelected = selectedRoom === roomKey;
    return (
      <TouchableOpacity
        style={[
          HomeStyle.roomBox,
          isAvailable && isSelected
            ? HomeStyle.selectedStyle
            : isAvailable
            ? HomeStyle.available
            : HomeStyle.unavailable,
            {justifyContent: "center"}
        ]}
        onPress={() => isAvailable && handleSelectRoom(item, floorName)}
        disabled={!isAvailable}>
        <Text style={HomeStyle.roomText}>{item}</Text>
        <View style={[HomeStyle.greenStripContainer]}>
          <View
            style={[
              isAvailable ? HomeStyle.grayStrip : HomeStyle.grayStrip,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const renderFloor = ({item}) => (
    <View style={HomeStyle.floorContainer}>
      <Text style={HomeStyle.floorTitle}>{item.name}</Text>
      {item.rooms && item.rooms.length > 0 ? (
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
      ) : (
        <Text style={[HomeStyle.pgDesc, {textAlign: 'center', paddingVertical: 10}]}>
          No rooms available
        </Text>
      )}
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
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={[HomeStyle.pgDesc, {marginTop: 10}]}>Loading room availability...</Text>
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{flexGrow: 1}}
          contentContainerStyle={{paddingBottom: 100}}
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
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
            />
            <View style={HomeStyle.legendRow}>
              <View style={{alignItems: 'center'}}>
                <View style={[HomeStyle.legendBox, {backgroundColor: Colors.selectedGreen}]} />
                <Text style={HomeStyle.legendLabel}>Available</Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  ...LayoutStyle.paddingLeft15,
                }}>
                <View style={[HomeStyle.legendBox, {backgroundColor: Colors.lightGray}]} />
                <Text style={HomeStyle.legendLabel}>Not Available</Text>
              </View>
            </View>
            {floors.length > 0 ? (
              <FlatList
                data={floors}
                keyExtractor={item => item.id}
                renderItem={renderFloor}
                scrollEnabled={false}
              />
            ) : (
              <Text style={[HomeStyle.pgDesc, {textAlign: 'center', paddingVertical: 20}]}>
                No floor data available
              </Text>
            )}
          </View>

          <View style={[HomeStyle.bottomTextContainer, {paddingHorizontal: 20}]}>
            <TouchableOpacity onPress={() => gotoPolicy()}>
              <Text style={[HomeStyle.bottomText]}>
                {'Click here for Booking & Refund Policies'}
              </Text>
            </TouchableOpacity>
            <View style={{marginTop: 15}}>
              <Button onPress={handleContinue} btnName={'Continue'} />
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default BookingOptionScreen;

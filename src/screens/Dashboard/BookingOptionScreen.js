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
import {getAllAvailableBeds, checkRoomAvailability} from '../../services/bookingService';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';

const BookingOptionScreen = props => {
  // Get data from route params
  const propertyData = props.route?.params?.propertyData;
  const selectedSharing = props.route?.params?.selectedSharing;
  const moveInDate = props.route?.params?.moveInDate;
  const bookingType = props.route?.params?.bookingType; // 'group', 'myself', or undefined
  const personCount = props.route?.params?.personCount || 1;
  const durationType = props.route?.params?.durationType || 'monthly';
  const durationMonths = props.route?.params?.durationMonths || null;
  const durationDays = props.route?.params?.durationDays || null;
  const durationWeeks = props.route?.params?.durationWeeks || null;
  const property = propertyData?.property || {};
  const propertyId = property?._id || property?.id;
  const rooms = propertyData?.rooms || {roomTypes: []};
  const roomTypes = rooms?.roomTypes || [];

  const [selectedSharingIndex, setSelectedSharingIndex] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floors, setFloors] = useState([]);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const [bedStatus, setBedStatus] = useState({}); // Map of roomIdentifier -> status (available, booked, approved)
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
  
  // Fetch room availability when propertyId or moveInDate changes
  useEffect(() => {
    if (propertyId && moveInDate) {
      fetchRoomAvailability();
    } else {
      setLoading(false);
    }
  }, [propertyId, moveInDate]);

  // Re-check availability when sharing type changes
  useEffect(() => {
    if (propertyId && moveInDate && (selectedSharingIndex !== null || selectedSharingIndex === 0)) {
      // Reset selected room when sharing type changes
      setSelectedRoom(null);
    }
  }, [selectedSharingIndex]);

  const fetchRoomAvailability = async () => {
    try {
      setLoading(true);
      
      // Convert date to YYYY-MM-DD format
      let formattedDate;
      if (!moveInDate || moveInDate === 'DD/MM/YYYY') {
        // If no date provided, use today's date
        formattedDate = moment().format('YYYY-MM-DD');
      } else if (moveInDate.includes('/')) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const dateParts = moveInDate.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          formattedDate = moment(moveInDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
      } else {
        // Try to parse as ISO date or use moment
        formattedDate = moment(moveInDate).format('YYYY-MM-DD');
      }

      console.log('Fetching availability for date:', formattedDate, 'propertyId:', propertyId, 'original date:', moveInDate);
      
      // Calculate end date (default to same as start date)
      const endDate = formattedDate;
      
      // Call the new API endpoint to get all beds with status
      const bedsResponse = await getAllAvailableBeds(propertyId, formattedDate, endDate);
      console.log("Beds response", bedsResponse);
      
      // Also check availability for unavailable rooms
      const availabilityResponse = await checkRoomAvailability({
        propertyId,
        startDate: formattedDate,
        endDate: endDate,
      });
      console.log("Availability response", availabilityResponse);
      
      const statusMap = {};
      let floorList = [];
      
      if (bedsResponse.success && bedsResponse.bedsByFloor) {
        // Process bedsByFloor structure
        Object.entries(bedsResponse.bedsByFloor).forEach(([floorName, beds]) => {
          const roomNumbers = new Set();
          
          beds.forEach(bed => {
            // Store bed status by roomIdentifier
            if (bed.roomIdentifier) {
              statusMap[bed.roomIdentifier] = bed.status;
              
              // Extract room number from roomIdentifier (format: sharingType-roomNumber-bedName)
              // Example: "single-101-bed1" -> room number is "101"
              const parts = bed.roomIdentifier.split('-');
              if (parts.length >= 2) {
                const roomNum = parts[1];
                roomNumbers.add(roomNum);
              }
            }
          });
          
          // Add floor with unique room numbers
          if (roomNumbers.size > 0) {
            floorList.push({
              id: `floor-${floorName}`,
              name: floorName,
              rooms: Array.from(roomNumbers).sort(),
            });
          }
        });
        
        setBedStatus(statusMap);
        setFloors(floorList);
      } else {
        // Fallback to default structure if API fails
        console.warn('Failed to get beds data, using fallback');
        setFloors([
          {id: 'floor1', name: 'First Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
          {id: 'floor2', name: '2nd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
          {id: 'floor3', name: '3rd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
        ]);
      }
      
      // Set unavailable rooms from check-availability response
      if (availabilityResponse.success && availabilityResponse.unavailableRooms) {
        setUnavailableRooms(availabilityResponse.unavailableRooms);
      } else {
        setUnavailableRooms([]);
      }
      
    } catch (error) {
      console.error('Error fetching room availability:', error);
      // Fallback to default structure
      setFloors([
        {id: 'floor1', name: 'First Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
        {id: 'floor2', name: '2nd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
        {id: 'floor3', name: '3rd Floor', rooms: ['101', '102', '103', '104', '105', '106', '111']},
      ]);
      setBedStatus({});
      setUnavailableRooms([]);
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
    
    const selectedSharing = props.route?.params?.selectedSharing;
    
    // Check if this is a group booking flow or MySelf booking flow
    if (bookingType === 'group' || bookingType === 'myself') {
      // Navigate to GuestDetailsScreen with selected room data
      const numberOfGuests = props.route?.params?.numberOfGuests || (bookingType === 'myself' ? 1 : null);
      const isShortVisit = props.route?.params?.isShortVisit || false;
      
      // Ensure selectedSharing has roomType data for pricing calculation
      let enhancedSelectedSharing = selectedSharing;
      if (selectedSharingIndex !== null && roomTypes.length > 0 && roomTypes[selectedSharingIndex]) {
        // Add roomType data to selectedSharing if not already present
        enhancedSelectedSharing = {
          ...selectedSharing,
          roomType: roomTypes[selectedSharingIndex], // Include full roomType with price and deposit
        };
      }
      
      props.navigation.navigate('GuestDetails', {
        propertyData,
        selectedRoom,
        selectedSharingIndex,
        moveInDate,
        numberOfGuests: bookingType === 'myself' ? 1 : numberOfGuests,
        isShortVisit,
        selectedSharing: enhancedSelectedSharing, // Pass enhanced selectedSharing with roomType
        durationType,
        durationMonths,
        durationDays,
        durationWeeks,
        bookingType, // Pass bookingType to GuestDetailsScreen
      });
    } else {
      // Legacy flow: Navigate to payment screen with booking data (self booking flow)
      const bookingData = {
        propertyData,
        selectedRoom,
        selectedSharingIndex,
        moveInDate,
        personCount,
        durationType,
        durationMonths,
        durationDays,
        selectedSharing,
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

  const isRoomAvailable = (roomNumber, floorName) => {
    // Check if any bed in this room is unavailable for the selected date
    // Bed statuses: 'available', 'booked', 'approved'
    // Room identifier format: {sharingType}-{roomNumber}-{bedName}
    
    // If no sharing type selected yet, check if ANY bed in this room is booked/approved
    if (selectedSharingIndex === null && selectedSharingIndex !== 0) {
      // Check if this room has any booked or approved beds (regardless of sharing type)
      const roomHasBookedBeds = Object.keys(bedStatus).some(roomIdentifier => {
        if (!roomIdentifier || typeof roomIdentifier !== 'string') {
          return false;
        }
        // Check if this bed is in the specified room
        const parts = roomIdentifier.split('-');
        if (parts.length >= 2 && parts[1] === roomNumber) {
          const status = bedStatus[roomIdentifier];
          // Consider booked or approved beds as unavailable
          return status === 'booked' || status === 'approved';
        }
        return false;
      });
      
      // Also check unavailableRooms array
      const roomInUnavailableList = unavailableRooms.some(unavailable => {
        if (!unavailable || typeof unavailable !== 'string') {
          return false;
        }
        return unavailable.includes(`-${roomNumber}-`);
      });
      
      // If room has booked/approved beds or is in unavailable list, show as unavailable
      if (roomHasBookedBeds || roomInUnavailableList) {
        return false;
      }
      
      // If no sharing type selected and no booked beds found, show as available
      // User will need to select sharing type to see specific availability
      return true;
    }
    
    const selectedRoomType = optionList[selectedSharingIndex];
    if (!selectedRoomType) {
      return true;
    }
    
    // Get sharing type from the selected option
    const sharingType = selectedRoomType?.roomType?.type || 
                       selectedRoomType?.roomType?.label?.toLowerCase()?.split(' ')[0] ||
                       selectedRoomType?.optionName?.toLowerCase()?.split(' ')[0] || 
                       'single';
    
    // Normalize sharing type (e.g., "Single Sharing" -> "single", "Double" -> "double")
    let normalizedSharingType = sharingType.toLowerCase().replace(' sharing', '').trim();
    
    // Handle common variations
    if (normalizedSharingType.includes('single') || normalizedSharingType === '1') {
      normalizedSharingType = 'single';
    } else if (normalizedSharingType.includes('double') || normalizedSharingType === '2') {
      normalizedSharingType = 'double';
    } else if (normalizedSharingType.includes('triple') || normalizedSharingType === '3') {
      normalizedSharingType = 'triple';
    } else if (normalizedSharingType.includes('four') || normalizedSharingType === '4') {
      normalizedSharingType = 'four';
    } else if (normalizedSharingType.includes('five') || normalizedSharingType === '5') {
      normalizedSharingType = 'five';
    } else if (normalizedSharingType.includes('six') || normalizedSharingType === '6') {
      normalizedSharingType = 'six';
    }
    
    // Check bed status for beds in this room with the selected sharing type
    const roomIdentifierPattern = `${normalizedSharingType}-${roomNumber}-`;
    let hasAvailableBed = false;
    let hasBookedOrApprovedBed = false;
    
    // Check bed status map
    Object.keys(bedStatus).forEach(roomIdentifier => {
      if (!roomIdentifier || typeof roomIdentifier !== 'string') {
        return;
      }
      
      const identifierLower = roomIdentifier.toLowerCase();
      // Check if this bed is in the specified room and sharing type
      if (identifierLower.startsWith(roomIdentifierPattern.toLowerCase())) {
        const status = bedStatus[roomIdentifier];
        if (status === 'available') {
          hasAvailableBed = true;
        } else if (status === 'booked' || status === 'approved') {
          hasBookedOrApprovedBed = true;
        }
      }
    });
    
    // Also check unavailableRooms array
    const roomInUnavailableList = unavailableRooms.some(unavailable => {
      if (!unavailable || typeof unavailable !== 'string') {
        return false;
      }
      const unavailableLower = unavailable.toLowerCase();
      return unavailableLower.startsWith(roomIdentifierPattern.toLowerCase()) || 
             (unavailableLower.includes(`-${roomNumber}-`) && 
              unavailableLower.startsWith(normalizedSharingType.toLowerCase()));
    });
    
    // Room is available if it has at least one available bed and no booked/approved beds
    // If all beds are booked/approved or in unavailable list, room is not available
    if (roomInUnavailableList || (hasBookedOrApprovedBed && !hasAvailableBed)) {
      return false;
    }
    
    // If we have bed status data, check if there's at least one available bed
    if (Object.keys(bedStatus).length > 0) {
      return hasAvailableBed;
    }
    
    // If no bed status data but room is not in unavailable list, assume available
    return !roomInUnavailableList;
  };

  const renderRoom = (floorName) => ({item}) => {
    const isAvailable = isRoomAvailable(item, floorName);
    const roomKey = `${floorName}-${item}`;
    const isSelected = selectedRoom === roomKey;
    
    // Apply disabled/gray styling for unavailable beds
    const roomTextStyle = isAvailable 
      ? HomeStyle.roomText 
      : [HomeStyle.roomText, { color: Colors.blackText || '#999999', opacity: 0.6 }];
    
    return (
      <TouchableOpacity
        style={[
          HomeStyle.roomBox,
          isAvailable && isSelected
            ? HomeStyle.selectedStyle
            : isAvailable
            ? HomeStyle.available
            : [HomeStyle.unavailable, { opacity: 0.5, backgroundColor: Colors.lightGray || '#E0E0E0' }],
            {justifyContent: "center"}
        ]}
        onPress={() => isAvailable && handleSelectRoom(item, floorName)}
        disabled={!isAvailable}
        activeOpacity={isAvailable ? 0.7 : 1}>
        <Text style={roomTextStyle}>{item}</Text>
        <View style={[HomeStyle.greenStripContainer]}>
          <View
            style={[
              isAvailable ? HomeStyle.grayStrip : [HomeStyle.grayStrip, { backgroundColor: Colors.lightGray || '#CCCCCC' }],
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

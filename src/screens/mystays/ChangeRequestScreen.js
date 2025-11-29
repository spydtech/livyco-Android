import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import { Button, DropDown, Icons } from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import MystaysStyle from '../../styles/MystaysStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import { CommonActions } from '@react-navigation/native';
import { deviceWidth } from '../../utils/DeviceInfo';
import { Dropdown } from 'react-native-element-dropdown';
import { getAllAvailableBeds } from '../../services/bookingService';
import moment from 'moment';

const ChangeRequestScreen = props => {
  const stayData = props.route?.params?.stayData;

  // Extract data from stayData
  const getProperty = (booking) => {
    return booking?.property || booking?.propertyId || {};
  };

  const getRoomDetails = (booking) => {
    return booking?.roomDetails?.[0] || {};
  };

  const property = getProperty(stayData);
  const roomDetails = getRoomDetails(stayData);
  const propertyName = property?.name || 'Abc Boys Hostel';
  const currentRoom = roomDetails?.roomNumber || stayData?.roomNumber || '101';
  const currentBed = stayData?.bed || roomDetails?.bed || 'B';
  const currentSharing = stayData?.roomType || roomDetails?.roomType || '2 Sharing';

  const dropdownData = [
    { label: 'Bed Change', value: '1' },
    { label: 'Room Change', value: '2' },
    { label: 'Other Services', value: '3' },
  ];
  const [reason, setReason] = useState('');
  const [reasonValue, setReasonValue] = useState('');
  const [reasonDesc, setReasonDesc] = useState('');
  const [selectedSharing, setSelectedSharing] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loadingBeds, setLoadingBeds] = useState(false);

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
      optionName: 'Four Sharing',
    },
    {
      id: 5,
      optionName: 'Five Sharing',
    },
    {
      id: 6,
      optionName: 'Six Sharing',
    },
  ];
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  // Fetch available beds when Bed Change is selected
  // Following the same logic as BookingOptionScreen.js
  const fetchAvailableBeds = async () => {
    if (!stayData || !property?._id) return;

    try {
      setLoadingBeds(true);
      const propertyId = property._id || property.id;
      
      // Convert date to YYYY-MM-DD format (same as BookingOptionScreen)
      let formattedDate;
      const moveInDate = stayData?.moveInDate;
      
      if (!moveInDate) {
        formattedDate = moment().format('YYYY-MM-DD');
      } else if (typeof moveInDate === 'string' && moveInDate.includes('/')) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const dateParts = moveInDate.split('/');
        if (dateParts.length === 3) {
          formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          formattedDate = moment(moveInDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
      } else {
        formattedDate = moment(moveInDate).format('YYYY-MM-DD');
      }
      
      const endDate = formattedDate;
      
      // Normalize sharing type (same as BookingOptionScreen)
      let normalizedSharingType = currentSharing;
      if (typeof currentSharing === 'string') {
        normalizedSharingType = currentSharing.toLowerCase().replace(' sharing', '').trim();
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
      }
      
      // Call the API endpoint to get all beds with status (same as BookingOptionScreen)
      const bedsResponse = await getAllAvailableBeds(propertyId, formattedDate, endDate);
      
      const allBeds = [];
      const bedStatusMap = {}; // Map to store bed status by bedId
      const bedIdMap = new Map(); // Map to track all bed IDs we've seen
      
      if (bedsResponse.success && bedsResponse.bedsByFloor) {
        // Process bedsByFloor structure (same as BookingOptionScreen)
        // bedsByFloor is an object where keys are floor names, values are arrays of bed objects
        Object.entries(bedsResponse.bedsByFloor).forEach(([floorName, beds]) => {
          // beds is an array of bed objects
          beds.forEach(bed => {
            if (bed.roomIdentifier) {
              // Extract room number and bed name from roomIdentifier
              // Format: "sharingType-roomNumber-bedName"
              // Example: "single-101-bed1" or "double-101-A"
              const parts = bed.roomIdentifier.split('-');
              if (parts.length >= 3) {
                const sharingType = parts[0].toLowerCase();
                const roomNum = parts[1];
                const bedName = parts.slice(2).join('-');
                
                // Check if this bed is in the current room and matches sharing type
                if (roomNum === currentRoom && sharingType === normalizedSharingType) {
                  // Extract bed letter/identifier
                  let bedId = bedName.toUpperCase();
                  // If bedName is like "bed1", "bed2", etc., extract the number and convert to letter
                  if (bedName.toLowerCase().startsWith('bed')) {
                    const bedNum = parseInt(bedName.replace(/[^0-9]/g, ''));
                    if (bedNum) {
                      bedId = String.fromCharCode(64 + bedNum); // Convert 1->A, 2->B, etc.
                    }
                  }
                  
                  // Store bed status
                  bedStatusMap[bedId] = bed.status || 'available';
                  bedIdMap.set(bedId, {
                    id: bedId,
                    bedName: bedName,
                    roomIdentifier: bed.roomIdentifier,
                    status: bed.status || 'available',
                  });
                }
              }
            }
          });
        });
      }
      
      // Now create the bed list - get all beds from the map
      // If we have beds from API, use them; otherwise we need to create based on sharing type
      if (bedIdMap.size > 0) {
        // Use beds from API
        bedIdMap.forEach((bedData, bedId) => {
          const isCurrent = bedId === currentBed.toUpperCase();
          const bedStatus = bedData.status || 'available';
          
          // Determine availability:
          // - Current bed is always shown and selectable (yellow)
          // - Beds with status 'available' are available and selectable (green)
          // - Beds with status 'booked' or 'approved' are unavailable and not selectable (gray)
          const isAvailable = isCurrent || bedStatus === 'available';
          
          allBeds.push({
            id: bedId,
            label: `${currentRoom}-${bedId}`,
            isCurrent: isCurrent,
            isAvailable: isAvailable,
            bedName: bedData.bedName,
            status: bedStatus,
            roomIdentifier: bedData.roomIdentifier,
          });
        });
      } else {
        // If no beds from API, create beds based on sharing type capacity
        // This ensures we show all beds even if API doesn't return them
        const sharingNumber = parseInt(currentSharing) || 2;
        const bedLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        
        for (let i = 0; i < sharingNumber && i < bedLetters.length; i++) {
          const bedId = bedLetters[i];
          const isCurrent = bedId === currentBed.toUpperCase();
          
          allBeds.push({
            id: bedId,
            label: `${currentRoom}-${bedId}`,
            isCurrent: isCurrent,
            isAvailable: isCurrent, // Only current bed is available if no API data
            bedName: bedId,
            status: isCurrent ? 'approved' : 'available',
            roomIdentifier: `${normalizedSharingType}-${currentRoom}-${bedId}`,
          });
        }
      }
      
      // Always ensure current bed is in the list (in case it's missing from API)
      const currentBedId = currentBed.toUpperCase();
      const hasCurrentBed = allBeds.some(b => b.id === currentBedId);
      if (!hasCurrentBed) {
        allBeds.push({
          id: currentBedId,
          label: `${currentRoom}-${currentBedId}`,
          isCurrent: true,
          isAvailable: true, // Current bed is always available/selectable
          bedName: currentBedId,
          status: 'approved',
          roomIdentifier: `${normalizedSharingType}-${currentRoom}-${currentBedId}`,
        });
      }

      // Sort beds alphabetically
      allBeds.sort((a, b) => a.id.localeCompare(b.id));
      
      console.log("availableBeds", allBeds);
      setAvailableBeds(allBeds);
      
    } catch (error) {
      console.error('Error fetching available beds:', error);
      // On error, set empty array (will show placeholder)
      setAvailableBeds([]);
    } finally {
      setLoadingBeds(false);
    }
  };

  // Fetch beds when Bed Change option is selected
  React.useEffect(() => {
    if (reasonValue === '1') {
      fetchAvailableBeds();
    } else {
      setAvailableBeds([]);
    }
  }, [reasonValue]);

  const handleSharingSelect = index => {
    setSelectedSharing(index);
    // props.navigation.navigate('BookingOption');
  };

  const renderOptionList = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => handleSharingSelect(index)}
        style={{ flex: 1, marginHorizontal: 5 }}>
        <View
          style={[
            HomeStyle.optionListContainer,
            selectedSharing === index && HomeStyle.selectOptionListContainer,
            { minWidth: (deviceWidth - 60) / 3 - 10 },
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

  const gotoSuccessRequet = () => {
    props.navigation.navigate('SuccessRequest');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[HomeStyle.homeContainer, { flex: 1 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View style={HomeStyle.headerContainerBlue}>
          <View style={HomeStyle.profileImgContainer}>
            <TouchableOpacity
              onPress={() => {
                gotoBack();
              }}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={[MystaysStyle.pageHeader]}>{'Change request'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={[MystaysStyle.container, { padding: 20 }]}>
          <View style={{ ...CommonStyles.directionRowSB, marginBottom: 15 }}>
            <Text style={[MystaysStyle.staysText, { fontSize: 16, fontFamily: 'Roboto-Medium' }]}>
              {propertyName}
            </Text>
            <TouchableOpacity>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'share-social-outline'}
                iconColor={Colors.black}
                iconSize={22}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={[MystaysStyle.checkDateTextBlack, { marginBottom: 10 }]}>
              {'Current room/bed details: '}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={[MystaysStyle.detailsRoom, { marginRight: 10, marginTop: 0 }]}>
                <Text style={[MystaysStyle.detailsText]}>
                  {`Room ${currentRoom} - ${currentBed}`}
                </Text>
              </View>
              <View style={[MystaysStyle.detailsRoom, { marginTop: 0 }]}>
                <Text style={[MystaysStyle.detailsText]}>
                  {currentSharing}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={[MystaysStyle.checkDateTextBlack, { marginBottom: 10 }]}>
              {'Select what you want to change: '}
            </Text>
            <Dropdown
              data={dropdownData}
              value={reasonValue}
              placeholder="Select"
              onChange={item => {
                setReason(item.label);
                setReasonValue(item.value);
                setSelectedBed(null);
                setSelectedSharing(null);
                setAvailableBeds([]);
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
          </View>
          {reasonValue && <View>
            <Text style={[MystaysStyle.checkDateTextBlack, { marginBottom: 0 }]}>
              {reasonValue === '3' ? 'Reason for Request' : 'Reason for change'}
            </Text>
            <TextInput
              style={MystaysStyle.textarea}
              multiline={true}
              numberOfLines={4}
              placeholder="Type something here..."
              value={reasonDesc}
              onChangeText={text => setReasonDesc(text)}
            />
          </View>}
          {reasonValue === '1' ? (
            <View style={{ marginTop: 20 }}>
              <Text style={[MystaysStyle.checkDateTextBlack, { marginBottom: 15 }]}>
                {'Select your preferred bed'}
              </Text>
              {loadingBeds ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={Colors.secondary} />
                  <Text style={{ marginTop: 10, color: Colors.grayText }}>Loading beds...</Text>
                </View>
              ) : availableBeds.length > 0 ? (
                <View style={{ ...CommonStyles.directionRowSB, flexWrap: 'wrap', marginBottom: 20 }}>
                  {availableBeds.map((bed, index) => (
                  <TouchableOpacity
                    key={bed.id}
                    onPress={() => {
                      // Only allow selection of available beds (green) and current bed (yellow)
                      if (bed.isAvailable) {
                        setSelectedBed(bed.id);
                      }
                    }}
                    disabled={!bed.isAvailable}
                    style={[
                      MystaysStyle.roomBox,
                      {
                        backgroundColor: bed.isCurrent
                          ? '#FFD700' // Yellow for current bed
                          : bed.isAvailable
                            ? bed.id == selectedBed ? '#FFD700' : Colors.selectedGreen // Green for available beds
                            : Colors.lightGray, // Gray for unavailable beds
                        marginRight: index < availableBeds.length - 1 ? 8 : 0,
                        marginBottom: 10,
                        opacity: bed.isAvailable ? 1 : 0.6,
                        justifyContent: "center",
                        alignContent: "center",
                        padding: 15,
                        borderWidth: bed.id == selectedBed ? 1 : 0,
                        borderColor: bed.id == selectedBed ? Colors.selectedGreen : Colors.lightGray,
                      },
                    ]}>
                    <Text style={[
                      MystaysStyle.roomText,
                      { color: bed.isCurrent || bed.isAvailable ? Colors.black : Colors.grayText }
                    ]}>
                      {bed.isCurrent ? `${bed.label} You` : bed.label}
                    </Text>
                    <View style={[MystaysStyle.greenStripContainer]}>
                      <View style={[
                        bed.isAvailable ? MystaysStyle.greenStrip : MystaysStyle.grayStrip
                      ]} />
                    </View>
                  </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: Colors.grayText }}>No beds available</Text>
                </View>
              )}
              <View style={MystaysStyle.legendRow}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={[MystaysStyle.legendBox, { backgroundColor: Colors.selectedGreen }]}
                  />
                  <Text style={MystaysStyle.legendLabel}>Available</Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    ...LayoutStyle.paddingLeft15,
                  }}>
                  <View
                    style={[MystaysStyle.legendBox, { backgroundColor: Colors.lightGray }]}
                  />
                  <Text style={MystaysStyle.legendLabel}>Not Available</Text>
                </View>
              </View>
            </View>
          ) : reasonValue === '2' ? (
            <View style={{ marginTop: 20 }}>
              <Text style={[MystaysStyle.checkDateTextBlack, { marginBottom: 15 }]}>
                {'Select your preferred Sharing'}
              </Text>
              <FlatList
                numColumns={3}
                data={optionList}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
                renderItem={({ item: optionItem, index }) =>
                  renderOptionList(optionItem, index)
                }
                scrollEnabled={false}
                keyExtractor={item => item.id}
              />
            </View>
          ) : null}
          {reasonValue && <View style={{ ...LayoutStyle.paddingTop20 }}>
            <Button
              onPress={() => gotoSuccessRequet()}
              btnName={'Raise Request'}
              btnStyle={[MystaysStyle.btnStylesmall]}
            />
          </View>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangeRequestScreen;

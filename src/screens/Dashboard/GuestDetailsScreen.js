import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import { Button, Icons, Input } from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import CommonStyles from '../../styles/CommonStyles';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { sendOTP, verifyOTP } from '../../services/authService';
import { showMessage } from 'react-native-flash-message';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

const GuestDetailsScreen = props => {
  // Get data from route params
  const propertyData = props.route?.params?.propertyData;
  const property = propertyData?.property || {};
  const propertyId = property?._id || property?.id;
  const numberOfGuests = props.route?.params?.numberOfGuests;
  const selectedRoom = props.route?.params?.selectedRoom;
  const selectedSharing = props.route?.params?.selectedSharing;
  const moveInDate = props.route?.params?.moveInDate;
  const isShortVisit = props.route?.params?.isShortVisit || true;
  const bookingType = props.route?.params?.bookingType; // 'myself' or 'group'
  const durationType = props.route?.params?.durationType || 'monthly';
  const durationMonths = props.route?.params?.durationMonths || null;
  const durationDays = props.route?.params?.durationDays || null;
  const durationWeeks = props.route?.params?.durationWeeks || null;
  
  // Determine if this is MySelf booking (always 1 guest, no Others tab)
  const isMySelfFlow = bookingType === 'myself';
  const isGroupFlow = bookingType === 'group';

  // Guest Details State
  const [guestType, setGuestType] = useState('Self'); // 'Self' or 'Others'
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0); // For Others mode, track which guest (0 to numberOfGuests-1)
  
  // Separate state for Self guest
  const [selfGuest, setSelfGuest] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    idProofType: '',
    idProofNumber: '',
    idProofImage: null,
    purpose: '',
    otpVerified: false,
    otpSent: false,
    otp: '',
    saveForFuture: true, // Checked by default
  });

  // Separate state for Others guests (array based on numberOfGuests)
  const [othersGuests, setOthersGuests] = useState([]);

  // OTP State
  const [otpLoading, setOtpLoading] = useState({});
  const [otpVerifying, setOtpVerifying] = useState({});


  // ID Proof Types
  const idProofTypes = [
    { label: 'Aadhar Card', value: 'aadhar' },
    { label: 'PAN Card', value: 'pan' },
    { label: 'Driving License', value: 'driving_license' },
    { label: 'Passport', value: 'passport' },
    { label: 'Voter ID', value: 'voter_id' },
  ];

  // Initialize Others guests array based on numberOfGuests
  useEffect(() => {
    // For MySelf flow, always use Self tab and disable Others
    if (isMySelfFlow) {
      setGuestType('Self');
    }
    
    if (guestType === 'Others' && numberOfGuests && !isMySelfFlow) {
      const guestCount = parseInt(numberOfGuests) || 1;
      setOthersGuests(prevGuests => {
        // Preserve existing data, only add new empty guests if needed
        const newGuests = Array.from({ length: guestCount }, (_, index) => {
          if (prevGuests[index]) {
            return prevGuests[index];
          }
          return {
            name: '',
            age: '',
            gender: '',
            mobile: '',
            alternateMobile: '',
            email: '',
            idProofType: '',
            idProofNumber: '',
            idProofImage: null,
            purpose: '',
            otpVerified: false,
            otpSent: false,
            otp: '',
            saveForFuture: true, // Checked by default
          };
        });
        return newGuests.slice(0, guestCount);
      });
      setCurrentGuestIndex(0);
    }
  }, [guestType, numberOfGuests, isMySelfFlow]);

  const handleGuestFieldChange = (field, value, index = null) => {
    if (guestType === 'Self') {
      setSelfGuest(prev => ({
        ...prev,
        [field]: value,
      }));
    } else {
      const guestIndex = index !== null ? index : currentGuestIndex;
      setOthersGuests(prevGuests => {
        const updatedGuests = [...prevGuests];
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          [field]: value,
        };
        return updatedGuests;
      });
    }
  };

  const handleGenderSelect = (gender, index = null) => {
    handleGuestFieldChange('gender', gender, index);
  };

  const handleSendOTP = async guestIndex => {
    const guest = guestType === 'Self' 
      ? selfGuest 
      : othersGuests[guestIndex !== undefined ? guestIndex : currentGuestIndex];
    const mobile = guest.mobile?.trim();

    if (!mobile || mobile.length !== 10) {
      showMessage({
        message: 'Please enter a valid 10-digit mobile number',
        type: 'danger',
        floating: true,
      });
      return;
    }

    const actualIndex = guestType === 'Self' ? 'self' : (guestIndex !== undefined ? guestIndex : currentGuestIndex);
    setOtpLoading({ ...otpLoading, [actualIndex]: true });
    try {
      const response = await sendOTP({ phone: mobile });
      if (response.success) {
        if (guestType === 'Self') {
          setSelfGuest(prev => ({ ...prev, otpSent: true }));
        } else {
          const idx = guestIndex !== undefined ? guestIndex : currentGuestIndex;
          setOthersGuests(prevGuests => {
            const updated = [...prevGuests];
            updated[idx] = { ...updated[idx], otpSent: true };
            return updated;
          });
        }
        showMessage({
          message: 'OTP sent successfully',
          type: 'success',
          floating: true,
        });
      } else {
        showMessage({
          message: response.message || 'Failed to send OTP',
          type: 'danger',
          floating: true,
        });
      }
    } catch (error) {
      showMessage({
        message: 'Failed to send OTP. Please try again.',
        type: 'danger',
        floating: true,
      });
    } finally {
      setOtpLoading({ ...otpLoading, [actualIndex]: false });
    }
  };

  const handleVerifyOTP = async guestIndex => {
    const guest = guestType === 'Self' 
      ? selfGuest 
      : othersGuests[guestIndex !== undefined ? guestIndex : currentGuestIndex];
    const mobile = guest.mobile?.trim();
    const otp = guest.otp?.trim();

    if (!mobile || mobile.length !== 10) {
      showMessage({
        message: 'Please enter a valid mobile number',
        type: 'danger',
        floating: true,
      });
      return;
    }

    if (!otp || otp.length !== 6) {
      showMessage({
        message: 'Please enter a valid 6-digit OTP',
        type: 'danger',
        floating: true,
      });
      return;
    }

    const actualIndex = guestType === 'Self' ? 'self' : (guestIndex !== undefined ? guestIndex : currentGuestIndex);
    setOtpVerifying({ ...otpVerifying, [actualIndex]: true });
    try {
      const response = await verifyOTP({ phone: mobile, otp });
      if (response.success) {
        if (guestType === 'Self') {
          setSelfGuest(prev => ({ ...prev, otpVerified: true }));
        } else {
          const idx = guestIndex !== undefined ? guestIndex : currentGuestIndex;
          setOthersGuests(prevGuests => {
            const updated = [...prevGuests];
            updated[idx] = { ...updated[idx], otpVerified: true };
            return updated;
          });
        }
        showMessage({
          message: 'OTP verified successfully',
          type: 'success',
          floating: true,
        });
      } else {
        showMessage({
          message: response.message || 'Invalid OTP',
          type: 'danger',
          floating: true,
        });
      }
    } catch (error) {
      showMessage({
        message: 'Failed to verify OTP. Please try again.',
        type: 'danger',
        floating: true,
      });
    } finally {
      setOtpVerifying({ ...otpVerifying, [actualIndex]: false });
    }
  };

  const handleImagePicker = guestIndex => {
    const options = {
      title: 'Select ID Proof',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        showMessage({
          message: 'Error picking image',
          type: 'danger',
          floating: true,
        });
      } else if (response.assets && response.assets[0]) {
        const image = response.assets[0];
        handleGuestFieldChange(
          'idProofImage',
          {
            uri: image.uri,
            type: image.type,
            name: image.fileName || 'id_proof.jpg',
          },
          guestIndex,
        );
      }
    });
  };

  // Check if all required fields are filled (without showing error messages)
  const isFormValid = () => {
    const guestsToValidate = guestType === 'Self' ? [selfGuest] : othersGuests;

    // Check if we have guests to validate
    if (guestsToValidate.length === 0) {
      return false;
    }

    for (let i = 0; i < guestsToValidate.length; i++) {
      const guest = guestsToValidate[i];
      
      // Check name
      if (!guest?.name?.trim()) {
        return false;
      }
      
      // Check age
      if (!guest?.age?.trim()) {
        return false;
      }
      
      // Check gender
      if (!guest?.gender) {
        return false;
      }
      
      // Check mobile number (must be 10 digits)
      if (!guest?.mobile?.trim() || guest.mobile.length !== 10) {
        return false;
      }
      
      // Check ID proof type
      if (!guest?.idProofType) {
        return false;
      }
      
      // Check ID proof number
      if (!guest?.idProofNumber?.trim()) {
        return false;
      }
      
      // Check ID proof image
      if (!guest?.idProofImage) {
        return false;
      }
      
      // Check if saveForFuture is checked (mandatory)
      if (!guest?.saveForFuture) {
        return false;
      }
    }
    
    return true;
  };

  const focusGuestTab = (tab, index) => {
    if (tab && guestType !== tab) {
      setGuestType(tab);
    }
    if (tab === 'Others' && typeof index === 'number') {
      setCurrentGuestIndex(index);
    }
  };

  const validateSingleGuest = (
    guest,
    { label = 'guest', isSelf = false, tab = null, index = null } = {},
  ) => {
    const targetLabel = isSelf ? 'your' : label;

    if (!guest) {
      showMessage({
        message: `Please fill details for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.name?.trim()) {
      showMessage({
        message: isSelf
          ? 'Please enter your name'
          : `Please enter name for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.age?.trim()) {
      showMessage({
        message: isSelf
          ? 'Please enter your age'
          : `Please enter age for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.gender) {
      showMessage({
        message: isSelf
          ? 'Please select your gender'
          : `Please select gender for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.mobile?.trim() || guest.mobile.length !== 10) {
      showMessage({
        message: isSelf
          ? 'Please enter a valid mobile number'
          : `Please enter a valid mobile number for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.idProofType) {
      showMessage({
        message: isSelf
          ? 'Please select ID proof type'
          : `Please select ID proof type for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.idProofNumber?.trim()) {
      showMessage({
        message: isSelf
          ? 'Please enter ID proof number'
          : `Please enter ID proof number for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.idProofImage) {
      showMessage({
        message: isSelf
          ? 'Please upload your ID proof'
          : `Please upload ID proof for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    if (!guest.saveForFuture) {
      showMessage({
        message: isSelf
          ? 'Please check "Save details for future use"'
          : `Please check "Save details for future use" for ${label}`,
        type: 'danger',
        floating: true,
      });
      focusGuestTab(tab, index);
      return false;
    }

    return true;
  };

  const validateGuestDetails = () => {
    // For MySelf flow, only validate self guest
    if (isMySelfFlow) {
      return validateSingleGuest(selfGuest, {
        label: 'self guest',
        isSelf: true,
        tab: 'Self',
      });
    }
    
    if (isGroupFlow) {
      // Always validate self guest first
      if (
        !validateSingleGuest(selfGuest, {
          label: 'self guest',
          isSelf: true,
          tab: 'Self',
        })
      ) {
        return false;
      }
      
      const expectedGuests = parseInt(numberOfGuests) || 0;
      if (expectedGuests <= 0) {
        showMessage({
          message: 'Please specify number of guests in the previous step',
          type: 'danger',
          floating: true,
        });
        focusGuestTab('Others', 0);
        return false;
      }

      if (!othersGuests || othersGuests.length < expectedGuests) {
        showMessage({
          message: `Please fill details for all ${expectedGuests} guest(s)`,
          type: 'danger',
          floating: true,
        });
        focusGuestTab('Others', othersGuests?.length || 0);
        return false;
      }

      for (let i = 0; i < expectedGuests; i++) {
        if (
          !validateSingleGuest(othersGuests[i], {
            label: `guest ${i + 1}`,
            tab: 'Others',
            index: i,
          })
        ) {
          return false;
        }
      }

      return true;
    }

    // Legacy flow: validate based on current tab selection
    if (guestType === 'Self') {
      return validateSingleGuest(selfGuest, {
        label: 'self guest',
        isSelf: true,
        tab: 'Self',
      });
    }

    if (!othersGuests || othersGuests.length === 0) {
      showMessage({
        message: 'Please add guest details',
        type: 'danger',
        floating: true,
      });
      focusGuestTab('Others', 0);
      return false;
    }

    for (let i = 0; i < othersGuests.length; i++) {
      if (
        !validateSingleGuest(othersGuests[i], {
          label: `guest ${i + 1}`,
          tab: 'Others',
          index: i,
        })
      ) {
        return false;
      }
    }
    
    return true;
  };

  const handlePayNow = () => {
    if (!validateGuestDetails()) {
      return;
    }

    if (!propertyId) {
      showMessage({
        message: 'Property information is missing',
        type: 'danger',
        floating: true,
      });
      return;
    }

    // Prepare customer details
    const primaryGuest = isGroupFlow
      ? selfGuest
      : guestType === 'Self'
      ? selfGuest
      : othersGuests[0];

    const additionalGuestSource = isGroupFlow
      ? othersGuests
      : guestType === 'Others'
      ? othersGuests.slice(1)
      : [];

    const filteredAdditionalGuests = (additionalGuestSource || [])
      .filter(guest => guest && guest.name)
      .map(guest => ({
        name: guest.name,
        age: parseInt(guest.age),
        gender: guest.gender,
        idProofType: guest.idProofType,
        idProofNumber: guest.idProofNumber,
      }));

    // Check if saveForFuture is set
    const saveForFuture = isGroupFlow
      ? Boolean(
          selfGuest.saveForFuture &&
            (othersGuests || []).every(guest => guest?.saveForFuture),
        )
      : guestType === 'Self'
      ? Boolean(selfGuest.saveForFuture)
      : Boolean(
          othersGuests.length > 0
            ? othersGuests[othersGuests.length - 1]?.saveForFuture
            : false,
        );

    const customerDetails = {
      primary: {
        name: primaryGuest.name,
        age: parseInt(primaryGuest.age),
        gender: primaryGuest.gender,
        mobile: primaryGuest.mobile,
        email: primaryGuest.email || '',
        idProofType: primaryGuest.idProofType,
        idProofNumber: primaryGuest.idProofNumber,
        purpose: primaryGuest.purpose || '',
      },
      additional: filteredAdditionalGuests,
      saveForFuture: saveForFuture,
    };

    // Prepare booking data (without creating booking yet)
    // Extract room type from selectedSharing - check multiple sources
    let roomTypeValue = 'single'; // Default fallback
    
    // Priority 1: Check selectedSharing.roomType.type (from BookingOptionScreen)
    if (selectedSharing?.roomType?.type) {
      roomTypeValue = selectedSharing.roomType.type;
    }
    // Priority 2: Check selectedSharing.type (direct type property)
    else if (selectedSharing?.type) {
      roomTypeValue = selectedSharing.type;
    }
    // Priority 3: Extract from optionName (e.g., "Single Sharing" -> "single")
    else if (selectedSharing?.optionName) {
      const optionNameLower = selectedSharing.optionName.toLowerCase();
      if (optionNameLower.includes('single')) {
        roomTypeValue = 'single';
      } else if (optionNameLower.includes('double')) {
        roomTypeValue = 'double';
      } else if (optionNameLower.includes('triple')) {
        roomTypeValue = 'triple';
      } else if (optionNameLower.includes('four')) {
        roomTypeValue = 'four';
      } else if (optionNameLower.includes('five')) {
        roomTypeValue = 'five';
      } else if (optionNameLower.includes('six')) {
        roomTypeValue = 'six';
      }
    }
    // Priority 4: Try to find in roomTypes array using selectedSharing.id
    else if (selectedSharing?.id && roomTypes.length > 0) {
      const foundRoomType = roomTypes.find(rt => 
        rt._id === selectedSharing.id || 
        rt.id === selectedSharing.id
      );
      if (foundRoomType?.type) {
        roomTypeValue = foundRoomType.type;
      } else if (foundRoomType?.label) {
        const labelLower = foundRoomType.label.toLowerCase();
        if (labelLower.includes('single')) roomTypeValue = 'single';
        else if (labelLower.includes('double')) roomTypeValue = 'double';
        else if (labelLower.includes('triple')) roomTypeValue = 'triple';
        else if (labelLower.includes('four')) roomTypeValue = 'four';
        else if (labelLower.includes('five')) roomTypeValue = 'five';
        else if (labelLower.includes('six')) roomTypeValue = 'six';
      }
    }
    
    // Normalize roomTypeValue to match backend format (single, double, triple, etc.)
    let normalizedSharingType = roomTypeValue;
    if (typeof roomTypeValue === 'string') {
      const roomTypeLower = roomTypeValue.toLowerCase();
      if (roomTypeLower.includes('single') || roomTypeLower === '1') {
        normalizedSharingType = 'single';
      } else if (roomTypeLower.includes('double') || roomTypeLower === '2') {
        normalizedSharingType = 'double';
      } else if (roomTypeLower.includes('triple') || roomTypeLower === '3') {
        normalizedSharingType = 'triple';
      } else if (roomTypeLower.includes('four') || roomTypeLower === '4') {
        normalizedSharingType = 'four';
      } else if (roomTypeLower.includes('five') || roomTypeLower === '5') {
        normalizedSharingType = 'five';
      } else if (roomTypeLower.includes('six') || roomTypeLower === '6') {
        normalizedSharingType = 'six';
      } else {
        normalizedSharingType = roomTypeLower.replace(' sharing', '').trim();
      }
    }
    
    // Use normalized type for roomTypeValue
    roomTypeValue = normalizedSharingType;
    
    // Debug logging
    console.log('GuestDetailsScreen - Room Type Extraction:', {
      selectedSharing,
      roomTypeValue,
      normalizedSharingType,
      hasRoomType: !!selectedSharing?.roomType,
      roomTypeFromSharing: selectedSharing?.roomType?.type,
    });
    
    // Parse selectedRoom format: "floorName-roomNumber" -> convert to "sharingType-roomNumber-bedName"
    let selectedRoomsArray = [];
    if (selectedRoom) {
      // Extract room number from "floorName-roomNumber" format (e.g., "First Floor-101" -> "101")
      const parts = selectedRoom.split('-');
      let roomNumber = null;
      
      if (parts.length >= 2) {
        // Get the last part as room number (e.g., "First Floor-101" -> "101")
        roomNumber = parts[parts.length - 1];
      } else if (parts.length === 1) {
        // If no dash, assume the whole string is the room number
        roomNumber = parts[0];
      }
      
      if (roomNumber) {
        // Construct proper roomIdentifier format: "sharingType-roomNumber-bedName"
        // Use default bed name "bed1" if not specified
        const roomIdentifier = `${normalizedSharingType}-${roomNumber}-bed1`;
        selectedRoomsArray = [roomIdentifier];
      } else {
        // Fallback if room number extraction fails
        selectedRoomsArray = [`${normalizedSharingType}-room-1-bed1`];
      }
    } else {
      // Fallback to placeholder if no room selected
      selectedRoomsArray = [`${normalizedSharingType}-room-1-bed1`];
    }
    
    // Convert moveInDate from DD/MM/YYYY to Date object if needed
    let moveInDateObj = moveInDate;
    if (typeof moveInDate === 'string' && moveInDate.includes('/')) {
      const dateParts = moveInDate.split('/');
      if (dateParts.length === 3) {
        moveInDateObj = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      }
    }
    
    // Use duration from route params if available, otherwise fallback to isShortVisit logic
    const finalDurationType = durationType || (isShortVisit ? 'daily' : 'monthly');
    const finalDurationDays = durationDays || (isShortVisit ? 1 : null);
    const finalDurationMonths = durationMonths || (isShortVisit ? null : 1);
    const finalDurationWeeks = durationWeeks || null;
    
    // Get room type details from propertyData
    const rooms = propertyData?.rooms || { roomTypes: [] };
    const roomTypes = rooms?.roomTypes || [];
    
    // Find the selected room type to get price and deposit
    let selectedRoomTypeData = null;
    if (selectedSharing) {
      // Try multiple ways to find the room type
      // 1. Check if selectedSharing has roomType property
      if (selectedSharing.roomType) {
        selectedRoomTypeData = selectedSharing.roomType;
      }
      // 2. Try to find by type or id in roomTypes array
      else if (roomTypes.length > 0) {
        selectedRoomTypeData = roomTypes.find(rt => 
          rt.type === roomTypeValue || 
          rt._id === selectedSharing.id ||
          rt.label?.toLowerCase().includes(roomTypeValue.toLowerCase()) ||
          (selectedSharing.type && rt.type === selectedSharing.type)
        );
      }
    }
    
    // Get price and deposit from room type
    const roomPrice = selectedRoomTypeData?.price || selectedSharing?.roomType?.price || selectedSharing?.price || 1.0;
    const roomDeposit = selectedRoomTypeData?.deposit || selectedSharing?.roomType?.deposit || selectedSharing?.deposit || 0;
    const monthlyRent = roomPrice; // Base monthly rent
    
    // Calculate advance amount based on duration
    let advanceAmount = 0;
    if (finalDurationType === 'daily' && finalDurationDays) {
      // For daily: advanceAmount = roomType.price * durationDays 
      advanceAmount = roomPrice * finalDurationDays;
    } else if (finalDurationType === 'monthly' && finalDurationMonths) {
      // For monthly: advanceAmount = roomType.price * durationMonths
      advanceAmount = roomPrice * finalDurationMonths;
    } else if (finalDurationType === 'weekly' && finalDurationWeeks) {
      // For weekly: convert to daily calculation
      advanceAmount = roomPrice * (finalDurationWeeks * 7);
    } else {
      // Default: 1 month
      advanceAmount = roomPrice;
    }
    
    // Calculate deposit amount: roomType.deposit * number of selected rooms
    const depositAmount = roomDeposit * selectedRoomsArray.length;
    
    // Calculate total amount: advanceAmount + depositAmount
    const totalAmount = advanceAmount + depositAmount;
    
    // Create pricing object matching web implementation
    const pricingData = {
      monthlyRent: monthlyRent,
      totalRent: advanceAmount, // Total rent for the duration
      advanceAmount: advanceAmount,
      securityDeposit: depositAmount,
      totalAmount: totalAmount,
      maintenanceFee: 0, // Can be added if needed
    };
    
    const bookingData = {
      propertyData,
      propertyId,
      roomType: roomTypeValue, // Use normalized room type (single, double, triple, etc.)
      selectedRooms: selectedRoomsArray,
      selectedSharing,
      selectedSharingIndex: null, // Can be passed if needed
      moveInDate: moment(moveInDateObj).format('YYYY-MM-DD'),
      moveInDateText: moveInDate,
      durationType: finalDurationType,
      durationDays: finalDurationDays,
      durationMonths: finalDurationMonths,
      durationWeeks: finalDurationWeeks,
      personCount: isMySelfFlow ? 1 : (parseInt(numberOfGuests) || 1),
      customerDetails,
      isShortVisit,
      bookingType, // Pass bookingType to payment screen
      // Add pricing data matching web implementation
      pricing: pricingData,
      advanceAmount: advanceAmount,
      depositAmount: depositAmount,
      totalAmount: totalAmount,
      monthlyRent: monthlyRent,
    };

    // Debug logging before navigation
    console.log('GuestDetailsScreen - Navigating to PayRentBooking with bookingData:', {
      roomType: bookingData.roomType,
      selectedRooms: bookingData.selectedRooms,
      propertyId: bookingData.propertyId,
      moveInDate: bookingData.moveInDate,
    });

    // Navigate to payment screen with all booking data
    // Booking will be created after successful payment
    props.navigation.navigate('PayRentBooking', {
      bookingData,
    });
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const currentGuest = guestType === 'Self' ? selfGuest : othersGuests[currentGuestIndex];
  const isOthersMode = guestType === 'Others';
  const canNavigateLeft = isOthersMode && currentGuestIndex > 0;
  const canNavigateRight =
    isOthersMode && currentGuestIndex < othersGuests.length - 1;
  
  // Check if all required fields are filled for all guests
  const isAllDetailsFilled = isFormValid();

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
          <Text style={HomeStyle.screenNameWhite}>{'Guest Details'}</Text>
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
          {/* Self/Others Toggle - Hide Others tab for MySelf flow */}
          {!isMySelfFlow && (
            <View style={[HomeStyle.btnTapFlexStyle]}>
              <TouchableOpacity
                onPress={() => {
                  setGuestType('Self');
                  setCurrentGuestIndex(0);
                }}
                style={[
                  HomeStyle.btnTapSelf,
                  guestType === 'Self' && { backgroundColor: Colors.secondary },
                  {
                    flex: 0.48,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  },
                ]}
              >
                <Text
                  style={[
                    { fontSize: 14, fontWeight: '600' },
                    guestType === 'Self'
                      ? { color: Colors.white }
                      : { color: Colors.grayText },
                  ]}
                >
                  {'Self'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setGuestType('Others');
                  setCurrentGuestIndex(0);
                }}
                style={[
                  HomeStyle.btnTapStyle,
                  guestType === 'Others' && { backgroundColor: Colors.secondary },
                  {
                    flex: 0.48,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  },
                ]}
              >
                <Text
                  style={[
                    { fontSize: 14, fontWeight: '600' },
                    guestType === 'Others'
                      ? { color: Colors.white }
                      : { color: Colors.grayText },
                  ]}
                >
                  {'Others'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Guest Navigation (for Others mode) */}
          {isOthersMode && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  canNavigateLeft && setCurrentGuestIndex(currentGuestIndex - 1)
                }
                disabled={!canNavigateLeft}
                style={{ opacity: canNavigateLeft ? 1 : 0.3 }}
              >
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'chevron-back'}
                  iconColor={canNavigateLeft ? Colors.secondary : Colors.gray}
                  iconSize={24}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: Colors.secondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.white,
                  }}
                >
                  {currentGuestIndex + 1}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  canNavigateRight && setCurrentGuestIndex(currentGuestIndex + 1)
                }
                disabled={!canNavigateRight}
                style={{ opacity: canNavigateRight ? 1 : 0.3 }}
              >
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'chevron-forward'}
                  iconColor={canNavigateRight ? Colors.secondary : Colors.gray}
                  iconSize={24}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Guest Form Fields */}
          <View style={{ ...LayoutStyle.marginTop20 }}>
            {/* Name and Age */}
            <Text style={[HomeStyle.inputLabel]}>{'Name *'}</Text>
            <View style={{ ...CommonStyles.directionRowSB, marginBottom: 15 }}>
              <TextInput
                style={[HomeStyle.inputName, { flex: 1, marginRight: 10, paddingHorizontal: 15 }]}
                placeholderTextColor={Colors.grayText}
                placeholder="Enter Name"
                value={currentGuest?.name || ''}
                onChangeText={value => handleGuestFieldChange('name', value)}
              />
              <TextInput
                style={[HomeStyle.inputAge]}
                placeholderTextColor={Colors.grayText}
                placeholder="Age"
                keyboardType="numeric"
                value={currentGuest?.age || ''}
                onChangeText={value => handleGuestFieldChange('age', value)}
              />
              {/* Gender */}
              <View style={{ marginLeft: 10 }}>
                <Text style={[HomeStyle.inputLabelGender]}>{'Gender'}</Text>
                <View style={[HomeStyle.genderRadioView]}>
                  <TouchableOpacity
                    onPress={() => handleGenderSelect('male')}
                    style={[
                      HomeStyle.genderIconContainer,
                      { marginRight: 10 },
                      currentGuest?.gender === 'male' && {
                        backgroundColor: Colors.secondary,
                      },
                    ]}
                  >
                    <Icons
                      iconSetName={'Ionicons'}
                      iconName={'man'}
                      iconColor={
                        currentGuest?.gender === 'male'
                          ? Colors.white
                          : Colors.gray
                      }
                      iconSize={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleGenderSelect('female')}
                    style={[
                      HomeStyle.genderIconContainer,
                      currentGuest?.gender === 'female' && {
                        backgroundColor: Colors.secondary,
                      },
                    ]}
                  >
                    <Icons
                      iconSetName={'Ionicons'}
                      iconName={'woman'}
                      iconColor={
                        currentGuest?.gender === 'female'
                          ? Colors.white
                          : Colors.gray
                      }
                      iconSize={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Mobile Number */}
            <Input
              InputLabel={'Mobile Number *'}
              value={currentGuest?.mobile || ''}
              onChangeText={value => handleGuestFieldChange('mobile', value)}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="Enter Mobile Number"
            />

            {/* Alternate Mobile Number */}
            <Input
              placeholder={"Enter Alternate Mobile Number"}
              InputLabel={'Alternate Mobile Number'}
              value={currentGuest?.alternateMobile || ''}
              onChangeText={value =>
                handleGuestFieldChange('alternateMobile', value)
              }
              keyboardType="phone-pad"
              maxLength={10}
            />

            {/* Email */}
            <Input
              InputLabel={'Email'}
              value={currentGuest?.email || ''}
              onChangeText={value => handleGuestFieldChange('email', value)}
              keyboardType="email-address"
              placeholder="Enter E-mail"
            />

            {/* ID Proof */}
            <Text style={[HomeStyle.idproof, { ...LayoutStyle.marginTop10 }]}>
              {'Id Proof *'}
            </Text>
            <Dropdown
              data={idProofTypes}
              placeholder={'Select ID Proof'}
              value={currentGuest?.idProofType || ''}
              onChange={item => {
                handleGuestFieldChange('idProofType', item.value);
              }}
              labelField="label"
              valueField="value"
              style={{
                height: 50,
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

            {/* Upload ID Proof */}
            <Text
              style={[HomeStyle.inputMobileImg, { ...LayoutStyle.marginTop10 }]}
            >
              {'Upload *'}
            </Text>
            <TouchableOpacity 
              style={[HomeStyle.uploadContainer, { marginBottom: 15 }]}               
              onPress={() =>
                handleImagePicker(guestType === 'Self' ? 'self' : currentGuestIndex)
              }
            >
              <TextInput
                style={[HomeStyle.inputMobile, { flex: 1, paddingHorizontal: 15 }]}
                placeholderTextColor={Colors.grayText}
                placeholder="Click here to upload ID"
                value={currentGuest?.idProofImage ? 'ID Proof Selected' : ''}
                editable={false}
              />
              <View style={[HomeStyle.verifyOTPContainer, { justifyContent: "center" }]}>
                <Text style={[HomeStyle.verifyOtpText]}>{'Upload'}</Text>
              </View>
            </TouchableOpacity>

            {/* ID Proof Number */}
            <Input
              InputLabel={'ID Proof Number *'}
              value={currentGuest?.idProofNumber || ''}
              onChangeText={value => handleGuestFieldChange('idProofNumber', value)}
              placeholder="Enter ID Proof Number"
            />

            {/* Purpose of visit */}
            <Input
              InputLabel={'Purpose of visit'}
              value={currentGuest?.purpose || ''}
              onChangeText={value => handleGuestFieldChange('purpose', value)}
              placeholder="Enter Purpose Of Visit"
            />

             {/* Save for future use - Mandatory checkbox */}
             <View
               style={{
                 flexDirection: 'row',
                 alignItems: 'center',
                 marginTop: 15,
               }}
             >
               <TouchableOpacity
                 onPress={() => {
                   if (guestType === 'Self') {
                     setSelfGuest(prev => ({
                       ...prev,
                       saveForFuture: !prev.saveForFuture,
                     }));
                   } else {
                     setOthersGuests(prevGuests => {
                       const updated = [...prevGuests];
                       updated[currentGuestIndex] = {
                         ...updated[currentGuestIndex],
                         saveForFuture: !updated[currentGuestIndex].saveForFuture,
                       };
                       return updated;
                     });
                   }
                 }}
                 style={{ flexDirection: 'row', alignItems: 'center' }}
               >
                 <Icons
                   iconSetName={'Ionicons'}
                   iconName={
                     (guestType === 'Self' ? selfGuest?.saveForFuture : currentGuest?.saveForFuture)
                       ? 'checkbox'
                       : 'checkbox-outline'
                   }
                   iconColor={
                     (guestType === 'Self' ? selfGuest?.saveForFuture : currentGuest?.saveForFuture)
                       ? Colors.secondary
                       : Colors.gray
                   }
                   iconSize={24}
                 />
                 <Text style={{ marginLeft: 10, color: Colors.black }}>
                   {'Save details for future use *'}
                 </Text>
               </TouchableOpacity>
             </View>
          </View>

          {/* Pay Now Button */}
          <Button
            btnStyle={[HomeStyle.paynowBtn, !isAllDetailsFilled && { opacity: 0.5 }]}
            btnName={'Pay Now'}
            onPress={handlePayNow}
            disabled={!isAllDetailsFilled}
          />
          <Text
            style={[
              HomeStyle.bottomLabel,
              { textAlign: 'center' },
            ]}
          >
            {'Id is mandatory during the check-in'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GuestDetailsScreen;


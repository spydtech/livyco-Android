import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import { Icons, Button } from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import { CommonActions } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import FontFamily from '../../assets/FontFamily';
import { deviceWidth } from '../../utils/DeviceInfo';
import {
  createPaymentOrder,
  validatePayment,
} from '../../services/paymentService';
import { showMessage } from 'react-native-flash-message';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY_ID } from '../../config/BaseUrl';
import moment from 'moment';

const PayRentBookingScreen = props => {
  const bookingData = props.route?.params?.bookingData || {};
  const propertyData = bookingData?.propertyData || {};
  const selectedRoom = bookingData?.selectedRoom || '';
  const selectedSharing = bookingData?.selectedSharing || {};
  const selectedSharingIndex = bookingData?.selectedSharingIndex || null;
  const moveInDate = bookingData?.moveInDate || '';
  const customerDetails = bookingData?.customerDetails || {};
  
  // Extract propertyId - try multiple sources
  let propertyId = bookingData?.propertyId;
  if (!propertyId && propertyData?.property) {
    propertyId = propertyData.property._id || propertyData.property.id;
  }
  
  console.log('PayRentBookingScreen - propertyId:', propertyId);
  console.log('PayRentBookingScreen - propertyData:', propertyData);
  
  const roomType = bookingData?.roomType;
  // Ensure selectedRooms is an array
  // Check for selectedRooms (plural) first (from group booking), then selectedRoom (singular) for self booking
  let selectedRooms = Array.isArray(bookingData?.selectedRooms)
    ? bookingData.selectedRooms
    : Array.isArray(bookingData?.selectedRoom)
    ? bookingData.selectedRoom
    : bookingData?.selectedRoom
    ? [bookingData.selectedRoom]
    : bookingData?.selectedRooms && !Array.isArray(bookingData.selectedRooms)
    ? [bookingData.selectedRooms]
    : [];
  
  // Normalize roomType to match backend format
  let normalizedRoomType = roomType || selectedSharing?.type || 'single';
  if (normalizedRoomType && typeof normalizedRoomType === 'string') {
    const roomTypeLower = normalizedRoomType.toLowerCase();
    if (roomTypeLower.includes('single') || roomTypeLower === '1') {
      normalizedRoomType = 'single';
    } else if (roomTypeLower.includes('double') || roomTypeLower === '2') {
      normalizedRoomType = 'double';
    } else if (roomTypeLower.includes('triple') || roomTypeLower === '3') {
      normalizedRoomType = 'triple';
    } else if (roomTypeLower.includes('four') || roomTypeLower === '4') {
      normalizedRoomType = 'four';
    } else if (roomTypeLower.includes('five') || roomTypeLower === '5') {
      normalizedRoomType = 'five';
    } else if (roomTypeLower.includes('six') || roomTypeLower === '6') {
      normalizedRoomType = 'six';
    } else {
      normalizedRoomType = roomTypeLower.replace(' sharing', '').trim();
    }
  }
  
  // Ensure selectedRooms are strings (not objects) and in correct format
  // Backend expects format: "sharingType-roomNumber-bedName" (e.g., "single-101-bed1")
  // Helper function to check if a string looks like an ObjectId (24 hex characters)
  const isObjectId = (str) => {
    return /^[0-9a-fA-F]{24}$/.test(str);
  };
  
  // Valid sharing types that backend expects
  const validSharingTypes = ['single', 'double', 'triple', 'four', 'five', 'six'];
  
  selectedRooms = selectedRooms.map(room => {
    let roomStr = '';
    if (typeof room === 'string') {
      roomStr = room;
    } else if (room && typeof room === 'object') {
      roomStr = room.roomIdentifier || room.toString();
    } else {
      roomStr = String(room);
    }
    
    // Split by dash to analyze the format
    const parts = roomStr.split('-');
    
    // Check if format is already correct: "sharingType-roomNumber-bedName"
    if (parts.length >= 3) {
      const firstPart = parts[0].toLowerCase();
      
      // If first part is a valid sharing type, format is correct
      if (validSharingTypes.includes(firstPart)) {
        return roomStr;
      }
      
      // If first part looks like an ObjectId, we need to extract room number and bed
      // Format might be: "ObjectId-roomNumber-bedName" or "ObjectId-roomNumber-bed"
      if (isObjectId(parts[0])) {
        // Extract room number (second part) and bed (third part or remaining parts)
        const roomNumber = parts[1] || 'unknown';
        const bed = parts.slice(2).join('-') || 'bed1';
        
        // Reconstruct with proper sharing type (use normalizedRoomType from component state)
        return `${normalizedRoomType}-${roomNumber}-${bed}`;
      }
      
      // If first part is not a valid sharing type and not an ObjectId,
      // treat it as floor name or other identifier, extract room number
      const roomNumber = parts[1] || parts[0];
      const bed = parts.slice(2).join('-') || 'bed1';
      return `${normalizedRoomType}-${roomNumber}-${bed}`;
    }
    
    // Format is incorrect - need to convert from "floorName-roomNumber" to "sharingType-roomNumber-bedName"
    let roomNumber = null;
    if (parts.length >= 2) {
      // Get the last part as room number (e.g., "First Floor-101" -> "101")
      roomNumber = parts[parts.length - 1];
    } else if (parts.length === 1) {
      // If no dash, check if it's an ObjectId or just a room number
      if (isObjectId(parts[0])) {
        // If it's just an ObjectId, we can't extract room number - use fallback
        roomNumber = null;
      } else {
        // Assume the whole string is the room number
        roomNumber = parts[0];
      }
    }
    
    if (roomNumber) {
      // Construct proper roomIdentifier format: "sharingType-roomNumber-bedName"
      return `${normalizedRoomType}-${roomNumber}-bed1`;
    }
    
    // Fallback if conversion fails - generate a unique identifier
    const uniqueId = Date.now().toString().slice(-6);
    return `${normalizedRoomType}-room-${uniqueId}-bed1`;
  }).filter(room => room && room.length > 0);
  
  // Log normalized rooms for debugging
  console.log('Normalized selectedRooms:', selectedRooms);
  console.log('Normalized roomType:', normalizedRoomType);
  
  const durationType = bookingData?.durationType;
  const durationDays = bookingData?.durationDays;
  const durationMonths = bookingData?.durationMonths;
  const durationWeeks = bookingData?.durationWeeks;
  const personCount = bookingData?.personCount || 1;
  
  // Convert weekly duration to days for backend compatibility
  // Backend enum only supports: ['monthly', 'daily', 'custom']
  let finalDurationType = durationType;
  let finalDurationDays = durationDays;
  let finalDurationMonths = durationMonths;
  
  if (durationType === 'weekly' && durationWeeks) {
    // Convert weeks to days (1 week = 7 days)
    finalDurationType = 'daily';
    finalDurationDays = durationWeeks * 7;
    finalDurationMonths = null;
  }

  const rooms = propertyData?.rooms || { roomTypes: [] };
  const roomTypes = rooms?.roomTypes || [];
console.log("bookingData",bookingData);

  // Get selected room type based on selectedSharingIndex
  let selectedRoomType = {};
  if (
    selectedSharingIndex !== null &&
    roomTypes.length > 0 &&
    roomTypes[selectedSharingIndex]
  ) {
    selectedRoomType = roomTypes[selectedSharingIndex];
  } else if (roomTypes.length > 0) {
    selectedRoomType = roomTypes[0];
  }

  // Calculate amounts based on the billing summary format
  // Get pricing from bookingData if available
  const bookingPricing = bookingData?.pricing || {};
  const totalPayment = bookingPricing.totalAmount || 
                       bookingData?.totalAmount || 
                       bookingData?.price || 
                       selectedRoomType?.price || 
                       1.0; // Total payment amount in INR
  const monthlyRent = bookingPricing.monthlyRent || 
                      bookingData?.monthlyRent || 
                      selectedRoomType?.price || 
                      1.0;
  const advanceAmount = bookingPricing.advanceAmount || 
                        bookingData?.advanceAmount || 
                        0;
  const securityDeposit = bookingPricing.securityDeposit || 
                          bookingPricing.depositAmount ||
                          bookingData?.securityDeposit || 
                          bookingData?.depositAmount || 
                          selectedRoomType?.deposit || 
                          0;
  const maintenanceFee = bookingPricing.maintenanceFee || 
                         bookingData?.maintenanceFee || 
                         0;
  
  const platformFeePercentage = 5; // 5% platform fee
  const gstPercentage = 18; // 18% GST on platform fee
  const platformFee = (totalPayment * platformFeePercentage) / 100;
  const gstOnPlatformFee = (platformFee * gstPercentage) / 100;
  const amountToPropertyOwner = totalPayment - platformFee - gstOnPlatformFee;

  const [processing, setProcessing] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const formatCurrency = amount => {
    return `₹ ${amount.toFixed(2)}`;
  };

  // Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD format
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // If already in YYYY-MM-DD format, validate and return
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parsed = moment(dateString, 'YYYY-MM-DD');
        if (parsed.isValid()) {
          return dateString;
        }
      }
      
      // If in DD/MM/YYYY format, convert to YYYY-MM-DD
      if (dateString.includes('/')) {
        const dateParts = dateString.split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          const formattedDate = `${year}-${month}-${day}`;
          // Validate the formatted date
          const parsed = moment(formattedDate, 'YYYY-MM-DD');
          if (parsed.isValid()) {
            return formattedDate;
          }
        }
      }
      
      // Try to parse with moment and format to YYYY-MM-DD
      const parsedDate = moment(dateString);
      if (parsedDate.isValid()) {
        return parsedDate.format('YYYY-MM-DD');
      }
      
      // If all parsing fails, return null (will be handled by validation)
      console.warn('Failed to parse date:', dateString);
      return null;
    } catch (error) {
      console.error('Error normalizing date:', error);
      return dateString; // Return original on error
    }
  };

  const handleProcessToPay = async () => {
    setProcessing(true);

    try {
      // Step 1: Ensure propertyId is correctly extracted
      // Try multiple sources to get propertyId
      let finalPropertyId = propertyId;
      
      if (!finalPropertyId) {
        finalPropertyId = propertyData?.property?._id || propertyData?.property?.id;
      }
      
      // If still not found, try from bookingData directly
      if (!finalPropertyId) {
        finalPropertyId = bookingData?.propertyId;
      }
      
      if (!finalPropertyId) {
        showMessage({
          message: 'Property information is missing. Please try again.',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }

      // Normalize moveInDate to YYYY-MM-DD format for backend
      const normalizedMoveInDate = normalizeDate(moveInDate);
      
      // Validate moveInDate
      if (!normalizedMoveInDate) {
        showMessage({
          message: 'Invalid move-in date. Please select a valid date.',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }
      
      // Double-check the date is valid using moment
      const validatedDate = moment(normalizedMoveInDate, 'YYYY-MM-DD');
      if (!validatedDate.isValid()) {
        showMessage({
          message: 'Invalid move-in date format. Please try again.',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }
      
      console.log('Creating payment order with propertyId:', finalPropertyId);
      console.log('Booking data received:', {
        propertyId: finalPropertyId,
        hasPropertyData: !!propertyData,
        propertyDataProperty: propertyData?.property,
        moveInDate: moveInDate,
        normalizedMoveInDate: normalizedMoveInDate,
      });

      // Step 2: Create payment order on backend
      const amountInPaise = Math.round(totalPayment * 100); // Convert INR to paise
      const receiptId = `receipt_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Prepare booking data for order creation - ensure propertyId is a string
      // Normalize roomType to match backend expectations (single, double, triple, etc.)
      let normalizedRoomType = roomType || selectedSharing?.type || 'single';
      if (normalizedRoomType && typeof normalizedRoomType === 'string') {
        // Convert "Single Sharing" -> "single", "Double Sharing" -> "double", etc.
        const roomTypeLower = normalizedRoomType.toLowerCase();
        if (roomTypeLower.includes('single') || roomTypeLower === '1') {
          normalizedRoomType = 'single';
        } else if (roomTypeLower.includes('double') || roomTypeLower === '2') {
          normalizedRoomType = 'double';
        } else if (roomTypeLower.includes('triple') || roomTypeLower === '3') {
          normalizedRoomType = 'triple';
        } else if (roomTypeLower.includes('four') || roomTypeLower === '4') {
          normalizedRoomType = 'four';
        } else if (roomTypeLower.includes('five') || roomTypeLower === '5') {
          normalizedRoomType = 'five';
        } else if (roomTypeLower.includes('six') || roomTypeLower === '6') {
          normalizedRoomType = 'six';
        }
      }
      
      // Prepare pricing object matching web version structure
      const pricingData = {
        monthlyRent: monthlyRent,
        totalRent: monthlyRent, // Can be same as monthlyRent or calculated differently
        advanceAmount: advanceAmount,
        securityDeposit: securityDeposit,
        totalAmount: totalPayment,
        maintenanceFee: maintenanceFee,
      };
      
      const bookingPayload = {
        propertyId: String(finalPropertyId), // Ensure it's a string
        roomType: normalizedRoomType,
        selectedRooms: selectedRooms, // Array of room identifier strings
        moveInDate: normalizedMoveInDate, // Use normalized date format (YYYY-MM-DD)
        endDate: null, // Will be calculated later for validation
        durationType: finalDurationType || 'monthly', // 'monthly', 'daily', or 'custom' (not 'weekly')
        durationDays: finalDurationDays || null,
        durationMonths: finalDurationMonths || null,
        personCount: personCount,
        customerDetails: customerDetails || {}, // Ensure it's an object
        pricing: pricingData,
      };

      const orderResponse = await createPaymentOrder({
        amount: amountInPaise, // Amount in paise
        currency: 'INR',
        receipt: receiptId,
        bookingData: bookingPayload,
      });

      if (!orderResponse.success || !orderResponse.data) {
        showMessage({
          message: orderResponse.message || 'Failed to create payment order',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }

      const razorpayOrder = orderResponse.data;
      console.log('Payment order created:', razorpayOrder);

      // Step 2: Open Razorpay checkout
      const razorpayOptions = {
        description: 'Booking Payment',
        currency: 'INR',
        key: RAZORPAY_KEY_ID, // Razorpay Key ID
        amount: razorpayOrder.amount, // Amount in paise
        name: 'Livyco Booking',
        order_id: razorpayOrder.id, // Order ID from backend
        prefill: {
          email: customerDetails?.primary?.email || '',
          contact: customerDetails?.primary?.mobile || '',
          name: customerDetails?.primary?.name || '',
        },
        theme: { color: Colors.secondary || '#1E88E5' },
        // PLACEHOLDER: Add any additional Razorpay options here
      };

      let razorpayResponse;
      try {
        razorpayResponse = await RazorpayCheckout.open(razorpayOptions);
        console.log('Razorpay payment response:', razorpayResponse);
      } catch (razorpayError) {
        console.error('Razorpay checkout error:', razorpayError);

        // Handle Razorpay cancellation or errors
        if (razorpayError.code === 'NETWORK_ERROR') {
          showMessage({
            message: 'Network error. Please check your connection.',
            type: 'danger',
            floating: true,
          });
        } else if (
          razorpayError.description === 'User closed the checkout form'
        ) {
          showMessage({
            message: 'Payment cancelled',
            type: 'info',
            floating: true,
          });
        } else {
          showMessage({
            message: razorpayError.description || 'Payment failed',
            type: 'danger',
            floating: true,
          });
        }
        setProcessing(false);
        return;
      }

      // Step 3: Validate payment on backend
      if (
        !razorpayResponse.razorpay_payment_id ||
        !razorpayResponse.razorpay_signature
      ) {
        showMessage({
          message: 'Invalid payment response',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }

      // Calculate moveOutDate based on moveInDate and duration
      // Use normalized moveInDate from bookingPayload for consistency
      const normalizedMoveInDateForCalc = normalizedMoveInDate || normalizeDate(moveInDate);
      let calculatedEndDate = null;
      
      if (normalizedMoveInDateForCalc) {
        try {
          // Parse the normalized date (should be in YYYY-MM-DD format)
          const parsedMoveInDate = moment(normalizedMoveInDateForCalc, 'YYYY-MM-DD');
          
          if (!parsedMoveInDate.isValid()) {
            throw new Error('Invalid moveInDate format');
          }

          // Calculate end date based on duration (use finalDurationType which handles weekly conversion)
          if (finalDurationType === 'monthly' && finalDurationMonths) {
            calculatedEndDate = parsedMoveInDate.clone().add(finalDurationMonths, 'months').format('YYYY-MM-DD');
          } else if (finalDurationType === 'daily' && finalDurationDays) {
            calculatedEndDate = parsedMoveInDate.clone().add(finalDurationDays, 'days').format('YYYY-MM-DD');
          } else {
            // Default: if no duration specified, set to 1 month from move-in date
            calculatedEndDate = parsedMoveInDate.clone().add(1, 'month').format('YYYY-MM-DD');
          }
          
          console.log('Date calculation:', {
            moveInDate: normalizedMoveInDateForCalc,
            originalDurationType: durationType,
            finalDurationType: finalDurationType,
            durationMonths: finalDurationMonths,
            durationWeeks: durationWeeks,
            durationDays: finalDurationDays,
            calculatedEndDate,
          });
        } catch (dateError) {
          console.error('Error calculating end date:', dateError);
          // Fallback: set to 1 month from today if calculation fails
          calculatedEndDate = moment().add(1, 'month').format('YYYY-MM-DD');
        }
      } else {
        // Fallback: if no moveInDate, set to 1 month from today
        calculatedEndDate = moment().add(1, 'month').format('YYYY-MM-DD');
      }

      // Ensure bookingPayload has propertyId and endDate for validation
      const validationBookingPayload = {
        propertyId: String(finalPropertyId), // Ensure propertyId is a string
        roomType: normalizedRoomType,
        selectedRooms: selectedRooms, // Array of room identifier strings
        moveInDate: normalizedMoveInDate, // Ensure moveInDate is in YYYY-MM-DD format
        endDate: calculatedEndDate, // Add calculated end date in YYYY-MM-DD format
        moveOutDate: calculatedEndDate, // Also add as moveOutDate for compatibility
        durationType: finalDurationType || 'monthly', // Use finalDurationType (weekly converted to daily)
        durationDays: finalDurationDays || null,
        durationMonths: finalDurationMonths || null,
        personCount: personCount || 1, // Ensure personCount is present
        customerDetails: customerDetails || {}, // Ensure customerDetails is present
        pricing: pricingData,
      };
      
      console.log('Validating payment with bookingData:', {
        propertyId: validationBookingPayload.propertyId,
        roomType: validationBookingPayload.roomType,
        selectedRooms: validationBookingPayload.selectedRooms,
        moveInDate: validationBookingPayload.moveInDate,
        endDate: validationBookingPayload.endDate,
        moveOutDate: validationBookingPayload.moveOutDate,
        durationType: validationBookingPayload.durationType,
        durationMonths: validationBookingPayload.durationMonths,
        durationDays: validationBookingPayload.durationDays,
        personCount: validationBookingPayload.personCount,
        hasCustomerDetails: !!validationBookingPayload.customerDetails,
        customerDetailsKeys: validationBookingPayload.customerDetails ? Object.keys(validationBookingPayload.customerDetails) : [],
        hasPricing: !!validationBookingPayload.pricing,
        pricing: validationBookingPayload.pricing,
      });
      
      // Validate critical fields before sending
      if (!validationBookingPayload.propertyId) {
        throw new Error('Missing propertyId');
      }
      if (!validationBookingPayload.moveInDate) {
        throw new Error('Missing moveInDate');
      }
      if (!validationBookingPayload.endDate && !validationBookingPayload.moveOutDate) {
        throw new Error('Missing endDate/moveOutDate');
      }
      if (!validationBookingPayload.selectedRooms || validationBookingPayload.selectedRooms.length === 0) {
        throw new Error('Missing selectedRooms');
      }
      if (!validationBookingPayload.customerDetails || !validationBookingPayload.customerDetails.primary) {
        throw new Error('Missing customerDetails.primary');
      }
      if (!validationBookingPayload.pricing) {
        console.warn('Missing pricing object, using defaults');
        // Pricing will use defaults in backend if not provided
      }
      
      // Verify all required fields are present
      if (!validationBookingPayload.endDate && !validationBookingPayload.moveOutDate) {
        console.error('Missing endDate/moveOutDate in validation payload');
      }
      if (!validationBookingPayload.moveInDate) {
        console.error('Missing moveInDate in validation payload');
      }
      if (!validationBookingPayload.propertyId) {
        console.error('Missing propertyId in validation payload');
      }
console.log("Validation Booking Payload",{
  razorpay_order_id: razorpayOrder.id,
  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
  razorpay_signature: razorpayResponse.razorpay_signature,
  bookingData: validationBookingPayload,
});

      const validationResponse = await validatePayment({
        razorpay_order_id: razorpayOrder.id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        bookingData: validationBookingPayload,
      });
      console.log('Validation response', validationResponse);

      if (validationResponse.success) {
        setBookingCreated(true);
        showMessage({
          message: 'Payment successful! Booking created.',
          type: 'success',
          floating: true,
        });

        // Extract booking data from validation response
        // The response structure: { success: true, booking: {...} } or { success: true, data: { booking: {...} } }
        const responseBooking = validationResponse.booking || validationResponse.data?.booking || validationResponse.data;
        
        // Prepare booking data for cancel screen
        const bookingDataForCancel = {
          booking: {
            id: responseBooking?.id || responseBooking?._id,
            _id: responseBooking?.id || responseBooking?._id,
            propertyName: responseBooking?.propertyName || 
                         propertyData?.property?.name || 
                         propertyData?.name || 
                         'Property Name',
            property: {
              name: responseBooking?.propertyName || 
                    propertyData?.property?.name || 
                    propertyData?.name || 
                    'Property Name',
              images: propertyData?.property?.images || 
                     propertyData?.images || 
                     responseBooking?.property?.images || 
                     [],
            },
            moveInDate: responseBooking?.moveInDate || normalizedMoveInDate,
            totalAmount: responseBooking?.totalAmount || 
                        responseBooking?.pricing?.totalAmount || 
                        totalPayment,
            pricing: {
              totalAmount: responseBooking?.totalAmount || 
                          responseBooking?.pricing?.totalAmount || 
                          totalPayment,
            },
          },
          bookingId: responseBooking?.id || responseBooking?._id,
          propertyName: responseBooking?.propertyName || 
                       propertyData?.property?.name || 
                       propertyData?.name || 
                       'Property Name',
          propertyImage: propertyData?.property?.images?.[0] || 
                        propertyData?.images?.[0] || 
                        responseBooking?.property?.images?.[0] || 
                        null,
          moveInDate: responseBooking?.moveInDate || normalizedMoveInDate,
          totalAmount: responseBooking?.totalAmount || 
                      responseBooking?.pricing?.totalAmount || 
                      totalPayment,
          amountPaid: responseBooking?.totalAmount || 
                     responseBooking?.pricing?.totalAmount || 
                     totalPayment,
        };

        // Navigate to cancel booking screen with booking details
        setTimeout(() => {
          props.navigation.navigate('Cancel', { 
            bookingData: bookingDataForCancel 
          });
        }, 1500);
      } else {
        showMessage({
          message: validationResponse.message || 'Payment validation failed',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      showMessage({
        message: error.message || 'An error occurred. Please try again.',
        type: 'danger',
        floating: true,
      });
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <View style={PaymentStyle.headerContainerBlue}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => gotoBack()}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{'Pay Rent'}</Text>
        </View>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1, backgroundColor: Colors.white }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={LayoutStyle.paddingHorizontal20}>
          {/* Billing Summary Card */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>
                {'Total Amount to be Paid'}
              </Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(totalPayment)}
              </Text>
            </View>

            {/* Automatic Fund Transfer Section */}
            <View style={styles.fundTransferContainer}>
              <View style={styles.fundTransferHeader}>
                <Icons
                  iconSetName={'MaterialIcons'}
                  iconName={'info-outline'}
                  iconColor={Colors.secondary}
                  iconSize={20}
                />
                <Text style={styles.fundTransferTitle}>
                  {'Automatic Fund Transfer'}
                </Text>
              </View>
              <Text style={styles.fundTransferDescription}>
                {
                  'After payment, funds will be automatically transferred to the property owner:'
                }
              </Text>

              {/* Breakdown */}
              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{'Total Payment:'}</Text>
                  <Text style={styles.breakdownValue}>
                    {formatCurrency(totalPayment)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text
                    style={styles.breakdownLabel}
                  >{`Platform Fee (${platformFeePercentage}%):`}</Text>
                  <Text style={[styles.breakdownValue, styles.deductionValue]}>
                    - {formatCurrency(platformFee)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text
                    style={styles.breakdownLabel}
                  >{`GST on Platform Fee (${gstPercentage}%):`}</Text>
                  <Text style={[styles.breakdownValue, styles.deductionValue]}>
                    - {formatCurrency(gstOnPlatformFee)}
                  </Text>
                </View>
                <View style={[styles.breakdownRow, styles.finalRow]}>
                  <Text style={styles.finalLabel}>
                    {'Amount to Property Owner:'}
                  </Text>
                  <Text style={styles.finalValue}>
                    {formatCurrency(amountToPropertyOwner)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Process to Pay Button - Fixed at bottom */}
      <View style={styles.bottomButtonContainer}>
        <Button
          btnStyle={[styles.processButton]}
          btnName={
            processing
              ? 'Processing...'
              : bookingCreated
              ? 'Booking Created!'
              : `Pay ${formatCurrency(totalPayment)}`
          }
          onPress={handleProcessToPay}
          disabled={processing || bookingCreated}
        />
        <Text style={styles.termsText}>
          {
            'By proceeding, you agree to our Terms of Service and Privacy Policy'
          }
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical15,
  },
  headerTitle: {
    ...LayoutStyle.fontSize16,
    color: Colors.white,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.marginLeft10,
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    ...LayoutStyle.padding15,
    ...LayoutStyle.marginTop20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    ...LayoutStyle.fontSize16,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoBold,
    flex: 1,
  },
  totalAmount: {
    ...LayoutStyle.fontSize18,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoBold,
  },
  fundTransferContainer: {
    backgroundColor: Colors.paleBlue || '#E3F2FD',
    borderRadius: 8,
    ...LayoutStyle.padding15,
    marginTop: 15,
  },
  fundTransferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fundTransferTitle: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.marginLeft10,
  },
  fundTransferDescription: {
    ...LayoutStyle.fontSize12,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    marginBottom: 15,
    lineHeight: 18,
  },
  breakdownContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.grayBorder || '#E0E0E0',
    ...LayoutStyle.paddingTop15,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...LayoutStyle.marginBottom10,
  },
  breakdownLabel: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoRegular,
    flex: 1,
  },
  breakdownValue: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoMedium,
  },
  deductionValue: {
    color: Colors.red || '#F44336',
  },
  finalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.grayBorder || '#E0E0E0',
  },
  finalLabel: {
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoBold,
    flex: 1,
  },
  finalValue: {
    ...LayoutStyle.fontSize16,
    color: Colors.blackText,
    fontFamily: FontFamily.RobotoBold,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.grayBorder || '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  processButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  termsText: {
    ...LayoutStyle.fontSize10,
    color: Colors.grayText || '#757575',
    fontFamily: FontFamily.RobotoRegular,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 14,
  },
});

export default PayRentBookingScreen;

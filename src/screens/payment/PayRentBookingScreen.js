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
import { createPaymentOrder, validatePayment } from '../../services/paymentService';
import { showMessage } from 'react-native-flash-message';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY_ID } from '../../config/BaseUrl';

const PayRentBookingScreen = props => {
  const bookingData = props.route?.params?.bookingData || {};
  const propertyData = bookingData?.propertyData || {};
  const selectedRoom = bookingData?.selectedRoom || '';
  const selectedSharing = bookingData?.selectedSharing || {};
  const selectedSharingIndex = bookingData?.selectedSharingIndex || null;
  const moveInDate = bookingData?.moveInDate || '';
  const customerDetails = bookingData?.customerDetails || {};
  const propertyId = bookingData?.propertyId;
  const roomType = bookingData?.roomType;
  const selectedRooms = bookingData?.selectedRooms || [];
  const durationType = bookingData?.durationType;
  const durationDays = bookingData?.durationDays;
  const durationMonths = bookingData?.durationMonths;
  const personCount = bookingData?.personCount || 1;

  const rooms = propertyData?.rooms || { roomTypes: [] };
  const roomTypes = rooms?.roomTypes || [];

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
  const totalPayment = selectedRoomType?.price || 1.0; // Total payment amount in INR
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

  const handleProcessToPay = async () => {
    setProcessing(true);
    
    try {
      // Step 1: Create payment order on backend
      const amountInPaise = Math.round(totalPayment * 100); // Convert INR to paise
      const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare booking data for order creation
      const bookingPayload = {
        propertyId,
        roomType: roomType || selectedSharing?.type || 'single',
        selectedRooms: selectedRooms,
        moveInDate: moveInDate,
        durationType: durationType || 'monthly',
        durationDays: durationDays || null,
        durationMonths: durationMonths || null,
        personCount: personCount,
        customerDetails: customerDetails,
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
        image: 'https://your-logo-url.com/logo.png', // TODO: Add your app logo URL
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
        } else if (razorpayError.description === 'User closed the checkout form') {
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
      if (!razorpayResponse.razorpay_payment_id || !razorpayResponse.razorpay_signature) {
        showMessage({
          message: 'Invalid payment response',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }

      const validationResponse = await validatePayment({
        razorpay_order_id: razorpayOrder.id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        bookingData: bookingPayload,
      });

      if (validationResponse.success) {
        setBookingCreated(true);
        showMessage({
          message: 'Payment successful! Booking created.',
          type: 'success',
          floating: true,
        });
        
        // Navigate to success screen or booking details
        setTimeout(() => {
          props.navigation.navigate('Tab', { screen: 'Mystays' });
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
              <Text style={styles.summaryTitle}>{'Total Amount to be Paid'}</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalPayment)}</Text>
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
                <Text style={styles.fundTransferTitle}>{'Automatic Fund Transfer'}</Text>
              </View>
              <Text style={styles.fundTransferDescription}>
                {'After payment, funds will be automatically transferred to the property owner:'}
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
                  <Text style={styles.breakdownLabel}>{`Platform Fee (${platformFeePercentage}%):`}</Text>
                  <Text style={[styles.breakdownValue, styles.deductionValue]}>
                    - {formatCurrency(platformFee)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{`GST on Platform Fee (${gstPercentage}%):`}</Text>
                  <Text style={[styles.breakdownValue, styles.deductionValue]}>
                    - {formatCurrency(gstOnPlatformFee)}
                  </Text>
                </View>
                <View style={[styles.breakdownRow, styles.finalRow]}>
                  <Text style={styles.finalLabel}>{'Amount to Property Owner:'}</Text>
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
          btnName={processing ? 'Processing...' : bookingCreated ? 'Booking Created!' : `Pay ${formatCurrency(totalPayment)}`}
          onPress={handleProcessToPay}
          disabled={processing || bookingCreated}
        />
        <Text style={styles.termsText}>
          {'By proceeding, you agree to our Terms of Service and Privacy Policy'}
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

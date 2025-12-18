import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  // SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import { Button, EmptyState, Icons } from '../../components';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { isGuestUser, showGuestRestrictionAlert } from '../../utils/authUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createRentOrder,
  getPendingRentDetails,
  validateRentPayment,
} from '../../services/paymentService';
import { showMessage } from 'react-native-flash-message';
import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_KEY_ID } from '../../config/BaseUrl';
import moment from 'moment';
import { apiGet } from '../../utils/apiCall';

const PayRentScreen = props => {
  const [rating, setRating] = useState(4);
  const [reason, setReason] = useState('');
  const [rentDetails, setRentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const isCompleted =
    isPaymentCompleted ||
    (rentDetails?.status || '').toString().toLowerCase() === 'completed';

  const gotoHistory = () => {
    props.navigation.navigate('PayTab', { screen: 'History' });
  };

  // Check guest status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkGuestStatus = async () => {
        const isGuest = await isGuestUser();
        if (isGuest) {
          props.navigation.navigate('HomeTab');
          showGuestRestrictionAlert(props.navigation);
        } else {
          // Refresh rent details and payment status when screen comes into focus
          fetchPendingRent();
        }
      };
      checkGuestStatus();
    }, [props.navigation]),
  );

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleRating = selectedRating => {
    setRating(selectedRating);
  };

  const formatCurrency = amount => {
    if (!amount && amount !== 0) {
      return '₹ 0.00';
    }
    const num = Number(amount) || 0;
    return `₹ ${num.toFixed(2)}`;
  };

  const fetchPendingRent = async () => {
    setLoading(true);
    const response = await getPendingRentDetails();
    console.log("Payment response", response);

    if (!response.success) {
      showMessage({
        message: response.message || 'Unable to fetch pending rent',
        type: 'danger',
        floating: true,
      });
      setRentDetails(null);
      setIsPaymentCompleted(false);
      setLoading(false);
      return;
    }

    setRentDetails(response.data);

    // Check if there's a completed rent payment for this property
    if (response.data?.propertyId) {
      await checkCompletedPayment(response.data.propertyId);
    } else {
      setIsPaymentCompleted(false);
    }

    setLoading(false);
  };

  const checkCompletedPayment = async (propertyId) => {
    try {
      const bookingsResponse = await apiGet('bookings/user');

      if (!bookingsResponse.success) {
        console.log('Failed to fetch bookings:', bookingsResponse.message);
        setIsPaymentCompleted(false);
        return;
      }

      const bookings =
        bookingsResponse.data?.bookings ||
        bookingsResponse.data?.data ||
        (Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []);

      // Find the booking with matching propertyId
      const matchingBooking = bookings.find(booking => {
        const bookingPropertyId =
          booking.property?._id ||
          booking.property?.id ||
          booking.propertyId?._id ||
          booking.propertyId?.id ||
          booking.propertyId;

        return String(bookingPropertyId) === String(propertyId);
      });

      if (!matchingBooking || !matchingBooking.payments || matchingBooking.payments.length === 0) {
        setIsPaymentCompleted(false);
        return;
      }

      // Filter payments with type "rent" and status "completed"
      const rentPayments = matchingBooking.payments.filter(
        payment =>
          payment.type === 'rent' &&
          payment.status === 'completed'
      );

      if (rentPayments.length === 0) {
        setIsPaymentCompleted(false);
        return;
      }

      // Sort by date (latest first) and get the most recent one
      const sortedPayments = rentPayments.sort((a, b) => {
        const dateA = new Date(a.date || a.paidDate || 0);
        const dateB = new Date(b.date || b.paidDate || 0);
        return dateB - dateA; // Descending order (latest first)
      });

      const latestRentPayment = sortedPayments[0];

      // Check if this is the latest payment among ALL payments (not just rent)
      const allPayments = matchingBooking.payments || [];
      const sortedAllPayments = allPayments.sort((a, b) => {
        const dateA = new Date(a.date || a.paidDate || 0);
        const dateB = new Date(b.date || b.paidDate || 0);
        return dateB - dateA; // Descending order (latest first)
      });

      const latestPaymentOverall = sortedAllPayments[0];
      const latestRentPaymentDate = new Date(latestRentPayment.date || latestRentPayment.paidDate || 0);
      const latestPaymentOverallDate = new Date(latestPaymentOverall.date || latestPaymentOverall.paidDate || 0);

      // Check if the latest rent payment is also the latest payment overall
      if (latestRentPaymentDate.getTime() === latestPaymentOverallDate.getTime()) {
        setIsPaymentCompleted(true);
      } else {
        setIsPaymentCompleted(false);
      }
    } catch (error) {
      console.error('Error checking completed payment:', error);
      setIsPaymentCompleted(false);
    }
  };

  useEffect(() => {
    fetchPendingRent();
  }, []);

  const handlePayRent = async () => {
    if (!rentDetails) {
      showMessage({
        message: 'No pending rent found',
        type: 'danger',
        floating: true,
      });
      return;
    }

    const amountInPaise = Math.round((rentDetails.amount || 0) * 100);
    if (!amountInPaise || amountInPaise <= 0) {
      showMessage({
        message: 'Invalid rent amount',
        type: 'danger',
        floating: true,
      });
      return;
    }

    setProcessing(true);

    try {
      const now = moment();
      const rentData = {
        bookingId: rentDetails.bookingId,
        propertyId: rentDetails.propertyId,
        amount: rentDetails.amount,
        description: `Rent payment for ${now.format('MMMM YYYY')}`,
        month: now.format('MMMM'),
        year: now.year(),
        moveInDate: rentDetails.moveInDate,
        roomType: rentDetails.roomType,
        reviewData: {
          shouldSaveReview: !!reason || rating > 0,
          rating,
          comment: reason,
        },
      };

      const orderResponse = await createRentOrder({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rent_${Date.now()}`,
        rentData,
      });

      if (!orderResponse.success || !orderResponse.data?.id) {
        showMessage({
          message: orderResponse.message || 'Failed to create rent order',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }

      const razorpayOrder = orderResponse.data;
      const options = {
        description: rentData.description,
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        name: rentDetails.propertyName || 'Livyco Rent',
        order_id: razorpayOrder.id,
        prefill: {
          email: rentDetails.customerDetails?.primary?.email || '',
          contact: rentDetails.customerDetails?.primary?.mobile || '',
          name: rentDetails.customerDetails?.primary?.name || '',
        },
        theme: { color: Colors.secondary || '#1E88E5' },
        notes: {
          bookingId: rentDetails.bookingId,
          propertyId: rentDetails.propertyId,
          payment_type: 'rent_payment',
        },
      };

      let razorpayResponse;
      try {
        razorpayResponse = await RazorpayCheckout.open(options);
      } catch (err) {
        console.error('Razorpay rent error:', err);
        showMessage({
          message:
            err?.description ||
            err?.error?.description ||
            'Payment cancelled or failed',
          type: 'danger',
          floating: true,
        });
        setProcessing(false);
        return;
      }

      const validationRes = await validateRentPayment({
        razorpay_order_id: razorpayOrder.id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        rentData,
      });

      if (validationRes.success) {
        showMessage({
          message: 'Rent payment successful!',
          type: 'success',
          floating: true,
        });
        // Refresh rent details and check for completed payment
        await fetchPendingRent();
        props.navigation.navigate('PayTab', { screen: 'History' });
      } else {
        showMessage({
          message: validationRes.message || 'Payment validation failed',
          type: 'danger',
          floating: true,
        });
      }
    } catch (error) {
      console.error('Pay rent error:', error);
      showMessage({
        message: error.message || 'Unable to complete payment',
        type: 'danger',
        floating: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={PaymentStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}
        edges={['top']}>
        <View style={PaymentStyle.headerContainerBlue}>
          <TouchableOpacity onPress={() => gotoBack()}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, flex: 1, justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}>
        {rentDetails ? (
          <View style={[PaymentStyle.payContainer]}>
            <Image source={IMAGES.bed} style={[PaymentStyle.pgImg]} />
            <Text style={[PaymentStyle.propName]}>
              {rentDetails.propertyName || 'Property Name'}
            </Text>
            <View style={[PaymentStyle.checkDate]}>
              <Text style={[PaymentStyle.checkIn]}>{'Check in Date - '}</Text>
              <Text style={[PaymentStyle.checkIn]}>
                {rentDetails.moveInDate
                  ? moment(rentDetails.moveInDate).format('DD/MM/YYYY')
                  : '00/00/0000'}
              </Text>
            </View>
            <View>
              <Text style={[PaymentStyle.reviewText]}>{'Drop a review'}</Text>
              <View style={[PaymentStyle.rateImg]}>
                {Array.from({ length: 5 }, (_, index) => (
                  <TouchableOpacity
                    key={'rate' + index}
                    onPress={() => handleRating(index + 1)}>
                    <Icons
                      iconSetName={'Ionicons'}
                      iconName={index < rating ? 'star' : 'star-outline'}
                      iconColor={Colors.rating}
                      iconSize={18}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={PaymentStyle.textarea}
                multiline={true}
                numberOfLines={4}
                placeholder="Type something here..."
                value={reason}
                onChangeText={text => setReason(text)}
                maxLength={200}
              />
              <Text style={[PaymentStyle.textCount]}>{`${reason.length}/200`}</Text>
              <TouchableOpacity onPress={() => gotoHistory()} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                <Text style={[PaymentStyle.historyText]}>
                  {'Payment History'}
                </Text>
                <View style={[PaymentStyle.arrowIcon]}>
                  <Icons
                    iconSetName={'MaterialIcons'}
                    iconName={'arrow-forward-ios'}
                    iconColor={Colors.black}
                    iconSize={16}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <EmptyState
              image={IMAGES.noPaymentHistory}
              title="No pay rent request found"
              description=""
              containerStyle={{ paddingTop: 50 }}
            />
          </View>
        )}
        {rentDetails && <Button
          btnName={
            loading
              ? 'Loading...'
              : processing
                ? 'Processing...'
                : isCompleted
                  ? 'Completed'
                  : rentDetails?.amount
                    ? `Pay ${formatCurrency(rentDetails.amount)}`
                    : 'Pay Rent'
          }
          btnStyle={[PaymentStyle.btnRadius, { marginBottom: 20 }]}
          bgColor={isCompleted ? Colors.green : undefined}
          disabled={loading || processing || !rentDetails || isCompleted}
          onPress={handlePayRent}
        />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PayRentScreen;

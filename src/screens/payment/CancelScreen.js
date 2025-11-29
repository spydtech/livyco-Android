import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import { Button, Icons } from '../../components';
import IMAGES from '../../assets/Images';
import FontFamily from '../../assets/FontFamily';
import { CommonActions } from '@react-navigation/native';
import { cancelBooking } from '../../services/bookingService';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';

const CancelScreen = props => {
  const bookingData = props.route?.params?.bookingData || {};
  const booking = bookingData?.booking || bookingData;

  // Extract booking details
  const bookingId = booking?.id || booking?._id || bookingData?.bookingId;
  const propertyName =
    booking?.propertyName ||
    booking?.property?.name ||
    bookingData?.propertyName ||
    'Property Name';
  // Handle image - can be string URL or object with url property
  const propertyImageRaw =
    booking?.property?.images?.[0] || bookingData?.propertyImage || null;
  const propertyImage =
    typeof propertyImageRaw === 'string'
      ? propertyImageRaw
      : propertyImageRaw?.url || null;
  const moveInDate = booking?.moveInDate || bookingData?.moveInDate || null;
  const amountPaid =
    booking?.totalAmount ||
    booking?.pricing?.totalAmount ||
    bookingData?.totalAmount ||
    bookingData?.amountPaid ||
    0;

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const resetToHome = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Tab',
            params: {
              screen: 'HomeTab',
            },
          },
        ],
      }),
    );
  };

  const gotoBack = () => {
    // From cancel booking screen, always go directly to Home and clear history
    resetToHome();
  };

  const formatDate = dateString => {
    if (!dateString) return '00/00/0000';
    try {
      const date = moment(dateString);
      if (date.isValid()) {
        return date.format('DD/MM/YYYY');
      }
      return '00/00/0000';
    } catch (error) {
      return '00/00/0000';
    }
  };

  const formatCurrency = amount => {
    return parseFloat(amount || 0).toFixed(2);
  };

  const handleCancelBooking = async () => {
    if (!termsAccepted) {
      showMessage({
        message: 'Please accept the terms and conditions to proceed',
        type: 'warning',
        floating: true,
      });
      return;
    }

    if (!bookingId) {
      showMessage({
        message: 'Booking information is missing',
        type: 'danger',
        floating: true,
      });
      return;
    }

    setCancelling(true);

    try {
      const response = await cancelBooking(bookingId);

      if (response.success) {
        showMessage({
          message: 'Booking cancelled successfully',
          type: 'success',
          floating: true,
        });

        // After successful cancellation, take user to Mystays tab and clear stack
        setTimeout(() => {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Tab',
                  params: {
                    screen: 'MystaysTab',
                  },
                },
              ],
            }),
          );
        }, 1500);
      } else {
        showMessage({
          message: response.message || 'Failed to cancel booking',
          type: 'danger',
          floating: true,
        });
        setCancelling(false);
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      showMessage({
        message: error.message || 'An error occurred while cancelling booking',
        type: 'danger',
        floating: true,
      });
      setCancelling(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={PaymentStyle.headerContainerBlue}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={gotoBack}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              {/* Property Image */}
              {propertyImage ? (
                <Image
                  source={{uri: propertyImage}}
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={IMAGES.bed || IMAGES.defaultProperty}
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
              )}

              {/* Property Name */}
              <Text style={styles.propertyName}>{propertyName}</Text>

              {/* Check in Date */}
              <View style={styles.rowContainer}>
                <Text style={styles.checkInLabel}>{'Check in Date - '}</Text>
                <Text style={styles.checkInValue}>
                  {formatDate(moveInDate)}
                </Text>
              </View>

              {/* Amount Paid */}
              <View style={styles.rowContainer}>
                <Text style={styles.amountLabel}>{'Amount Paid'}</Text>
                <Text style={styles.amountValue}>
                  ₹{formatCurrency(amountPaid)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section with Terms and Cancel Button */}
        <View style={styles.bottomContainer}>
          <View style={styles.termsContainer}>
            <TouchableOpacity
              onPress={() => setTermsAccepted(!termsAccepted)}
              style={styles.checkboxContainer}
            >
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={termsAccepted ? 'check-circle' : 'circle'}
                iconColor={termsAccepted ? Colors.secondary : Colors.grayBorder}
                iconSize={20}
              />
            </TouchableOpacity>
            <Text style={styles.termsText}>
              {
                'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. T&C'
              }
            </Text>
          </View>
          <Button
            btnTextColor={Colors.secondary}
            btnStyle={styles.cancelButton}
            btnName={cancelling ? 'Cancelling...' : 'Cancel booking'}
            onPress={handleCancelBooking}
            disabled={cancelling}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.goastWhite || Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingVertical15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    ...LayoutStyle.paddingHorizontal20,
    ...LayoutStyle.paddingTop20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    ...LayoutStyle.padding15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  propertyName: {
    fontFamily: FontFamily.RobotoBold,
    ...LayoutStyle.fontSize16,
    color: Colors.blackText,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkInLabel: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
  },
  checkInValue: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize14,
    color: Colors.blackText,
  },
  amountLabel: {
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize16,
    color: Colors.blackText,
  },
  amountValue: {
    fontFamily: FontFamily.RobotoMedium,
    ...LayoutStyle.fontSize16,
    color: Colors.blackText,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    // borderTopWidth: 1,
    // borderTopColor: Colors.grayBorder || '#E0E0E0',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkboxContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    fontFamily: FontFamily.RobotoRegular,
    ...LayoutStyle.fontSize10,
    color: Colors.blackText,
    flex: 1,
    lineHeight: 14,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
    paddingVertical: 12,
  },
});

export default CancelScreen;

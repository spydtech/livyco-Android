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
  Modal,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import { Button, Icons } from '../../components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import LayoutStyle from '../../styles/LayoutStyle';
import CommonStyles from '../../styles/CommonStyles';
import { CommonActions } from '@react-navigation/native';
import {
  getBookingPaymentHistory,
  requestVacateRoom,
} from '../../services/vacateService';
import {showMessage} from 'react-native-flash-message';

const VacateRoomScreen = props => {
  const stayData = props?.route?.params?.stayData || {};
  const bookingId = useMemo(
    () => stayData?._id || stayData?.id || stayData?.bookingId || null,
    [stayData],
  );

  const [moveDate, setMoveDate] = useState('DD/MM/YYYY');
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(4);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [duesVisible, setDuesVisible] = useState(false);

  const handleRating = selectedRating => {
    setRating(selectedRating);
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleMovingDate = selectedDate => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('DD/MM/YYYY');
      setMoveDate(formattedDate);
    }
    setOpen(false);
  };

  const toggleTerms = () => {
    setIsTermsAccepted(prev => !prev);
  };

  const handleVacatePress = () => {
    if (!isButtonEnabled) {
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirmNo = () => {
    setConfirmVisible(false);
  };

  const handleConfirmYes = async () => {
    setConfirmVisible(false);

    if (!bookingId) {
      showMessage({
        message: 'Booking information is missing',
        type: 'danger',
        floating: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const historyResponse = await getBookingPaymentHistory(bookingId);
      
      if (!historyResponse.success) {
        showMessage({
          message: historyResponse.message || 'Failed to check payment history',
          type: 'danger',
          floating: true,
        });
        setIsSubmitting(false);
        return;
      }

      const outstandingAmount =
        historyResponse?.data?.outstandingAmount ??
        historyResponse?.data?.data?.outstandingAmount ??
        0;

      if (Number(outstandingAmount) > 0) {
        setDuesVisible(true);
        setIsSubmitting(false);
        return;
      }

      const vacateDate =
        moveDate && moveDate !== 'DD/MM/YYYY'
          ? moment(moveDate, 'DD/MM/YYYY').toISOString()
          : new Date().toISOString();

      const vacateResponse = await requestVacateRoom(bookingId, {
        vacateDate,
        reason,
        feedback,
        rating,
      });

      if (vacateResponse.success) {
        showMessage({
          message: vacateResponse.message || 'Vacate request submitted successfully',
          type: 'success',
          floating: true,
        });
        // Navigate to success screen after a short delay
        setTimeout(() => {
          props.navigation.navigate('VacateSuccess', {
            requestId: vacateResponse.requestId,
            bookingId: bookingId,
            vacateData: vacateResponse.data,
          });
        }, 500);
      } else {
        showMessage({
          message: vacateResponse.message || 'Failed to submit vacate request. Please try again.',
          type: 'danger',
          floating: true,
        });
      }
    } catch (error) {
      console.error('Vacate room flow error:', error);
      showMessage({
        message: error.message || 'An unexpected error occurred. Please try again.',
        type: 'danger',
        floating: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConfirmModal = () => {
    return (
      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={handleConfirmNo}>
        <View style={HomeStyle.modalOverlayCenter}>
          <View style={HomeStyle.confirmCard}>
            <Text style={HomeStyle.confirmTitle}>
              {'Are you sure you want to vacate?'}
            </Text>
            <View style={HomeStyle.confirmActionsRow}>
              <TouchableOpacity
                style={[HomeStyle.confirmBtn, HomeStyle.confirmYesBtn]}
                onPress={handleConfirmYes}
                disabled={isSubmitting}>
                <Icons
                  iconName={'check'}
                  iconSetName={'MaterialCommunityIcons'}
                  iconColor={Colors.white}
                  iconSize={20}
                />
                <Text style={HomeStyle.confirmYesText}>{'Yes'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[HomeStyle.confirmBtn, HomeStyle.confirmYesBtn]}
                onPress={handleConfirmNo}
                disabled={isSubmitting}>
                  <Icons
                  iconName={'close'}
                  iconSetName={'MaterialCommunityIcons'}
                  iconColor={Colors.white}
                  iconSize={20}
                />
                <Text style={HomeStyle.confirmYesText}>{'No'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderDuesModal = () => {
    return (
      <Modal
        transparent
        visible={duesVisible}
        animationType="fade"
        onRequestClose={() => setDuesVisible(false)}>
        <View style={HomeStyle.modalOverlayCenter}>
          <View style={HomeStyle.duesCard}>
            <View style={HomeStyle.duesIconWrapper}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'warning-outline'}
                iconColor={Colors.danger || Colors.secondary}
                iconSize={40}
              />
            </View>
            <Text style={HomeStyle.duesText}>
              {
                'Room vacate option is disabled due to outstanding dues. Please clear your dues to proceed.'
              }
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  const isDateSelected = moveDate && moveDate !== 'DD/MM/YYYY';
  const isButtonEnabled = isTermsAccepted && isDateSelected && !isSubmitting;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[HomeStyle.homeContainer, { flex: 1, backgroundColor: Colors.white }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
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
            <Text style={[HomeStyle.pageHeader]}>{'Vacate room'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={{ backgroundColor: Colors.white }}>
        <View style={[HomeStyle.vacateRoomContainer]}>
          <View
            style={[
              HomeStyle.dateContainer,
              { flexDirection: 'row', alignItems: 'center' },
            ]}>
            <Text style={[HomeStyle.dateText]}>{'Vacating Date *'}</Text>
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
              onConfirm={selectedDate => {
                handleMovingDate(selectedDate);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </TouchableOpacity>
          <View style={{ ...LayoutStyle.paddingTop20 }}>
            <Text style={[HomeStyle.dateText]}>{'Reason for vacating'}</Text>
            <TextInput
              style={HomeStyle.textarea}
              multiline={true}
              numberOfLines={4}
              placeholder="Type something here..."
              value={reason}
              onChangeText={text => setReason(text)}
            />
          </View>
          <View style={{ ...LayoutStyle.paddingTop20 }}>
            <Text style={[HomeStyle.dateText]}>
              {'Please drop your valuable feedback'}
            </Text>
            <View style={[HomeStyle.rateImg, { ...LayoutStyle.marginTop5 }]}>
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
              style={HomeStyle.textarea}
              multiline={true}
              numberOfLines={4}
              placeholder="Type something here..."
              value={feedback}
              onChangeText={text => setFeedback(text)}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[HomeStyle.vacateBtnBottom, { paddingHorizontal: 20 }]}>
        <TouchableOpacity
          style={{ ...CommonStyles.directionRowSB }}
          onPress={toggleTerms}>
          <Icons
            iconSetName={'Ionicons'}
            iconName={
              isTermsAccepted
                ? 'radio-button-on-outline'
                : 'radio-button-off-outline'
            }
            iconColor={isTermsAccepted ? Colors.secondary : Colors.gray}
            iconSize={22}
          />
          <Text style={[HomeStyle.textRadioBtn]}>
            {
              'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a.'
            }
          </Text>
        </TouchableOpacity>
        <View style={{ ...LayoutStyle.marginTop20 }}>
          <View
            style={{
              opacity: isButtonEnabled ? 1 : 0.6,
            }}>
            <Button
              btnName={'Vacate Room'}
              onPress={handleVacatePress}
              bgColor={Colors.paleYellow}
              btnTextColor={Colors.blackText}
            />
          </View>
        </View>
      </View>
      {renderConfirmModal()}
      {renderDuesModal()}
    </KeyboardAvoidingView>
  );
};

export default VacateRoomScreen;

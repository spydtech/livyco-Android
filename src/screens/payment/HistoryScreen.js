import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  // SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import {Icons, EmptyState} from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import IMAGES from '../../assets/Images';
import {CommonActions} from '@react-navigation/native';
import {getUserPayments} from '../../services/paymentService';
import moment from 'moment';
import LayoutStyle from '../../styles/LayoutStyle';

const HistoryScreen = props => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getUserPayments();
      console.log("Response", response);
      
      if (response.success && response.data) {
        setPayments(response.data);
      } else {
        console.log('Failed to fetch payments:', response.message);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const gotoPayDetails = (payment) => {
    props.navigation.navigate('HistoryDetail', {payment});
  };

  // Get initials from property name
  const getInitials = (name) => {
    if (!name || name === 'N/A') return 'NA';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format amount
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '0000.00';
    return parseFloat(amount).toFixed(2);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'DD/MM/YYYY';
    return moment(date).format('DD/MM/YYYY');
  };

  const renderHistoryList = ({item: payment}) => {
    const propertyName = payment.propertyName || 'N/A';
    const initials = getInitials(propertyName);
    const amount = formatAmount(payment.amount);
    const date = formatDate(payment.date);

    return (
      <View style={[PaymentStyle.historyList, PaymentStyle.historyCard]}>
        <View style={[PaymentStyle.mainPayContainer, PaymentStyle.cardPadding]}>
          <View style={[PaymentStyle.listContainer]}>
            <View style={[PaymentStyle.alphabateContainer]}>
              <Text style={[PaymentStyle.alphabateText]}>{initials}</Text>
            </View>
            <View style={[PaymentStyle.paymentSender]}>
              <Text style={[PaymentStyle.paidToText]}>{'Paid to'}</Text>
              <Text style={[PaymentStyle.senderName]} numberOfLines={1}>
                {propertyName}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => gotoPayDetails(payment)}>
            <View style={[PaymentStyle.payArrow]}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-top-right'}
                iconColor={Colors.green}
                iconSize={20}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[PaymentStyle.dateAmount]}>
          <Text style={[PaymentStyle.amountText]}>{amount}</Text>
          <Text style={[PaymentStyle.dateText]}>{date}</Text>
        </View>
      </View>
    );
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={PaymentStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }} edges={['top']}>
        <View style={PaymentStyle.headerContainerBlue}>
          <View style={CommonStyles.directionRowSB}>
            <View style={CommonStyles.directionRowCenter}>
              <TouchableOpacity onPress={() => gotoBack()}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'arrow-left'}
                  iconColor={Colors.white}
                  iconSize={26}
                />
              </TouchableOpacity>
              <Text style={[PaymentStyle.titleText]}>{'History'}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={PaymentStyle.scrollContent}>
        <View style={[PaymentStyle.payContainer]}>
          {loading ? (
            <View style={PaymentStyle.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
          ) : payments.length === 0 ? (
            <EmptyState
              image={IMAGES.noPaymentHistory}
              title="No payment history found"
              description="Your payment history will appear here once you make a payment"
              containerStyle={PaymentStyle.emptyContainer}
            />
          ) : (
            <FlatList
              data={payments}
              renderItem={renderHistoryList}
              scrollEnabled={false}
              keyExtractor={(item, index) =>
                item.transactionId || item.bookingId || `payment-${index}`
              }
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HistoryScreen;

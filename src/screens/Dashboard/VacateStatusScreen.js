import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  // SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import FontFamily from '../../assets/FontFamily';
import {Icons} from '../../components';
import MystaysStyle from '../../styles/MystaysStyle';
import {CommonActions} from '@react-navigation/native';
import {getVacateStatus} from '../../services/vacateService';
import moment from 'moment';

const VacateStatusScreen = props => {
  const bookingId = props.route?.params?.bookingId;
  const requestId = props.route?.params?.requestId;
  const initialVacateData = props.route?.params?.vacateData;

  const [vacateRequest, setVacateRequest] = useState(initialVacateData || null);
  const [loading, setLoading] = useState(!initialVacateData);
  const [timelineData, setTimelineData] = useState([]);
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    if (bookingId && !initialVacateData) {
      fetchVacateStatus();
    } else if (initialVacateData) {
      buildTimeline(initialVacateData);
      setRefundAmount(initialVacateData?.refundAmount || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (vacateRequest) {
      buildTimeline(vacateRequest);
      setRefundAmount(vacateRequest?.refundAmount || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vacateRequest]);

  const fetchVacateStatus = async () => {
    if (!bookingId) return;

    setLoading(true);
    try {
      const response = await getVacateStatus(bookingId);
      if (response.success && response.exists && response.request) {
        setVacateRequest(response.request);
      }
    } catch (error) {
      console.error('Error fetching vacate status:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTimeline = (vacateData) => {
    if (!vacateData) return;

    const timeline = [];

    // Step 1: Cancel / Vacate requested (always completed)
    timeline.push({
      id: '1',
      label: 'Cancel / Vacate requested',
      timestamp: vacateData.createdAt
        ? moment(vacateData.createdAt).format('DD/MM/YYYY HH:mm:ss')
        : '',
      status: 'completed',
    });

    // Step 2: Based on refund status
    if (vacateData.refundStatus === 'initiated' || vacateData.refundStatus === 'processed' || vacateData.refundStatus === 'completed') {
      timeline.push({
        id: '2',
        label: 'Refund Initiated',
        timestamp: vacateData.refundDate
          ? moment(vacateData.refundDate).format('DD/MM/YYYY HH:mm:ss')
          : '',
        status: 'completed',
      });
    } else if (vacateData.status === 'approved') {
      timeline.push({
        id: '2',
        label: 'Refund Initiated',
        timestamp: vacateData.approvedAt
          ? moment(vacateData.approvedAt).format('DD/MM/YYYY HH:mm:ss')
          : '',
        status: 'completed',
      });
    } else {
      timeline.push({
        id: '2',
        label: 'Refund Initiated',
        timestamp: '',
        status: 'pending',
      });
    }

    // Step 3: Refunded to Wallet
    if (vacateData.refundStatus === 'completed') {
      timeline.push({
        id: '3',
        label: 'Refunded to Wallet',
        timestamp: vacateData.refundDate
          ? moment(vacateData.refundDate).format('DD/MM/YYYY HH:mm:ss')
          : '',
        status: 'completed',
      });
    } else {
      timeline.push({
        id: '3',
        label: 'Refunded to Wallet',
        timestamp: '',
        status: 'pending',
      });
    }

    setTimelineData(timeline);
  };

  const gotoBack = () => {
    // Reset navigation stack and navigate directly to MyStay screen
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
  };

  const gotoWallet = () => {
    // // Navigate to wallet screen (you may need to adjust this based on your navigation structure)
    // props.navigation.navigate('Tab', {
    //   screen: 'ProfileTab',
    //   params: {
    //     screen: 'Wallet', // Adjust based on your actual wallet screen name
    //   },
    // });
  };

  const TimelineItem = ({item, isLast}) => {
    const isCompleted = item.status === 'completed';
    return (
      <View style={MystaysStyle.itemContainer}>
        <View style={MystaysStyle.iconColumn}>
          <View
            style={[
              MystaysStyle.circle,
              {backgroundColor: isCompleted ? '#4CAF50' : '#757575'},
            ]}
          />
          {!isLast && <View style={MystaysStyle.verticalLine} />}
        </View>
        <View style={MystaysStyle.textColumn}>
          <Text
            style={isCompleted ? MystaysStyle.labelBold : MystaysStyle.label}>
            {item.label}
          </Text>
          {item.timestamp ? (
            <Text style={MystaysStyle.timestamp}>{item.timestamp}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[HomeStyle.homeContainer, {flex: 1}]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }} edges={['top']}>
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
            <Text style={[MystaysStyle.pageHeader]}>{'Label'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        style={{flex: 1, backgroundColor: Colors.white}}
        contentContainerStyle={MystaysStyle.statusContainer}>
        {loading ? (
          <View style={MystaysStyle.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
          </View>
        ) : (
          <>
            {timelineData.length > 0 && (
              <>
                {timelineData.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isLast={index === timelineData.length - 1}
                  />
                ))}
              </>
            )}

            {/* Refund Summary Section */}
            <View
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                padding: 20,
                marginTop: 30,
                marginHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FontFamily.RobotoBold,
                  color: Colors.black,
                  marginBottom: 15,
                }}>
                {'Refund Summary'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FontFamily.RobotoRegular,
                    color: Colors.black,
                  }}>
                  {'Total expected refund'}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FontFamily.RobotoMedium,
                    color: Colors.black,
                  }}>
                  {`₹${(refundAmount || 0).toFixed(2)}`}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: FontFamily.RobotoRegular,
                  color: Colors.grayText,
                  marginTop: 5,
                }}>
                {`₹${(refundAmount || 0).toFixed(2)} will be credited to your wallet`}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.secondary,
          paddingVertical: 16,
          marginHorizontal: 20,
          marginBottom: 30,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => gotoWallet()}>
        <Text
          style={{
            color: Colors.white,
            fontSize: 16,
            fontFamily: FontFamily.RobotoMedium,
          }}>
          {'Go to Wallet'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default VacateStatusScreen;


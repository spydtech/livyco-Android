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
import {Icons} from '../../components';
import MystaysStyle from '../../styles/MystaysStyle';
import {CommonActions} from '@react-navigation/native';
import {getConcernById} from '../../services/concernService';
import moment from 'moment';

const ViewStatusScreen = props => {
  const concernId = props.route?.params?.concernId || props.route?.params?.concern?._id || props.route?.params?.concern?.id;
  const initialConcern = props.route?.params?.concern;
  
  const [concern, setConcern] = useState(initialConcern || null);
  const [loading, setLoading] = useState(!initialConcern);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    if (concernId && !initialConcern) {
      fetchConcernDetails();
    } else if (initialConcern) {
      buildTimeline(initialConcern);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concernId]);

  useEffect(() => {
    if (concern) {
      buildTimeline(concern);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concern]);

  const fetchConcernDetails = async () => {
    if (!concernId) return;
    
    setLoading(true);
    try {
      const response = await getConcernById(concernId);
      if (response.success && response.concern) {
        setConcern(response.concern);
      }
    } catch (error) {
      console.error('Error fetching concern details:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTimeline = (concernData) => {
    if (!concernData) return;

    const timeline = [];
    
    // Step 1: Request raised (always completed)
    timeline.push({
      id: '1',
      label: 'Request raised',
      timestamp: concernData.createdAt 
        ? moment(concernData.createdAt).format('DD/MM/YYYY HH:mm:ss')
        : '',
      status: 'completed',
    });

    // Step 2: Based on status
    if (concernData.status === 'approved' || concernData.status === 'completed') {
      timeline.push({
        id: '2',
        label: 'Request approved',
        timestamp: concernData.approvedAt 
          ? moment(concernData.approvedAt).format('DD/MM/YYYY HH:mm:ss')
          : '',
        status: 'completed',
      });
    } else if (concernData.status === 'rejected') {
      timeline.push({
        id: '2',
        label: 'Request rejected',
        timestamp: concernData.rejectedAt 
          ? moment(concernData.rejectedAt).format('DD/MM/YYYY HH:mm:ss')
          : '',
        status: 'completed',
      });
    } else {
      timeline.push({
        id: '2',
        label: 'Under review',
        timestamp: '',
        status: 'pending',
      });
    }

    // Step 3: Completion (only if completed)
    if (concernData.status === 'completed') {
      timeline.push({
        id: '3',
        label: 'Request completed',
        timestamp: concernData.completedAt 
          ? moment(concernData.completedAt).format('DD/MM/YYYY HH:mm:ss')
          : '',
        status: 'completed',
      });
    } else if (concernData.status === 'approved') {
      timeline.push({
        id: '3',
        label: 'Processing',
        timestamp: '',
        status: 'pending',
      });
    } else {
      timeline.push({
        id: '3',
        label: 'Label',
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
      style={[HomeStyle.homeContainer, {flex:1}]}>
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
            <Text style={[MystaysStyle.pageHeader]}>{'Change request'}</Text>
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
        ) : timelineData.length > 0 ? (
          timelineData.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              isLast={index === timelineData.length - 1}
            />
          ))
        ) : (
          <View style={MystaysStyle.emptyContainer}>
            <Text style={MystaysStyle.emptyText}>No timeline data available</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ViewStatusScreen;

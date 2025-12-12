import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  // SafeAreaView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import {CommonActions} from '@react-navigation/native';
import {getUserNotifications, markNotificationAsRead} from '../../services/notificationService';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet} from 'react-native';

const NotificationScreen = props => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getUserNotifications({limit: 50});
      console.log("Response: ", response);
      
      if (response.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      } else {
        console.error('Failed to fetch notifications:', response.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.isRead) {
      try {
        const response = await markNotificationAsRead(notification._id);
        console.log("Response: ", response);
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(item =>
            item._id === notification._id ? {...item, isRead: true} : item
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const getNotificationBackgroundColor = (type) => {
    if (type?.includes('success') || type?.includes('approved') || type?.includes('refund')) {
      return Colors.greenLight || '#E7F8F0'; // Light green
    } else if (type?.includes('failed') || type?.includes('rejected') || type?.includes('cancelled')) {
      return '#FFE5E5'; // Light red/pink
    } else {
      return Colors.goastWhite || '#F8F8FF'; // Light blue/off-white
    }
  };

  const getNotificationIcon = (type) => {
    if (!type) {
      return { iconSetName: 'Ionicons', iconName: 'notifications-outline', iconColor: Colors.secondary };
    }

    const typeLower = type.toLowerCase();

    // Booking related notifications
    if (typeLower.includes('booking_created') || typeLower.includes('booking_submitted')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'book-plus', iconColor: Colors.blue };
    }
    if (typeLower.includes('booking_approved')) {
      return { iconSetName: 'Ionicons', iconName: 'checkmark-circle', iconColor: Colors.green };
    }
    if (typeLower.includes('booking_rejected') || typeLower.includes('booking_declined')) {
      return { iconSetName: 'Ionicons', iconName: 'close-circle', iconColor: Colors.red };
    }
    if (typeLower.includes('booking_cancelled')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'cancel', iconColor: Colors.orange };
    }
    if (typeLower.includes('booking_paid') || typeLower.includes('booking_confirmed')) {
      return { iconSetName: 'Ionicons', iconName: 'checkmark-done-circle', iconColor: Colors.green };
    }

    // Payment related notifications
    if (typeLower.includes('payment_received') || typeLower.includes('payment_successful')) {
      return { iconSetName: 'Ionicons', iconName: 'wallet', iconColor: Colors.green };
    }
    if (typeLower.includes('payment_failed')) {
      return { iconSetName: 'Ionicons', iconName: 'close-circle', iconColor: Colors.red };
    }
    if (typeLower.includes('payment_refunded')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'cash-refund', iconColor: Colors.blue };
    }

    // Property related notifications
    if (typeLower.includes('property_submitted')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'home-plus', iconColor: Colors.blue };
    }
    if (typeLower.includes('property_approved')) {
      return { iconSetName: 'Ionicons', iconName: 'checkmark-circle', iconColor: Colors.green };
    }
    if (typeLower.includes('property_rejected')) {
      return { iconSetName: 'Ionicons', iconName: 'close-circle', iconColor: Colors.red };
    }
    if (typeLower.includes('property_deleted')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'delete', iconColor: Colors.red };
    }
    if (typeLower.includes('property_updated') || typeLower.includes('property_revision')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'home-edit', iconColor: Colors.orange };
    }

    // Chat related notifications
    if (typeLower.includes('chat_message_received') || typeLower.includes('chat_message') || typeLower.includes('message_received')) {
      return { iconSetName: 'Ionicons', iconName: 'chatbubble-ellipses', iconColor: Colors.blue };
    }
    if (typeLower.includes('chat') || typeLower.includes('message')) {
      return { iconSetName: 'Ionicons', iconName: 'chatbubbles', iconColor: Colors.secondary };
    }

    // Food/Menu related notifications
    if (typeLower.includes('food_item_added') || typeLower.includes('food_added') || typeLower.includes('menu_item_added')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'food', iconColor: Colors.orange };
    }
    if (typeLower.includes('food') || typeLower.includes('menu')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'silverware-fork-knife', iconColor: Colors.orange };
    }

    // Other notification types
    if (typeLower.includes('tenant_added')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'account-plus', iconColor: Colors.blue };
    }
    if (typeLower.includes('system_alert')) {
      return { iconSetName: 'Ionicons', iconName: 'warning', iconColor: Colors.orange };
    }
    if (typeLower.includes('reminder')) {
      return { iconSetName: 'Ionicons', iconName: 'time-outline', iconColor: Colors.secondary };
    }
    if (typeLower.includes('concern') || typeLower.includes('ticket')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'ticket', iconColor: Colors.orange };
    }
    if (typeLower.includes('vacate') || typeLower.includes('vacation')) {
      return { iconSetName: 'MaterialCommunityIcons', iconName: 'home-export', iconColor: Colors.blue };
    }
    if (typeLower.includes('review') || typeLower.includes('rating')) {
      return { iconSetName: 'Ionicons', iconName: 'star', iconColor: Colors.rating };
    }

    // Default icon
    return { iconSetName: 'Ionicons', iconName: 'notifications', iconColor: Colors.secondary };
  };

  const renderNotificationItem = ({item, index}) => {
    const backgroundColor = getNotificationBackgroundColor(item.type);
    const iconConfig = getNotificationIcon(item.type);
    
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        style={[
          styles.notificationCard,
          {backgroundColor: backgroundColor},
          index === 0 && styles.firstCard,
        ]}>
        <View style={styles.notificationContent}>
          <View style={styles.iconContainer}>
            <Icons
              iconSetName={iconConfig.iconSetName}
              iconName={iconConfig.iconName}
              iconColor={iconConfig.iconColor}
              iconSize={24}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notificationText}>
              {item.message || item.title || 'Notification'}
            </Text>
            {item.createdAt && (
              <Text style={styles.notificationTime}>
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            )}
          </View>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
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
            <TouchableOpacity onPress={gotoBack}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={HomeStyle.headerTitle}>Notification</Text>
          </View>
          <View style={{width: 26}} />
        </View>
      </SafeAreaView>
      <ImageBackground
        source={IMAGES.primaryBG}
        style={[HomeStyle.formContainer, { flex: 1 }]}
        resizeMode="cover">
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={[HomeStyle.reviewText, {marginTop: 10}]}>
              Loading notifications...
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'notifications-outline'}
              iconColor={Colors.gray}
              iconSize={60}
            />
            <Text style={[HomeStyle.screenTitle, {marginTop: 20, textAlign: 'center'}]}>
              No notifications
            </Text>
            <Text style={[HomeStyle.pgDesc, {textAlign: 'center', marginTop: 10}]}>
              You don't have any notifications yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item, index) => item._id?.toString() || index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            style={styles.flatListStyle}
          />
        )}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    minHeight: 60,
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  firstCard: {
    marginTop: 20,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  notificationText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.blackText,
    lineHeight: 20,
    flexShrink: 1,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: Colors.grayText,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    marginLeft: 8,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 120,
    paddingTop: 10,
    flexGrow: 1,
  },
  flatListStyle: {
    flex: 1,
    width: '100%',
  },
});

export default NotificationScreen;


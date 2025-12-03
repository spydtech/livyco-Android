import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from 'react-native';
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
        await markNotificationAsRead(notification._id);
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

  const renderNotificationItem = ({item, index}) => {
    const backgroundColor = getNotificationBackgroundColor(item.type);
    
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        style={[
          styles.notificationCard,
          {backgroundColor: backgroundColor},
          index === 0 && styles.firstCard,
        ]}>
        <Text style={styles.notificationText}>{item.message || item.title || 'Notification'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
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
        style={[HomeStyle.formContainer]}
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
  },
  firstCard: {
    marginTop: 20,
  },
  notificationText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.blackText,
    lineHeight: 20,
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
    paddingBottom: 40,
  },
});

export default NotificationScreen;


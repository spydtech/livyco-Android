import {View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import ChatStyle from '../../styles/ChatStyle';
import FastImage from 'react-native-fast-image';
import {Icons} from '../../components';
import Colors from '../../styles/Colors';
import LayoutStyle from '../../styles/LayoutStyle';
import {useNavigation} from '@react-navigation/native';
import {getConversations} from '../../services/chatService';
import socketService from '../../services/socketService';
import {getUserToken} from '../../utils/Api';
import {getUserIdFromToken} from '../../utils/jwtUtils';
import moment from 'moment';

const ChatListScreen = props => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Initialize socket and fetch conversations
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await getUserToken();
        if (token) {
          const userId = getUserIdFromToken(token);
          setCurrentUserId(userId);
          
          // Connect socket
          await socketService.connect(userId);
        }
      } catch (error) {
        console.error('Error initializing chat list:', error);
      }
      
      fetchConversations();
    };

    initialize();
  }, []);

  // Listen for new messages to update conversation list
  useEffect(() => {
    const unsubscribe = socketService.on('newMessage', (newMessage) => {
      // Refresh conversations when a new message is received
      if (newMessage) {
        fetchConversations();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      
      if (response.success && response.data) {
        setChatList(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'DD/MM/YYY';
    const date = moment(dateString);
    const now = moment();
    
    if (date.isSame(now, 'day')) {
      return date.format('HH:mm');
    } else if (date.isSame(now, 'year')) {
      return date.format('DD/MM');
    } else {
      return date.format('DD/MM/YYY');
    }
  };

  const gotoMessageScreen = (conversation) => {
    const recipientId = conversation.user?._id || conversation._id;
    const propertyId = conversation.property?._id || conversation.property;
    const recipientName = conversation.user?.name || 'Owner Name';
    const recipientImage = conversation.user?.profileImage;
    const recipientTag = conversation.property?.name || 'Tag';
    
    navigation.navigate('MessageList', {
      recipientId,
      propertyId,
      recipientName,
      recipientImage,
      recipientTag,
    });
  };
  const renderChatList = ({item}) => {
    const recipientId = item.user?._id || item._id;
    const isCurrentUserSender = item.lastMessage?.sender?._id === currentUserId || 
                                String(item.lastMessage?.sender?._id) === String(currentUserId) ||
                                String(item.lastMessage?.sender) === String(currentUserId);
    
    const getStatusIndicator = () => {
      const isOnline = item.user?.online;
      if (isOnline) {
        return <View style={[ChatStyle.profileRound]}></View>;
      }
      return null;
    };

    const getMessageStatusIcon = () => {
      if (!isCurrentUserSender) return null;
      
      const isRead = item.lastMessage?.read;
      if (isRead) {
        return (
          <Icons
            iconName={'checkmark-done-outline'}
            iconSetName={'Ionicons'}
            iconColor={Colors.green}
            iconSize={20}
          />
        );
      } else {
        return (
          <Icons
            iconName={'checkmark-outline'}
            iconSetName={'Ionicons'}
            iconColor={Colors.gray}
            iconSize={20}
          />
        );
      }
    };

    const getUnreadCount = () => {
      // Count unread messages for this conversation
      // This would ideally come from the API, but for now we'll use a simple check
      if (!isCurrentUserSender && !item.lastMessage?.read) {
        return 1; // Show badge if last message is unread and not from current user
      }
      return 0;
    };

    const unreadCount = getUnreadCount();
    const lastMessage = item.lastMessage?.content || 'No messages yet';
    const lastMessageDate = item.lastMessage?.createdAt || item.lastMessage?.timestamp;

    return (
      <TouchableOpacity
        style={[ChatStyle.chatListContainer]}
        onPress={() => gotoMessageScreen(item)}>
        <View style={[ChatStyle.chatContainer]}>
              <FastImage
                style={ChatStyle.profileImg}
                source={
                  item.user?.profileImage
                    ? {
                        uri: item.user.profileImage,
                        priority: FastImage.priority.normal,
                      }
                    : {
                        uri: 'https://cdn.pixabay.com/photo/2021/02/22/16/34/portrait-6040876_1280.jpg',
                        priority: FastImage.priority.normal,
                      }
                }
                resizeMode={FastImage.resizeMode.cover}
              />
              {getStatusIndicator()}

            <View style={{marginLeft: 10, flex: 1, justifyContent: "center"}}>
              <Text style={[ChatStyle.ownerName]}>
                {item.user?.name || 'Owner Name'}
              </Text>
              <Text 
                style={[ChatStyle.msgText]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {lastMessage}
              </Text>
            </View>

          <View style={[ChatStyle.chatEndDate, {justifyContent: "center"}]}>
            <Text style={[ChatStyle.dateText]}>
              {formatDate(lastMessageDate)}
            </Text>
            {unreadCount > 0 ? (
              <View style={ChatStyle.unreadBadge}>
                <Text style={ChatStyle.unreadBadgeText}>{unreadCount}</Text>
              </View>
            ) : (
              getMessageStatusIcon()
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  if (loading && chatList.length === 0) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.white, width: "100%"}}>
      <FlatList
        data={chatList}
        renderItem={renderChatList}
        contentContainerStyle={{width: "100%"}}
        scrollEnabled={true}
        keyExtractor={(item, index) => {
          const id = item.user?._id || item._id || `chat-${index}`;
          return String(id);
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.secondary]}
            tintColor={Colors.secondary}
          />
        }
        ListEmptyComponent={
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
            <Text style={{color: Colors.grayText, ...LayoutStyle.fontSize12}}>
              No conversations yet. Start chatting!
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ChatListScreen;

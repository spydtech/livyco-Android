import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Icons } from '../../components';
import FastImage from 'react-native-fast-image';
import Colors from '../../styles/Colors';
import ChatStyle from '../../styles/ChatStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import { CommonActions } from '@react-navigation/native';
import socketService from '../../services/socketService';
import { getMessages, sendMessage } from '../../services/chatService';
import { getUserToken } from '../../utils/Api';
import { getUserIdFromToken } from '../../utils/jwtUtils';
import moment from 'moment';

const MessageListScreen = props => {
  // Get params from navigation
  const recipientId = props.route?.params?.recipientId;
  const propertyId = props.route?.params?.propertyId;
  const recipientName = props.route?.params?.recipientName || 'Owner Name';
  const recipientImage = props.route?.params?.recipientImage;
  const recipientTag = props.route?.params?.recipientTag || 'Tag';
  
  // State to check if user is checked out
  const [isCheckedOut, setIsCheckedOut] = useState(
    props.route?.params?.isCheckedOut || false
  );
  const [checkoutDate, setCheckoutDate] = useState(
    props.route?.params?.checkoutDate || 'DD/MM/YYYY'
  );
  const [hostelName, setHostelName] = useState(
    props.route?.params?.hostelName || 'ABC Hostel'
  );
  
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const flatListRef = useRef(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = moment(dateString);
    return date.format('DD/MM/YYYY');
  };

  // Check if date should be shown
  const shouldShowDate = (currentDate, previousDate) => {
    if (!previousDate) return true;
    return formatDate(currentDate) !== formatDate(previousDate);
  };

  // Initialize user ID and socket connection
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = await getUserToken();
        if (token) {
          const userId = getUserIdFromToken(token);
          setCurrentUserId(userId);
          
          // Connect socket
          await socketService.connect(userId);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      // Don't disconnect socket here as it might be used by other screens
      // socketService.disconnect();
    };
  }, []);

  // Fetch messages on mount and when recipient/property changes
  useEffect(() => {
    if (recipientId && propertyId) {
      fetchMessages();
    }
  }, [recipientId, propertyId]);

  // Listen for new messages via socket
  useEffect(() => {
    const unsubscribe = socketService.on('newMessage', (newMessage) => {
      // Only add message if it's for this conversation
      if (
        newMessage &&
        ((newMessage.sender?._id === recipientId || newMessage.sender === recipientId) ||
         (newMessage.recipient?._id === recipientId || newMessage.recipient === recipientId)) &&
        (newMessage.property?._id === propertyId || newMessage.property === propertyId)
      ) {
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => 
            msg._id === newMessage._id || 
            (msg.content === newMessage.content && 
             Math.abs(new Date(msg.createdAt || msg.timestamp) - new Date(newMessage.createdAt || newMessage.timestamp)) < 1000)
          );
          if (exists) return prev;
          return [...prev, newMessage];
        });
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [recipientId, propertyId]);

  // Fetch messages from API
  const fetchMessages = async () => {
    if (!recipientId || !propertyId) return;

    try {
      setLoading(true);
      const response = await getMessages(recipientId, propertyId);
      
      if (response.success && response.data) {
        setMessages(response.data);
        
        // Scroll to bottom after messages load
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !recipientId || !propertyId || sending) return;

    const content = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const response = await sendMessage(recipientId, propertyId, content);
      
      if (response.success && response.data) {
        // Add message to local state immediately for better UX
        setMessages(prev => {
          const exists = prev.some(msg => msg._id === response.data._id);
          if (exists) return prev;
          return [...prev, response.data];
        });
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        // Restore message text on error
        setMessageText(content);
        console.error('Failed to send message:', response.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageText(content);
    } finally {
      setSending(false);
    }
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const renderChatItem = useCallback(({ item, index }) => {
    const prevItem = index > 0 ? messages[index - 1] : null;
    const showDate = shouldShowDate(
      item.createdAt || item.timestamp,
      prevItem?.createdAt || prevItem?.timestamp
    );
console.log("item", item, currentUserId);

    // Determine if message is from current user
    // Compare sender ID with current user ID
    const senderId = item.sender?._id || item.sender || item.senderId;
    
    // Message is from current user if sender matches current user ID
    const isCurrentUser = 
      senderId && 
      currentUserId && 
      senderId == currentUserId ;

    return (
      <View>
        {showDate && (
          <View style={[ChatStyle.chatDateContainer]}>
            <Text style={[ChatStyle.chatdateCenter]}>
              {formatDate(item.createdAt || item.timestamp)}
            </Text>
          </View>
        )}
        <View
          style={[
            isCurrentUser
              ? ChatStyle.messageSenderView
              : ChatStyle.messageReceiverView,
          ]}>
          <Text
            style={[
              isCurrentUser
                ? ChatStyle.messageSenderText
                : ChatStyle.messageReceiverText,
            ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  }, [messages, currentUserId]);

  return (
    <View style={[ChatStyle.homeContainer, { flex: 1 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View style={ChatStyle.headerContainerBlue}>
          <View style={ChatStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={ChatStyle.screenNameWhite}>{'Chats'}</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={ChatStyle.topHeader}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View style={[ChatStyle.chatName]}>
              <FastImage
                style={ChatStyle.headerImg}
                source={
                  recipientImage
                    ? {
                        uri: recipientImage,
                        priority: FastImage.priority.normal,
                      }
                    : {
                        uri: 'https://cdn.pixabay.com/photo/2021/02/22/16/34/portrait-6040876_1280.jpg',
                        priority: FastImage.priority.normal,
                      }
                }
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{ ...LayoutStyle.marginLeft10 }}>
                <Text style={[ChatStyle.ownerName]}>{recipientName}</Text>
                <Text style={[ChatStyle.msgText]}>{recipientTag}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                isCheckedOut ? ChatStyle.callIconInactive : ChatStyle.callIcon,
              ]}
              disabled={isCheckedOut}>
              <Icons
                iconName={'call-outline'}
                iconSetName={'Ionicons'}
                iconColor={isCheckedOut ? Colors.gray : Colors.black}
                iconSize={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.secondary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderChatItem}
            keyExtractor={(item, index) => item._id || `msg-${index}`}
            contentContainerStyle={ChatStyle.messagesContainer}
            style={{ flex: 1, backgroundColor: Colors.white }}
            inverted={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            onContentSizeChange={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
            onLayout={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }, 100);
            }}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                <Text style={{ color: Colors.grayText, ...LayoutStyle.fontSize12 }}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
          />
        )}

        {isCheckedOut ? (
          <View style={ChatStyle.checkoutBanner}>
            <View style={ChatStyle.checkoutBannerIcon}>
              <Icons
                iconName={'alert-circle'}
                iconSetName={'Ionicons'}
                iconColor={Colors.black}
                iconSize={20}
              />
            </View>
            <Text style={ChatStyle.checkoutBannerText}>
              {`You have already checked out of ${hostelName} on ${checkoutDate}. Please connect with customer care for further communication.`}
            </Text>
          </View>
        ) : (
          <View style={[ChatStyle.inputMsg]}>
            <TextInput
              style={ChatStyle.msgInput}
              placeholder="Type a message..."
              placeholderTextColor={Colors.grayText}
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity style={ChatStyle.inputIconContainer}>
              <Icons
                iconName={'camera-outline'}
                iconSetName={'Ionicons'}
                iconColor={Colors.black}
                iconSize={22}
              />
            </TouchableOpacity>
            <TouchableOpacity style={ChatStyle.inputIconContainer}>
              <Icons
                iconName={'attach-outline'}
                iconSetName={'Ionicons'}
                iconColor={Colors.black}
                iconSize={22}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[ChatStyle.sendIcon]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}>
              {sending ? (
                <ActivityIndicator size="small" color={Colors.black} />
              ) : (
                <Icons
                  iconName={'send'}
                  iconSetName={'Ionicons'}
                  iconColor={messageText.trim() ? Colors.black : Colors.gray}
                  iconSize={20}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default MessageListScreen;

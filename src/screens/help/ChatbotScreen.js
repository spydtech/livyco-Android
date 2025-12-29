import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Icons, EmptyState } from '../../components';
import Colors from '../../styles/Colors';
import ChatStyle from '../../styles/ChatStyle';
import IMAGES from '../../assets/Images';
import FontFamily from '../../assets/FontFamily';
import { CommonActions } from '@react-navigation/native';
import {
  processChatbotMessage,
  getChatbotHistory,
  clearChatbotConversation,
} from '../../services/chatbotService';
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { getUserToken } from '../../utils/Api';
import { getUser } from '../../services/authService';

const SESSION_ID_KEY = 'chatbot_session_id';

const ChatbotScreen = (props) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [user, setUser] = useState(null);
  const [hasWelcomeShown, setHasWelcomeShown] = useState(false);

  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Scroll after a short delay to ensure layout is complete
      scrollTimeoutRef.current = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages.length, loading]);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await getUserToken();
        if (token) {
          const userResponse = await getUser(token);
          if (userResponse.success && userResponse.data?.user) {
            setUser(userResponse.data.user);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Generate or retrieve session ID
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Try to get existing session ID
        let existingSessionId = await AsyncStorage.getItem(SESSION_ID_KEY);
        
        if (!existingSessionId) {
          // Generate new session ID
          existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem(SESSION_ID_KEY, existingSessionId);
        }
        
        setSessionId(existingSessionId);
        
        // Load conversation history
        await loadHistory(existingSessionId);
      } catch (error) {
        console.error('Error initializing session:', error);
        // Generate fallback session ID
        const fallbackSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(fallbackSessionId);
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Load conversation history
  const loadHistory = async (sessionIdToLoad) => {
    try {
      setLoading(true);
      const response = await getChatbotHistory(sessionIdToLoad);
      
      if (response.success && response.data && response.data.length > 0) {
        // Format history messages and sort by timestamp to ensure correct order
        const formattedMessages = response.data
          .map((msg) => ({
            _id: msg._id || `msg-${Date.now()}-${Math.random()}`,
            content: msg.message || msg.response || '',
            isBot: msg.isBot !== undefined ? msg.isBot : (msg.sender === 'Livy AI' || !msg.sender),
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            quickReplies: msg.quickReplies || [],
            actions: msg.actions || [],
            sender: msg.sender || (msg.isBot ? 'Livy AI' : user?.name || 'User'),
          }))
          .sort((a, b) => {
            // Sort by timestamp to ensure messages are in chronological order
            return new Date(a.timestamp) - new Date(b.timestamp);
          });
        
        setMessages(formattedMessages);
        setHasWelcomeShown(formattedMessages.length > 0);
        
        // Set quick replies from last bot message
        const lastBotMessage = formattedMessages
          .slice()
          .reverse()
          .find((msg) => msg.isBot);
        if (lastBotMessage && lastBotMessage.quickReplies) {
          setQuickReplies(lastBotMessage.quickReplies);
        }
      } else {
        // Send initial greeting if no history
        sendInitialGreeting(sessionIdToLoad);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      // Send initial greeting on error (e.g., if user is not authenticated)
      sendInitialGreeting(sessionIdToLoad);
    } finally {
      setLoading(false);
    }
  };

  // Send initial greeting
  const sendInitialGreeting = async (sessionIdToLoad) => {
    try {
      // Create personalized greeting based on user role
      let greetingMessage = {
        _id: `initial_greeting_${Date.now()}`,
        content: "Hello! 👋 I'm Livy, your AI assistant for Livyco Hostels. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
        quickReplies: [
          { text: "Find hostels", action: "find_hostels" },
          { text: "Check prices", action: "check_prices" },
          { text: "Book virtual tour", action: "virtual_tour" },
          { text: "My bookings", action: "my_bookings" }
        ],
        sender: 'Livy AI'
      };

      // Personalize greeting based on user type
      if (user) {
        if (user.role === 'student') {
          greetingMessage = {
            ...greetingMessage,
            content: `Hello ${user.name || 'student'}! 👋 I'm Livy, your AI assistant for Livyco Hostels. Need help with student housing or bookings?`,
            quickReplies: [
              { text: "Student hostels", action: "student_hostels" },
              { text: "My applications", action: "my_applications" },
              { text: "Payment status", action: "payment_status" },
              { text: "Contact warden", action: "contact_warden" }
            ]
          };
        } else if (user.role === 'admin' || user.role === 'warden' || user.role === 'client') {
          greetingMessage = {
            ...greetingMessage,
            content: `Hello ${user.name || 'admin'}! 👋 I'm Livy, your AI assistant for managing Livyco Hostels.`,
            quickReplies: [
              { text: "View bookings", action: "view_bookings" },
              { text: "Check occupancy", action: "check_occupancy" },
              { text: "Manage rooms", action: "manage_rooms" },
              { text: "Generate reports", action: "generate_reports" }
            ]
          };
        }
      }

      setMessages([greetingMessage]);
      setQuickReplies(greetingMessage.quickReplies);
      setHasWelcomeShown(true);
    } catch (error) {
      console.error('Error sending initial greeting:', error);
      // Set default greeting
      const defaultMessage = {
        _id: `bot-default`,
        content: "Hello! 👋 I'm Livy, your AI assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
        quickReplies: [
          { text: "Find hostels", action: "find_hostels" },
          { text: "Check prices", action: "check_prices" },
          { text: "Contact support", action: "contact_support" },
        ],
        sender: 'Livy AI'
      };
      setMessages([defaultMessage]);
      setQuickReplies(defaultMessage.quickReplies);
      setHasWelcomeShown(true);
    }
  };

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

  // Handle send message
  const handleSendMessage = async (message = null) => {
    const content = message || messageText.trim();
    if (!content || !sessionId || sending) return;

    // Clear input if using text input
    if (!message) {
      setMessageText('');
    }

    // Add user message to UI immediately
    const userMessage = {
      _id: `user-${Date.now()}`,
      content: content,
      isBot: false,
      timestamp: new Date(),
      sender: user?.name || 'User'
    };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    setQuickReplies([]); // Clear quick replies while waiting

    try {
      const response = await processChatbotMessage(content, sessionId);

      if (response.success) {
        const botMessage = {
          _id: `bot-${Date.now()}`,
          content: response.response || response.data?.response || 'I apologize, but I encountered an error. Please try again.',
          isBot: true,
          timestamp: new Date(),
          quickReplies: response.quickReplies || [],
          actions: response.actions || response.data?.actions || [],
          sender: 'Livy AI'
        };

        setMessages((prev) => {
          // Remove temporary user message and add both user and bot messages
          const filtered = prev.filter((msg) => msg._id !== userMessage._id);
          return [...filtered, userMessage, botMessage];
        });

        setQuickReplies(response.quickReplies || []);

        // Update session ID if provided
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
          await AsyncStorage.setItem(SESSION_ID_KEY, response.sessionId);
        }

      } else {
        // Show error message
        showMessage({
          message: 'Error',
          description: response.message || 'Failed to send message',
          type: 'danger',
          floating: true,
          statusBarHeight: 40,
          icon: 'auto',
          autoHide: true,
          duration: 3000,
        });

        // Remove user message on error
        setMessages((prev) => prev.filter((msg) => msg._id !== userMessage._id));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to send message. Please try again.',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });

      // Remove user message on error
      setMessages((prev) => prev.filter((msg) => msg._id !== userMessage._id));
    } finally {
      setSending(false);
    }
  };

  // Handle quick reply
  const handleQuickReply = (quickReply) => {
    // Display the text in UI, but send ACTION: prefix to backend if action exists
    const displayText = quickReply.text || quickReply.action || '';
    const messageToSend = quickReply.action 
      ? `ACTION:${quickReply.action}` 
      : quickReply.text;
    
    // Add user message with display text (not ACTION: prefix)
    const userMessage = {
      _id: `user-${Date.now()}`,
      content: displayText,
      isBot: false,
      timestamp: new Date(),
      sender: user?.name || 'User'
    };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    setQuickReplies([]); // Clear quick replies while waiting

    // Send the actual message (with ACTION: prefix if needed) to backend
    handleSendMessageWithUserMessage(messageToSend, userMessage);
  };

  // Handle send message with pre-created user message
  const handleSendMessageWithUserMessage = async (message, userMessage) => {
    if (!message || !sessionId || sending) return;

    try {
      const response = await processChatbotMessage(message, sessionId);

      if (response.success) {
        const botMessage = {
          _id: `bot-${Date.now()}`,
          content: response.response || response.data?.response || 'I apologize, but I encountered an error. Please try again.',
          isBot: true,
          timestamp: new Date(),
          quickReplies: response.quickReplies || [],
          actions: response.actions || response.data?.actions || [],
          sender: 'Livy AI'
        };

        setMessages((prev) => {
          // Remove temporary user message and add both user and bot messages
          const filtered = prev.filter((msg) => msg._id !== userMessage._id);
          return [...filtered, userMessage, botMessage];
        });

        setQuickReplies(response.quickReplies || []);

        // Update session ID if provided
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
          await AsyncStorage.setItem(SESSION_ID_KEY, response.sessionId);
        }

      } else {
        // Show error message
        showMessage({
          message: 'Error',
          description: response.message || 'Failed to send message',
          type: 'danger',
          floating: true,
          statusBarHeight: 40,
          icon: 'auto',
          autoHide: true,
          duration: 3000,
        });

        // Remove user message on error
        setMessages((prev) => prev.filter((msg) => msg._id !== userMessage._id));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to send message. Please try again.',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });

      // Remove user message on error
      setMessages((prev) => prev.filter((msg) => msg._id !== userMessage._id));
    } finally {
      setSending(false);
    }
  };

  // Handle clear conversation
  const handleClearConversation = async () => {
    try {
      if (sessionId) {
        await clearChatbotConversation(sessionId);
      }
      
      // Clear local storage
      await AsyncStorage.removeItem(SESSION_ID_KEY);
      
      // Reset state
      setMessages([]);
      setQuickReplies([]);
      setHasWelcomeShown(false);
      
      // Generate new session
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      await AsyncStorage.setItem(SESSION_ID_KEY, newSessionId);
      
      // Send initial greeting
      await sendInitialGreeting(newSessionId);
      
      showMessage({
        message: 'Success',
        description: 'Conversation cleared',
        type: 'success',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleActionPress = (action) => {
    // Handle navigation actions based on action type or label
    const actionType = action.action || action.type || '';
    const actionLabel = (action.label || '').toLowerCase();
    
    // Map action types to filter data and navigation
    let filterData = null;
    let screenName = 'Trending';

    // Price-based filters
    if (actionType.includes('under_5000') || actionLabel.includes('under 5000') || actionLabel.includes('under ₹5000')) {
      filterData = { budget: 5000 };
    } else if (actionType.includes('under_10000') || actionLabel.includes('under 10000') || actionLabel.includes('under ₹10000')) {
      filterData = { budget: 10000 };
    } else if (actionType.includes('under_15000') || actionLabel.includes('under 15000') || actionLabel.includes('under ₹15000')) {
      filterData = { budget: 15000 };
    } else if (actionType.includes('under_20000') || actionLabel.includes('under 20000') || actionLabel.includes('under ₹20000')) {
      filterData = { budget: 20000 };
    } else if (actionType.includes('5000_10000') || actionLabel.includes('5000-10000') || actionLabel.includes('₹5000-₹10000')) {
      filterData = { budget: 10000 }; // Max budget
    } else if (actionType.includes('10000_15000') || actionLabel.includes('10000-15000') || actionLabel.includes('₹10000-₹15000')) {
      filterData = { budget: 15000 };
    } else if (actionType.includes('15000_20000') || actionLabel.includes('15000-20000') || actionLabel.includes('₹15000-₹20000')) {
      filterData = { budget: 20000 };
    }
    // Gender-based filters
    else if (actionType.includes('male') || actionLabel.includes('male') || actionLabel.includes('for him')) {
      filterData = { gender: 'Male' };
    } else if (actionType.includes('female') || actionLabel.includes('female') || actionLabel.includes('for her')) {
      filterData = { gender: 'Female' };
    } else if (actionType.includes('co_living') || actionLabel.includes('co-living') || actionLabel.includes('co living')) {
      filterData = { gender: 'Co-Living' };
    }
    // Room type filters
    else if (actionType.includes('single') || actionLabel.includes('single sharing')) {
      filterData = { roomType: 'Single Sharing' };
    } else if (actionType.includes('double') || actionLabel.includes('double sharing')) {
      filterData = { roomType: 'Double Sharing' };
    } else if (actionType.includes('triple') || actionLabel.includes('triple sharing')) {
      filterData = { roomType: 'Triple Sharing' };
    } else if (actionType.includes('four') || actionLabel.includes('four sharing')) {
      filterData = { roomType: 'Four Sharing' };
    }
    // General navigation actions
    else if (actionType.includes('find_hostels') || actionLabel.includes('find hostels') || actionLabel.includes('view hostels')) {
      // Navigate to trending without filters (show all)
      filterData = null;
    } else if (actionType.includes('student_hostels') || actionLabel.includes('student hostels')) {
      filterData = { gender: 'Male' }; // Default to male for students, can be adjusted
    } else if (actionType.includes('my_bookings') || actionLabel.includes('my bookings')) {
      screenName = 'MystaysTab';
      filterData = null;
    } else if (actionType.includes('my_applications') || actionLabel.includes('my applications')) {
      screenName = 'MystaysTab';
      filterData = null;
    } else if (actionType.includes('view_bookings') || actionLabel.includes('view bookings')) {
      // For admin/warden - navigate to bookings screen if exists
      screenName = 'MystaysTab';
      filterData = null;
    } else if (actionType.includes('check_prices') || actionLabel.includes('check prices')) {
      // Navigate to trending to see prices
      filterData = null;
    } else if (actionType.includes('virtual_tour') || actionLabel.includes('virtual tour')) {
      // Navigate to trending to see properties with virtual tours
      filterData = null;
    }

    // Navigate to the appropriate screen
    if (screenName === 'Trending') {
      props.navigation.navigate('Trending', { filterData });
    } else {
      props.navigation.navigate(screenName);
    }
  };

  const renderChatItem = useCallback(
    ({ item, index }) => {
      const prevItem = index > 0 ? messages[index - 1] : null;
      const showDate = shouldShowDate(
        item.timestamp,
        prevItem?.timestamp
      );

      const isBot = item.isBot;

      return (
        <View>
          {showDate && (
            <View style={[ChatStyle.chatDateContainer]}>
              <Text style={[ChatStyle.chatdateCenter]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginHorizontal: 16,
              marginVertical: 8,
              justifyContent: isBot ? 'flex-start' : 'flex-end',
            }}>
            {/* Avatar */}
            {isBot && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#3B82F6', // Blue gradient start
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                  marginBottom: 2,
                }}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'robot'}
                  iconColor={Colors.white}
                  iconSize={18}
                />
              </View>
            )}
            
            {/* Message Content Container */}
            <View
              style={{
                maxWidth: '70%',
                marginRight: isBot ? 48 : 0,
                marginLeft: !isBot ? 48 : 0,
              }}>
              {/* User Name (for user messages) */}
              {!isBot && item.sender && (
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: FontFamily.RobotoMedium,
                    color: Colors.grayText,
                    marginBottom: 4,
                    textAlign: 'right',
                  }}>
                  {item.sender}
                </Text>
              )}
              
              {/* Message Bubble */}
              {isBot ? (
                <View
                  style={{
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.grayBorder,
                    borderRadius: 18,
                    borderTopLeftRadius: 4,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.blackText,
                      lineHeight: 20,
                    }}>
                    {item.content}
                  </Text>
                  
                  {/* Quick Replies */}
                  {item.quickReplies && item.quickReplies.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 12,
                        gap: 8,
                      }}>
                      {item.quickReplies.map((reply, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => handleQuickReply(reply)}
                          disabled={sending}
                          style={{
                            backgroundColor: Colors.goastWhite,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: Colors.grayBorder,
                            marginRight: 6,
                            marginBottom: 6,
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: FontFamily.RobotoRegular,
                              color: Colors.blackText,
                            }}>
                            {reply.text}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {/* Action Buttons */}
                  {item.actions && item.actions.length > 0 && (
                    <View style={{ marginTop: 12, gap: 8 }}>
                      {item.actions.map((action, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => handleActionPress(action)}
                          style={{
                            backgroundColor: '#3B82F6',
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: FontFamily.RobotoMedium,
                              color: Colors.white,
                            }}>
                            {action.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <LinearGradient
                  colors={['#2563EB', '#9333EA']} // Blue to purple gradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 18,
                    borderTopRightRadius: 4,
                    padding: 12,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.white,
                      lineHeight: 20,
                    }}>
                    {item.content}
                  </Text>
                </LinearGradient>
              )}
              
              {/* Timestamp */}
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: FontFamily.RobotoRegular,
                  color: isBot ? Colors.grayText : '#2563EB',
                  marginTop: 4,
                  textAlign: isBot ? 'left' : 'right',
                }}>
                {moment(item.timestamp).format('HH:mm')}
              </Text>
            </View>
            
            {/* User Avatar */}
            {!isBot && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#10B981', // Green gradient start
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8,
                  marginBottom: 2,
                }}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'account'}
                  iconColor={Colors.white}
                  iconSize={18}
                />
              </View>
            )}
          </View>
        </View>
      );
    },
    [messages.length, sending, user] // Only re-render when message count changes, not on every message update
  );

  const renderQuickReplies = () => {
    // Quick replies are now rendered inside bot messages, so this is kept for backward compatibility
    // but may not be needed if all quick replies are in messages
    return null;
  };

  return (
    <View style={[ChatStyle.homeContainer, { flex: 1 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}
        edges={['top']}>
        <LinearGradient
          colors={['#2563EB', '#9333EA']} // Blue to purple gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={ChatStyle.headerContainerBlue}>
          <View style={ChatStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                  <Icons
                    iconSetName={'MaterialCommunityIcons'}
                    iconName={'robot'}
                    iconColor={Colors.secondary}
                    iconSize={20}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FontFamily.RobotoSemiBold,
                      color: Colors.white,
                    }}>
                    Livy AI Assistant
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: FontFamily.RobotoRegular,
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: 2,
                    }}>
                    {user ? `Connected as ${user.name}` : 'Online • Ready to help'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClearConversation}
              style={{
                padding: 8,
                marginLeft: 8,
              }}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'delete-outline'}
                iconColor={Colors.white}
                iconSize={20}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1, backgroundColor: Colors.goastWhite }}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={Colors.secondary} />
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderChatItem}
              keyExtractor={(item, index) => item._id || `msg-${index}`}
              contentContainerStyle={[
                ChatStyle.messagesContainer,
                { backgroundColor: Colors.goastWhite }
              ]}
              style={{ flex: 1, backgroundColor: Colors.goastWhite }}
              inverted={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={10}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 100,
                  }}>
                  <Icons
                    iconSetName={'MaterialCommunityIcons'}
                    iconName={'robot'}
                    iconColor={Colors.grayText}
                    iconSize={48}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FontFamily.RobotoMedium,
                      color: Colors.grayText,
                      marginTop: 16,
                    }}>
                    Your conversation with Livy
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.grayText,
                      marginTop: 8,
                    }}>
                    Start by saying hello!
                  </Text>
                </View>
              }
            />
            
            {/* Typing Indicator */}
            {sending && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 16,
                  marginBottom: 8,
                }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#3B82F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                  }}>
                  <Icons
                    iconSetName={'MaterialCommunityIcons'}
                    iconName={'robot'}
                    iconColor={Colors.white}
                    iconSize={18}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.grayBorder,
                    borderRadius: 18,
                    borderTopLeftRadius: 4,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: Colors.grayText,
                      }}
                    />
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: Colors.grayText,
                        marginLeft: 4,
                      }}
                    />
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: Colors.grayText,
                        marginLeft: 4,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.grayText,
                      marginLeft: 8,
                    }}>
                    Livy is typing...
                  </Text>
                </View>
              </View>
            )}
            
            {renderQuickReplies()}
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: Colors.white }}>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: Colors.grayBorder,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: Colors.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                
                {/* Left Action Buttons */}
                {/* <View style={{ flexDirection: 'row', marginRight: 8 }}>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      marginRight: 4,
                    }}
                    disabled={sending}>
                    <Icons
                      iconSetName={'MaterialCommunityIcons'}
                      iconName={'paperclip'}
                      iconColor={Colors.grayText}
                      iconSize={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                    }}
                    disabled={sending}>
                    <Icons
                      iconSetName={'MaterialCommunityIcons'}
                      iconName={'camera'}
                      iconColor={Colors.grayText}
                      iconSize={20}
                    />
                  </TouchableOpacity>
                </View> */}
                
                {/* Input Field */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 25,
                      borderColor: Colors.grayBorder,
                      borderWidth: 1,
                      minHeight: 45,
                      maxHeight: 100,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      backgroundColor: Colors.white,
                      fontSize: 14,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.blackText,
                    }}
                    placeholder="Type your message..."
                    placeholderTextColor={Colors.grayText}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                    editable={!sending}
                  />
                </View>
                
                {/* Send Button */}
                <TouchableOpacity
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 22.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      messageText.trim() && !sending
                        ? '#2563EB'
                        : Colors.lightGray,
                  }}
                  onPress={() => handleSendMessage()}
                  disabled={!messageText.trim() || sending}>
                  {sending ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Icons
                      iconName={'send'}
                      iconSetName={'Ionicons'}
                      iconColor={Colors.white}
                      iconSize={20}
                    />
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Feedback Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 8,
                  gap: 24,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icons
                    iconSetName={'MaterialCommunityIcons'}
                    iconName={'thumb-up-outline'}
                    iconColor={Colors.grayText}
                    iconSize={14}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.grayText,
                      marginLeft: 4,
                    }}>
                    Helpful
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icons
                    iconSetName={'MaterialCommunityIcons'}
                    iconName={'thumb-down-outline'}
                    iconColor={Colors.grayText}
                    iconSize={14}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: FontFamily.RobotoRegular,
                      color: Colors.grayText,
                      marginLeft: 4,
                    }}>
                    Not helpful
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatbotScreen;


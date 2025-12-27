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

const SESSION_ID_KEY = 'chatbot_session_id';

const ChatbotScreen = (props) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);

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

  // Generate or retrieve session ID
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Try to get existing session ID
        let existingSessionId = await AsyncStorage.getItem(SESSION_ID_KEY);
        
        if (!existingSessionId) {
          // Generate new session ID
          existingSessionId = `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem(SESSION_ID_KEY, existingSessionId);
        }
        
        setSessionId(existingSessionId);
        
        // Load conversation history
        await loadHistory(existingSessionId);
      } catch (error) {
        console.error('Error initializing session:', error);
        // Generate fallback session ID
        const fallbackSessionId = `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
            isBot: msg.isBot || false,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            quickReplies: msg.quickReplies || [],
          }))
          .sort((a, b) => {
            // Sort by timestamp to ensure messages are in chronological order
            return new Date(a.timestamp) - new Date(b.timestamp);
          });
        
        setMessages(formattedMessages);
        
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
      const response = await processChatbotMessage('Hello', sessionIdToLoad);
      
      if (response.success) {
        const botMessage = {
          _id: `bot-${Date.now()}`,
          content: response.response || response.data?.response || "Hello! 👋 I'm Livy, your AI assistant. How can I help you today?",
          isBot: true,
          timestamp: new Date(),
          quickReplies: response.quickReplies || [],
        };
        
        setMessages([botMessage]);
        setQuickReplies(response.quickReplies || []);
        
        // Update session ID if provided
        if (response.sessionId) {
          setSessionId(response.sessionId);
          await AsyncStorage.setItem(SESSION_ID_KEY, response.sessionId);
        }
      }
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
      };
      setMessages([defaultMessage]);
      setQuickReplies(defaultMessage.quickReplies);
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
      
      // Generate new session
      const newSessionId = `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
              marginHorizontal: 20,
              marginVertical: 5,
              justifyContent: isBot ? 'flex-start' : 'flex-end',
            }}>
            {isBot && (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.secondary,
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
            {!isBot && <View style={{ flex: 1 }} />}
            <View
              style={[
                isBot
                  ? ChatStyle.messageReceiverView
                  : ChatStyle.messageSenderView,
                {
                  marginLeft: 0,
                  marginRight: 0,
                },
              ]}>
              <Text
                style={[
                  isBot
                    ? ChatStyle.messageReceiverText
                    : ChatStyle.messageSenderText,
                ]}>
                {item.content}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [messages.length] // Only re-render when message count changes, not on every message update
  );

  const renderQuickReplies = () => {
    if (!quickReplies || quickReplies.length === 0) return null;

    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: Colors.paleBlue,
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: 1,
                borderColor: Colors.secondary,
              }}
              onPress={() => handleQuickReply(reply)}
              disabled={sending}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: FontFamily.RobotoRegular,
                  color: Colors.black,
                }}>
                {reply.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[ChatStyle.homeContainer, { flex: 1 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}
        edges={['top']}>
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
            <Text style={ChatStyle.screenNameWhite}>{'Chat Support'}</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1, backgroundColor: Colors.white }}>
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
              contentContainerStyle={ChatStyle.messagesContainer}
              style={{ flex: 1, backgroundColor: Colors.white }}
              inverted={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={10}
              ListEmptyComponent={
                <EmptyState
                  image={IMAGES.noChat}
                  title="No messages yet"
                  description="Start the conversation!"
                  containerStyle={{ paddingTop: 50 }}
                />
              }
            />
            {renderQuickReplies()}
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: Colors.white }}>
              <View style={[ChatStyle.inputMsg, { paddingBottom: Platform.OS === 'ios' ? 0 : 10 }]}>
                <TextInput
                  style={ChatStyle.msgInput}
                  placeholder="Type a message..."
                  placeholderTextColor={Colors.grayText}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  editable={!sending}
                />
                <TouchableOpacity
                  style={[ChatStyle.sendIcon]}
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
            </SafeAreaView>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatbotScreen;


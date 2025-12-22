import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Pressable,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {Swipeable} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import ChatStyle from '../../styles/ChatStyle';
import {Button, EmptyState, Icons, Overlay} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
import Dialog from 'react-native-dialog';
import {getUserContacts, deleteContact} from '../../services/contactService';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import IMAGES from '../../assets/Images';

const ContactedScreen = props => {
  const navigation = useNavigation();
  const [isCallModal, setIsCallModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingContactId, setDeletingContactId] = useState(null);

  // Fetch contacts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [])
  );

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await getUserContacts({page: 1, limit: 50});
      if (response.success) {
        setContacts(response.data || []);
      } else {
        console.error('Failed to fetch contacts:', response.message);
        showMessage({
          message: 'Error',
          description: response.message || 'Failed to fetch contacts',
          type: 'danger',
          floating: true,
          statusBarHeight: 40,
          icon: 'auto',
          autoHide: true,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to fetch contacts',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!contactId) return;

    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingContactId(contactId);
            try {
              const response = await deleteContact(contactId);
              if (response.success) {
                // Remove contact from list
                setContacts(prevContacts => 
                  prevContacts.filter(contact => contact._id !== contactId)
                );
                showMessage({
                  message: 'Success',
                  description: 'Contact deleted successfully',
                  type: 'success',
                  floating: true,
                  statusBarHeight: 40,
                  icon: 'auto',
                  autoHide: true,
                  duration: 2000,
                });
              } else {
                showMessage({
                  message: 'Error',
                  description: response.message || 'Failed to delete contact',
                  type: 'danger',
                  floating: true,
                  statusBarHeight: 40,
                  icon: 'auto',
                  autoHide: true,
                  duration: 3000,
                });
              }
            } catch (error) {
              console.error('Error deleting contact:', error);
              showMessage({
                message: 'Error',
                description: 'Failed to delete contact',
                type: 'danger',
                floating: true,
                statusBarHeight: 40,
                icon: 'auto',
                autoHide: true,
                duration: 3000,
              });
            } finally {
              setDeletingContactId(null);
            }
          },
        },
      ]
    );
  };

  const openCallModal = (contact) => {
    setSelectedContact(contact);
    setIsCallModal(true);
  };

  const clickOnYes = () => {
    if (selectedContact?.clientPhone) {
      Linking.openURL(`tel:${selectedContact.clientPhone}`);
    }
    setIsCallModal(false);
    setSelectedContact(null);
  };

  const clickOnNo = () => {
    setIsCallModal(false);
    setSelectedContact(null);
  };

  const handleChat = (contact) => {
    if (!contact?.clientId || !contact?.propertyId) {
      showMessage({
        message: 'Error',
        description: 'Contact information is incomplete',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });
      return;
    }

    navigation.navigate('MessageList', {
      recipientId: contact.clientId,
      propertyId: contact.propertyId,
      recipientName: contact.clientName || 'Owner Name',
      recipientImage: contact.clientImage,
      recipientTag: contact.propertyName || 'Property',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return moment(dateString).format('DD/MM/YYYY HH:mm');
    } catch (error) {
      return 'N/A';
    }
  };

  const renderRightActions = (contact) => {
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteContact(contact._id)}
          disabled={deletingContactId === contact._id}>
          {deletingContactId === contact._id ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Icons
              iconName={'trash-outline'}
              iconSetName={'Ionicons'}
              iconColor={Colors.white}
              iconSize={24}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderContacted = ({item: contact}) => {
    const imageUri = contact.clientImage || 
      'https://cdn.pixabay.com/photo/2021/02/22/16/34/portrait-6040876_1280.jpg';
    
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(contact)}
        overshootRight={false}>
        <View style={ChatStyle.contactedList}>
          <View style={[ChatStyle.chatContainer]}>
            <View style={[ChatStyle.chatName]}>
              <FastImage
                style={ChatStyle.contactedImg}
                source={{
                  uri: imageUri,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{...LayoutStyle.marginLeft10}}>
                <Text style={[ChatStyle.ownerName]}>
                  {contact.clientName || 'Owner Name'}
                </Text>
                <Text style={[ChatStyle.timeDateText]}>
                  {formatDate(contact.contactedAt)}
                </Text>
                {contact.propertyName && (
                  <Text style={[ChatStyle.timeDateText, {fontSize: 12, marginTop: 2}]}>
                    {contact.propertyName}
                  </Text>
                )}
              </View>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <TouchableOpacity
                style={[ChatStyle.callIcon]}
                onPress={() => openCallModal(contact)}>
                <Icons
                  iconName={'call-outline'}
                  iconSetName={'Ionicons'}
                  iconColor={Colors.black}
                  iconSize={22}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[ChatStyle.callIcon, {...LayoutStyle.marginLeft20}]}
                onPress={() => handleChat(contact)}>
                <Icons
                  iconName={'chatbubble-outline'}
                  iconSetName={'Ionicons'}
                  iconColor={Colors.black}
                  iconSize={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  if (contacts && contacts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
            image={IMAGES.noChat}
            title="No contacts yet"
            description="Contacts you make will appear here"
            containerStyle={{paddingTop: 50}}
          />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={contacts}
        renderItem={renderContacted}
        scrollEnabled={true}
        keyExtractor={item => item._id || item.id}
        contentContainerStyle={{paddingBottom: 20}}
      />
      <Overlay visible={isCallModal}>
        <View style={[ChatStyle.callContainerModal]}>
          <Text style={[ChatStyle.qusText]}>
            {'Do you want to call this number?'}
          </Text>
          {selectedContact?.clientPhone && (
            <Text style={[ChatStyle.qusText, {fontSize: 14, marginTop: 8, color: Colors.gray}]}>
              {selectedContact.clientPhone}
            </Text>
          )}
          <View style={[ChatStyle.modalBnts]}>
            <TouchableOpacity
              style={{flex: 0.345}}
              onPress={() => clickOnYes()}>
              <View style={[ChatStyle.yesBtn]}>
                <Text style={[ChatStyle.yesBtnText]}>{'Yes'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 0.345}} onPress={() => clickOnNo()}>
              <View style={[ChatStyle.noBtn]}>
                <Text style={[ChatStyle.noBtnText]}>{'No'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
  rightActionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
    paddingRight: 20,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 0,
  },
});

export default ContactedScreen;

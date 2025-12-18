import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Colors from '../../styles/Colors';
import { EmptyState, Icons } from '../../components';
import HelpStyle from '../../styles/HelpStyle';
import { getUserTickets, createTicket } from '../../services/ticketService';
import { getUser } from '../../services/authService';
import { Dropdown } from 'react-native-element-dropdown';
import { showMessage } from 'react-native-flash-message';
import moment from 'moment';
import LayoutStyle from '../../styles/LayoutStyle';
import FontFamily from '../../assets/FontFamily';
import IMAGES from '../../assets/Images';

const TicketScreen = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  // Category options
  const categoryOptions = [
    { label: 'Payment Issue', value: 'Payment Issue' },
    { label: 'Technical Issue', value: 'Technical Issue' },
    { label: 'Account Support', value: 'Account Support' },
    { label: 'General Inquiry', value: 'General Inquiry' },
  ];

  useEffect(() => {
    fetchTickets();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userResponse = await getUser();
      if (userResponse.success && userResponse.data?.user) {
        const user = userResponse.data.user;
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getUserTickets();
      console.log("response---->",response);
      
      if (response.success) {
        setTickets(response.tickets || []);
      } else {
        showMessage({
          message: 'Error',
          description: response.message || 'Failed to fetch tickets',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      showMessage({
        message: 'Error',
        description: 'An unexpected error occurred',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const gotoBack = () => {
    navigation.dispatch(CommonActions.goBack());
  };

  const openCreateModal = () => {
    setModalVisible(true);
    setErrors({});
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrors({});
    setCategory(null);
    setDescription('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!category) {
      newErrors.category = 'Please select an issue category';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTicket = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await createTicket({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        category: category,
        comment: description.trim(),
      });

      if (response.success) {
        showMessage({
          message: 'Success',
          description: response.message || 'Ticket created successfully',
          type: 'success',
        });
        closeModal();
        fetchTickets(); // Refresh the list
      } else {
        showMessage({
          message: 'Error',
          description: response.message || 'Failed to create ticket',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      showMessage({
        message: 'Error',
        description: 'An unexpected error occurred',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return Colors.orange;
      case 'Resolved':
        return Colors.green;
      case 'Closed':
        return Colors.gray;
      default:
        return Colors.gray;
    }
  };

  const renderTicketItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={HelpStyle.ticketCard}
        activeOpacity={0.7}>
        <View style={HelpStyle.ticketHeader}>
          <View>
            <Text style={HelpStyle.ticketId}>Ticket #{item.ticketId}</Text>
            <Text style={HelpStyle.ticketDate}>
              {moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
          <View
            style={[
              HelpStyle.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}>
            <Text
              style={[
                HelpStyle.statusText,
                { color: getStatusColor(item.status) },
              ]}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={HelpStyle.ticketBody}>
          <Text style={HelpStyle.ticketCategory}>{item.category}</Text>
          {item.comment ? (
            <Text style={HelpStyle.ticketDescription} numberOfLines={2}>
              {item.comment}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCreateModal = () => {
    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={HelpStyle.modalOverlay}>
          <TouchableOpacity
            style={HelpStyle.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={HelpStyle.modalContainer}>
            <View style={HelpStyle.modalContent}>
              {/* Modal Header */}
              <View style={HelpStyle.modalHeader}>
                <Text style={HelpStyle.modalTitle}>Create Support Ticket</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'close'}
                    iconColor={Colors.white}
                    iconSize={24}
                  />
                </TouchableOpacity>
              </View>

              {/* Modal Body */}
              <ScrollView
                style={HelpStyle.modalBody}
                showsVerticalScrollIndicator={false}>
                {/* Name Field */}
                <View style={HelpStyle.inputContainer}>
                  <Text style={HelpStyle.inputLabel}>Your Name</Text>
                  <TextInput
                    style={[
                      HelpStyle.input,
                      errors.name && HelpStyle.inputError,
                    ]}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.placeholder}
                    cursorColor={Colors.secondary}
                  />
                  {errors.name ? (
                    <Text style={HelpStyle.errorText}>{errors.name}</Text>
                  ) : null}
                </View>

                {/* Email Field */}
                <View style={HelpStyle.inputContainer}>
                  <Text style={HelpStyle.inputLabel}>Email Address</Text>
                  <TextInput
                    style={[
                      HelpStyle.input,
                      errors.email && HelpStyle.inputError,
                    ]}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    cursorColor={Colors.secondary}
                  />
                  {errors.email ? (
                    <Text style={HelpStyle.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                {/* Phone Field */}
                <View style={HelpStyle.inputContainer}>
                  <Text style={HelpStyle.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={[
                      HelpStyle.input,
                      errors.phone && HelpStyle.inputError,
                    ]}
                    value={phone}
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      setPhone(numericText);
                      if (errors.phone) {
                        setErrors({ ...errors, phone: '' });
                      }
                    }}
                    placeholder="Enter your phone number"
                    placeholderTextColor={Colors.placeholder}
                    keyboardType="phone-pad"
                    maxLength={15}
                    cursorColor={Colors.secondary}
                  />
                  {errors.phone ? (
                    <Text style={HelpStyle.errorText}>{errors.phone}</Text>
                  ) : null}
                </View>

                {/* Category Dropdown */}
                <View style={HelpStyle.inputContainer}>
                  <Text style={HelpStyle.inputLabel}>Issue Category</Text>
                  <Dropdown
                    style={[
                      HelpStyle.dropdown,
                      errors.category && HelpStyle.inputError,
                    ]}
                    placeholderStyle={HelpStyle.dropdownPlaceholder}
                    selectedTextStyle={HelpStyle.dropdownSelectedText}
                    data={categoryOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select issue category"
                    value={category}
                    onChange={(item) => {
                      setCategory(item.value);
                      if (errors.category) {
                        setErrors({ ...errors, category: '' });
                      }
                    }}
                  />
                  {errors.category ? (
                    <Text style={HelpStyle.errorText}>{errors.category}</Text>
                  ) : null}
                </View>

                {/* Description Field */}
                <View style={HelpStyle.inputContainer}>
                  <Text style={HelpStyle.inputLabel}>Description</Text>
                  <TextInput
                    style={[
                      HelpStyle.textArea,
                      errors.description && HelpStyle.inputError,
                      {marginBottom:20}
                    ]}
                    value={description}
                    onChangeText={(text) => {
                      setDescription(text);
                      if (errors.description) {
                        setErrors({ ...errors, description: '' });
                      }
                    }}
                    placeholder="Please describe your issue in detail..."
                    placeholderTextColor={Colors.placeholder}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    cursorColor={Colors.secondary}
                  />
                  {errors.description ? (
                    <Text style={HelpStyle.errorText}>
                      {errors.description}
                    </Text>
                  ) : null}
                </View>
              </ScrollView>

              {/* Modal Footer */}
              <View style={HelpStyle.modalFooter}>
                <TouchableOpacity
                  style={HelpStyle.cancelButton}
                  onPress={closeModal}
                  disabled={submitting}>
                  <Text style={HelpStyle.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    HelpStyle.createButton,
                    submitting && HelpStyle.createButtonDisabled,
                  ]}
                  onPress={handleCreateTicket}
                  disabled={submitting}>
                  {submitting ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={HelpStyle.createButtonText}>
                      Create Ticket
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HelpStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }}
        edges={['top']}>
        <View style={HelpStyle.headerContainerBlue}>
          <TouchableOpacity onPress={gotoBack}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={HelpStyle.headerTitle}>{'Ticket Status'}</Text>
          <View style={HelpStyle.headerRightContainer} />
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={HelpStyle.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : tickets.length === 0 ? (
        <View style={HelpStyle.emptyContainer}>
          <EmptyState
            image={IMAGES.noTickets}
            title="No tickets found"
            description="Create a new ticket to get support"
            containerStyle={{ paddingTop: 50 }}
          />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item, index) =>
            item._id ? String(item._id) : `ticket-${index}`
          }
          renderItem={renderTicketItem}
          contentContainerStyle={HelpStyle.ticketListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={HelpStyle.fab}
        onPress={openCreateModal}
        activeOpacity={0.8}>
        <Icons
          iconSetName={'Ionicons'}
          iconName={'add'}
          iconColor={Colors.white}
          iconSize={28}
        />
      </TouchableOpacity>

      {renderCreateModal()}
    </KeyboardAvoidingView>
  );
};

export default TicketScreen;


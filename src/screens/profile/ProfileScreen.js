import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  // SafeAreaView,
  Image,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import Colors from '../../styles/Colors';
import { Icons } from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import ProfileStyle from '../../styles/ProfileStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import { CommonActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUser, deleteUserAccount } from '../../services/authService';
import { getUserToken, clearUserToken } from '../../utils/Api';
import { isGuestUser, showGuestRestrictionAlert } from '../../utils/authUtils';
import { deviceHight, deviceWidth } from '../../utils/DeviceInfo';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  // Check guest status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const checkGuestStatus = async () => {
        const isGuest = await isGuestUser();
        fetchUserData();
        if (isGuest) {
          // Redirect to HomeTab if guest
          navigation.navigate('HomeTab');
          showGuestRestrictionAlert(navigation);
        }
      };
      checkGuestStatus();
    }, [navigation])
  );

  const gotoBack = () => {
    navigation.dispatch(CommonActions.goBack());
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log('showDeleteConfirmModal changed:', showDeleteConfirmModal);
  }, [showDeleteConfirmModal]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await getUserToken();
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      const response = await getUser(token);
      if (response.success && response.data?.user) {
        setUserData(response.data.user);
        console.log("User dataaa", response.data.user);

      } else {
        console.log('Failed to fetch user data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format phone number with +91- prefix
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove any existing formatting
    const cleaned = phone.replace(/[^0-9]/g, '');
    // If it starts with 91, remove it
    const phoneNumber = cleaned.startsWith('91') ? cleaned.substring(2) : cleaned;
    // Format as +91-XXXXXXXXXX
    return phoneNumber ? `+91-${phoneNumber}` : '';
  };

  // Format user ID (LVC + last 7 digits of aadhaar or user ID)
  const formatUserId = (user) => {
    if (!user) return 'LVC0000000';
    // Try to use aadhaarNumber first
    if (user.clientId) {
      return user.clientId;
    }
    return 'LVC0000000';
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    console.log('Delete account button clicked - showing modal');
    console.log('Setting showDeleteConfirmModal to true');
    setShowDeleteConfirmModal(true);
    console.log('showDeleteConfirmModal state:', showDeleteConfirmModal);
  };

  const handleConfirmDelete = async () => {
    try {
      setShowDeleteConfirmModal(false);
      
      // Call API to delete account
      const response = await deleteUserAccount();
      console.log("Delete account response:", JSON.stringify(response, null, 2));
      
      if (response.success) {
        // Show success modal
        setShowDeleteSuccessModal(true);
        
        // After showing success, navigate to Welcome screen
        setTimeout(async () => {
          try {
            // Clear the token from AsyncStorage
            await clearUserToken();
            
            // Reset navigation stack and navigate to Welcome screen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            );
          } catch (error) {
            console.error('Error during account deletion:', error);
          }
        }, 2000);
      } else {
        // Show error alert if API call failed
        const errorMessage = response.message || 
          (response.status === 500 
            ? 'Server error occurred. Please try again later or contact support.' 
            : 'Failed to delete account. Please try again.');
        
        console.error('Delete account failed:', {
          success: response.success,
          message: response.message,
          error: response.error,
          status: response.status,
        });
        
        Alert.alert(
          'Error',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to delete account. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear the token from AsyncStorage
              await clearUserToken();
              
              // Reset navigation stack and navigate to Welcome screen
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                })
              );
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[MystaysStyle.homeContainer, { flex: 1 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }} edges={['top']}>
        <View style={MystaysStyle.headerContainerBlue}>
          <View style={MystaysStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={[ProfileStyle.headerTitle]}>{'Profile'}</Text>
          </View>
          <View style={MystaysStyle.iconContainer}>
            <TouchableOpacity 
              style={{ ...LayoutStyle.marginLeft5 }}
              onPress={() => navigation.navigate('Notification')}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'notifications-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
              <View style={MystaysStyle.smallRound}></View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <View style={[ProfileStyle.mainContainer]}>
        {loading ? (
          <View style={ProfileStyle.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
          </View>
        ) : (
          <View style={[ProfileStyle.profileSection]}>
            <View style={[ProfileStyle.userNameContainer]}>
              <View style={[ProfileStyle.imageContaienr, { padding:0}]}>
                {userData?.profileImage ? (
                  <Image
                    source={{ uri: userData.profileImage }}
                    style={[ProfileStyle.profileImg, {height: 60, width: 60, resizeMode: "stretch"}]}
                  />
                ) : (
                  <Image
                    source={{
                      uri: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_1280.png',
                    }}
                    style={[ProfileStyle.profileImg]}
                  />
                )}
              </View>
              <View style={{ ...LayoutStyle.marginLeft20 }}>
                <Text style={[ProfileStyle.userName]}>
                  {userData?.name || 'N/A'}
                </Text>
                <Text style={[ProfileStyle.fontLite]}>
                  {formatPhoneNumber(userData?.phone)}
                </Text>
                <Text style={[ProfileStyle.fontLite]}>
                  {formatUserId(userData)}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[ProfileStyle.editButton]}
              onPress={() => navigation.navigate('Register', { isEditMode: true })}
            >
              <Icons
                iconSetName={'FontAwesome'}
                iconName={'edit'}
                iconColor={Colors.white}
                iconSize={20}
              />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView style={ProfileStyle.scrollContainer}>
          <View style={[ProfileStyle.accountInfoHeader, { marginVertical: 20 }]}>
            <Text style={[ProfileStyle.accountInfoTitle, { fontWeight: "bold" }]}>
              {'Account Info'}
            </Text>
          </View>
          {/* Theme option - commented out */}
          {/* <View
            style={ProfileStyle.accountOptionRow}>
            <Text style={[ProfileStyle.listOption]}>{'Theme'}</Text>
            <Switch />
          </View> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('History')}>
            <View style={ProfileStyle.accountOptionRow}>
              <Text style={[ProfileStyle.listOption]}>{'Payment history'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
          </TouchableOpacity>
          {/* My wallet option - commented out */}
          {/* <TouchableOpacity>
            <View style={ProfileStyle.accountOptionRow}>
              <Text style={[ProfileStyle.listOption]}>{'My wallet'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Help')}>
            <View style={ProfileStyle.accountOptionRow}>
              <Text style={[ProfileStyle.listOption]}>{'Help & support'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsAndConditions')}>
            <View style={ProfileStyle.accountOptionRow}>
              <Text style={[ProfileStyle.listOption]}>{'Term & policy'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccount}>
            <View style={ProfileStyle.accountOptionRow}>
              <Text style={[ProfileStyle.listOption]}>{'Delete Account'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity 
          style={[ProfileStyle.logoutBtn, { marginBottom: 30 }]}
          onPress={handleLogout}
        >
          <Text style={[ProfileStyle.logoutText]}>{'Logout'}</Text>
          <Icons
            iconSetName={'MaterialIcons'}
            iconName={'logout'}
            iconColor={Colors.red}
            iconSize={24}
          />
        </TouchableOpacity>

      {/* Delete Account Confirmation Modal */}
        <Modal
          visible={showDeleteConfirmModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelDelete}
          statusBarTranslucent={true}>
          <View style={ProfileStyle.modalOverlay}>
            <TouchableOpacity
              style={ProfileStyle.modalOverlayBackdrop}
              activeOpacity={1}
              onPress={handleCancelDelete}
            />
            <View 
              style={ProfileStyle.modalContainer}
              onStartShouldSetResponder={() => true}>
              <View style={ProfileStyle.modalContent}>
                <Text style={ProfileStyle.modalTitle}>
                  Are you sure you want to delete your account?
                </Text>
                <Text style={ProfileStyle.modalWarning}>
                  This action is irreversible, and all your data will be permanently lost.
                </Text>
                <View style={ProfileStyle.modalButtons}>
                  <TouchableOpacity
                    style={ProfileStyle.modalButton}
                    onPress={handleConfirmDelete}
                    activeOpacity={0.8}>
                    <Icons
                      iconSetName={'MaterialIcons'}
                      iconName={'check'}
                      iconColor={Colors.white}
                      iconSize={20}
                    />
                    <Text style={ProfileStyle.modalButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={ProfileStyle.modalButton}
                    onPress={handleCancelDelete}
                    activeOpacity={0.8}>
                    <Icons
                      iconSetName={'MaterialIcons'}
                      iconName={'close'}
                      iconColor={Colors.white}
                      iconSize={20}
                    />
                    <Text style={ProfileStyle.modalButtonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

      {/* Delete Account Success Modal */}
        <Modal
          visible={showDeleteSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeleteSuccessModal(false)}
          statusBarTranslucent={true}>
          <View style={ProfileStyle.modalOverlay}>
            <View style={ProfileStyle.modalOverlayBackdrop} />
            <View style={ProfileStyle.modalContainer}>
              <View style={ProfileStyle.successModalContent}>
                <Text style={ProfileStyle.successModalText}>
                  Your account has been successfully deleted.
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

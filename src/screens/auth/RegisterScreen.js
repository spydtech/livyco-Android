import {
  View,
  Text,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import AuthStyle from "../../styles/AuthStyle";
import IMAGES from "../../assets/Images";
import Colors from "../../styles/Colors";
import { BottomSheet, Button, Icons, Input } from "../../components";
import CommonStyles from "../../styles/CommonStyles";
import LayoutStyle from "../../styles/LayoutStyle";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import ImagePicker from "react-native-image-crop-picker";
import { deviceHight } from "../../utils/DeviceInfo";
import {setUserToken, getUserTokenSync} from "../../utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isDevelopment } from "../../utils/Environment";
import { apiPost } from "../../utils/apiCall";
import { getUser, updateUserProfile } from "../../services/authService";

const RegisterScreen = (props) => {
  // Check if in edit mode
  const isEditMode = props.route?.params?.isEditMode || false;
  
  // Basic Details fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("");
  const [dobDate, setDobDate] = useState(null); // Store actual date object
  
  // Contact Information fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState('student'); // Changed to match backend enum
  const [isEnabled, setIsEnabled] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  
  // KYC fields
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadharPhotoPath, setAadharPhotoPath] = useState(""); // Store the actual file path
  
  // UI state
  const [screenName, setScreenName] = useState("first");
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState("");
  const [doc, setDoc] = useState("");
  const [pickerType, setPickerType] = useState("");
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const gotoUpdateScreen = () => {
    setScreenName("second");
  };
  const gotoKycScreen = () => {
    setScreenName("third");
  };
  const handleMovingDate = (date) => {
    setOpen(false);
    const formattedDate = moment(date).format("DD-MM-YYYY");
    console.log("in press date=>date", formattedDate);
    setDob(formattedDate);
    setDobDate(date); // Store the actual date object
  };
  const gotoRegister = () => {
    props.navigation.navigate("SuccessID");
  };
  const gotoBottomSheetClose = () => {
    setIsBottomSheet(false);
  };
  const openImgOption = (type) => {
    setIsBottomSheet(true);
    setPickerType(type);
  };
  const openGallery = () => {
    const currentPickerType = pickerType; // Capture the current pickerType before closing bottom sheet
    gotoBottomSheetClose();
    ImagePicker.openPicker({
      width: 300,
      height: 400,
    }).then((image) => {
      console.log(image);
      console.log("Picker type:", currentPickerType);
      if (currentPickerType === "img") {
        setProfile(image.path);
        // Ensure doc fields are not affected
        if (doc && !aadharPhotoPath) {
          // Only clear if doc was set but no file path exists (meaning it was a profile selection)
        }
      } else if (currentPickerType === "doc") {
        console.log("i am in print==>", image);
        setDoc(image.filename || image.path);
        setAadharPhotoPath(image.path); // Store the actual path for file upload
        // Ensure profile is not affected when doc is selected
        if (profile && (profile.startsWith('/') || profile.startsWith('file://') || profile.startsWith('content://'))) {
          // Profile remains unchanged
        }
      }
    }).catch((error) => {
      console.log("Image picker cancelled or error:", error);
    });
  };
  const openCamera = () => {
    const currentPickerType = pickerType; // Capture the current pickerType before closing bottom sheet
    gotoBottomSheetClose();
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: currentPickerType === "img", // Only crop for profile images
    }).then((image) => {
      console.log("Print the image", image);
      console.log("Picker type:", currentPickerType);
      if (currentPickerType === "img") {
        setProfile(image.path);
        // Ensure doc fields are not affected
      } else if (currentPickerType === "doc") {
        console.log("DOC", image);
        setDoc(image.filename || image.path);
        setAadharPhotoPath(image.path); // Store the actual path for file upload
        // Ensure profile is not affected when doc is selected
      }
    }).catch((error) => {
      console.log("Camera cancelled or error:", error);
    });
  };
  const gotoBasicDetails = () => {
    setScreenName("first");
  };
  const gotoContactInfo = () => {
    setScreenName("second");
  };

  // Load user data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadUserData();
    }
  }, [isEditMode]);

  const loadUserData = async () => {
    try {
      setIsLoadingUserData(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Error", "Please login first");
        setIsLoadingUserData(false);
        return;
      }

      const response = await getUser(token);
      console.log("response==>", response);
      
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        
        // Populate basic details - always set, use empty string if not present
        setName(userData.name || "");
        setEmail(userData.email || "");
        setGender(userData.gender || "male");
        if (userData.dob) {
          const dobMoment = moment(userData.dob);
          setDob(dobMoment.format("DD-MM-YYYY"));
          setDobDate(dobMoment.toDate());
        } else {
          setDob("");
          setDobDate(null);
        }
        if (userData.profileImage) setProfile(userData.profileImage);
        
        // Populate contact information - always set, use empty string if not present
        setPhoneNumber(userData.phone || "");
        setLocation(userData.location || "");
        setSelected(userData.userType || "student");
        setIsEnabled(userData.whatsappUpdates !== undefined ? userData.whatsappUpdates : false);
        
        // Populate user type specific fields - always set, use empty string if not present
        if (userData.userType === "student") {
          setInstituteName(userData.instituteName || "");
          setGuardianName(userData.guardianName || "");
          setGuardianContact(userData.guardianContact || "");
          // Clear professional fields
          setOrganizationName("");
          setEmergencyContactName("");
          setEmergencyContactNumber("");
        } else if (userData.userType === "professional") {
          setOrganizationName(userData.organizationName || "");
          setEmergencyContactName(userData.emergencyContactName || "");
          setEmergencyContactNumber(userData.emergencyContactNumber || "");
          // Clear student fields
          setInstituteName("");
          setGuardianName("");
          setGuardianContact("");
        } else {
          // If userType is not set, clear all type-specific fields
          setInstituteName("");
          setGuardianName("");
          setGuardianContact("");
          setOrganizationName("");
          setEmergencyContactName("");
          setEmergencyContactNumber("");
        }
        
        // Populate KYC fields
        if (userData.aadhaarNumber) {
          setAadhaarNumber(userData.aadhaarNumber);
        } else {
          setAadhaarNumber("");
        }
        if (userData.aadharPhoto) {
          setDoc(userData.aadharPhoto);
          // Note: We can't set the file path for existing aadhar photo, user needs to re-upload if changing
        } else {
          setDoc("");
        }
      } else {
        Alert.alert("Error", response.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load user data. Please try again.");
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // API call to update user profile
  const handleUpdateProfile = async () => {
    // Validation - Basic Details
    if (!name || name.trim().length === 0) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    
    if (!email || email.trim().length === 0) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    
    // Validation - Contact Information
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid mobile number");
      return;
    }

    if (!location || location.trim().length === 0) {
      Alert.alert("Error", "Please enter your location");
      return;
    }

    if (selected === "professional") {
      if (!organizationName || !emergencyContactName || !emergencyContactNumber) {
        Alert.alert("Error", "Please fill all required fields for professional");
        return;
      }
    } else if (selected === "student") {
      if (!instituteName || !guardianName || !guardianContact) {
        Alert.alert("Error", "Please fill all required fields for student");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Error", "Please login first");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      
      // Add profile image if selected (only if it's a new file, not a URL)
      if (profile && (profile.startsWith('/') || profile.startsWith('file://') || profile.startsWith('content://'))) {
        // New profile image selected
        let fileUri = profile;
        if (Platform.OS === 'android' && !fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
          fileUri = fileUri.startsWith('/') ? `file://${fileUri}` : `file:///${fileUri}`;
        }
        
        const getFileType = (uri) => {
          const ext = uri?.toLowerCase().split('.').pop();
          if (ext === 'png') return 'image/png';
          if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
          return 'image/jpeg';
        };
        
        const fileName = `profile_${Date.now()}.jpg`;
        const fileType = getFileType(profile);
        
        formData.append('profileImage', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
      }

      // Add basic details fields - ALWAYS send required fields as strings
      // Ensure all values are strings for FormData compatibility
      formData.append('name', String(name || '').trim());
      formData.append('email', String(email || '').trim());
      formData.append('phone', String(phoneNumber || '').trim());
      formData.append('location', String(location || '').trim());
      formData.append('gender', String(gender || 'male'));
      if (dobDate) {
        // Format date as YYYY-MM-DD for backend
        const formattedDob = moment(dobDate).format('YYYY-MM-DD');
        formData.append('dob', String(formattedDob));
      } else {
        formData.append('dob', '');
      }
      
      // Add KYC fields
      if (aadhaarNumber) {
        formData.append('aadhaarNumber', String(aadhaarNumber));
      } else {
        formData.append('aadhaarNumber', '');
      }
      
      // Add contact information fields - ALWAYS send as strings
      formData.append('userType', String(selected || 'student'));
      formData.append('whatsappUpdates', String(isEnabled));

      // Add user type specific fields - ALWAYS send as strings, even if empty
      if (selected === "student") {
        formData.append('institute', String(instituteName || '').trim());
        formData.append('instituteName', String(instituteName || '').trim());
        formData.append('guardianName', String(guardianName || '').trim());
        formData.append('guardianContact', String(guardianContact || '').trim());
        // Clear professional fields
        formData.append('organizationName', '');
        formData.append('emergencyContactName', '');
        formData.append('emergencyContactNumber', '');
      } else if (selected === "professional") {
        formData.append('organizationName', String(organizationName || '').trim());
        formData.append('emergencyContactName', String(emergencyContactName || '').trim());
        formData.append('emergencyContactNumber', String(emergencyContactNumber || '').trim());
        // Clear student fields
        formData.append('institute', '');
        formData.append('instituteName', '');
        formData.append('guardianName', '');
        formData.append('guardianContact', '');
      } else {
        // If userType is not set, send empty strings for all type-specific fields
        formData.append('institute', '');
        formData.append('instituteName', '');
        formData.append('guardianName', '');
        formData.append('guardianContact', '');
        formData.append('organizationName', '');
        formData.append('emergencyContactName', '');
        formData.append('emergencyContactNumber', '');
      }

      // Verify FormData is properly constructed
      if (!formData) {
        Alert.alert("Error", "Failed to prepare form data");
        setIsLoading(false);
        return;
      }

      const response = await updateUserProfile(formData);

      console.log("Update profile response:", response);

      if (response.success) {
        Alert.alert("Success", response.message || "Profile updated successfully", [
          {
            text: "OK",
            onPress: () => props.navigation.goBack(),
          },
        ]);
      } else {
        let errorMessage = response.message || "Failed to update profile. Please try again.";
        
        if (response.status === 400) {
          errorMessage = response.message || "Invalid data. Please check all fields.";
        } else if (response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.message) {
        if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('JSON')) {
          errorMessage = "Invalid response from server. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // API call to register by client
  const handleRegisterByClient = async () => {
    // Validation - Basic Details
    if (!name || name.trim().length === 0) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    
    if (!email || email.trim().length === 0) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    
    // Validation - Contact Information
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid mobile number");
      return;
    }

    if (!location || location.trim().length === 0) {
      Alert.alert("Error", "Please enter your location");
      return;
    }

    if (selected === "professional") {
      if (!organizationName || !emergencyContactName || !emergencyContactNumber) {
        Alert.alert("Error", "Please fill all required fields for professional");
        return;
      }
    } else if (selected === "student") {
      if (!instituteName || !guardianName || !guardianContact) {
        Alert.alert("Error", "Please fill all required fields for student");
        return;
      }
    }

    // Validation - KYC Information
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      Alert.alert("Error", "Please enter a valid 12-digit Aadhaar number");
      return;
    }

    if (!aadharPhotoPath) {
      Alert.alert("Error", "Please upload Aadhar photo");
      return;
    }

    setIsLoading(true);

    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Error", "Please login first");
        setIsLoading(false);
        return;
      }

      // Format file path for React Native (add file:// prefix if needed for Android)
      let fileUri = aadharPhotoPath;
      if (Platform.OS === 'android' && !fileUri.startsWith('file://') && !fileUri.startsWith('content://')) {
        fileUri = fileUri.startsWith('/') ? `file://${fileUri}` : `file:///${fileUri}`;
      }

      // Determine file type from extension
      const getFileType = (filename) => {
        const ext = filename?.toLowerCase().split('.').pop();
        if (ext === 'png') return 'image/png';
        if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
        return 'image/jpeg'; // default
      };

      const fileName = doc || 'aadhar.jpg';
      const fileType = getFileType(fileName);

      const formData = new FormData();
      
      // Add Aadhar photo (required) - React Native FormData format
      formData.append('aadharPhoto', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      });

      // Add basic details fields
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('phone', phoneNumber.trim());
      formData.append('location', location.trim());
      if (gender) formData.append('gender', gender);
      if (dobDate) {
        // Format date as YYYY-MM-DD for backend
        const formattedDob = moment(dobDate).format('YYYY-MM-DD');
        formData.append('dob', formattedDob);
      }
      
      // Add KYC fields
      formData.append('aadhaarNumber', aadhaarNumber);
      
      // Add contact information fields
      formData.append('userType', selected);
      formData.append('whatsappUpdates', isEnabled.toString());

      // Add user type specific fields
      if (selected === "student") {
        if (instituteName) formData.append('instituteName', instituteName.trim());
        if (guardianName) formData.append('guardianName', guardianName.trim());
        if (guardianContact) formData.append('guardianContact', guardianContact.trim());
      } else if (selected === "professional") {
        // Add professional fields if needed
        if (organizationName) formData.append('organizationName', organizationName.trim());
        if (emergencyContactName) formData.append('emergencyContactName', emergencyContactName.trim());
        if (emergencyContactNumber) formData.append('emergencyContactNumber', emergencyContactNumber.trim());
      }

      console.log("FormData being sent - File URI:", fileUri);
      console.log("FormData being sent - Phone:", phoneNumber);
      console.log("FormData being sent - Name:", name);

      // Use reusable API function with FormData support
      const response = await apiPost('auth/client/register-by-client', formData, {
        isFormData: true,
        requireAuth: false,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      console.log("Response data:", response);

      if (response.success) {
        // Store the new token if provided
        if (response.data?.token) {
          await setUserToken(response.data.token);
        }
        
        Alert.alert("Success", response.message || "Registration successful", [
          {
            text: "OK",
            onPress: () => gotoRegister(),
          },
        ]);
      } else {
        // Handle error responses
        let errorMessage = response.message || "Failed to register. Please try again.";
        
        // Handle specific HTTP status codes
        if (response.status === 400) {
          errorMessage = response.message || "Invalid data. Please check all fields.";
        } else if (response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (response.status === 409) {
          errorMessage = response.message || "User already exists with this phone or Aadhaar number.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Register by client error:", error);
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      
      let errorMessage = "Failed to register. Please try again.";
      
      // Handle different types of errors
      if (error.message) {
        if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('JSON')) {
          errorMessage = "Invalid response from server. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error("Final error message:", errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.goastWhite }} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.goastWhite}
      />
      {isEditMode && (
        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icons
              iconSetName={"Ionicons"}
              iconName={"arrow-back"}
              iconColor={Colors.black}
              iconSize={24}
            />
          </TouchableOpacity>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={AuthStyle.registerContainer}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View style={[AuthStyle.photoContainer]}>
          {profile ? (
            <Image source={{ uri: profile }} style={[AuthStyle.profileImg]} />
          ) : (
            <View style={[AuthStyle.photoView]}>
              <Icons
                iconSetName={"Ionicons"}
                iconName={"camera-outline"}
                iconColor={Colors.black}
                iconSize={50}
              />
            </View>
          )}
          <TouchableOpacity onPress={() => openImgOption("img")} activeOpacity={0.7}>
              <View style={[AuthStyle.plusIcon, {height: 40, width: 40, justifyContent: "center", alignItems: "center" }]}>
              <Icons
                iconSetName={"FontAwesome6"}
                iconName={"plus"}
                iconColor={Colors.black}
                iconSize={18}
              />
            </View>
          </TouchableOpacity>
        </View>
          {screenName == "first" ? (
            <View>
              <Text style={[AuthStyle.registerTitle]}>{"Basic Details"}</Text>
              <Input 
                InputLabel={"Full Name*"} 
                value={name}
                onChangeText={setName}
              />
              <Input 
                InputLabel={"Email ID*"} 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={[AuthStyle.inputText]}>{"Date of birth"}</Text>
              <TouchableOpacity
                onPress={() => setOpen(true)}
                style={[AuthStyle.dateView]}
              >
                <Text style={[AuthStyle.textDate]}>{dob || "Select date"}</Text>
                <DatePicker
                  mode={"date"}
                  modal
                  open={open}
                  date={dobDate || new Date()}
                  onConfirm={(selectedDate) => {
                    handleMovingDate(selectedDate);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </TouchableOpacity>
              <Text style={[AuthStyle.inputText]}>{"Gender"}</Text>
              <View
                style={[
                  AuthStyle.radioContainer,
                  { ...LayoutStyle.marginTop10 },
                ]}
              >
                <TouchableOpacity onPress={() => setGender("male")}>
                  <View style={{ ...CommonStyles.directionRowCenter }}>
                    <Icons
                      iconSetName={"Ionicons"}
                      iconName={
                        gender === "male"
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      iconColor={Colors.black}
                      iconSize={26}
                    />
                    <Text style={[AuthStyle.radioTextLabel]}>{"Male"}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setGender("female")}>
                  <View style={{ ...CommonStyles.directionRowCenter }}>
                    <Icons
                      iconSetName={"Ionicons"}
                      iconName={
                        gender === "female"
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      iconColor={Colors.black}
                      iconSize={26}
                    />
                    <Text style={[AuthStyle.radioTextLabel]}>{"Female"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[AuthStyle.buttonContainer]}>
                <Text style={[AuthStyle.registerTitleGray]}>
                  {"Contact Information"}
                </Text>
                <Text
                  style={[
                    AuthStyle.registerTitleGray,
                    { ...LayoutStyle.marginTop10 },
                  ]}
                >
                  {"KYC information"}
                </Text>
                <View style={{ ...LayoutStyle.marginTop20 }}>
                  <Button
                    onPress={() => gotoUpdateScreen()}
                    btnName={"NEXT"}
                    bgColor={Colors.primary}
                    btnTextColor={Colors.blackText}
                  />
                </View>
              </View>
            </View>
          ) : screenName == "second" ? (
            <View>
              <TouchableOpacity onPress={() => gotoBasicDetails()}>
                <Text style={[AuthStyle.registerTitleGray]}>
                  {"Basic Details"}
                </Text>
              </TouchableOpacity>
              <Text style={[AuthStyle.registerTitle]}>
                {"Contact Information"}
              </Text>
              <View style={[AuthStyle.inputContainer]}>
                <Text style={[AuthStyle.inputLabel]}>{"Mobile Number"}</Text>
              </View>
              <View style={AuthStyle.mobileInputContainer}>
                <TouchableOpacity style={AuthStyle.countryCode}>
                  <Image source={IMAGES.indianFlag} style={AuthStyle.flag} />
                  <Text style={AuthStyle.code}>{"+91"}</Text>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'chevron-down'}
                    iconColor={Colors.gray}
                    iconSize={18}
                  />
                </TouchableOpacity>
                <TextInput
                  style={AuthStyle.input}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  cursorColor={Colors.secondary}
                />
              </View>
              <View style={[AuthStyle.inputContainer, {marginTop: 15}]}>
                <Text style={[AuthStyle.inputLabel]}>{"Location*"}</Text>
              </View>
              <View style={AuthStyle.mobileInputContainer}>
                <TextInput
                  style={AuthStyle.input}
                  value={location}
                  onChangeText={setLocation}
                  cursorColor={Colors.secondary}
                />
              </View>
              <View style={[AuthStyle.toggleContainer]}>
                <Text style={[AuthStyle.toggleText]}>
                  {"Get Updates on WhatsApp "}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <View style={[AuthStyle.radioContainer]}>
                <Text style={[AuthStyle.radioText]}>{`I'm a`}</Text>
                <TouchableOpacity onPress={() => setSelected("professional")}>
                  <View style={CommonStyles.directionRowCenter}>
                    <Icons
                      iconSetName={"Ionicons"}
                      iconName={
                        selected === "professional"
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      iconColor={Colors.black}
                      iconSize={24}
                    />
                    <Text style={[AuthStyle.radioTextLabel]}>
                      {"Professional"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelected("student")}>
                  <View style={CommonStyles.directionRowCenter}>
                    <Icons
                      iconSetName={"Ionicons"}
                      iconName={
                        selected === "student"
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      iconColor={Colors.black}
                      iconSize={24}
                    />
                    <Text style={[AuthStyle.radioTextLabel]}>{"Student "}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {selected === "professional" ? (
                <View>
                  <Input 
                    InputLabel={"Organization Name"} 
                    value={organizationName}
                    onChangeText={setOrganizationName}
                  />
                  <Input 
                    InputLabel={"Emergency Contact name"} 
                    value={emergencyContactName}
                    onChangeText={setEmergencyContactName}
                  />
                  <Input 
                    InputLabel={"Emergency Contact number"} 
                    value={emergencyContactNumber}
                    onChangeText={setEmergencyContactNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              ) : (
                <View>
                  <Input 
                    InputLabel={"Institute Name"} 
                    value={instituteName}
                    onChangeText={setInstituteName}
                  />
                  <Input 
                    InputLabel={"Guardian Name"} 
                    value={guardianName}
                    onChangeText={setGuardianName}
                  />
                  <Input
                    InputLabel={"Guardian Contact Number"}
                    value={guardianContact}
                    onChangeText={setGuardianContact}
                    keyboardType="phone-pad"
                  />
                </View>
              )}

              <View style={[AuthStyle.buttonContainer]}>
                <Text
                  style={[
                    AuthStyle.registerTitleGray,
                    { ...LayoutStyle.marginTop10 },
                  ]}
                >
                  {"KYC information"}
                </Text>
                <View style={{ ...LayoutStyle.marginTop20 }}>
                  <Button
                    onPress={() => gotoKycScreen()}
                    btnName={"NEXT"}
                    bgColor={Colors.primary}
                    btnTextColor={Colors.blackText}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <TouchableOpacity onPress={() => gotoBasicDetails()}>
                <Text style={[AuthStyle.registerTitleGray]}>
                  {"Basic Details"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => gotoContactInfo()}>
                <Text style={[AuthStyle.registerTitleGray]}>
                  {"Contact Information"}
                </Text>
              </TouchableOpacity>
              <Text style={[AuthStyle.registerTitle]}>{"KYC information"}</Text>
              <Input
                InputLabel={"Aadhar Card Number*"}
                value={aadhaarNumber}
                onChangeText={(text) => {
                  // Only allow numbers and limit to 12 digits
                  const numericText = text.replace(/[^0-9]/g, '').slice(0, 12);
                  setAadhaarNumber(numericText);
                }}
                keyboardType="phone-pad"
                maxLength={12}
              />
              <Text style={[AuthStyle.inputText]}>{"Upload Aadhar Document*"}</Text>

              <View style={[AuthStyle.uploadImgContainer]}>
                <Text>{doc || ""}</Text>
                <TouchableOpacity
                  style={[AuthStyle.uploadIcon]}
                  onPress={() => openImgOption("doc")}
                >
                  <Icons
                    iconSetName={"MaterialCommunityIcons"}
                    iconName={"upload"}
                    iconColor={Colors.gray}
                    iconSize={26}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ ...LayoutStyle.marginTop30 }}>
                {isLoading || isLoadingUserData ? (
                  <View style={{ alignItems: "center", padding: 15 }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                ) : (
                  <Button
                    onPress={isEditMode ? handleUpdateProfile : handleRegisterByClient}
                    btnName={isEditMode ? "UPDATE" : "SUBMIT"}
                    bgColor={Colors.primary}
                    btnTextColor={Colors.blackText}
                  />
                )}
              </View>
            </View>
          )}
      </ScrollView>
      {isBottomSheet && (
        <BottomSheet
          maxHeight={deviceHight / 4.5}
          isOpen={isBottomSheet}
          onClose={() => gotoBottomSheetClose()}
          renderContent={() => {
            return (
              <View style={[AuthStyle.bottomSheetContent]}>
                <Text style={[AuthStyle.selectOption]}>{"Select Option"}</Text>
                <View style={[AuthStyle.imgOptionContainer]}>
                  <TouchableOpacity onPress={() => openCamera()}>
                    <View style={[AuthStyle.optionView]}>
                      <Icons
                        iconSetName={"MaterialIcons"}
                        iconName={"add-a-photo"}
                        iconColor={Colors.secondary}
                        iconSize={36}
                      />
                      <Text style={[AuthStyle.imgOpenName]}>{"Camera"}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openGallery()}>
                    <View style={[AuthStyle.optionView]}>
                      <Icons
                        iconSetName={"MaterialIcons"}
                        iconName={"photo-library"}
                        iconColor={Colors.secondary}
                        iconSize={36}
                      />
                      <Text style={[AuthStyle.imgOpenName]}>{"Gallery"}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

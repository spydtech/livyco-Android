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
import Api from "../../utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = (props) => {
  // Basic Details fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("DD/MM/YYYY");
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
    gotoBottomSheetClose();
    ImagePicker.openPicker({
      width: 300,
      height: 400,
    }).then((image) => {
      console.log(image);
      if (pickerType === "img") {
        setProfile(image.path);
      } else if (pickerType === "doc") {
        console.log("i am in print==>", image);
        setDoc(image.filename || image.path);
        setAadharPhotoPath(image.path); // Store the actual path for file upload
      }
    });
  };
  const openCamera = () => {
    gotoBottomSheetClose();
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log("Print the image", image);
      if (pickerType === "img") {
        setProfile(image.path);
      } else if (pickerType === "doc") {
        console.log("DOC", image);
        
        setDoc(image.filename || image.path);
        setAadharPhotoPath(image.path); // Store the actual path for file upload
      }
    });
  };
  const gotoBasicDetails = () => {
    setScreenName("first");
  };
  const gotoContactInfo = () => {
    setScreenName("second");
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

      const formData = new FormData();
      
      // Add Aadhar photo (required)
      formData.append('aadharPhoto', {
        uri: aadharPhotoPath,
        type: 'image/jpeg',
        name: doc || 'aadhar.jpg',
      });

      // Add basic details fields
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phoneNumber);
      formData.append('location', location);
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
        if (instituteName) formData.append('instituteName', instituteName);
        if (guardianName) formData.append('guardianName', guardianName);
        if (guardianContact) formData.append('guardianContact', guardianContact);
      }

      console.log("FormData being sent:", formData);

      // Use existing Api.js structure for FormData
      // The interceptor will automatically handle FormData headers
      const response = await Api.post('auth/client/register-by-client', formData);

      console.log("Response of register by client:", response.data);

      if (response.data && response.data.success) {
        // Store the new token if provided
        if (response.data.token) {
          await setUserToken(response.data.token);
        }
        
        Alert.alert("Success", response.data.message || "Registration successful", [
          {
            text: "OK",
            onPress: () => gotoRegister(),
          },
        ]);
      } else {
        const errorMessage = response.data?.message || "Failed to register. Please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Register by client error:", error);
      
      let errorMessage = "Failed to register. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
        console.error("Error response:", error.response.status, error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your internet connection.";
        console.error("Network error - No response:", error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
        console.error("Request setup error:", error.message);
      }
      
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={AuthStyle.registerContainer}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <TouchableOpacity style={[AuthStyle.photoContainer]} onPress={() => openImgOption("img")}>
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
          <TouchableOpacity>
              <View style={[AuthStyle.plusIcon, {height: 40, width: 40, justifyContent: "center", alignItems: "center" }]}>
              <Icons
                iconSetName={"FontAwesome6"}
                iconName={"plus"}
                iconColor={Colors.black}
                iconSize={18}
              />
            </View>
          </TouchableOpacity>
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
                <Text style={[AuthStyle.textDate]}>{dob}</Text>
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
                    iconSetName={"FontAwesome6"}
                    iconName={"caret-down"}
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
                  placeholder="Enter your location"
                  placeholderTextColor={Colors.placeholder}
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
                <Text>{doc || "No file selected"}</Text>
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
                {isLoading ? (
                  <View style={{ alignItems: "center", padding: 15 }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                ) : (
                  <Button
                    onPress={handleRegisterByClient}
                    btnName={"SUBMIT"}
                    bgColor={Colors.primary}
                    btnTextColor={Colors.blackText}
                  />
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
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

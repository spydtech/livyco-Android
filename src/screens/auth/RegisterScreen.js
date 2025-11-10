import {
  View,
  Text,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
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

const RegisterScreen = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selected, setSelected] = useState("option1");
  const [gender, setGender] = useState("male");
  const [screenName, setScreenName] = useState("first");
  const [isEnabled, setIsEnabled] = useState(false);
  const [dob, setDob] = useState("DD/MM/YYYY");
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState("");
  const [doc, setDoc] = useState("");
  const [pickerType, setPickerType] = useState("");
  const [isBottomSheet, setIsBottomSheet] = useState(false);

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
        setDoc(image.filename);
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
        setDoc(image.filename);
      }
    });
  };
  const gotoBasicDetails = () => {
    setScreenName("first");
  };
  const gotoContactInfo = () => {
    setScreenName("second");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={AuthStyle.registerContainer}
    >
      <StatusBar
        baSafeAreaViewrStyle="dark-content"
        backgroundColor={Colors.goastWhite}
      />
      <SafeAreaView style={{ paddingTop: 10, flex: 1 }} />
      <ScrollView>
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
          <TouchableOpacity onPress={() => openImgOption("img")}>
            <View style={[AuthStyle.plusIcon]}>
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
              <Input InputLabel={"Full Name*"} />
              <Input InputLabel={"Email ID*"} />
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
                  date={new Date()}
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
                <TouchableOpacity onPress={() => setSelected("option1")}>
                  <View>
                    <Icons
                      iconSetName={"Ionicons"}
                      iconName={
                        selected === "option1"
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
                <TouchableOpacity onPress={() => setSelected("option2")}>
                  <View>
                    <Icons
                      iconSetName={"Ionicons"}
                      iconName={
                        selected === "option2"
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
              {selected === "option1" ? (
                <View>
                  <Input InputLabel={"Organization Name"} />
                  <Input InputLabel={"Emergency Contact name"} />
                  <Input InputLabel={"Emergency Contact number"} />
                </View>
              ) : (
                <View>
                  <Input InputLabel={"Institute Name"} />
                  <Input InputLabel={"Guardian Name"} />
                  <Input
                    InputLabel={"Guardian Contact Number"}
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
                keyboardType="phone-pad"
              />
              <Input
                InputLabel={"Bank Account Number*"}
                keyboardType="phone-pad"
              />
              <Input InputLabel={"IFSC Code*"} />
              <Text style={[AuthStyle.inputText]}>{"Upload Document*"}</Text>

              <View style={[AuthStyle.uploadImgContainer]}>
                <Text>{doc}</Text>
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
                <Button
                  onPress={() => gotoRegister()}
                  btnName={"NEXT"}
                  bgColor={Colors.primary}
                  btnTextColor={Colors.blackText}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {isBottomSheet && (
        <BottomSheet
          maxHeight={deviceHight / 4.5}
          isOpen={isBottomSheet}
          onClose={() => gotoBottomSheetClose()}
          renderContent={() => {
            return (
              <View style={[AuthStyle.bottomSheetHeight]}>
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
  );
};

export default RegisterScreen;

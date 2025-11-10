import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, Icons, DropDown, Input} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import DatePicker from 'react-native-date-picker';
import CommonStyles from '../../styles/CommonStyles';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';

const GroupBookingScreen = props => {
  const [moveDate, setMoveDate] = useState('DD/MM/YYYY');
  const [open, setOpen] = useState(false);
  const [screen1, setScreen1] = useState(true);

  const optionList = [
    {
      id: 1,
      optionName: 'Single Sharing',
    },
    {
      id: 2,
      optionName: 'Double Sharing',
    },
    {
      id: 3,
      optionName: 'Triple Sharing',
    },
    {
      id: 4,
      optionName: 'Four \nSharing',
    },
    {
      id: 5,
      optionName: 'Five  \nSharing',
    },
    {
      id: 6,
      optionName: 'Six  \nSharing',
    },
  ];

  const dropdownData = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
  ];

  const renderOptionList = (item, index) => {
    return (
      <TouchableOpacity>
        <View style={[HomeStyle.optionListContainer]}>
          <Text style={[HomeStyle.optionListText]}>{item.optionName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const gotoNextScreen = () => {
    setScreen1(false);
  };

  const gotoPayNow = () => {
    props.navigation.navigate('Tab', {screen: 'PayTab'});
  };

  const handleMovingDate = date => {
    setOpen(false);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    console.log('in press date=>date', formattedDate);

    setMoveDate(formattedDate);
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View style={HomeStyle.headerContainerBlue}>
          <View style={HomeStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={HomeStyle.screenNameWhite}>{'Group Bookings'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={{backgroundColor: Colors.goastWhite}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {screen1 ? (
          <View style={[HomeStyle.homePadding20]}>
            <Text
              style={[
                HomeStyle.blackTextSmall,
                {...LayoutStyle.marginBottom15},
              ]}>
              {'Please fill the below details for a smooth transaction'}
            </Text>
            <View style={[HomeStyle.radioBtn]}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'radio-button-off-outline'}
                iconColor={Colors.gray}
                iconSize={24}
              />
              <Text style={[HomeStyle.visitText]}>{'Short Visit'}</Text>
            </View>
            <View style={[HomeStyle.dateContainer]}>
              <Text style={[HomeStyle.dateText]}>{'Move In Date *'}</Text>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'calendar-clear-outline'}
                iconColor={Colors.gray}
                iconSize={24}
              />
            </View>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={[HomeStyle.dateView]}>
              <Text style={[HomeStyle.textDate]}>{moveDate}</Text>
              <DatePicker
                mode={'date'}
                modal
                open={open}
                date={new Date()}
                onConfirm={selectedDate => {
                  handleMovingDate(selectedDate);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </TouchableOpacity>
            <Text style={[HomeStyle.optionSelectText]}>
              {'Select your preferred Sharing'}
            </Text>
            <FlatList
              numColumns={3}
              data={optionList}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                ...LayoutStyle.marginTop20,
              }}
              renderItem={({item: optionItem, index}) =>
                renderOptionList(optionItem, index)
              }
              scrollEnabled={false}
              keyExtractor={item => item.id}
            />
            <Text style={[HomeStyle.numbOf]}>{'Number Of Guest'}</Text>
            <DropDown
              placeholderStyle={[HomeStyle.dropdownMonth]}
              selectedTextStyle={[HomeStyle.dropdownMonth]}
              searchPlaceholder={'Search..'}
              itemContainerStyle={{
                paddingHorizontal: 10,
              }}
              containerStyle={{
                // borderRadius: 10,
                width: 90,
                paddingBottom: 10,
              }}
              itemTextStyle={{
                padding: 5,
                fontSize: 12,
              }}
              activeColor={Colors.secondary}
              dropdownData={dropdownData}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={'Select from below options'}
              value={'selectedMonth'}
              onChange={item => {
                // gotoChangeMonth(item.name);
              }}
            />

            <View style={[HomeStyle.bottomTextGroup]}>
              <Button onPress={() => gotoNextScreen()} btnName={'Continue'} />
              <Text style={[HomeStyle.bottomLabel]}>
                {'Id is mandatory during the check-in'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[HomeStyle.homePadding20]}>
            <View style={[HomeStyle.btnTapFlexStyle]}>
              <Button
                btnStyle={[HomeStyle.btnTapSelf]}
                flexContainer={{flexGrow: 0.456}}
                btnName={'Self'}
              />
              <Button
                flexContainer={{flexGrow: 0.456}}
                btnStyle={[HomeStyle.btnTapStyle]}
                btnName={'Others'}
                btnTextColor={Colors.grayText}
              />
            </View>

            <View style={{...LayoutStyle.marginTop20}}>
              <Text style={[HomeStyle.inputLabel]}>{'Name *'}</Text>
              <View style={{...CommonStyles.directionRowSB}}>
                <TextInput
                  style={[HomeStyle.inputName]}
                  placeholderTextColor={Colors.grayText}
                />
                <TextInput
                  style={[HomeStyle.inputAge]}
                  placeholderTextColor={Colors.grayText}
                  placeholder="Age"
                />
                <View>
                  <Text style={[HomeStyle.inputLabelGender]}>{'Gender'}</Text>
                  <View style={[HomeStyle.genderRadioView]}>
                    <View
                      style={[
                        HomeStyle.genderIconContainer,
                        {marginRight: 10},
                      ]}>
                      <Icons
                        iconSetName={'Ionicons'}
                        iconName={'man'}
                        iconColor={Colors.gray}
                        iconSize={20}
                      />
                    </View>
                    <View style={[HomeStyle.genderIconContainer]}>
                      <Icons
                        iconSetName={'Ionicons'}
                        iconName={'woman'}
                        iconColor={Colors.gray}
                        iconSize={20}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <Text style={[HomeStyle.inputMobileLabel]}>
                {'Mobile Number *'}
              </Text>
              <View style={{...CommonStyles.directionRowCenter}}>
                <TextInput
                  style={[HomeStyle.inputMobile]}
                  placeholderTextColor={Colors.grayText}
                />
                <TouchableOpacity style={[HomeStyle.verifyOTPContainer]}>
                  <Text style={[HomeStyle.verifyOtpText]}>{'Verify OTP'}</Text>
                </TouchableOpacity>
              </View>
              <Input InputLabel={'Alternate Mobile Number'} />
              <Input InputLabel={'Email'} />
              <Text style={[HomeStyle.idproof]}>{'Id Proof *'}</Text>
              <DropDown
                placeholderStyle={[HomeStyle.dropdownMonth]}
                selectedTextStyle={[HomeStyle.dropdownMonth]}
                searchPlaceholder={'Search..'}
                itemContainerStyle={{
                  paddingHorizontal: 10,
                }}
                containerStyle={{
                  // borderRadius: 10,
                  width: 90,
                  paddingBottom: 10,
                }}
                itemTextStyle={{
                  padding: 5,
                  fontSize: 12,
                }}
                activeColor={Colors.secondary}
                dropdownData={dropdownData}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder={'Select from below options'}
                value={'selectedMonth'}
                onChange={item => {
                  // gotoChangeMonth(item.name);
                }}
              />
              <Text style={[HomeStyle.inputMobileImg]}>{'Upload *'}</Text>
              <View style={[HomeStyle.uploadContainer]}>
                <TextInput
                  style={[HomeStyle.inputMobile]}
                  placeholderTextColor={Colors.grayText}
                />
                <TouchableOpacity style={[HomeStyle.verifyOTPContainer]}>
                  <Text style={[HomeStyle.verifyOtpText]}>{'Upload'}</Text>
                </TouchableOpacity>
              </View>
              <Input InputLabel={'Purpose of visit'} />
            </View>
            <Button
              btnStyle={HomeStyle.paynowBtn}
              btnName={'Pay Now'}
              onPress={() => gotoPayNow()}
            />
            <Text style={[HomeStyle.bottomLabel]}>
              {'Id is mandatory during the check-in'}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GroupBookingScreen;

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, DropDown, Icons} from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import MystaysStyle from '../../styles/MystaysStyle';
import LayoutStyle from '../../styles/LayoutStyle';
import {CommonActions} from '@react-navigation/native';

const ChangeRequestScreen = props => {
  const dropdownData = [
    {label: 'Bed Chnage', value: '1'},
    {label: 'Room Change', value: '2'},
    {label: 'Other Services', value: '3'},
  ];
  const [reason, setReason] = useState('');
  const [reasonValue, setReasonValue] = useState('');
  const [reasonDesc, setReasonDesc] = useState('');
  const [selectedSharing, setSelectedSharing] = useState(0);

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
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleSharingSelect = index => {
    setSelectedSharing(index);
    // props.navigation.navigate('BookingOption');
  };

  const renderOptionList = (item, index) => {
    return (
      <TouchableOpacity onPress={() => handleSharingSelect(index)}>
        <View
          style={[
            HomeStyle.optionListContainer,

            selectedSharing === index && HomeStyle.selectOptionListContainer,
          ]}>
          <Text
            style={[
              HomeStyle.optionListText,
              selectedSharing === index && HomeStyle.selectOptionListText,
            ]}>
            {item.optionName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const gotoSuccessRequet = () => {
    props.navigation.navigate('SuccessRequest');
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
            <TouchableOpacity
              onPress={() => {
                gotoBack();
              }}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={[MystaysStyle.pageHeader]}>{'Change Request'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={[MystaysStyle.container]}>
          <View style={{...CommonStyles.directionRowSB}}>
            <Text style={[MystaysStyle.staysText]}>{'Abc Boys Hostel'}</Text>
            <TouchableOpacity>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'share-social-outline'}
                iconColor={Colors.black}
                iconSize={22}
              />
            </TouchableOpacity>
          </View>
          <View style={[MystaysStyle.detailsViewMystay]}>
            <Text style={[MystaysStyle.checkDateTextBlack]}>
              {'Current room/bed details: '}
            </Text>
            <View>
              <View style={[MystaysStyle.detailsRoom]}>
                <Text style={[MystaysStyle.detailsText]}>
                  {'Room 101 - Bed B'}
                </Text>
              </View>
              <View
                style={[
                  MystaysStyle.detailsRoom,
                  {...LayoutStyle.marginTop10},
                ]}>
                <Text style={[MystaysStyle.detailsText]}>{'2 Sharing'}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={[MystaysStyle.checkDateTextBlack]}>
              {'Select what you want to change: '}
            </Text>
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
              placeholder={'Select'}
              value={'selectedMonth'}
              onChange={item => {
                console.log('i am in print===>', item);
                // gotoChangeMonth(item.name);
                setReason(item.label);
                setReasonValue(item.value);
              }}
            />
          </View>
          <Text style={[MystaysStyle.checkDateTextBlack]}>
            {'Reason for change'}
          </Text>
          <TextInput
            style={MystaysStyle.textarea}
            multiline={true}
            numberOfLines={4}
            placeholder="Type something here..."
            value={reasonDesc}
            onChangeText={text => setReasonDesc(text)}
          />

          {reasonValue === '1' ? (
            <View>
              <Text style={[MystaysStyle.checkDateTextBlack]}>
                {'Select your preferred bed'}
              </Text>
              <View style={{...CommonStyles.directionRowSB}}>
                <TouchableOpacity
                  style={[
                    MystaysStyle.roomBox,
                    {backgroundColor: Colors.paleYellow},
                  ]}>
                  <Text style={MystaysStyle.roomText}>{'101-A'}</Text>
                  <View style={[MystaysStyle.greenStripContainer]}>
                    <View style={[MystaysStyle.greenStrip]} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    MystaysStyle.roomBox,
                    {backgroundColor: Colors.selectedGreen},
                  ]}>
                  <Text style={MystaysStyle.roomText}>{'101-A'}</Text>
                  <View style={[MystaysStyle.greenStripContainer]}>
                    <View style={[MystaysStyle.grayStrip]} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    MystaysStyle.roomBox,
                    {backgroundColor: Colors.lightGray},
                  ]}>
                  <Text style={MystaysStyle.roomText}>{'101-A'}</Text>
                  <View style={[MystaysStyle.greenStripContainer]}>
                    <View style={[MystaysStyle.greenStrip]} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    MystaysStyle.roomBox,
                    {backgroundColor: Colors.selectedGreen},
                  ]}>
                  <Text style={MystaysStyle.roomText}>{'101-A'}</Text>
                  <View style={[MystaysStyle.greenStripContainer]}>
                    <View style={[MystaysStyle.grayStrip]} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    MystaysStyle.roomBox,
                    {backgroundColor: Colors.darkBorder},
                  ]}>
                  <Text style={MystaysStyle.roomText}>{'101-A'}</Text>
                  <View style={[MystaysStyle.greenStripContainer]}>
                    <View style={[MystaysStyle.grayStrip]} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={MystaysStyle.legendRow}>
                <View style={{alignItems: 'center'}}>
                  <View
                    style={[MystaysStyle.legendBox, {backgroundColor: 'green'}]}
                  />
                  <Text style={MystaysStyle.legendLabel}>Available</Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    ...LayoutStyle.paddingLeft15,
                  }}>
                  <View
                    style={[MystaysStyle.legendBox, {backgroundColor: 'gray'}]}
                  />
                  <Text style={MystaysStyle.legendLabel}>Not Available</Text>
                </View>
              </View>
            </View>
          ) : reasonValue === '2' ? (
            <View>
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
            </View>
          ) : null}
          <View style={{...LayoutStyle.paddingTop20}}>
            <Button
              onPress={() => gotoSuccessRequet()}
              btnName={'Raise Request'}
              btnStyle={[MystaysStyle.btnStylesmall]}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangeRequestScreen;

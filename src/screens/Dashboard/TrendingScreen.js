import {
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {BottomSheet, Icons, Input} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import {deviceHight} from '../../utils/DeviceInfo';
import FilterComponent from './FilterComponent';
import {CommonActions} from '@react-navigation/native';

const TrendingScreen = props => {
  const [rating, setRating] = useState(4);
  const [selected, setSelected] = useState(null);
  const [sortByModal, setSortByModal] = useState(false);
  const [isFilterl, setIsFilterl] = useState(false);
  const [statusColor, setStatusColor] = useState(Colors.secondary);

  const pgList = [
    {
      id: 1,
      name: '',
    },
    {
      id: 2,
      name: '',
    },
    {
      id: 3,
      name: '',
    },
    {
      id: 4,
      name: '',
    },
    {
      id: 5,
      name: '',
    },
    {
      id: 6,
      name: '',
    },
  ];
  const options = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Freshness',
  ];

  const gotoBooking = () => {
    props.navigation.navigate('PGBooking');
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const renderPGList = (data, index) => {
    return (
      <TouchableOpacity key={'flatlist' + index} onPress={() => gotoBooking()}>
        <View style={[HomeStyle.bedListContainer]}>
          <Image source={IMAGES.bed} style={[HomeStyle.bedimg]} />
          <View>
            <Text style={[HomeStyle.hostelTitle]}>
              {'Figma Deluxe  Hostel'}
            </Text>
            <View style={[HomeStyle.genderView]}>
              <Text style={[HomeStyle.servicesName]}>{'Male'}</Text>
            </View>
            <Text style={[HomeStyle.areaName]}>{'Uppal, Hyderabad'}</Text>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Text style={[HomeStyle.reviewText]}>{'Starting from '}</Text>
              <Text style={[HomeStyle.price]}>{'₹ 8000/-'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <View style={[HomeStyle.rateImg]}>
                {Array.from({length: 5}, (_, index) => (
                  <TouchableOpacity
                    key={'rate' + index}
                    onPress={() => handleRating(index + 1)}>
                    <Icons
                      iconSetName={'Ionicons'}
                      iconName={index < rating ? 'star' : 'star-outline'}
                      iconColor={Colors.rating}
                      iconSize={18}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[HomeStyle.reviewText]}>{'  49 reviews'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'wifi'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'Ionicons'}
                iconName={'car-sport'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'alpha-p-circle'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'Ionicons'}
                iconName={'bonfire-outline'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'iron'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'pot-steam-outline'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'FontAwesome6'}
                iconName={'user-secret'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <TouchableOpacity>
                <Text style={[HomeStyle.reviewText]}>{' View all '}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const gotoBottomSheetClose = () => {
    setSortByModal(false);
  };
  const closeModal = () => {
    setIsFilterl(false);
  };
  const handleApply = data => {
    console.log('Selected Data:', data);
  };

  const handleClear = () => {
    console.log('Filters cleared');
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={statusColor} />
      {!isFilterl ? (
        <SafeAreaView style={{}}>
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
              <Text style={HomeStyle.screenNameWhite}>{'Trending PG’s'}</Text>
            </View>
            <View style={HomeStyle.iconContainer}>
              <TouchableOpacity>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'notifications-outline'}
                  iconColor={Colors.white}
                  iconSize={26}
                />
                <View style={HomeStyle.smallRound}></View>
              </TouchableOpacity>
              <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'heart-outline'}
                  iconColor={Colors.white}
                  iconSize={26}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ImageBackground
            source={IMAGES.primaryBG}
            style={HomeStyle.formContainer}
            resizeMode="cover">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                ...LayoutStyle.paddingBottom30,
              }}
              showsVerticalScrollIndicator={false}>
              <View style={[HomeStyle.PgListContainer]}>
                <Input
                  placeholder={'Search for locality or landmark'}
                  inputStyle={HomeStyle.searchInput}
                  leftIcon={true}
                  leftIconSet={'Ionicons'}
                  leftIconName={'search-outline'}
                  leftIconColor={Colors.gray}
                  leftIconSize={18}
                  rightIcon={false}
                />
                <FlatList
                  data={pgList}
                  renderItem={({item: destinationItem, index}) =>
                    renderPGList(destinationItem, index)
                  }
                  scrollEnabled={false}
                  keyExtractor={item => item.id}
                />
              </View>
            </ScrollView>
            <View style={[HomeStyle.trendingFilter]}>
              <TouchableOpacity
                onPress={() => {
                  setSortByModal(true);
                }}>
                <View style={[HomeStyle.filterIconText]}>
                  <Image source={IMAGES.sort} style={[HomeStyle.iconFilter]} />
                  <Text style={[HomeStyle.filterName]}>{'Sort'}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsFilterl(true);
                }}>
                <View style={[HomeStyle.filterIconText]}>
                  <Image
                    source={IMAGES.filter}
                    style={[HomeStyle.iconFilter]}
                  />
                  <Text style={[HomeStyle.filterName]}>{'Filters'}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <BottomSheet
              maxHeight={deviceHight / 2}
              isOpen={sortByModal}
              onClose={() => gotoBottomSheetClose()}
              renderContent={() => {
                return (
                  <View style={[HomeStyle.bottomSheetHeight]}>
                    <Text style={[HomeStyle.blackTextbigCenter]}>
                      {'Sort By'}
                    </Text>
                    {options.map((item, index) => (
                      <TouchableOpacity
                        key={'opt' + index}
                        style={[
                          HomeStyle.option,
                          selected === item && HomeStyle.selectedOption,
                        ]}
                        onPress={() => setSelected(item)}>
                        <Text
                          style={[
                            HomeStyle.optionText,
                            selected === item && HomeStyle.selectedText,
                          ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              }}
            />
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <FilterComponent
          key={'index-filter'}
          onApply={() => {
            handleApply();
            closeModal(); // Close the modal after applying the filter
          }}
          onClear={() => {
            handleClear();
            closeModal(); // Close the modal after clearing the filter
          }}
          isFilterlShow={setIsFilterl} // Modal close handler
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default TrendingScreen;

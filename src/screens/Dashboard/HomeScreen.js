import {
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import FastImage from 'react-native-fast-image';
import LayoutStyle from '../../styles/LayoutStyle';
import { Button, Icons, Input, DropDown, CitySelectionModal } from '../../components';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import { Dropdown } from "react-native-element-dropdown";
import { deviceHight, deviceWidth } from '../../utils/DeviceInfo';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { getUser } from '../../services/authService';
import { getAllProperties, getApprovedReviews } from '../../services/homeService';
import { getUserToken } from '../../utils/Api';
import { isGuestUser, showGuestRestrictionAlert } from '../../utils/authUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = props => {
  const isFocused = useIsFocused();
  const [rating, setRating] = useState(4);
  const [shortVisit, setShortVisit] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkOut, setCheckOut] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [user, setUser] = useState(null);
  const [originalProperties, setOriginalProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState('For Him');
  const [sharingType, setSharingType] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [moveInDateOpen, setMoveInDateOpen] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  // Dropdown data
  const sharingTypeData = [
    { label: 'Single', value: 'single' },
    { label: 'Double', value: 'double' },
    { label: 'Triple', value: 'triple' },
    { label: 'Four', value: 'four' },
  ];

  const budgetData = [
    { label: '₹ 0 - ₹ 5,000', value: '0-5000' },
    { label: '₹ 5,000 - ₹ 10,000', value: '5000-10000' },
    { label: '₹ 10,000 - ₹ 15,000', value: '10000-15000' },
    { label: '₹ 15,000 - ₹ 20,000', value: '15000-20000' },
    { label: '₹ 20,000 - ₹ 25,000', value: '20000-25000' },
    { label: '₹ 25,000+', value: '25000+' },
  ];

  // Category data
  const categories = [
    {
      id: 1,
      title: 'For Professionals',
      image: IMAGES.category,
      features: ['High-Speed Internet', 'Locker facility', 'A.C & Room heaters', 'Lift'],
    },
    {
      id: 2,
      title: 'For Female',
      image: IMAGES.category,
      features: ['Safe & Secure', 'Emergency Preparedness', 'Hostel facilities', '24/7 CCTV'],
    },
    {
      id: 3,
      title: 'For Co-Living',
      image: IMAGES.category,
      features: ['Privacy & Security', 'Co-Working facility', 'Recreation', 'Amazing & Budget'],
    },
    {
      id: 4,
      title: 'For Students',
      image: IMAGES.category,
      features: ['24 Hours Electricity', 'Food facility', 'Internet facility', 'Work & Study area'],
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchHomeData();
  }, []);

  // Update StatusBar when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchHomeData();
    }, [])
  );

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const token = await getUserToken();

      // Fetch user profile
      if (token) {
        const userResponse = await getUser(token);
        if (userResponse.success && userResponse.data?.user) {
          setUser(userResponse.data.user);
        }
      }

      // Fetch properties
      const propertiesResponse = await getAllProperties();
      if (propertiesResponse.success) {
        // Filter only approved properties and keep original copy for search filtering
        const approvedProperties = propertiesResponse.data
          .filter(item => item.property?.status === 'approved');
        setOriginalProperties(approvedProperties);
        setFilteredProperties(approvedProperties);
      } else {
        setOriginalProperties([]);
        setFilteredProperties([]);
      }

      // Fetch reviews
      const reviewsResponse = await getApprovedReviews();
      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data.slice(0, 1));
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum price from room types for budget filtering
  const getMinPrice = item => {
    if (!item?.rooms?.roomTypes || item.rooms.roomTypes.length === 0) return 0;
    const prices = item.rooms.roomTypes
      .map(room => room.price || 0)
      .filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // Apply filters from the search UI
  const applySearchFilters = () => {
    if (!originalProperties.length) {
      setFilteredProperties([]);
      return;
    }

    let filtered = [...originalProperties];

    // Gender filter (maps UI text to backend values)
    if (selectedGender) {
      const genderMap = {
        'For Him': 'Male',
        'For Her': 'Female',
        'Co Living': 'Co Living',
      };
      const targetGender = genderMap[selectedGender] || selectedGender;
      filtered = filtered.filter(item => {
        const pgGender = item.pgProperty?.gender || '';
        return pgGender.toLowerCase() === targetGender.toLowerCase();
      });
    }

    // Sharing type filter (checks room labels/types)
    if (sharingType) {
      const targetSharing = sharingType.toLowerCase();
      filtered = filtered.filter(item => {
        const roomTypes = item.rooms?.roomTypes || [];
        return roomTypes.some(room => {
          const label = (room.label || room.type || '').toLowerCase();
          return label.includes(targetSharing);
        });
      });
    }

    // Budget filter using minimum room price
    if (budget) {
      const [minStr, maxStr] = budget.split('-');
      const budgetMin = parseInt(minStr, 10) || 0;
      const budgetMax = budget.includes('+') ? Infinity : parseInt(maxStr, 10) || Infinity;

      filtered = filtered.filter(item => {
        const minPrice = getMinPrice(item);
        return minPrice >= budgetMin && minPrice <= budgetMax;
      });
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(item =>
        (item.property?.city || '').toLowerCase() === selectedCity.toLowerCase(),
      );
    }

    setFilteredProperties(filtered);
  };

  const gotoPGDetails = async (item) => {
    // Check if user is a guest before allowing booking
    const isGuest = await isGuestUser();
    if (isGuest) {
      showGuestRestrictionAlert(props.navigation);
      return;
    }

    // Pass the complete property data object
    const propertyData = {
      property: item.property || {},
      pgProperty: item.pgProperty || {},
      media: item.media || {images: [], videos: []},
      rooms: item.rooms || {roomTypes: []},
      owner: item.owner || {}
    };
    props.navigation.navigate('PGBooking', { propertyData });
  };

  const renderPGList = ({ item, index }) => {
    if (!item || !item.property) return null;

    const property = item.property;
    const pgProperty = item.pgProperty;
    const media = item.media;
    const rooms = item.rooms;

    // Get first image or default
    const propertyImage = media?.images?.[0]?.url;
    const propertyName = property.name || 'PG Property';
    const propertyLocation = `${property.locality || ''}, ${property.city || ''}`.trim() || 'Location not specified';
    const propertyFor = pgProperty?.propertyFor || 'All';

    // Get minimum price from room types
    let minPrice = 0;
    if (rooms?.roomTypes && rooms.roomTypes.length > 0) {
      const prices = rooms.roomTypes.map(rt => rt.price || 0).filter(p => p > 0);
      minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    }

    const avgRating = 4;

    return (
      <TouchableOpacity
        onPress={() => gotoPGDetails(item)}
        style={{ marginRight: 15, width: screenWidth * 0.85 }}>
        <View style={[HomeStyle.bedListContainer]}>
          {propertyImage && propertyImage.startsWith('http') ? (
            <FastImage
              source={{ uri: propertyImage }}
              style={[HomeStyle.bedimg]}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image source={IMAGES.bed} style={[HomeStyle.bedimg]} />
          )}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[HomeStyle.hostelTitle]} numberOfLines={1}>
              {propertyName}
            </Text>
            <View style={[HomeStyle.genderView]}>
              <Text style={[HomeStyle.servicesName]}>{propertyFor}</Text>
            </View>
            <Text style={[HomeStyle.areaName]} numberOfLines={1}>
              {propertyLocation}
            </Text>
            {minPrice > 0 && (
              <View style={{ ...CommonStyles.directionRowCenter, marginTop: 5 }}>
                <Text style={[HomeStyle.reviewText]}>{'Starting from '}</Text>
                <Text style={[HomeStyle.price]}>{`₹ ${minPrice.toLocaleString()}/-`}</Text>
              </View>
            )}
            <View style={{ ...CommonStyles.directionRowCenter, marginTop: 5 }}>
              <View style={[HomeStyle.rateImg]}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Icons
                    key={index}
                    iconSetName={'Ionicons'}
                    iconName={index < avgRating ? 'star' : 'star-outline'}
                    iconColor={Colors.rating}
                    iconSize={16}
                  />
                ))}
              </View>
              <Text style={[HomeStyle.reviewText, { marginLeft: 5 }]}>{'49 reviews'}</Text>
            </View>
            <View style={{ ...CommonStyles.directionRowCenter, marginTop: 8, flexWrap: 'wrap' }}>
              <Icons iconSetName={'Ionicons'} iconName={'wifi'} iconColor={Colors.gray} iconSize={16} />
              <Icons iconSetName={'Ionicons'} iconName={'car-sport'} iconColor={Colors.gray} iconSize={16} />
              <Icons iconSetName={'MaterialCommunityIcons'} iconName={'alpha-p-circle'} iconColor={Colors.gray} iconSize={16} />
              <Icons iconSetName={'Ionicons'} iconName={'bonfire-outline'} iconColor={Colors.gray} iconSize={16} />
              <Icons iconSetName={'MaterialCommunityIcons'} iconName={'iron'} iconColor={Colors.gray} iconSize={16} />
              <Icons iconSetName={'MaterialCommunityIcons'} iconName={'pot-steam-outline'} iconColor={Colors.gray} iconSize={16} />
              <Icons iconSetName={'FontAwesome6'} iconName={'user-secret'} iconColor={Colors.gray} iconSize={16} />
              <TouchableOpacity>
                <Text style={[HomeStyle.reviewText, { marginLeft: 5 }]}>{'View all'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryList = ({ item }) => {
    return (
      <View style={[HomeStyle.cateContainer, { width: screenWidth * 0.45 }]}>
        <Image
          source={item.image}
          style={[HomeStyle.categoryImg, { width: '100%' }]}
          resizeMode="cover"
        />
        <View style={{ padding: 10 }}>
          <Text style={[HomeStyle.categoryLabel]}>{item.title}</Text>
          {item.features.map((feature, index) => (
            <View key={index} style={[HomeStyle.cateRoundContainer, { marginTop: 5 }]}>
              <View style={[HomeStyle.round]} />
              <Text style={[HomeStyle.cateDesc]}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const gotoTrendingPG = () => {
    props.navigation.navigate('Trending');
  };

  const gotoGroupBooking = () => {
    props.navigation.navigate('GroupBooking');
  };

  const renderPromotionalBanner = () => {
    return (
      <View style={{
        backgroundColor: Colors.secondary,
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 120,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'Roboto-Bold',
            color: Colors.white,
            marginBottom: 8,
          }}>
            Book Your favorite Hostel from Livyco
          </Text>
          <Text style={{
            fontSize: 14,
            fontFamily: 'Roboto-Medium',
            color: Colors.white,
            marginBottom: 10,
          }}>
            Get Cashback up to 20%
          </Text>
          <View style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            alignSelf: 'flex-start',
          }}>
            <Text style={{
              fontSize: 12,
              fontFamily: 'Roboto-Bold',
              color: Colors.black,
            }}>
              CASH BACK
            </Text>
          </View>
        </View>
        <Image
          source={IMAGES.banner}
          style={{
            width: 100,
            height: 100,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  const gotoUpdateShortVisit = () => {
    setShortVisit(!shortVisit);
  };

  const handleCheckInDate = date => {
    setOpen(false);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    setCheckIn(formattedDate);
  };

  const handleCheckOutDate = date => {
    setOpen(false);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    setCheckOut(formattedDate);
  };

  const handleMoveInDate = date => {
    setMoveInDateOpen(false);
    const formattedDate = moment(date).format('MM/DD/YYYY');
    setMoveInDate(formattedDate);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.name);
    setCityModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={HomeStyle.homeContainer}>
        {isFocused && (
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        )}
        <ImageBackground
          source={IMAGES.primaryBG}
          style={HomeStyle.formContainer}
          resizeMode="cover">
          <View style={HomeStyle.headerContainer}>
            <View style={HomeStyle.profileImgContainer}>
              <View style={[HomeStyle.profileView, {padding: user?.profileImage ? 0 : 5}]}>
                <FastImage
                  style={[HomeStyle.profileImg, {borderRadius: 15}]}
                  source={{
                    uri: user?.profileImage || 'https://cdn.pixabay.com/photo/2014/03/25/16/32/user-297330_1280.png',
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </View>
              <Text style={HomeStyle.userName} numberOfLines={1}>
                {user?.name || 'User'}
              </Text>
            </View>
            <View style={HomeStyle.iconContainer}>
              <TouchableOpacity 
                style={[HomeStyle.iconPadding10]}
                onPress={() => props.navigation.navigate('Notification')}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'notifications-outline'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
                <View style={HomeStyle.smallRound}></View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[HomeStyle.iconPadding10]}
                onPress={() => props.navigation.navigate('Wishlist')}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'heart-outline'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 30,
            }}
            showsVerticalScrollIndicator={false}>

            {/* Promotional Banner */}
            {renderPromotionalBanner()}

            {/* Search Section */}
            <View style={HomeStyle.searchView}>
              {/* Yellow Background Container */}
              <View style={HomeStyle.searchContainer}>
                {/* Gender Filter Buttons */}
                <View style={HomeStyle.genderButtonsContainer}>
                  {['For Him', 'For Her', 'Co Living'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      onPress={() => setSelectedGender(gender)}
                      style={[
                        HomeStyle.genderButton,
                        selectedGender === gender && HomeStyle.genderButtonSelected
                      ]}>
                      <Text style={[
                        HomeStyle.genderButtonText,
                        selectedGender === gender && HomeStyle.genderButtonTextSelected
                      ]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Sharing Type and Budget Dropdowns */}
                <View style={HomeStyle.dropdownsContainer}>
                  <View style={HomeStyle.dropdownWrapper}>
                    <Dropdown
                      data={sharingTypeData}
                      value={sharingType}
                      placeholder='Sharing Type'
                      onChange={(item) => setSharingType(item.value)}
                      labelField="label"
                      valueField="value"
                      style={{
                        height: 45,
                        backgroundColor: Colors.white,
                        borderRadius: 25,
                        paddingHorizontal: 15,
                      }}
                      placeholderStyle={{
                        color: Colors.grayBorder
                      }}
                      renderRightIcon={() => (
                        <Icons
                          iconSetName={'Ionicons'}
                          iconName={'chevron-down'}
                          iconColor={Colors.grayBorder}
                          iconSize={18}
                        />
                      )}
                    />
                    {/* <DropDown
                      placeholder="Sharing Type"
                      dropdownData={sharingTypeData}
                      value={sharingType}
                      onChange={(item) => setSharingType(item.value)}
                      labelField="label"
                      valueField="value"
                      mainDropdownStyle={HomeStyle.dropdownStyle}
                      renderRightIcon={() => (
                        <Icons
                          iconSetName={'Ionicons'}
                          iconName={'chevron-down'}
                          iconColor={Colors.gray}
                          iconSize={18}
                        />
                      )}
                    /> */}
                  </View>
                  <View style={[HomeStyle.dropdownWrapper, { marginLeft: 10 }]}>
                  <Dropdown
                      data={budgetData}
                      value={budget}
                      placeholder='Budget'
                      onChange={(item) => setBudget(item.value)}
                      labelField="label"
                      valueField="value"
                      style={{
                        height: 45,
                        backgroundColor: Colors.white,
                        borderRadius: 25,
                        paddingHorizontal: 15,
                      }}
                      placeholderStyle={{
                        color: Colors.grayBorder
                      }}
                      renderRightIcon={() => (
                        <Icons
                          iconSetName={'Ionicons'}
                          iconName={'chevron-down'}
                          iconColor={Colors.grayBorder}
                          iconSize={18}
                        />
                      )}
                    />
                    {/* <DropDown
                      placeholder="Budget"
                      dropdownData={budgetData}
                      value={budget}
                      onChange={(item) => setBudget(item.value)}
                      labelField="label"
                      valueField="value"
                      mainDropdownStyle={HomeStyle.dropdownStyle}
                      renderRightIcon={() => (
                        <Icons
                          iconSetName={'Ionicons'}
                          iconName={'chevron-down'}
                          iconColor={Colors.gray}
                          iconSize={18}
                        />
                      )}
                    /> */}
                  </View>
                </View>

                {/* Select City Button */}
                <TouchableOpacity 
                  style={HomeStyle.selectCityButton}
                  onPress={() => setCityModalVisible(true)}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'location'}
                    iconColor={Colors.black}
                    iconSize={20}
                  />
                  <Text style={HomeStyle.selectCityText}>
                    {selectedCity || 'Select City'}
                  </Text>
                </TouchableOpacity>

                {/* Move In Date */}
                <View style={HomeStyle.moveInContainer}>
                  <Text style={HomeStyle.moveInLabel}>Move In</Text>
                  <TouchableOpacity
                    style={HomeStyle.dateInputContainer}
                    onPress={() => setMoveInDateOpen(true)}>
                    <Text style={[
                      HomeStyle.dateInputText,
                      !moveInDate && HomeStyle.dateInputPlaceholder
                    ]}>
                      {moveInDate || 'mm/dd/yyyy'}
                    </Text>
                    <Icons
                      iconSetName={'Ionicons'}
                      iconName={'calendar-outline'}
                      iconColor={Colors.black}
                      iconSize={18}
                    />
                  </TouchableOpacity>
                  <DatePicker
                    mode={'date'}
                    modal
                    open={moveInDateOpen}
                    date={new Date()}
                    onConfirm={handleMoveInDate}
                    onCancel={() => setMoveInDateOpen(false)}
                  />
                </View>

                {/* Search Button */}
                <Button
                  btnName={'Search'}
                  btnTextColor={Colors.black}
                  bgColor={Colors.darkYellowButton}
                  btnStyle={HomeStyle.searchButtonStyle}
                  onPress={applySearchFilters}
                />
              </View>
            </View>

            {/* Trending PGs Section */}
            <View style={[HomeStyle.trendingPGCard, { ...LayoutStyle.paddingHorizontal20 }]}>
              <Text style={HomeStyle.blackTextMid}>{'Trending PGs'}</Text>
              <TouchableOpacity onPress={() => gotoTrendingPG()}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'arrow-right'}
                  iconColor={Colors.black}
                  iconSize={26}
                />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
            ) : filteredProperties.length > 0 ? (
              <FlatList
                data={filteredProperties}
                renderItem={renderPGList}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                keyExtractor={(item, index) => item.property?._id || `property-${index}`}
              />
            ) : (
              <Text style={[HomeStyle.reviewText, { textAlign: 'center', padding: 20 }]}>
                No properties available
              </Text>
            )}

            {/* How It Works Section */}
            <View style={HomeStyle.workCard}>
              <Text style={HomeStyle.blackTextMid}>{'How It Works'}</Text>
            </View>
            <View style={CommonStyles.directionRowSB}>
              <View style={HomeStyle.descImgContainer}>
                <Image source={IMAGES.searchImg} style={HomeStyle.searchImg} />
                <Text style={HomeStyle.descText}>
                  {'Browse verified listings tailored to your needs and within your budget.'}
                </Text>
              </View>
              <View style={HomeStyle.descImgContainer}>
                <Image source={IMAGES.formImg} style={HomeStyle.homeDescImg} />
                <Text style={HomeStyle.descText}>
                  {'Check and verify amenities, prices, and reviews'}
                </Text>
              </View>
              <View style={HomeStyle.descImgContainer}>
                <Image source={IMAGES.receiptImg} style={HomeStyle.homeDescImg} />
                <Text style={HomeStyle.descText}>
                  {'Secure your pay instantly with easy payment options.'}
                </Text>
              </View>
            </View>

            {/* Recently Viewed Section */}
            <View style={[HomeStyle.trendingPGCard, { ...LayoutStyle.paddingHorizontal20 }]}>
              <Text style={HomeStyle.blackTextMid}>{'Recently Viewed'}</Text>
              <TouchableOpacity onPress={()=> gotoTrendingPG()}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'arrow-right'}
                  iconColor={Colors.black}
                  iconSize={26}
                />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
            ) : filteredProperties.length > 0 ? (
              <FlatList
                data={filteredProperties.slice(0, 5)}
                renderItem={renderPGList}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                keyExtractor={(item, index) => item.property?._id || `recent-${index}`}
              />
            ) : (
              <Text style={[HomeStyle.reviewText, { textAlign: 'center', padding: 20 }]}>
                No recently viewed properties
              </Text>
            )}

            {/* Choice Best one by Category */}
            <View style={HomeStyle.workCard}>
              <Text style={[HomeStyle.blackTextMid, { ...LayoutStyle.marginBottom10 }]}>
                {'Choice Best one by Category'}
              </Text>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderCategoryList}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyExtractor={item => item.id.toString()}
              />
            </View>

            {/* Why Choose Us Section */}
            <View style={HomeStyle.chooseCard}>
              <Text style={[HomeStyle.blackTextMid, { alignSelf: 'center', marginTop: 20 }]}>
                {'Why Choose Us'}
              </Text>
              <View style={[HomeStyle.aboutContainer, { marginHorizontal: 20 }]}>
                <View style={[HomeStyle.aboutTextContainer]}>
                  <View>
                    <Text style={[HomeStyle.whiteTextBig]}>{'20+'}</Text>
                    <Text style={[HomeStyle.whiteTextMid]}>{'Cities'}</Text>
                  </View>
                  <View>
                    <Text style={[HomeStyle.whiteTextBig]}>{'190+'}</Text>
                    <Text style={[HomeStyle.whiteTextMid]}>{'Hostels'}</Text>
                  </View>
                  <View>
                    <Text style={[HomeStyle.whiteTextBig]}>{'10K+'}</Text>
                    <Text style={[HomeStyle.whiteTextMid]}>{'Customers'}</Text>
                  </View>
                </View>
              </View>
              <View style={[HomeStyle.mainServicesContainer, { paddingHorizontal: 20 }]}>
                <View style={[HomeStyle.servicesContainer]}>
                  <Image source={IMAGES.office} style={[HomeStyle.officeIcon]} />
                  <Text style={[HomeStyle.servicesText]}>
                    {'AVOID PHYSICAL VISIT'}
                  </Text>
                  <Text style={[HomeStyle.servicesDesc]}>
                    {'Experience hassle-free PG selection without the need for physical visits. Our app offers detailed property photos, and verified reviews, allowing you to explore and decide from the comfort of your home.'}
                  </Text>
                </View>
                <View style={[HomeStyle.servicesContainerRight]}>
                  <Image source={IMAGES.review} style={[HomeStyle.officeIcon]} />
                  <Text style={[HomeStyle.servicesTextRight]}>
                    {'Customer REVIEWS'}
                  </Text>
                  <Text style={[HomeStyle.servicesDescRight]}>
                    {'Make informed decisions with genuine customer reviews. Our app features verified feedback from previous tenants, giving you insights into the quality, amenities, and reliability of each PG before you book'}
                  </Text>
                </View>
                <View style={[HomeStyle.servicesContainer]}>
                  <Image source={IMAGES.points} style={[HomeStyle.officeIcon]} />
                  <Text style={[HomeStyle.servicesText]}>{'Amenities'}</Text>
                  <Text style={[HomeStyle.servicesDesc]}>
                    {'Discover PGs with all the amenities you need! From Wi-Fi, air conditioning, and laundry services to fully furnished rooms, our app helps you find accommodations that match your lifestyle and comfort requirements.'}
                  </Text>
                </View>
                <View style={[HomeStyle.servicesContainerRight]}>
                  <Image source={IMAGES.wallet} style={[HomeStyle.officeIcon]} />
                  <Text style={[HomeStyle.servicesTextRight]}>
                    {'Pay online'}
                  </Text>
                  <Text style={[HomeStyle.servicesDescRight]}>
                    {'Simplify your PG booking with secure online payment options. Instantly reserve your spot without the hassle of cash transactions. Safe, quick, and convenient!'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Feedbacks From Our Users */}
            <View style={HomeStyle.workCard}>
              <Text style={HomeStyle.blackTextMid}>
                {'Feedbacks From Our Users'}
              </Text>
            </View>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View key={review._id || index} style={[HomeStyle.feedbackComponent]}>
                  <View style={[HomeStyle.feedbackProfile]}>
                    <FastImage
                      style={HomeStyle.clientImg}
                      source={{
                        uri: review.userAvatar || 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  <View style={[HomeStyle.feedbackNameContainer]}>
                    <Text style={[HomeStyle.feedbackName]}>{review.userName || 'User'}</Text>
                    <Text style={[HomeStyle.whiteTextSmall]}>
                      {review.userRole || 'Customer'}
                    </Text>
                    <View style={[HomeStyle.rateImgViewFeedback]}>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Icons
                          key={starIndex}
                          iconSetName={'Ionicons'}
                          iconName={starIndex < (review.rating || 4) ? 'star' : 'star-outline'}
                          iconColor={Colors.primary}
                          iconSize={18}
                        />
                      ))}
                    </View>
                    <Text style={[HomeStyle.feedbackDesc]} numberOfLines={4}>
                      {review.comment || 'Great experience with this property!'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={[HomeStyle.feedbackComponent]}>
                <View style={[HomeStyle.feedbackProfile]}>
                  <FastImage
                    style={HomeStyle.clientImg}
                    source={{
                      uri: 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
                    }}
                  />
                </View>
                <View style={[HomeStyle.feedbackNameContainer]}>
                  <Text style={[HomeStyle.feedbackName]}>{'Sravanthi'}</Text>
                  <Text style={[HomeStyle.whiteTextSmall]}>
                    {'College Lecturer'}
                  </Text>
                  <View style={[HomeStyle.rateImgViewFeedback]}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icons
                        key={index}
                        iconSetName={'Ionicons'}
                        iconName={index < rating ? 'star' : 'star-outline'}
                        iconColor={Colors.primary}
                        iconSize={18}
                      />
                    ))}
                  </View>
                  <Text style={[HomeStyle.feedbackDesc]}>
                    {'I am unable to move my legs, Great app for finding accessible PG accommodations, with detailed listings and helpful filters for wheelchair users.....more'}
                  </Text>
                </View>
              </View>
            )}

            {/* Rating Stats */}
            <View style={[HomeStyle.rateContainer, { marginHorizontal: 20 }]}>
              <View style={{ ...CommonStyles.directionRowCenter }}>
                <Image source={IMAGES.musicGirl} style={[HomeStyle.musicImg]} />
                <View style={[HomeStyle.rateList]}>
                  <View>
                    <Text style={[HomeStyle.whiteBold]}>{'50K+'}</Text>
                    <Text style={[HomeStyle.whiteTextRate]}>
                      {'Happy People'}
                    </Text>
                  </View>
                  <View style={{ ...LayoutStyle.marginLeft20 }}>
                    <Text style={[HomeStyle.whiteBold]}>{'4.72'}</Text>
                    <Text style={[HomeStyle.whiteTextRate]}>
                      {'Overall rating'}
                    </Text>
                    <View style={[HomeStyle.rateImgView]}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Icons
                          key={index}
                          iconSetName={'Ionicons'}
                          iconName={index < 4 ? 'star' : 'star-outline'}
                          iconColor={Colors.primary}
                          iconSize={18}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Refer a Friend */}
            <View style={[HomeStyle.friendContainer]}>
              <View>
                <Text style={[HomeStyle.refFriend]}>{'Refer a friend'}</Text>
                <Text style={[HomeStyle.refFriendDesc]}>
                  {'Stay Connected Anywhere!'}
                </Text>
              </View>
              <Image source={IMAGES.appImg} style={[HomeStyle.appImg]} />
            </View>
          </ScrollView>

          {/* Floating Chat Button */}
          <>
            <TouchableOpacity style={[HomeStyle.chatContainer]}>
              <Image source={IMAGES.chat} style={[HomeStyle.chatImg]} />
            </TouchableOpacity>
          </>

          {/* City Selection Modal */}
          <CitySelectionModal
            visible={cityModalVisible}
            onClose={() => setCityModalVisible(false)}
            onSelectCity={handleCitySelect}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

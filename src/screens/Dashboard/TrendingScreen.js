import {
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {BottomSheet, Icons, Input} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import {deviceHight} from '../../utils/DeviceInfo';
import FilterComponent from './FilterComponent';
import {CommonActions} from '@react-navigation/native';
import {getAllProperties} from '../../services/homeService';
import FastImage from 'react-native-fast-image';

const TrendingScreen = props => {
  const [rating, setRating] = useState(4);
  const [selected, setSelected] = useState(null);
  const [sortByModal, setSortByModal] = useState(false);
  const [isFilterl, setIsFilterl] = useState(false);
  const [statusColor, setStatusColor] = useState(Colors.secondary);
  const [pgList, setPgList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState(null);

  useEffect(() => {
    fetchPGList();
  }, []);

  useEffect(() => {
    if (originalList.length > 0) {
      applyFiltersAndSort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, filterData, originalList.length]);

  const fetchPGList = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      console.log("response",response);
      
      if (response.success && response.data) {
        // Filter only approved properties with PG data
        const approvedPGProperties = response.data.filter(
          item => item.property?.status === 'approved' && item.pgProperty
        );
        setOriginalList(approvedPGProperties);
        setPgList(approvedPGProperties);
      }
    } catch (error) {
      console.error('Error fetching PG list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum price from property
  const getMinPrice = (item) => {
    if (!item?.rooms?.roomTypes || item.rooms.roomTypes.length === 0) return 0;
    const prices = item.rooms.roomTypes.map(room => room.price || 0).filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // Apply filters based on filterData
  const applyFilters = (list) => {
    if (!filterData) return list;

    let filtered = [...list];

    // Filter by gender
    if (filterData.gender) {
      const genderMap = {
        'Male': 'Male',
        'Female': 'Female',
        'Co-Living': 'Co Living'
      };
      const targetGender = genderMap[filterData.gender] || filterData.gender;
      filtered = filtered.filter(item => {
        const pgGender = item.pgProperty?.gender || '';
        return pgGender.toLowerCase() === targetGender.toLowerCase();
      });
    }

    // Filter by room type
    if (filterData.roomType) {
      const roomTypeMap = {
        'Single Sharing': 'Single',
        'Double Sharing': 'Double',
        'Triple Sharing': 'Triple',
        'Four Sharing': 'Four',
        'Five Sharing': 'Five',
        'Five + Sharing': 'Five+'
      };
      const targetRoomType = roomTypeMap[filterData.roomType] || filterData.roomType;
      filtered = filtered.filter(item => {
        const roomTypes = item.rooms?.roomTypes || [];
        return roomTypes.some(room => {
          const roomLabel = (room.label || room.type || '').toLowerCase();
          return roomLabel.includes(targetRoomType.toLowerCase());
        });
      });
    }

    // Filter by budget (max price)
    if (filterData.budget) {
      filtered = filtered.filter(item => {
        const minPrice = getMinPrice(item);
        return minPrice > 0 && minPrice <= filterData.budget;
      });
    }

    // Filter by amenities
    if (filterData.amenities && filterData.amenities.length > 0) {
      filtered = filtered.filter(item => {
        const propertyAmenities = (item.pgProperty?.amenities || []).map(a => a.toLowerCase());
        return filterData.amenities.some(amenity => 
          propertyAmenities.some(pa => pa.includes(amenity.toLowerCase()))
        );
      });
    }

    // Filter by ratings (if ratings filter is applied)
    // Note: Since we don't have actual ratings in the data, we'll skip this for now
    // if (filterData.ratings && filterData.ratings.length > 0) {
    //   filtered = filtered.filter(item => {
    //     const propertyRating = item.rating || 0;
    //     return filterData.ratings.some(rating => propertyRating >= rating);
    //   });
    // }

    return filtered;
  };

  // Apply sorting based on selected option
  const applySorting = (list) => {
    if (!selected) return list;

    const sorted = [...list];

    switch (selected) {
      case 'Price - Low to High':
        return sorted.sort((a, b) => {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceA - priceB;
        });

      case 'Price - High to Low':
        return sorted.sort((a, b) => {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceB - priceA;
        });

      case 'Freshness':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.property?.createdAt || 0);
          const dateB = new Date(b.property?.createdAt || 0);
          return dateB - dateA; // Newest first
        });

      case 'Relevance':
      default:
        // Keep original order (already sorted by backend or default)
        return sorted;
    }
  };

  // Apply both filters and sorting
  const applyFiltersAndSort = () => {
    let result = [...originalList];
    
    // Apply filters first
    result = applyFilters(result);
    
    // Then apply sorting
    result = applySorting(result);
    
    setPgList(result);
  };
  const options = [
    'Relevance',
    'Price - Low to High',
    'Price - High to Low',
    'Freshness',
  ];

  const gotoBooking = (propertyData) => {
    props.navigation.navigate('PGBooking', { propertyData });
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const renderPGList = ({item, index}) => {
    if (!item || !item.property || !item.pgProperty) return null;

    const property = item.property;
    const pgProperty = item.pgProperty;
    const media = item.media;
    const rooms = item.rooms;

    // Get first image or default
    const propertyImage = media?.images?.[0]?.url || IMAGES.bed;
    const propertyName = property.name || 'PG Property';
    const gender = pgProperty.gender || 'Co Living';
    const location = `${property.locality || ''}, ${property.city || ''}`.trim();
    
    // Get minimum price from room types
    let minPrice = 0;
    if (rooms?.roomTypes && rooms.roomTypes.length > 0) {
      const prices = rooms.roomTypes.map(room => room.price || 0).filter(p => p > 0);
      minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    }

    // Get amenities (first few for display)
    const amenities = pgProperty.amenities || [];
    const displayAmenities = amenities.slice(0, 7);

    return (
      <TouchableOpacity 
        key={'flatlist' + index} 
        onPress={() => gotoBooking(item)}
        activeOpacity={0.7}>
        <View style={[HomeStyle.bedListContainer]}>
          {propertyImage ? (
            <FastImage
              source={{uri: propertyImage}}
              style={[HomeStyle.bedimg]}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image source={IMAGES.bed} style={[HomeStyle.bedimg]} />
          )}
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={[HomeStyle.hostelTitle]} numberOfLines={1}>
              {propertyName}
            </Text>
            <View style={[HomeStyle.genderView]}>
              <Text style={[HomeStyle.servicesName]}>{gender}</Text>
            </View>
            <Text style={[HomeStyle.areaName]} numberOfLines={1}>
              {location || 'Location not available'}
            </Text>
            {minPrice > 0 && (
              <View style={{...CommonStyles.directionRowCenter, marginTop: 5}}>
                <Text style={[HomeStyle.reviewText]}>{'Starting from '}</Text>
                <Text style={[HomeStyle.price]}>{`₹ ${minPrice.toLocaleString()}/-`}</Text>
              </View>
            )}
            <View style={{...CommonStyles.directionRowCenter, marginTop: 5}}>
              <View style={[HomeStyle.rateImg]}>
                {Array.from({length: 5}, (_, idx) => (
                  <Icons
                    key={'rate' + idx}
                    iconSetName={'Ionicons'}
                    iconName={idx < rating ? 'star' : 'star-outline'}
                    iconColor={Colors.rating}
                    iconSize={18}
                  />
                ))}
              </View>
              <Text style={[HomeStyle.reviewText]}>{'  49 reviews'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowCenter, marginTop: 5, flexWrap: 'wrap'}}>
              {displayAmenities.map((amenity, idx) => {
                let iconName = 'star-outline';
                let iconSet = 'Ionicons';
                
                // Map amenities to icons
                if (amenity.toLowerCase().includes('wifi') || amenity.toLowerCase().includes('internet')) {
                  iconName = 'wifi';
                } else if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car')) {
                  iconName = 'car-sport';
                } else if (amenity.toLowerCase().includes('gym')) {
                  iconName = 'barbell';
                } else if (amenity.toLowerCase().includes('ac') || amenity.toLowerCase().includes('air')) {
                  iconName = 'snow-outline';
                } else {
                  iconName = 'checkmark-circle-outline';
                }
                
                return (
                  <Icons
                    key={'amenity' + idx}
                    iconSetName={iconSet}
                    iconName={iconName}
                    iconColor={Colors.gray}
                    iconSize={18}
                    style={{marginRight: 5}}
                  />
                );
              })}
              {amenities.length > 7 && (
                <TouchableOpacity>
                  <Text style={[HomeStyle.reviewText]}>{' View all '}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const gotoBottomSheetClose = () => {
    setSortByModal(false);
  };

  const handleSortSelect = (sortOption) => {
    setSelected(sortOption);
    // Close modal after a short delay to show selection
    setTimeout(() => {
      setSortByModal(false);
    }, 300);
  };

  const closeModal = () => {
    setIsFilterl(false);
  };

  const handleApply = (data) => {
    console.log('Selected Data:', data);
    setFilterData(data);
    // Modal will be closed by FilterComponent's onApply
  };

  const handleClear = () => {
    console.log('Filters cleared');
    setFilterData(null);
    setSelected(null);
    // Modal will be closed by FilterComponent's onClear
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
            <View style={{paddingHorizontal: 20, paddingTop: 20, backgroundColor: 'transparent'}}>
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
            </View>
            {loading ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <ActivityIndicator size="large" color={Colors.secondary} />
                <Text style={[HomeStyle.reviewText, {marginTop: 10}]}>Loading PG properties...</Text>
              </View>
            ) : pgList.length === 0 ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
                <Text style={[HomeStyle.reviewText]}>No PG properties found</Text>
              </View>
            ) : (
              <FlatList
                data={pgList}
                renderItem={renderPGList}
                scrollEnabled={true}
                keyExtractor={(item, index) => item?.property?._id?.toString() || index.toString()}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 150,
                }}
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
              />
            )}
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
            {sortByModal && <BottomSheet
              maxHeight={deviceHight / 2}
              isOpen={sortByModal}
              onClose={() => gotoBottomSheetClose()}
              renderContent={() => {
                return (
                  <View style={[]}>
                    <Text style={[HomeStyle.blackTextbigCenter, {marginTop: 20}]}>
                      {'Sort By'}
                    </Text>
                    {options.map((item, index) => (
                      <TouchableOpacity
                        key={'opt' + index}
                        style={[
                          HomeStyle.option,
                          selected === item && HomeStyle.selectedOption,
                          {paddingHorizontal: 20}
                        ]}
                        onPress={() => handleSortSelect(item)}>
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
            />}
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <FilterComponent
          key={'index-filter'}
          onApply={(data) => {
            handleApply(data);
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

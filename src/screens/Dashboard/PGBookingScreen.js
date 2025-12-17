import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  // SafeAreaView,
  ImageBackground,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import { Button, Icons, BottomSheet, EmptyState } from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import FastImage from 'react-native-fast-image';
import { deviceHight, deviceWidth } from '../../utils/DeviceInfo';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { checkWishlistStatus, addToWishlist, removeFromWishlist } from '../../services/wishlistService';
import { showMessage } from 'react-native-flash-message';
import { useCallback } from 'react';
import { getReviewsByProperty, getLocationByProperty, getNearbyProperties, getMapByProperty } from '../../services/homeService';
import MapView, { Marker } from 'react-native-maps';
import AuthStyle from '../../styles/AuthStyle';
import { isGuestUser, showGuestRestrictionAlert } from '../../utils/authUtils';
import { createContact } from '../../services/contactService';

const PGBookingScreen = props => {
  const propertyData = props.route?.params?.propertyData;
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [neighborhoodData, setNeighborhoodData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [mapCoordinates, setMapCoordinates] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageCarouselRef = useRef(null);

  // Extract data from propertyData
  const property = propertyData?.property || {};
  const pgProperty = propertyData?.pgProperty || {};
  const media = propertyData?.media || { images: [], videos: [] };
  const rooms = propertyData?.rooms || { roomTypes: [] };
  const owner = propertyData?.owner || {};

  // Get images
  const images = media?.images || [];
  const mainImage = images[selectedImageIndex]?.url || images[0]?.url;
  const thumbnailImages = images.slice(0, 4);

  // Get amenities
  const amenities = pgProperty?.amenities || [];

  // Get room types (sharing options)
  const roomTypes = rooms?.roomTypes || [];

  // Get description
  const description = pgProperty?.description || property.name || 'No description available';

  // Get rules
  const rules = pgProperty?.rules || [];
  const otherRules = pgProperty?.otherRules || '';
  const pgRules = rules.length > 0 ? rules.join('. ') : (otherRules || 'No rules specified');

  // Get location
  const location = property.location?.coordinates || [];
  const locationText = `${property.street || ''}, ${property.locality || ''}, ${property.city || ''}`.trim();
  console.log("Location", location);

  // Get property ID - handle both propertyData and direct propertyId from route params
  const propertyId = property?._id || property?.id || props.route?.params?.propertyId;

  // Check wishlist status on mount
  useEffect(() => {
    if (propertyId) {
      checkWishlistStatusOnMount();
    }
  }, [propertyId]);

  // Refresh wishlist status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (propertyId) {
        checkWishlistStatusOnMount();
      }
    }, [propertyId])
  );

  // Fetch neighborhood, reviews, nearby properties, and map location
  useEffect(() => {
    if (propertyId) {
      fetchNeighborhoodData();
      fetchReviews();
      fetchNearbyProperties();
      fetchMapLocation();
    }
  }, [propertyId]);

  // Set initial map coordinates from propertyData
  useEffect(() => {
    if (property?.location?.coordinates && property.location.coordinates.length === 2) {
      // GeoJSON format: [longitude, latitude] -> convert to {latitude, longitude}
      setMapCoordinates({
        latitude: property.location.coordinates[1],
        longitude: property.location.coordinates[0],
      });
    }
  }, [property?.location?.coordinates]);

  const fetchNeighborhoodData = async () => {
    try {
      const response = await getLocationByProperty(propertyId);
      if (response.success && response.data) {
        setNeighborhoodData(response.data);
      }
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviewsByProperty(propertyId);
      if (response.success) {
        const reviewData = response.data || [];
        setReviews(reviewData);
console.log("reviewData", reviewData);

        const totalReviews = reviewData.length;
        const avgRating =
          totalReviews > 0
            ? reviewData.reduce(
                (sum, review) => sum + (review.rating || 0),
                0,
              ) / totalReviews
            : 0;

        setReviewCount(totalReviews);
        setRating(Math.round(avgRating));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchNearbyProperties = async () => {
    try {
      if (property?.city) {
        const response = await getNearbyProperties(property.city, propertyId);
        if (response.success) {
          setNearbyProperties(response.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
    }
  };

  const fetchMapLocation = async () => {
    try {
      const response = await getMapByProperty(propertyId);
      console.log('Map location data fetched:', response.data);

      if (response.success && response.data) {
        const mapLocation = response.data;

        // Check if pins array exists and has at least one pin
        if (mapLocation.pins && Array.isArray(mapLocation.pins) && mapLocation.pins.length > 0) {
          // Use the first pin's coordinates as the property location
          const firstPin = mapLocation.pins[0];
          if (firstPin.lat && firstPin.lng) {
            setMapCoordinates({
              latitude: firstPin.lat,
              longitude: firstPin.lng,
            });
            console.log('Map coordinates set from API:', { latitude: firstPin.lat, longitude: firstPin.lng });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching map location:', error);
      // Fallback: Use coordinates from propertyData if API fails
      const coords = property.location?.coordinates;
      if (coords && coords.length === 2) {
        setMapCoordinates({
          latitude: coords[1],
          longitude: coords[0],
        });
      }
    }
  };

  // Helper function to get icon for neighborhood item
  const getNeighborhoodIcon = (name) => {
    const nameLower = name?.toLowerCase() || '';
    if (nameLower.includes('airport') || nameLower.includes('flight')) {
      return { iconSet: 'MaterialCommunityIcons', iconName: 'airplane-takeoff' };
    } else if (nameLower.includes('metro') || nameLower.includes('subway')) {
      return { iconSet: 'MaterialIcons', iconName: 'train' };
    } else if (nameLower.includes('bus') || nameLower.includes('station')) {
      return { iconSet: 'Ionicons', iconName: 'bus' };
    } else if (nameLower.includes('railway') || nameLower.includes('train')) {
      return { iconSet: 'Ionicons', iconName: 'train-sharp' };
    }
    return { iconSet: 'Ionicons', iconName: 'location' };
  };

  // Render neighborhood items
  const renderNeighborhoodItems = () => {
    if (!neighborhoodData || !neighborhoodData.pins || neighborhoodData.pins.length === 0) {
      return null;
    }

    return neighborhoodData.pins.map((pin, index) => {
      const icon = getNeighborhoodIcon(pin.address || neighborhoodData.name);
      return (
        <View key={index} style={{ ...LayoutStyle.marginVertical20 }}>
          <View style={[HomeStyle.pathContainer, { flexDirection: 'row', alignItems: "center" }]}>
            <Icons
              iconSetName={icon.iconSet}
              iconName={icon.iconName}
              iconColor={Colors.secondary}
              iconSize={26}
            />
            <Text style={[HomeStyle.pathText]}>{pin.address || neighborhoodData.name || 'Location'}</Text>
          </View>
        </View>
      );
    });
  };

  const checkWishlistStatusOnMount = async () => {
    try {
      const response = await checkWishlistStatus(propertyId);
      if (response.success) {
        setIsInWishlist(response.isInWishlist || false);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!propertyId) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await removeFromWishlist(propertyId);
        if (response.success) {
          setIsInWishlist(false);
          showMessage({
            message: 'Removed from wishlist',
            type: 'success',
            floating: true,
            statusBarHeight: 40,
            icon: 'auto',
            autoHide: true,
          });
        } else {
          showMessage({
            message: response.message || 'Failed to remove from wishlist',
            type: 'danger',
            floating: true,
            statusBarHeight: 40,
            icon: 'auto',
            autoHide: true,
          });
        }
      } else {
        // Add to wishlist
        const response = await addToWishlist(propertyId);
        if (response.success) {
          setIsInWishlist(true);
          showMessage({
            message: 'Added to wishlist',
            type: 'success',
            floating: true,
            statusBarHeight: 40,
            icon: 'auto',
            autoHide: true,
          });
        } else {
          showMessage({
            message: response.message || 'Failed to add to wishlist',
            type: 'danger',
            floating: true,
            statusBarHeight: 40,
            icon: 'auto',
            autoHide: true,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showMessage({
        message: 'An error occurred. Please try again.',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const gotoBottomSheetClose = () => {
    setIsBottomSheet(false);
  };

  const gotoContactClick = async () => {
    // Check if user is a guest before allowing contact
    const isGuest = await isGuestUser();
    if (isGuest) {
      showGuestRestrictionAlert(props.navigation);
      return;
    }
    setIsBottomSheet(true);
    setIsContact(true);
  };

  const gotoBookClick = async () => {
    // Check if user is a guest before allowing booking
    const isGuest = await isGuestUser();
    if (isGuest) {
      showGuestRestrictionAlert(props.navigation);
      return;
    }
    setIsBottomSheet(true);
    setIsContact(false);
  };
console.log("propertyData", propertyData);

  const gotoMySelf = () => {
    setIsBottomSheet(false);
    props.navigation.navigate('MySelfBooking', { propertyData });
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return { iconSet: 'Ionicons', iconName: 'wifi' };
    } else if (amenityLower.includes('gym') || amenityLower.includes('fitness')) {
      return { iconSet: 'Ionicons', iconName: 'barbell' };
    } else if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return { iconSet: 'Ionicons', iconName: 'car-sport' };
    } else if (amenityLower.includes('ac') || amenityLower.includes('air conditioning')) {
      return { iconSet: 'Ionicons', iconName: 'snow-outline' };
    } else {
      return { iconSet: 'Ionicons', iconName: 'checkmark-circle-outline' };
    }
  };

  const getSharingLabel = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('single') || typeLower === '1') return 'Single Sharing';
    if (typeLower.includes('double') || typeLower === '2') return 'Double Sharing';
    if (typeLower.includes('triple') || typeLower === '3') return 'Triple Sharing';
    if (typeLower.includes('four') || typeLower === '4') return 'Four Sharing';
    return type || 'Sharing';
  };

  const renderSharingList = ({ item, index }) => {
    const sharingLabel = getSharingLabel(item.type || item.label);
    const price = item.price || 0;
    const deposit = item.deposit || 0;

    return (
      <View key={index} style={[HomeStyle.sharingContainer, { width: deviceWidth / 3.5, padding: 15 }]}>
        <Icons
          iconSetName={'Ionicons'}
          iconName={'people-outline'}
          iconColor={Colors.secondary}
          iconSize={24}
        />
        <Text style={[HomeStyle.sharingText, { marginTop: 10 }]}>{sharingLabel}</Text>
        <Text style={[HomeStyle.sharingPrice]}>{price > 0 ? `₹${price.toLocaleString()}` : 'N/A'}</Text>
        <Text style={[HomeStyle.sharingText, { ...LayoutStyle.marginTop10 }]}>
          {'Deposit'}
        </Text>
        <Text style={[HomeStyle.sharingPrice]}>{deposit > 0 ? `₹${deposit.toLocaleString()}` : 'N/A'}</Text>
      </View>
    );
  };

  const renderReviewList = ({ item, index }) => {
    const reviewRating = item.rating || 0;
    return (
      <View key={index} style={{ ...LayoutStyle.marginBottom20 }}>
        <View style={{ ...CommonStyles.directionRowCenter }}>
          <FastImage
            style={HomeStyle.reviewerImg}
            source={{
              uri: item.userAvatar || 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
            }}
          />
          <Text style={[HomeStyle.userName]}>{item.userName || 'Anonymous'}</Text>
        </View>
        <View style={[HomeStyle.rateImg, { ...LayoutStyle.marginVertical20 }]}>
          {Array.from({ length: 5 }, (_, idx) => (
            <Icons
              key={'rate' + idx}
              iconSetName={'Ionicons'}
              iconName={idx < reviewRating ? 'star' : 'star-outline'}
              iconColor={Colors.rating}
              iconSize={20}
            />
          ))}
        </View>
        <Text style={[HomeStyle.pgDesc]}>
          {item.comment || 'No comment provided.'}
        </Text>
      </View>
    );
  };

  const renderPropertyList = ({ item, index }) => {
    const nearbyProperty = item.property || {};
    const nearbyMedia = item.media || {};
    const nearbyRooms = item.rooms || {};
    const propertyImage = nearbyMedia?.images?.[0]?.url;
    const propertyName = nearbyProperty.name || 'Property Name';

    // Get minimum price from room types
    let minPrice = 0;
    if (nearbyRooms?.roomTypes && nearbyRooms.roomTypes.length > 0) {
      const prices = nearbyRooms.roomTypes.map(rt => rt.price || 0).filter(p => p > 0);
      minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    }

    return (
      <TouchableOpacity
        key={index}
        style={{ ...LayoutStyle.marginRight10 }}
        onPress={() => {
          props.navigation.navigate('PGBooking', { propertyData: item });
        }}>
        {propertyImage ? (
          <FastImage
            source={{ uri: propertyImage }}
            style={[HomeStyle.propertyImg]}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Image source={IMAGES.property} style={[HomeStyle.propertyImg]} />
        )}
        <Text style={[HomeStyle.propertyName]} numberOfLines={1}>{propertyName}</Text>
        <Text style={[HomeStyle.propertyPrice]}>{minPrice > 0 ? `₹${minPrice.toLocaleString()}` : 'N/A'}</Text>
        <View style={[HomeStyle.rateImg]}>
          {Array.from({ length: 5 }, (_, idx) => (
            <Icons
              key={'rate' + idx}
              iconSetName={'Ionicons'}
              iconName={idx < rating ? 'star' : 'star-outline'}
              iconColor={Colors.rating}
              iconSize={18}
            />
          ))}
        </View>
        <View style={[HomeStyle.withinKmContainer]}>
          <Text style={[HomeStyle.withinKm]}>{'Nearby'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPGImgList = ({ item, index }) => {
    const imageUrl = item?.url;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedImageIndex(index);
          setCurrentImageIndex(index);
          setIsImageViewerVisible(true);
        }}
        style={{ marginRight: 10 }}>
        <FastImage
          source={imageUrl ? { uri: imageUrl } : IMAGES.property}
          style={[HomeStyle.pgImgaesmall, {
            borderWidth: selectedImageIndex === index ? 2 : 0,
            borderColor: Colors.secondary,
          }]}
          borderRadius={10}
        />
      </TouchableOpacity>
    );
  };

  const openImageViewer = (index = 0) => {
    setCurrentImageIndex(index);
    setIsImageViewerVisible(true);
  };

  // Scroll to the correct image when modal opens
  useEffect(() => {
    if (isImageViewerVisible && imageCarouselRef.current && images.length > 0) {
      setTimeout(() => {
        imageCarouselRef.current?.scrollToIndex({
          index: currentImageIndex,
          animated: false,
        });
      }, 100);
    }
  }, [isImageViewerVisible, currentImageIndex]);

  const closeImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  const renderFullScreenImage = ({ item, index }) => {
    const imageUrl = item?.url;
    return (
      <View style={{ width: deviceWidth, height: deviceHight, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          source={imageUrl ? { uri: imageUrl } : IMAGES.property}
          style={{ width: deviceWidth, height: deviceHight }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  };

  const onImageScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
    setSelectedImageIndex(index);
  };

  const handleCall = async () => {
     // Check if user is a guest before allowing booking
     const isGuest = await isGuestUser();
     if (isGuest) {
       showGuestRestrictionAlert(props.navigation);
       return;
     }

    // Validate required data
    if (!owner?._id || !propertyId) {
      showMessage({
        message: 'Error',
        description: 'Owner or property information is missing',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });
      return;
    }

    // Create contact record before making the call
    try {
      const contactResponse = await createContact({
        propertyId: propertyId,
        propertyName: property?.name || pgProperty?.name || 'Property',
        clientId: owner._id || owner.id,
        clientName: owner?.name || 'Property Owner',
        clientPhone: owner?.phone || '',
        contactMethod: 'call',
        contactType: 'inquiry',
        message: `Interested in ${property?.name || pgProperty?.name || 'property'}`,
      });
      console.log("contactResponse", contactResponse);

      if (contactResponse.success) {
        // Contact created successfully, now make the call
        if (owner?.phone) {
          Linking.openURL(`tel:${owner.phone}`);
        }
      } else {
        // Still allow the call even if contact creation fails
        console.warn('Failed to create contact:', contactResponse.message);
        if (owner?.phone) {
          Linking.openURL(`tel:${owner.phone}`);
        }
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      // Still allow the call even if contact creation fails
      if (owner?.phone) {
        Linking.openURL(`tel:${owner.phone}`);
      }
    }
  };

  const handleChat = async() => {
     // Check if user is a guest before allowing booking
     const isGuest = await isGuestUser();
     if (isGuest) {
       showGuestRestrictionAlert(props.navigation);
       return;
     }
    // Navigate to chat screen with owner
    if (!owner?._id || !propertyId) {
      showMessage({
        message: 'Error',
        description: 'Owner or property information is missing',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
        duration: 3000,
      });
      return;
    }

    // Create contact record before navigating to chat
    try {
      const contactResponse = await createContact({
        propertyId: propertyId,
        propertyName: property?.name || pgProperty?.name || 'Property',
        clientId: owner._id || owner.id,
        clientName: owner?.name || 'Property Owner',
        clientPhone: owner?.phone || '',
        contactMethod: 'chat',
        contactType: 'inquiry',
        message: `Interested in ${property?.name || pgProperty?.name || 'property'}`,
      });

      if (!contactResponse.success) {
        // Still allow navigation even if contact creation fails
        console.warn('Failed to create contact:', contactResponse.message);
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      // Still allow navigation even if contact creation fails
    }

    props.navigation.navigate('MessageList', {
      recipientId: owner._id || owner.id,
      propertyId: propertyId,
      recipientName: owner?.name || 'Owner Name',
      recipientImage: owner?.profileImage,
      recipientTag: owner?.email || property?.name || 'Tag',
    });
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const gotoGroupCheckIn = () => {
    setIsBottomSheet(false);
    props.navigation.navigate('GroupBooking', { propertyData });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }} edges={['top']}>
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
          </View>
          <View style={HomeStyle.iconContainer}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Notification')}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'notifications-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
              <View style={HomeStyle.smallRound}></View>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...LayoutStyle.marginLeft15 }}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'share-social-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...LayoutStyle.marginLeft15 }}
              onPress={() => props.navigation.navigate('Wishlist')}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'heart-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <ImageBackground
        source={IMAGES.primaryBG}
        style={[HomeStyle.formContainer]}
        resizeMode="cover">
        {!propertyData || !propertyData.property || !property?._id ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={[HomeStyle.reviewText, { marginTop: 10 }]}>Loading property details...</Text>
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}>
            <View style={[HomeStyle.PgListContainer, { paddingHorizontal: 20 }]}>
              <View style={[HomeStyle.imageListContainer]}>
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openImageViewer(selectedImageIndex)}
                    style={{ width: '100%' }}>
                    {mainImage ? (
                      <FastImage
                        source={{ uri: mainImage }}
                        style={[HomeStyle.pgImgaeBig]}
                        borderRadius={10}
                      />
                    ) : (
                      <Image
                        source={IMAGES.property}
                        style={[HomeStyle.pgImgaeBig]}
                        borderRadius={10}
                      />
                    )}
                  </TouchableOpacity>
                  {/* Heart Icon Overlay */}
                  <TouchableOpacity
                    onPress={toggleWishlist}
                    disabled={wishlistLoading}
                    style={HomeStyle.wishlistHeartOverlay}
                    activeOpacity={0.7}>
                    {wishlistLoading ? (
                      <ActivityIndicator size="small" color={Colors.red} />
                    ) : (
                      <Icons
                        iconSetName={'Ionicons'}
                        iconName={isInWishlist ? 'heart' : 'heart-outline'}
                        iconColor={isInWishlist ? Colors.red : Colors.white}
                        iconSize={28}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {thumbnailImages.length > 0 && (
                  <FlatList
                    data={thumbnailImages}
                    renderItem={renderPGImgList}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                )}
              </View>
              <View style={{ ...CommonStyles.directionRowSB, marginTop: 20 }}>
                <Text style={[HomeStyle.screenTitle]} numberOfLines={1}>
                  {property.name || 'PG Property'}
                </Text>
              </View>

              <View style={[HomeStyle.rateImg, { ...LayoutStyle.marginTop10 }]}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Icons
                    key={'rate' + index}
                    iconSetName={'Ionicons'}
                    iconName={index < reviewCount ? 'star' : 'star-outline'}
                    iconColor={Colors.rating}
                    iconSize={24}
                  />
                ))}
              </View>
              <Text style={[HomeStyle.reviewText, { marginTop: 5 }]}>
                {reviewCount > 0
                  ? `${reviewCount} review${reviewCount > 1 ? 's' : ''}`
                  : 'No reviews yet'}
              </Text>
              <Text style={[HomeStyle.pgDesc]}>
                {description}
              </Text>
              {amenities.length > 0 && (
                <View style={[HomeStyle.listContainer, { justifyContent: "flex-start", flexWrap: 'wrap' }]}>
                  {amenities.map((item, index) => {
                    const icon = getAmenityIcon(item);
                    return (
                      <View key={index} style={{ ...CommonStyles.directionRowCenter, marginRight: 10, marginBottom: 10 }}>
                        <Icons
                          iconSetName={icon.iconSet}
                          iconName={icon.iconName}
                          iconColor={Colors.gray}
                          iconSize={20}
                        />
                        <Text style={[HomeStyle.iconServicesName]} numberOfLines={1}>{item}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
              {roomTypes.length > 0 && (
                <View style={{ ...LayoutStyle.marginVertical20 }}>
                  <Text style={[HomeStyle.screenTitle]}>{'Sharing'}</Text>
                  <FlatList
                    horizontal
                    data={roomTypes}
                    renderItem={renderSharingList}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                  />
                </View>
              )}
              <View style={{ ...LayoutStyle.marginBottom20 }}>
                <Text style={[HomeStyle.screenTitle]}>{'Pg Rules'}</Text>
                <Text style={[HomeStyle.pgDesc]}>
                  {pgRules}
                </Text>
              </View>
              <View style={{ ...CommonStyles.directionRowSB }}>
                <View style={{ ...CommonStyles.directionRowCenter }}>
                  <FastImage
                    style={HomeStyle.ownerImg}
                    source={{
                      uri: owner?.profileImage || 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
                    }}
                  />
                  <View style={{ ...LayoutStyle.marginLeft20 }}>
                    <Text style={[HomeStyle.ownerName]}>{owner?.name || 'Owner Name'}</Text>
                    <Text style={[HomeStyle.ownerTag]}>{owner?.email || 'Tag'}</Text>
                  </View>
                </View>
                <View style={{ ...CommonStyles.directionRowCenter }}>
                  <TouchableOpacity onPress={handleCall}>
                    <View style={[HomeStyle.iconCall]}>
                      <Icons
                        iconSetName={'Ionicons'}
                        iconName={'call-outline'}
                        iconColor={Colors.black}
                        iconSize={20}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleChat}>
                    <View
                      style={[HomeStyle.iconCall, { ...LayoutStyle.marginLeft20 }]}>
                      <Icons
                        iconSetName={'Feather'}
                        iconName={'message-circle'}
                        iconColor={Colors.black}
                        iconSize={20}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[HomeStyle.mapContainer]}>
                <Icons
                  iconSetName={'Octicons'}
                  iconName={'location'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pgDescIcon]}>
                  {locationText || 'Location not available'}
                </Text>
              </View>
              <View style={[HomeStyle.mapImg, { overflow: 'hidden', borderRadius: 10 }]}>
                {mapCoordinates.latitude && mapCoordinates.longitude ? (
                  <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                      latitude: mapCoordinates.latitude,
                      longitude: mapCoordinates.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    region={{
                      latitude: mapCoordinates.latitude,
                      longitude: mapCoordinates.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    mapType="standard">
                    <Marker
                      coordinate={{
                        latitude: mapCoordinates.latitude,
                        longitude: mapCoordinates.longitude,
                      }}
                      title={property.name || 'Property Location'}
                      description={locationText}
                      pinColor={Colors.secondary}
                    />
                  </MapView>
                ) : (
                  <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.lightWhite }}>
                    <EmptyState
                      image={IMAGES.noMap}
                      title="Location data not available"
                      description="Map location is not available for this property"
                      containerStyle={{ paddingVertical: 20 }}
                      imageStyle={{ width: 150, height: 150 }}
                    />
                  </View>
                )}
              </View>
              {neighborhoodData && neighborhoodData.pins && neighborhoodData.pins.length > 0 && (
                <View style={{ ...LayoutStyle.marginVertical20 }}>
                  <Text style={[HomeStyle.screenTitle]}>{'Neighborhood'}</Text>
                  {renderNeighborhoodItems()}
                </View>
              )}
              <View>
                <Text
                  style={[
                    HomeStyle.screenTitle,
                    { ...LayoutStyle.marginBottom20, marginTop: reviews.length > 0  ? 0 : 20 },
                  ]}>
                  {'Reviews'}
                </Text>
                {reviews.length > 0 ? (
                  <FlatList
                    data={showAllReviews ? reviews : reviews.slice(0, 2)}
                    renderItem={renderReviewList}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => item._id?.toString() || index.toString()}
                  />
                ) : (
                  <EmptyState
                    image={IMAGES.reviewsNot}
                    title="No reviews yet"
                    description="Be the first to review this property"
                    containerStyle={{ paddingVertical: 20 }}
                    imageStyle={{ width: 150, height: 150 }}
                  />
                )}
                {reviews.length > 2 && !showAllReviews && (
                  <TouchableOpacity
                    style={{ alignItems: 'center', marginVertical: 10 }}
                    onPress={() => setShowAllReviews(true)}
                  >
                    <View
                      style={[
                        HomeStyle.iconViewAll,
                        { flexDirection: 'row', alignItems: 'center' },
                      ]}
                    >
                      <Text style={[HomeStyle.viewallTextIcon]}>{'View more'}</Text>
                      <Icons
                        iconSetName={'MaterialIcons'}
                        iconName={'keyboard-arrow-down'}
                        iconColor={Colors.gray}
                        iconSize={26}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text
                  style={[
                    HomeStyle.screenTitle,
                    { ...LayoutStyle.marginBottom20 },
                  ]}>
                  {'Near by properties'}
                </Text>
                {nearbyProperties.length > 0 ? (
                  <FlatList
                    horizontal
                    data={nearbyProperties}
                    renderItem={renderPropertyList}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.property?._id?.toString() || index.toString()}
                  />
                ) : (
                  <Text style={[HomeStyle.pgDesc, { textAlign: 'center', paddingVertical: 20 }]}>
                    No nearby properties found
                  </Text>
                )}
              </View>
              {propertyData && (
                <View style={[HomeStyle.btnBookingContainer, { paddingHorizontal: 20, marginVertical: 65 }]}>
                  <Button
                    onPress={() => gotoContactClick()}
                    btnStyle={[HomeStyle.btnRadius]}
                    flexContainer={{ flexGrow: 0.456 }}
                    btnName={'Contact'}
                  />
                  <Button
                    onPress={() => gotoBookClick()}
                    btnStyle={[HomeStyle.btnRadius]}
                    flexContainer={{ flexGrow: 0.456 }}
                    btnName={'Book now'}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        )}
        <BottomSheet
          maxHeight={deviceHight / 5}
          isOpen={isBottomSheet}
          onClose={() => gotoBottomSheetClose()}
          renderContent={() => {
            return (
              <View style={[]}>
                {isContact ? (
                  <View style={[HomeStyle.btnBookingContainer, { paddingHorizontal: 20, gap: 15, marginVertical: 20, }]}>
                    <TouchableOpacity
                      style={{ flex: 0.48 }}
                      onPress={() => {
                        handleCall();
                        gotoBottomSheetClose();
                      }}
                      activeOpacity={0.8}>
                      <View style={[HomeStyle.iconBtnContainer, { paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }]}>
                        <Icons
                          iconSetName={'Ionicons'}
                          iconName={'call-outline'}
                          iconColor={Colors.goastWhite}
                          iconSize={24}
                        />
                        <Text style={[HomeStyle.iconChat, { marginTop: 8 }]}>{'Call'}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 0.48 }}
                      onPress={() => {
                        handleChat();
                        gotoBottomSheetClose();
                      }}
                      activeOpacity={0.8}>
                      <View style={[HomeStyle.iconBtnContainer, { paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }]}>
                        <Icons
                          iconSetName={'Feather'}
                          iconName={'message-circle'}
                          iconColor={Colors.goastWhite}
                          iconSize={24}
                        />
                        <Text style={[HomeStyle.iconChat, { marginTop: 8 }]}>{'Chat'}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[HomeStyle.btnBookingContainer, { paddingHorizontal: 20, gap: 15, marginVertical: 20, }]}>
                    <TouchableOpacity
                      style={{ flex: 0.48 }}
                      onPress={() => gotoMySelf()}>
                      <View style={[HomeStyle.iconBtnContainer, { paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }]}>
                        <Icons
                          iconSetName={'FontAwesome'}
                          iconName={'user'}
                          iconColor={Colors.goastWhite}
                          iconSize={20}
                        />
                        <Text style={[HomeStyle.iconChat]}>{'My self'}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 0.48 }}
                      onPress={() => gotoGroupCheckIn()}>
                      <View style={[HomeStyle.iconBtnContainer, { paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }]}>
                        <Icons
                          iconSetName={'FontAwesome'}
                          iconName={'group'}
                          iconColor={Colors.goastWhite}
                          iconSize={20}
                        />
                        <Text style={[HomeStyle.iconChat]}>
                          {'Group check in'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
        
        {/* Full Screen Image Viewer Modal */}
        <Modal
          visible={isImageViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageViewer}
          statusBarTranslucent={true}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={closeImageViewer}
              style={{
                position: 'absolute',
                top: Platform.OS === 'ios' ? 50 : 40,
                right: 20,
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 20,
                padding: 10,
              }}
              activeOpacity={0.7}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'close'}
                iconColor={Colors.white}
                iconSize={28}
              />
            </TouchableOpacity>

            {/* Image Counter */}
            {images.length > 1 && (
              <View style={{
                position: 'absolute',
                top: Platform.OS === 'ios' ? 50 : 40,
                left: 20,
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 15,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}>
                <Text style={{
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  {currentImageIndex + 1} / {images.length}
                </Text>
              </View>
            )}

            {/* Image Carousel */}
            {images.length > 0 ? (
              <FlatList
                ref={imageCarouselRef}
                data={images}
                renderItem={renderFullScreenImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onImageScroll}
                getItemLayout={(data, index) => ({
                  length: deviceWidth,
                  offset: deviceWidth * index,
                  index,
                })}
                onScrollToIndexFailed={(info) => {
                  // Fallback: scroll to offset if scrollToIndex fails
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    imageCarouselRef.current?.scrollToOffset({
                      offset: info.averageItemLength * info.index,
                      animated: false,
                    });
                  });
                }}
                style={{ flex: 1, width: deviceWidth }}
              />
            ) : (
              <View style={{ width: deviceWidth, height: deviceHight, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={IMAGES.property}
                  style={{ width: deviceWidth, height: deviceHight }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </Modal>
       
        {/* Simple bottom sheet with Call button */}
        {/* <BottomSheet
          maxHeight={deviceHight / 2}
          isOpen={isBottomSheet}
          onClose={() => gotoBottomSheetClose()}
          renderContent={() => {
            return (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    handleCall();
                    gotoBottomSheetClose();
                  }}
                  style={[HomeStyle.iconBtnContainer, { 
                    paddingVertical: 15, 
                    paddingHorizontal: 30,
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '80%'
                  }]}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'call-outline'}
                    iconColor={Colors.goastWhite}
                    iconSize={24}
                  />
                  <Text style={[HomeStyle.iconChat, { marginTop: 8 }]}>{'Call'}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        /> */}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default PGBookingScreen;

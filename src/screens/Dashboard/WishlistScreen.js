import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import FastImage from 'react-native-fast-image';
import {deviceHight, deviceWidth} from '../../utils/DeviceInfo';
import {CommonActions} from '@react-navigation/native';
import {getUserWishlist, removeFromWishlist} from '../../services/wishlistService';
import {showMessage} from 'react-native-flash-message';

const WishlistScreen = props => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await getUserWishlist();
      console.log("wishlist response", response);
      
      if (response.success) {
        setWishlistItems(response.data || []);
      } else {
        console.error('Failed to fetch wishlist:', response.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const handleView = (item) => {
    // Navigate to PG Booking screen with property data
    const propertyData = {
      property: {
        _id: item.propertyId,
        name: item.propertyData?.name || 'Property',
        city: item.propertyData?.city || '',
        locality: item.propertyData?.locality || '',
        street: item.propertyData?.street || '',
        location: {
          coordinates: []
        }
      },
      pgProperty: item.propertyData?.pgProperty || {},
      media: {
        images: item.propertyData?.images || [],
        videos: []
      },
      rooms: item.propertyData?.rooms || {roomTypes: []},
      owner: item.propertyData?.owner || {}
    };
    props.navigation.navigate('PGBooking', {propertyData});
  };

  const handleCall = (item) => {
    const phone = item.propertyData?.owner?.phone;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleChat = (item) => {
    // Navigate to chat screen
    const ownerId = item.propertyData?.owner?._id;
    if (ownerId) {
      // props.navigation.navigate('Chat', { userId: ownerId });
      console.log('Navigate to chat with owner:', ownerId);
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    const propertyId = item.propertyId;
    if (!propertyId) return;

    setRemovingItemId(propertyId);
    try {
      const response = await removeFromWishlist(propertyId);
      if (response.success) {
        // Remove item from local state
        setWishlistItems(prevItems => 
          prevItems.filter(wishlistItem => wishlistItem.propertyId !== propertyId)
        );
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
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showMessage({
        message: 'An error occurred. Please try again.',
        type: 'danger',
        floating: true,
        statusBarHeight: 40,
        icon: 'auto',
        autoHide: true,
      });
    } finally {
      setRemovingItemId(null);
    }
  };

  const renderWishlistItem = ({item, index}) => {
    const propertyData = item.propertyData || {};
    const imageUrl = propertyData.image?.url || propertyData.images?.[0]?.url;
    const name = propertyData.name || 'Property Name';
    const description = propertyData.pgProperty?.description || propertyData.description || 'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.';
    const price = propertyData.price || propertyData.rooms?.roomTypes?.[0]?.price || 0;

    return (
      <View style={[HomeStyle.wishlistCard, {marginBottom: 20}]}>
        <View style={HomeStyle.wishlistImageContainer}>
          {imageUrl ? (
            <FastImage
              source={{uri: imageUrl}}
              style={HomeStyle.wishlistImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image
              source={IMAGES.property}
              style={HomeStyle.wishlistImage}
              resizeMode="cover"
            />
          )}
          
          {/* Price Tag Overlay */}
          <View style={HomeStyle.wishlistPriceTag}>
            <Text style={HomeStyle.wishlistPriceText}>
              ₹{price.toLocaleString('en-IN')}
            </Text>
          </View>

          {/* Heart Icon */}
          <TouchableOpacity
            onPress={() => handleRemoveFromWishlist(item)}
            disabled={removingItemId === item.propertyId}
            style={HomeStyle.wishlistHeartIcon}
            activeOpacity={0.7}>
            {removingItemId === item.propertyId ? (
              <ActivityIndicator size="small" color={Colors.red} />
            ) : (
              <Icons
                iconSetName={'Ionicons'}
                iconName={'heart'}
                iconColor={Colors.red}
                iconSize={24}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text style={HomeStyle.wishlistName} numberOfLines={1}>
          {name}
        </Text>

        {/* Description */}
        <Text style={HomeStyle.wishlistDescription} numberOfLines={3}>
          {description}
        </Text>

        {/* Action Buttons */}
        <View style={HomeStyle.wishlistActionContainer}>
          <Button
            onPress={() => handleView(item)}
            btnStyle={[HomeStyle.wishlistViewButton]}
            flexContainer={{flex: 1}}
            btnName={'View'}
          />
          <TouchableOpacity
            onPress={() => handleCall(item)}
            style={HomeStyle.wishlistIconButton}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'call-outline'}
              iconColor={Colors.white}
              iconSize={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChat(item)}
            style={[HomeStyle.wishlistIconButton, {marginLeft: 10}]}>
            <Icons
              iconSetName={'Feather'}
              iconName={'message-circle'}
              iconColor={Colors.white}
              iconSize={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
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
        <View style={[HomeStyle.headerContainerBlue, {justifyContent: "flex-start"}]}>
          <View style={HomeStyle.profileImgContainer}>
            <TouchableOpacity onPress={gotoBack}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
          <View style={HomeStyle.iconContainer}>
            <Text style={HomeStyle.headerTitle}>My Wishlist</Text>
          </View>
        </View>
      </SafeAreaView>
      <ImageBackground
        source={IMAGES.primaryBG}
        style={[HomeStyle.formContainer]}
        resizeMode="cover">
        {loading ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={[HomeStyle.reviewText, {marginTop: 10}]}>
              Loading wishlist...
            </Text>
          </View>
        ) : wishlistItems.length === 0 ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'heart-outline'}
              iconColor={Colors.gray}
              iconSize={60}
            />
            <Text style={[HomeStyle.screenTitle, {marginTop: 20, textAlign: 'center'}]}>
              Your wishlist is empty
            </Text>
            <Text style={[HomeStyle.pgDesc, {textAlign: 'center', marginTop: 10}]}>
              Start adding properties to your wishlist to see them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item, index) => item._id?.toString() || index.toString()}
            contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default WishlistScreen;


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
import {Button, Icons, BottomSheet} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import FastImage from 'react-native-fast-image';
import {deviceHight, deviceWidth} from '../../utils/DeviceInfo';
import {CommonActions} from '@react-navigation/native';

const PGBookingScreen = props => {
  const propertyData = props.route?.params?.propertyData;
  const [rating, setRating] = useState(4);
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Extract data from propertyData
  const property = propertyData?.property || {};
  const pgProperty = propertyData?.pgProperty || {};
  const media = propertyData?.media || {images: [], videos: []};
  const rooms = propertyData?.rooms || {roomTypes: []};
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

  const gotoBottomSheetClose = () => {
    setIsBottomSheet(false);
  };

  const gotoContactClick = () => {
    setIsBottomSheet(true);
    setIsContact(true);
  };

  const gotoBookClick = () => {
    setIsBottomSheet(true);
    setIsContact(false);
  };

  const gotoMySelf = () => {
    props.navigation.navigate('MySelfBooking');
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return {iconSet: 'Ionicons', iconName: 'wifi'};
    } else if (amenityLower.includes('gym') || amenityLower.includes('fitness')) {
      return {iconSet: 'Ionicons', iconName: 'barbell'};
    } else if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return {iconSet: 'Ionicons', iconName: 'car-sport'};
    } else if (amenityLower.includes('ac') || amenityLower.includes('air conditioning')) {
      return {iconSet: 'Ionicons', iconName: 'snow-outline'};
    } else {
      return {iconSet: 'Ionicons', iconName: 'checkmark-circle-outline'};
    }
  };

  const renderServiceList = ({item, index}) => {
    const icon = getAmenityIcon(item);
    return (
      <View key={index} style={{...CommonStyles.directionRowCenter, marginRight: 10}}>
        <Icons
          iconSetName={icon.iconSet}
          iconName={icon.iconName}
          iconColor={Colors.gray}
          iconSize={20}
        />
        <Text style={[HomeStyle.iconServicesName]} numberOfLines={1}>{item}</Text>
      </View>
    );
  };

  const getSharingLabel = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('single') || typeLower === '1') return 'Single Sharing';
    if (typeLower.includes('double') || typeLower === '2') return 'Double Sharing';
    if (typeLower.includes('triple') || typeLower === '3') return 'Triple Sharing';
    if (typeLower.includes('four') || typeLower === '4') return 'Four Sharing';
    return type || 'Sharing';
  };

  const renderSharingList = ({item, index}) => {
    const sharingLabel = getSharingLabel(item.type || item.label);
    const price = item.price || 0;
    const deposit = item.deposit || 0;
    
    return (
      <View key={index} style={[HomeStyle.sharingContainer, {width: deviceWidth / 3.5, padding: 15}]}>
        <Icons
          iconSetName={'Ionicons'}
          iconName={'people-outline'}
          iconColor={Colors.secondary}
          iconSize={24}
        />
        <Text style={[HomeStyle.sharingText, {marginTop: 10}]}>{sharingLabel}</Text>
        <Text style={[HomeStyle.sharingPrice]}>{price > 0 ? `₹${price.toLocaleString()}` : 'N/A'}</Text>
        <Text style={[HomeStyle.sharingText, {...LayoutStyle.marginTop10}]}>
          {'Deposit'}
        </Text>
        <Text style={[HomeStyle.sharingPrice]}>{deposit > 0 ? `₹${deposit.toLocaleString()}` : 'N/A'}</Text>
      </View>
    );
  };

  const renderReviewList = ({item, index}) => {
    // For now, show placeholder reviews since we don't have review data in propertyData
    return (
      <View key={index} style={{...LayoutStyle.marginBottom20}}>
        <View style={{...CommonStyles.directionRowCenter}}>
          <FastImage
            style={HomeStyle.reviewerImg}
            source={{
              uri: 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
            }}
          />
          <Text style={[HomeStyle.userName]}>{'Glenn Johnston'}</Text>
        </View>
        <View style={[HomeStyle.rateImg, {...LayoutStyle.marginVertical20}]}>
          {Array.from({length: 5}, (_, idx) => (
            <Icons
              key={'rate' + idx}
              iconSetName={'Ionicons'}
              iconName={idx < rating ? 'star' : 'star-outline'}
              iconColor={Colors.rating}
              iconSize={20}
            />
          ))}
        </View>
        <Text style={[HomeStyle.pgDesc]}>
          {'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.'}
        </Text>
      </View>
    );
  };

  const renderPropertyList = ({item, index}) => {
    // For now, show placeholder nearby properties
    return (
      <View key={index} style={{...LayoutStyle.marginRight10}}>
        <Image source={IMAGES.property} style={[HomeStyle.propertyImg]} />
        <Text style={[HomeStyle.propertyName]} numberOfLines={1}>{'Property Name'}</Text>
        <Text style={[HomeStyle.propertyPrice]}>{'00000'}</Text>
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
        <View style={[HomeStyle.withinKmContainer]}>
          <Text style={[HomeStyle.withinKm]}>{'Within a km'}</Text>
        </View>
      </View>
    );
  };

  const renderPGImgList = ({item, index}) => {
    const imageUrl = item?.url;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedImageIndex(index)}
        style={{marginRight: 10}}>
        <FastImage
          source={imageUrl ? {uri: imageUrl} : IMAGES.property}
          style={[HomeStyle.pgImgaesmall, {
            borderWidth: selectedImageIndex === index ? 2 : 0,
            borderColor: Colors.secondary,
          }]}
          borderRadius={10}
        />
      </TouchableOpacity>
    );
  };

  const handleCall = () => {
    if (owner?.phone) {
      Linking.openURL(`tel:${owner.phone}`);
    }
  };

  const handleChat = () => {
    // Navigate to chat screen with owner
    // props.navigation.navigate('Chat', { userId: owner._id });
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const gotoGroupCheckIn = () => {
    props.navigation.navigate('GroupBooking');
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
                iconName={'share-social-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
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
      </SafeAreaView>
      <ImageBackground
        source={IMAGES.primaryBG}
        style={[HomeStyle.formContainer]}
        resizeMode="cover">
        {!propertyData ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={[HomeStyle.reviewText, {marginTop: 10}]}>Loading property details...</Text>
          </View>
        ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: '10%'}}
          showsVerticalScrollIndicator={false}>
          <View style={[HomeStyle.PgListContainer, {paddingHorizontal: 20}]}>
            <View style={[HomeStyle.imageListContainer]}>
              {mainImage ? (
                <FastImage
                  source={{uri: mainImage}}
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
              {thumbnailImages.length > 0 && (
                <FlatList
                  data={thumbnailImages}
                  renderItem={renderPGImgList}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{marginTop: 10}}
                />
              )}
            </View>
            <View style={{...CommonStyles.directionRowSB, marginTop: 20}}>
              <Text style={[HomeStyle.screenTitle]} numberOfLines={1}>
                {property.name || 'PG Property'}
              </Text>
            </View>

            <View style={[HomeStyle.rateImg, {...LayoutStyle.marginTop10}]}>
              {Array.from({length: 5}, (_, index) => (
                <Icons
                  key={'rate' + index}
                  iconSetName={'Ionicons'}
                  iconName={index < rating ? 'star' : 'star-outline'}
                  iconColor={Colors.rating}
                  iconSize={24}
                />
              ))}
            </View>
            <Text style={[HomeStyle.pgDesc]}>
              {description}
            </Text>
            {amenities.length > 0 && (
              <View style={[HomeStyle.listContainer]}>
                <FlatList
                  horizontal
                  data={amenities.slice(0, 4)}
                  renderItem={renderServiceList}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                />
                {amenities.length > 4 && (
                  <TouchableOpacity>
                    <Text style={[HomeStyle.viewallText]}>{'View all'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {roomTypes.length > 0 && (
              <View style={{...LayoutStyle.marginVertical20}}>
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
            <View style={{...LayoutStyle.marginBottom20}}>
              <Text style={[HomeStyle.screenTitle]}>{'Pg Rules'}</Text>
              <Text style={[HomeStyle.pgDesc]}>
                {pgRules}
              </Text>
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <View style={{...CommonStyles.directionRowCenter}}>
                <FastImage
                  style={HomeStyle.ownerImg}
                  source={{
                    uri: owner?.profileImage || 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
                  }}
                />
                <View style={{...LayoutStyle.marginLeft20}}>
                  <Text style={[HomeStyle.ownerName]}>{owner?.name || 'Owner Name'}</Text>
                  <Text style={[HomeStyle.ownerTag]}>{owner?.email || 'Tag'}</Text>
                </View>
              </View>
              <View style={{...CommonStyles.directionRowCenter}}>
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
                    style={[HomeStyle.iconCall, {...LayoutStyle.marginLeft20}]}>
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
            <Image source={IMAGES.map} style={[HomeStyle.mapImg]} />
            <View style={{...LayoutStyle.marginVertical20}}>
              <Text style={[HomeStyle.screenTitle]}>{'Neighborhood'}</Text>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'airplane-takeoff'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Airport'}</Text>
              </View>
            </View>
            <View>
              <View style={{...CommonStyles.directionRowSB}}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'MaterialIcons'}
                  iconName={'train'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Metro'}</Text>
              </View>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <View style={[HomeStyle.kmContainer]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View
                style={[HomeStyle.kmContainer, {...LayoutStyle.marginTop10}]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'bus'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Bus'}</Text>
              </View>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <View style={[HomeStyle.kmContainer]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View
                style={[HomeStyle.kmContainer, {...LayoutStyle.marginTop10}]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'train-sharp'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Railways'}</Text>
              </View>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <View style={[HomeStyle.kmContainer]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View
                style={[HomeStyle.kmContainer, {...LayoutStyle.marginTop10}]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <TouchableOpacity>
                <View style={[HomeStyle.iconViewAll]}>
                  <Text style={[HomeStyle.viewallTextIcon]}>{'View all'}</Text>
                  <Icons
                    iconSetName={'MaterialIcons'}
                    iconName={'keyboard-arrow-down'}
                    iconColor={Colors.gray}
                    iconSize={26}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={[
                  HomeStyle.screenTitle,
                  {...LayoutStyle.marginBottom20},
                ]}>
                {'Reviews'}
              </Text>
              <FlatList
                data={[1, 2]} // Placeholder for reviews
                renderItem={renderReviewList}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity style={{alignItems: 'center', marginTop: 10}}>
                <View style={[HomeStyle.iconViewAll, {flexDirection: 'row', alignItems: 'center'}]}>
                  <Text style={[HomeStyle.viewallTextIcon]}>{'View more'}</Text>
                  <Icons
                    iconSetName={'MaterialIcons'}
                    iconName={'keyboard-arrow-down'}
                    iconColor={Colors.gray}
                    iconSize={26}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={[
                  HomeStyle.screenTitle,
                  {...LayoutStyle.marginBottom20},
                ]}>
                {'Near by properties'}
              </Text>
              <FlatList
                horizontal
                data={[1, 2, 3]} // Placeholder for nearby properties
                renderItem={renderPropertyList}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </ScrollView>
        )}
        {propertyData && (
        <View style={[HomeStyle.btnBookingContainer, {paddingHorizontal: 20, paddingBottom: 20}]}>
          <Button
            onPress={() => gotoContactClick()}
            btnStyle={[HomeStyle.btnRadius]}
            flexContainer={{flexGrow: 0.456}}
            btnName={'Contact'}
          />
          <Button
            onPress={() => gotoBookClick()}
            btnStyle={[HomeStyle.btnRadius]}
            flexContainer={{flexGrow: 0.456}}
            btnName={'Book now'}
          />
        </View>
        )}
        {isBottomSheet && (
          <BottomSheet
            maxHeight={deviceHight / 6}
            isOpen={isBottomSheet}
            onClose={() => gotoBottomSheetClose()}
            renderContent={() => {
              return (
                <View style={[HomeStyle.bottomSheetHeight]}>
                  {isContact ? (
                    <View style={[HomeStyle.btnBookingContainer]}>
                      <TouchableOpacity style={{flex: 0.48}}>
                        <View style={[HomeStyle.iconBtnContainer]}>
                          <Icons
                            iconSetName={'Ionicons'}
                            iconName={'call-outline'}
                            iconColor={Colors.goastWhite}
                            iconSize={20}
                          />
                          <Text style={[HomeStyle.iconChat]}>{'Call'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex: 0.48}}>
                        <View style={[HomeStyle.iconBtnContainer]}>
                          <Icons
                            iconSetName={'Feather'}
                            iconName={'message-circle'}
                            iconColor={Colors.goastWhite}
                            iconSize={20}
                          />
                          <Text style={[HomeStyle.iconChat]}>{'Chat'}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={[HomeStyle.btnBookingContainer]}>
                      <TouchableOpacity
                        style={{flex: 0.48}}
                        onPress={() => gotoMySelf()}>
                        <View style={[HomeStyle.iconBtnContainer]}>
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
                        style={{flex: 0.48}}
                        onPress={() => gotoGroupCheckIn()}>
                        <View style={[HomeStyle.iconBtnContainer]}>
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
        )}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default PGBookingScreen;

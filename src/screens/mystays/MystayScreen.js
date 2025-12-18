import {View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, Modal, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';
import {Icons, Button, EmptyState} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {getMyStays} from '../../services/staysService';
import moment from 'moment';
import LayoutStyle from '../../styles/LayoutStyle';
import CommonStyles from '../../styles/CommonStyles';

const ACTIVE_BOOKING_STATUSES = ['approved', 'active', 'confirmed', 'pending'];

const MystayScreen = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [stays, setStays] = useState([]);
  const [selectedStay, setSelectedStay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);
      const response = await getMyStays();
      if (response.success) {
        setStays(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching stays:', error);
    } finally {
      setLoading(false);
    }
  };

  const openStayDetails = (stay) => {
    console.log("Stayyyy", stay);
    
    setSelectedStay(stay);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStay(null);
  };

  const gotoFoodMenu = () => {
    closeModal();
    navigation.navigate('FoodManu', {stayData: selectedStay});
  };

  const gotoRaiseConcern = () => {
    closeModal();
    navigation.navigate('ChangeRequest', {stayData: selectedStay});
  };

  const gotoVacateRoom = () => {
    closeModal();
    navigation.navigate('VacateRoom', {stayData: selectedStay});
  };

  const formatDate = (date) => {
    if (!date) return 'NA';
    return moment(date).format('DD/MM/YYYY');
  };

  const getIsPresent = (booking) => {
    if (!booking) return false;
    const status = (booking?.bookingStatus || '').toLowerCase();
    const hasPastMoveOutDate = booking?.moveOutDate && moment(booking.moveOutDate).isBefore(moment(), 'day');
    return ACTIVE_BOOKING_STATUSES.includes(status) && !hasPastMoveOutDate;
  };

  const getProperty = (booking) => {
    return booking?.property || booking?.propertyId || {};
  };

  const getRoomDetails = (booking) => {
    return booking?.roomDetails?.[0] || {};
  };

  const getImageUri = (booking) => {
    const property = getProperty(booking);
    const rawImage = Array.isArray(property?.images) ? property.images[0] : null;
    if (typeof rawImage === 'string') return rawImage;
    return rawImage?.url || rawImage?.secure_url || null;
  };

  const getAddress = (booking) => {
    const property = getProperty(booking);
    const addressParts = [property?.locality, property?.city]
      .filter(part => !!part)
      .join(', ');
    return addressParts || 'N/A';
  };

  const getDetailsText = (booking) => {
    if (!booking) return '';
    const roomDetails = getRoomDetails(booking);
    const floor = roomDetails?.floor || booking?.floor || '';
    const room = roomDetails?.roomNumber || booking?.roomNumber || '';
    const sharing = booking?.roomType || roomDetails?.roomType || '';
    
    let details = '';
    if (floor) details += `${floor} Floor`;
    if (room) details += details ? `, Room ${room}` : `Room ${room}`;
    if (sharing) details += details ? `, ${sharing}` : sharing;
    
    return details || 'N/A';
  };

  const renderStayCard = (booking) => {
    const property = getProperty(booking);
    const title = property?.name || 'N/A';
    const address = getAddress(booking);
    const checkIn = formatDate(booking?.moveInDate);
    const checkOut = booking?.moveOutDate ? formatDate(booking.moveOutDate) : 'NA';
    const details = getDetailsText(booking);
    const imageUri = getImageUri(booking);
    const isPresent = getIsPresent(booking);

    return (
      <TouchableOpacity 
        key={booking?._id || booking?.id || Math.random()} 
        onPress={() => openStayDetails(booking)}
        activeOpacity={0.8}>
        <View style={[MystaysStyle.staysListContainer]}>
          {isPresent && (
            <View style={MystaysStyle.presentLabel}>
              <Text style={MystaysStyle.presentLabelText}>Present</Text>
            </View>
          )}
          <Image 
            source={imageUri ? {uri: imageUri} : IMAGES.stays} 
            style={[MystaysStyle.staysImg]} 
            defaultSource={IMAGES.stays}
            resizeMode="cover"
          />
          <View style={MystaysStyle.staysContentContainer}>
            <View style={MystaysStyle.staysHeaderRow}>
              <Text style={[MystaysStyle.staysText]} numberOfLines={1}>{title}</Text>
              <TouchableOpacity 
                style={MystaysStyle.shareButton}
                onPress={(e) => {
                  e.stopPropagation();
                  // Handle share functionality
                }}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'share-social-outline'}
                  iconColor={Colors.black}
                  iconSize={20}
                />
              </TouchableOpacity>
            </View>
            <View style={[MystaysStyle.iconAddress]}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'location-sharp'}
                iconColor={Colors.black}
                iconSize={16}
              />
              <Text style={[MystaysStyle.staysAddress]} numberOfLines={2}>
                {address}
              </Text>
            </View>
            <View style={MystaysStyle.dateRow}>
              <Text style={[MystaysStyle.checkDate]}>{'Check in Date: '}</Text>
              <Text style={[MystaysStyle.checkDateAns]}>{checkIn}</Text>
            </View>
            <View style={MystaysStyle.dateRow}>
              <Text style={[MystaysStyle.checkDate]}>{'Check out Date: '}</Text>
              <Text style={[MystaysStyle.checkDateAns]}>{checkOut}</Text>
            </View>
            <View style={MystaysStyle.detailsRow}>
              <Text style={[MystaysStyle.checkDate]}>{'Details: '}</Text>
              <Text style={[MystaysStyle.checkDateAns]} numberOfLines={1}>
                {details}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const hasStays = stays.length > 0;

  if (loading && !hasStays) {
    return (
      <View style={[MystaysStyle.tabListcontainer, MystaysStyle.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!hasStays) {
    return (
      <View style={[MystaysStyle.tabListcontainer, MystaysStyle.emptyContainer]}>
        <EmptyState
          image={IMAGES.noStays}
          title="No stays found"
          description=""
          containerStyle={{ paddingTop: 50 }}
        />
      </View>
    );
  }

  const renderModalContent = () => {
    if (!selectedStay) return null;

    const property = getProperty(selectedStay);
    const roomDetails = getRoomDetails(selectedStay);
    const isPresent = getIsPresent(selectedStay);
    const title = property?.name || 'N/A';
    const address = getAddress(selectedStay);
    const checkIn = formatDate(selectedStay?.moveInDate);
    const checkOut = selectedStay?.moveOutDate ? formatDate(selectedStay.moveOutDate) : 'NA';
    const imageUri = getImageUri(selectedStay);
    const roomNumber = roomDetails?.roomNumber || selectedStay?.roomNumber || '101';
    const bed = selectedStay?.bed || roomDetails?.bed || 'B';
    const sharing = selectedStay?.roomType || roomDetails?.roomType || '2 Sharing';

    return (
      <View style={MystaysStyle.modalWrapper}>
        <ScrollView
          style={MystaysStyle.modalScrollView}
          contentContainerStyle={MystaysStyle.modalContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: '100%',
              padding: 20,
              backgroundColor: Colors.white,
              borderRadius: 15,
            }}
          >
            <View style={MystaysStyle.modalCardContainer}>
              <Image
                source={imageUri ? { uri: imageUri } : IMAGES.stays}
                style={MystaysStyle.modalImage}
                defaultSource={IMAGES.stays}
                resizeMode="cover"
              />
              <View style={MystaysStyle.modalContent}>
                <View style={MystaysStyle.modalHeaderRow}>
                  <Text style={MystaysStyle.modalTitle}>{title}</Text>
                  <TouchableOpacity
                    onPress={e => {
                      e.stopPropagation();
                      // Handle share functionality
                    }}
                  >
                    <Icons
                      iconSetName={'Ionicons'}
                      iconName={'share-social-outline'}
                      iconColor={Colors.black}
                      iconSize={24}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    MystaysStyle.iconAddress,
                    { ...LayoutStyle.marginTop10 },
                  ]}
                >
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'location-sharp'}
                    iconColor={Colors.black}
                    iconSize={16}
                  />
                  <Text style={[MystaysStyle.staysAddress]} numberOfLines={2}>
                    {address}
                  </Text>
                </View>
                <View style={MystaysStyle.modalDateRow}>
                  <Text style={[MystaysStyle.checkDate]}>
                    {'Check in Date: '}
                  </Text>
                  <Text style={[MystaysStyle.checkDateAns]} numberOfLines={1}>
                    {checkIn}
                  </Text>
                </View>
                <View style={MystaysStyle.modalDateRow}>
                  <Text style={[MystaysStyle.checkDate]}>
                    {'Check out Date: '}
                  </Text>
                  <Text style={[MystaysStyle.checkDateAns]} numberOfLines={1}>
                    {checkOut}
                  </Text>
                </View>

                {(roomNumber || bed || sharing) && (
                  <View style={MystaysStyle.modalRoomDetails}>
                    <Text style={[MystaysStyle.checkDate, {marginTop: 10}]}>
                      {isPresent
                        ? 'Current room/bed details: '
                        : 'Current room/bed details: '}
                    </Text>
                    <View style={MystaysStyle.modalRoomBadges}>
                      {(roomNumber || bed) && (
                        <View
                          style={[MystaysStyle.detailsRoom, { marginTop: 0 }]}
                        >
                          <Text style={[MystaysStyle.detailsText]}>
                            {`Room ${roomNumber} - ${bed}`}
                          </Text>
                        </View>
                      )}
                      {sharing && (
                        <View style={[MystaysStyle.detailsRoom]}>
                          <Text style={[MystaysStyle.detailsText]}>
                            {sharing}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {!isPresent && (
                  <TouchableOpacity style={[MystaysStyle.referButton, {marginTop: 20}]}>
                    <Text style={{
                      color: Colors.white,
                    }}>Refer to a friend</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isPresent && (
              <>
                <TouchableOpacity
                  style={[MystaysStyle.btnFood]}
                  onPress={gotoFoodMenu}
                >
                  <Text style={[MystaysStyle.foodText]}>{'Food Menu'}</Text>
                  <Icons
                    iconSetName={'MaterialIcons'}
                    iconName={'keyboard-arrow-right'}
                    iconColor={Colors.secondary}
                    iconSize={30}
                  />
                </TouchableOpacity>
                <View style={[MystaysStyle.btnRoomContainer]}>
                  <Button
                    flexContainer={{ flex: 0.48 }}
                    btnName={'Raise Concern'}
                    btnStyle={[MystaysStyle.RadiusBtnStyle]}
                    onPress={gotoRaiseConcern}
                  />
                  <Button
                    flexContainer={{ flex: 0.48 }}
                    btnStyle={[MystaysStyle.RadiusRoomBtnStyle]}
                    btnName={'Vacate Room'}
                    onPress={gotoVacateRoom}
                    btnTextColor={Colors.secondary}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[MystaysStyle.tabListcontainer]}>
      <FlatList
        data={stays}
        keyExtractor={(item, index) => (item?._id ? String(item._id) : item?.id ? String(item.id) : `stay-${index}`)}
        renderItem={({item}) => renderStayCard(item)}
        contentContainerStyle={MystaysStyle.scrollContent}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={MystaysStyle.modalOverlay}>
          <TouchableOpacity 
            style={MystaysStyle.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          >
          <View style={MystaysStyle.modalContainer}>
            {renderModalContent()}
            </View>
            </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MystayScreen;

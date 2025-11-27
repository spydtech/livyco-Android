import {View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList, Modal, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';
import {Icons, Button} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {getMyStays} from '../../services/staysService';
import moment from 'moment';
import LayoutStyle from '../../styles/LayoutStyle';
import CommonStyles from '../../styles/CommonStyles';

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

  const getDetailsText = (stay) => {
    if (!stay) return '';
    const floor = stay.floor || '';
    const room = stay.room || '';
    const sharing = stay.sharing || '';
    
    let details = '';
    if (floor) details += `${floor} Floor`;
    if (room) details += details ? `, Room ${room}` : `Room ${room}`;
    if (sharing) details += details ? `, ${sharing}` : sharing;
    
    return details || 'N/A';
  };

  const renderStayCard = (stay, isPresent = false) => {
    const title = stay?.title || stay?.propertyId?.name || 'N/A';
    const address = stay?.address || 
                   (stay?.propertyId ? `${stay.propertyId.locality || ''} ${stay.propertyId.city || ''}`.trim() : '') ||
                   'N/A';
    const checkIn = formatDate(stay?.checkIn || stay?.moveInDate);
    const checkOut = stay?.checkOut || stay?.moveOutDate ? formatDate(stay.checkOut || stay.moveOutDate) : 'NA';
    const details = getDetailsText(stay);
    const imageUri = stay?.image || stay?.propertyId?.images?.[0] || stay?.raw?.propertyId?.images?.[0] || null;

    return (
      <TouchableOpacity 
        key={stay?._id || Math.random()} 
        onPress={() => openStayDetails(stay)}
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
        <Text style={MystaysStyle.emptyText}>No stays found</Text>
      </View>
    );
  }

  const renderModalContent = () => {
    if (!selectedStay) return null;

    const isPresent = selectedStay.isPresent;
    const title = selectedStay?.title || selectedStay?.propertyId?.name || 'N/A';
    const address = selectedStay?.address || 
                   (selectedStay?.propertyId ? `${selectedStay.propertyId.locality || ''} ${selectedStay.propertyId.city || ''}`.trim() : '') ||
                   'N/A';
    const checkIn = formatDate(selectedStay?.checkIn || selectedStay?.moveInDate);
    const checkOut = selectedStay?.checkOut || selectedStay?.moveOutDate ? formatDate(selectedStay.checkOut || selectedStay.moveOutDate) : 'NA';
    const imageUri = selectedStay?.image || selectedStay?.propertyId?.images?.[0] || selectedStay?.raw?.propertyId?.images?.[0] || null;
    const roomNumber = selectedStay?.room || selectedStay?.roomDetails?.[0]?.roomNumber || '101';
    const bed = selectedStay?.bed || 'B';
    const sharing = selectedStay?.sharing || selectedStay?.roomType?.name || '2 Sharing';

    return (
      <View style={MystaysStyle.modalWrapper}>
        <ScrollView 
          style={MystaysStyle.modalScrollView}
          contentContainerStyle={MystaysStyle.modalContentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={MystaysStyle.modalCardContainer}>
            <Image 
              source={imageUri ? {uri: imageUri} : IMAGES.stays} 
              style={MystaysStyle.modalImage}
              defaultSource={IMAGES.stays}
              resizeMode="cover"
            />
            <View style={MystaysStyle.modalContent}>
              <View style={MystaysStyle.modalHeaderRow}>
                <Text style={MystaysStyle.modalTitle}>{title}</Text>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    // Handle share functionality
                  }}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'share-social-outline'}
                    iconColor={Colors.black}
                    iconSize={24}
                  />
                </TouchableOpacity>
              </View>
              <View style={[MystaysStyle.iconAddress, {...LayoutStyle.marginTop10}]}>
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
                <Text style={[MystaysStyle.checkDate]}>{'Check in Date: '}</Text>
                <Text style={[MystaysStyle.checkDateAns]} numberOfLines={1}>{checkIn}</Text>
              </View>
              <View style={MystaysStyle.modalDateRow}>
                <Text style={[MystaysStyle.checkDate]}>{'Check out Date: '}</Text>
                <Text style={[MystaysStyle.checkDateAns]} numberOfLines={1}>{checkOut}</Text>
              </View>
              
              {(roomNumber || bed || sharing) && (
                <View style={MystaysStyle.modalRoomDetails}>
                  <Text style={[MystaysStyle.checkDate]}>
                    {isPresent ? 'Current room/bed details: ' : 'Room/bed details: '}
                  </Text>
                  <View style={MystaysStyle.modalRoomBadges}>
                    {(roomNumber || bed) && (
                      <View style={[MystaysStyle.detailsRoom]}>
                        <Text style={[MystaysStyle.detailsText]}>
                          {`Room ${roomNumber} - Bed ${bed}`}
                        </Text>
                      </View>
                    )}
                    {sharing && (
                      <View style={[MystaysStyle.detailsRoom]}>
                        <Text style={[MystaysStyle.detailsText]}>{sharing}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
          
          {isPresent && (
            <>
              <TouchableOpacity
                style={[MystaysStyle.btnFood]}
                onPress={gotoFoodMenu}>
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
                  flexContainer={{flex: 0.48}}
                  btnName={'Raise Concern'}
                  btnStyle={[MystaysStyle.RadiusBtnStyle]}
                  onPress={gotoRaiseConcern}
                />
                <Button
                  flexContainer={{flex: 0.48}}
                  btnStyle={[MystaysStyle.RadiusRoomBtnStyle]}
                  btnName={'Vacate Room'}
                  onPress={gotoVacateRoom}
                  btnTextColor={Colors.secondary}
                />
              </View>
            </>
          )}
          
          {!isPresent && (
            <View style={MystaysStyle.referButtonContainer}>
              <Button
                btnName={'Refer to a friend'}
                btnStyle={[MystaysStyle.referButton]}
                onPress={() => {
                  // Handle refer to friend
                  closeModal();
                }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[MystaysStyle.tabListcontainer]}>
      <FlatList
        data={stays}
        keyExtractor={(item, index) => (item?._id ? String(item._id) : `stay-${index}`)}
        renderItem={({item}) => renderStayCard(item, item.isPresent)}
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
          />
          <View style={MystaysStyle.modalContainer}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MystayScreen;

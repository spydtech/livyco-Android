import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Icons } from './index';
import Colors from '../styles/Colors';
import LayoutStyle from '../styles/LayoutStyle';
import FontFamily from '../assets/FontFamily';
import { deviceHight, deviceWidth } from '../utils/DeviceInfo';
import IMAGES from '../assets/Images';
import { Image } from 'react-native';

// Popular Indian cities with their images (only cities with available images)
const POPULAR_CITIES = [
  { id: 1, name: 'Mumbai', image: IMAGES.mumbai, landmark: 'Gateway of India' },
  { id: 2, name: 'Delhi-NCR', image: IMAGES.delhi, landmark: 'India Gate' },
  { id: 3, name: 'Bangalore', image: IMAGES.bangalore, landmark: 'Vidhana Soudha' },
  { id: 4, name: 'Hyderabad', image: IMAGES.hyderabad, landmark: 'Charminar' },
  { id: 5, name: 'Chandigarh', image: IMAGES.chandigarh, landmark: 'Open Hand Monument' },
  { id: 6, name: 'Ahmedabad', image: IMAGES.ahmedabad, landmark: 'Sidi Saiyyed Mosque' },
  { id: 7, name: 'Pune', image: IMAGES.pune, landmark: 'Shaniwar Wada' },
  { id: 8, name: 'Chennai', image: IMAGES.chennai, landmark: 'Ripon Building' },
  { id: 9, name: 'Kolkata', image: IMAGES.kolkata, landmark: 'Howrah Bridge' },
  { id: 10, name: 'Kochi', image: IMAGES.kochi, landmark: 'Backwaters' },
];

// Extended list of cities for search (includes popular cities and additional cities)
const ALL_CITIES = [
  ...POPULAR_CITIES,
  { id: 11, name: 'Indore', icon: '🏛️', landmark: 'Rajwada' },
  { id: 12, name: 'Bhopal', icon: '🏛️', landmark: 'Taj-ul-Masajid' },
  { id: 13, name: 'Visakhapatnam', icon: '🌊', landmark: 'RK Beach' },
  { id: 14, name: 'Patna', icon: '🏛️', landmark: 'Golghar' },
  { id: 15, name: 'Vadodara', icon: '🏛️', landmark: 'Laxmi Vilas Palace' },
  { id: 16, name: 'Ghaziabad', icon: '🏛️', landmark: 'City Center' },
  { id: 17, name: 'Ludhiana', icon: '🏛️', landmark: 'Gurudwara' },
  { id: 18, name: 'Agra', icon: '🏛️', landmark: 'Taj Mahal' },
  { id: 19, name: 'Nashik', icon: '🏛️', landmark: 'Sula Vineyards' },
  { id: 20, name: 'Faridabad', icon: '🏛️', landmark: 'City Center' },
  { id: 21, name: 'Meerut', icon: '🏛️', landmark: 'City Center' },
  { id: 22, name: 'Rajkot', icon: '🏛️', landmark: 'City Center' },
  { id: 23, name: 'Varanasi', icon: '🕉️', landmark: 'Kashi Vishwanath' },
  { id: 24, name: 'Srinagar', icon: '🏔️', landmark: 'Dal Lake' },
  { id: 25, name: 'Amritsar', icon: '🕌', landmark: 'Golden Temple' },
  { id: 26, name: 'Goa', icon: '🏖️', landmark: 'Beaches' },
  { id: 27, name: 'Mysore', icon: '🏰', landmark: 'Mysore Palace' },
  { id: 28, name: 'Coimbatore', icon: '🏛️', landmark: 'City Center' },
];

const CitySelectionModal = ({ visible, onClose, onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = ALL_CITIES.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredCities([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      // Request location permission
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Livyco needs access to your location to detect your city',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to detect your city.'
          );
          setIsDetectingLocation(false);
          return;
        }
      }

      // Get current position using React Native's Geolocation API
      // React Native includes Geolocation in navigator.geolocation
      // For React Native 0.60+, geolocation is available globally
      let geolocation;
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        geolocation = navigator.geolocation;
      } else if (typeof global !== 'undefined' && global.navigator?.geolocation) {
        geolocation = global.navigator.geolocation;
      } else {
        // Try to require Geolocation polyfill if available
        try {
          geolocation = require('@react-native-community/geolocation');
        } catch (e) {
          Alert.alert(
            'Geolocation Not Available',
            'Location services are not available on this device. Please select a city manually.'
          );
          setIsDetectingLocation(false);
          return;
        }
      }

      if (!geolocation || !geolocation.getCurrentPosition) {
        Alert.alert(
          'Geolocation Not Available',
          'Location services are not available on this device. Please select a city manually.'
        );
        setIsDetectingLocation(false);
        return;
      }

      geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get city name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data && data.city) {
              const detectedCity = data.city;
              // Find matching city in our list
              const matchedCity = ALL_CITIES.find(
                city => city.name.toLowerCase().includes(detectedCity.toLowerCase()) ||
                        detectedCity.toLowerCase().includes(city.name.toLowerCase())
              );
              
              if (matchedCity) {
                onSelectCity(matchedCity);
                onClose();
              } else {
                // If city not in list, create a new entry
                const newCity = {
                  id: Date.now(),
                  name: detectedCity,
                  icon: '📍',
                  landmark: 'Your Location',
                };
                onSelectCity(newCity);
                onClose();
              }
            } else {
              Alert.alert('Error', 'Could not determine your city from location.');
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            Alert.alert('Error', 'Failed to get city name from location.');
          }
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          Alert.alert(
            'Location Error',
            'Failed to get your location. Please check your location settings or select a city manually.'
          );
          setIsDetectingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.error('Location detection error:', error);
      Alert.alert('Error', 'Failed to detect location. Please select a city manually.');
      setIsDetectingLocation(false);
    }
  };

  const handleCitySelect = (city) => {
    onSelectCity(city);
    setSearchQuery('');
    onClose();
  };

  const renderCityCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cityCard}
      onPress={() => handleCitySelect(item)}
      activeOpacity={0.7}>
      <View style={styles.cityImageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.cityImage} resizeMode="cover" />
        ) : (
          <View style={styles.cityIconPlaceholder}>
            <Text style={styles.cityIcon}>{item.icon || '📍'}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cityName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleCitySelect(item)}
      activeOpacity={0.7}>
      <Icons
        iconSetName={'Ionicons'}
        iconName={'location'}
        iconColor={Colors.secondary}
        iconSize={20}
      />
      <Text style={styles.searchResultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <SafeAreaView
        // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
        >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View 
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'search'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for your city"
                placeholderTextColor={Colors.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={false}
              />
            </View>
            <TouchableOpacity
              style={styles.detectButton}
              onPress={handleDetectLocation}
              disabled={isDetectingLocation}>
              {isDetectingLocation ? (
                <ActivityIndicator size="small" color={Colors.red} />
              ) : (
                <>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'location'}
                    iconColor={Colors.red}
                    iconSize={16}
                  />
                  <Text style={styles.detectText}>Detect</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {showSearchResults && (
            <View style={styles.searchResultsContainer}>
              <FlatList
                data={filteredCities}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id.toString()}
                style={styles.searchResultsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              />
            </View>
          )}

          {/* Popular Cities Section */}
          {!showSearchResults && (
            <>
              <Text style={styles.sectionTitle}>Popular Cities</Text>
              <FlatList
                data={POPULAR_CITIES}
                renderItem={renderCityCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.citiesGrid}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: deviceHight * 0.85,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goastWhite,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
    padding: 0,
    height: 40,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.red,
    height: 40,
  },
  detectText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.red,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamily.RobotoBold,
    color: Colors.blackText,
    marginBottom: 15,
  },
  citiesGrid: {
    paddingBottom: 10,
  },
  cityCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    minHeight: 100,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cityImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: Colors.goastWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityImage: {
    width: '100%',
    height: '100%',
  },
  cityIconPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityIcon: {
    fontSize: 24,
  },
  cityName: {
    fontSize: 14,
    fontFamily: FontFamily.RobotoMedium,
    color: Colors.blackText,
    textAlign: 'center',
  },
  searchResultsContainer: {
    maxHeight: deviceHight * 0.5,
    marginTop: 10,
    flex: 1,
  },
  searchResultsList: {
    flexGrow: 0,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorder,
  },
  searchResultText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: FontFamily.RobotoRegular,
    color: Colors.blackText,
  },
});

export default CitySelectionModal;


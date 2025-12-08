import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  // SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import MystaysStyle from '../../styles/MystaysStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import moment from 'moment';
import {getFoodItemsByBookingAndDay} from '../../services/menuService';

const FoodManuScreen = props => {
  const stayData = props.route?.params?.stayData;
  const bookingId = stayData?._id || stayData?.id;
  
  const [loading, setLoading] = useState(true);
  const [mealData, setMealData] = useState([]);
  const [error, setError] = useState(null);

  // Category time mappings
  const categoryTimes = {
    Breakfast: '(8:00 A.M - 9:00 A.M)',
    Lunch: '(12:30 P.M - 2:00 P.M)',
    Snacks: '(4:30 P.M - 5:00 P.M)',
    Dinner: '(07:30 P.M - 9:00 P.M)',
  };

  // Get current day name
  const getCurrentDay = () => {
    return moment().format('dddd'); // Returns Monday, Tuesday, etc.
  };

  // Group food items by category
  const groupFoodItemsByCategory = (foodItems) => {
    const grouped = {
      Breakfast: [],
      Lunch: [],
      Snacks: [],
      Dinner: [],
    };

    foodItems.forEach(item => {
      const category = item.category || 'Breakfast';
      if (grouped[category]) {
        grouped[category].push(item.name || item.description || '');
      }
    });

    // Convert to array format matching the original structure
    return [
      {
        title: `Breakfast ${categoryTimes.Breakfast}`,
        items: grouped.Breakfast,
      },
      {
        title: `Lunch ${categoryTimes.Lunch}`,
        items: grouped.Lunch,
      },
      {
        title: `Snacks ${categoryTimes.Snacks}`,
        items: grouped.Snacks,
      },
      {
        title: `Dinner ${categoryTimes.Dinner}`,
        items: grouped.Dinner,
      },
    ].filter(meal => meal.items.length > 0); // Only show categories with items
  };

  useEffect(() => {
    fetchFoodMenu();
  }, [bookingId]);

  const fetchFoodMenu = async () => {
    if (!bookingId) {
      setError('Booking ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const currentDay = getCurrentDay();
      const response = await getFoodItemsByBookingAndDay(bookingId, currentDay);

      if (response.success && response.data) {
        const groupedData = groupFoodItemsByCategory(response.data);
        setMealData(groupedData);
      } else {
        // If no data, show empty state
        setMealData([]);
        setError(response.message || 'No food items found for today');
      }
    } catch (err) {
      console.error('Error fetching food menu:', err);
      setError('Failed to load food menu. Please try again.');
      setMealData([]);
    } finally {
      setLoading(false);
    }
  };

  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const MealItem = ({item}) => {
    if (!item.items || item.items.length === 0) {
      return null;
    }

    return (
      <View style={MystaysStyle.itemContainerFood}>
        <Text style={MystaysStyle.mealTitle}>{item.title}</Text>
        <View style={{...CommonStyles.directionRowCenter, flexWrap: 'wrap'}}>
          {item.items.map((line, index) => (
            <Text key={index} style={MystaysStyle.mealText}>
              {line}
              {index < item.items.length - 1 ? ', ' : ''}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[HomeStyle.homeContainer, {flex: 1}]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          backgroundColor: Colors.secondary,
        }} edges={['top']}>
        <View style={MystaysStyle.headerContainerBlue}>
          <TouchableOpacity
            onPress={() => {
              gotoBack();
            }}
            style={MystaysStyle.profileImgContainer}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={MystaysStyle.headerTitle}>Food Menu</Text>
          <View style={MystaysStyle.iconContainer}>
            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'share-social-outline'}
                iconColor={Colors.white}
                iconSize={24}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{...LayoutStyle.marginLeft15}}
              onPress={() => props.navigation.navigate('Wishlist')}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'heart-outline'}
                iconColor={Colors.white}
                iconSize={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <ImageBackground
        source={IMAGES.primaryBG}
        style={[MystaysStyle.formContainer, {flex: 1}]}
        resizeMode="cover">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1, alignItems: 'center', width: "100%"}}
          showsVerticalScrollIndicator={false}>
          <Image source={IMAGES.food} style={[MystaysStyle.imgFood, {marginVertical: 20}]} />
          <View style={[MystaysStyle.foodListContainer, {width: '100%', padding:20}]}>
            <Text style={[MystaysStyle.header, {marginBottom: 15}]}>
              Date ({moment().format('DD/MM/YYYY')}) - {getCurrentDay()}
            </Text>
            
            {loading ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40}}>
                <ActivityIndicator size="large" color={Colors.secondary} />
                <Text style={{marginTop: 10, color: Colors.grayText}}>Loading menu...</Text>
              </View>
            ) : error && mealData.length === 0 ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40}}>
                <Text style={{color: Colors.grayText, textAlign: 'center'}}>{error}</Text>
                <TouchableOpacity
                  onPress={fetchFoodMenu}
                  style={{
                    marginTop: 15,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: Colors.secondary,
                    borderRadius: 8,
                  }}>
                  <Text style={{color: Colors.white}}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : mealData.length === 0 ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40}}>
                <Text style={{color: Colors.grayText, textAlign: 'center'}}>
                  No food items available for today
                </Text>
              </View>
            ) : (
              <FlatList
                data={mealData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={MealItem}
                contentContainerStyle={[MystaysStyle.listContent]}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default FoodManuScreen;

import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {CommonActions} from '@react-navigation/native';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import MystaysStyle from '../../styles/MystaysStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';

const FoodManuScreen = props => {
  const mealData = [
    {
      title: 'Breakfast (8:00 A.M - 9:00 A.M)',
      items: ['Aaloo Paratha', 'Aam ka achar', 'Chai and Dahi'],
    },
    {
      title: 'Lunch (12:30 P.M - 2:00 P.M)',
      items: ['Rajama curry', 'Roti', 'Raiyta', 'Rice and salad'],
    },
    {
      title: 'Snacks (4:30 P.M - 5:00 P.M)',
      items: ['Tea / Milk and Biscuits'],
    },
    {
      title: 'Dinner (07:30 P.M - 9:00 P.M)',
      items: ['Dal', 'Mix veg.', 'Halwa', 'Rice and salad'],
    },
  ];
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };

  const MealItem = ({item}) => {
    return (
      <View style={MystaysStyle.itemContainerFood}>
        <Text style={MystaysStyle.mealTitle}>{item.title}</Text>
        <View style={{...CommonStyles.directionRowCenter}}>
          {item.items.map((line, index) => (
            <Text key={index} style={MystaysStyle.mealText}>
              {line + ', '}
            </Text>
          ))}
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
        style={[MystaysStyle.formContainer, {flex: 1}]}
        resizeMode="cover">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          <Image source={IMAGES.food} style={[MystaysStyle.imgFood]} />
          <View style={MystaysStyle.foodListContainer}>
            <Text style={MystaysStyle.header}>Date (DD/MM/YYYY)</Text>
            <FlatList
              data={mealData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={MealItem}
              contentContainerStyle={MystaysStyle.listContent}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default FoodManuScreen;

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  // SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import MystaysStyle from '../../styles/MystaysStyle';
import {CommonActions} from '@react-navigation/native';

export default function MystayDetailScreen(props) {
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const gotoFoodmenu = () => {
    props.navigation.navigate('FoodManu');
  };
  const gotoRaiseRequest = () => {
    props.navigation.navigate('ChangeRequest');
  };
  const gotoVacateRoom = () => {
    props.navigation.navigate('VacateRoom');
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
            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'share-social-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{...LayoutStyle.marginLeft5}}
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={[HomeStyle.graybg]}>
          <View style={[HomeStyle.pgDetailsContainer]}>
            <View style={[HomeStyle.centerView]}>
              <Image
                source={IMAGES.property}
                style={[HomeStyle.pgDetailsImg]}
              />
            </View>
            <View style={[HomeStyle.textIconTitle]}>
              <Text style={[HomeStyle.titleText]}>{'ABC boys hostel'}</Text>
              <TouchableOpacity>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'share-social-outline'}
                  iconColor={Colors.black}
                  iconSize={26}
                />
              </TouchableOpacity>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'location-pin'}
                iconColor={Colors.black}
                iconSize={20}
              />
              <Text style={[MystaysStyle.addressText]}>
                {'Location texP.No 123,abc, dfg xxxx, Hyd 5xxxxxx '}
              </Text>
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <Text style={[MystaysStyle.checkDateText]}>
                {'Check in Date: '}
              </Text>
              <Text style={[MystaysStyle.checkDateValue]}>{'DD/MM/YYYY'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <Text style={[MystaysStyle.checkDateText]}>
                {'Check out Date: '}
              </Text>
              <Text style={[MystaysStyle.checkDateValue]}>{'NA'}</Text>
            </View>
            <View style={[MystaysStyle.detailsView]}>
              <Text style={[MystaysStyle.checkDateText]}>
                {'Current room/bed details: '}
              </Text>
              <View>
                <View style={[MystaysStyle.detailsRoom]}>
                  <Text style={[MystaysStyle.detailsText]}>
                    {'Room 101 - Bed B'}
                  </Text>
                </View>
                <View
                  style={[
                    MystaysStyle.detailsRoom,
                    {...LayoutStyle.marginTop10},
                  ]}>
                  <Text style={[MystaysStyle.detailsText]}>{'2 Sharing'}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[MystaysStyle.btnFood]}
              onPress={() => gotoFoodmenu()}>
              <Text style={[MystaysStyle.foodText]}>{'Food menu'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.secondary}
                iconSize={30}
              />
            </TouchableOpacity>
            <View style={[MystaysStyle.btnRoomContainer]}>
              <Button
                flexContainer={{flex: 0.456}}
                btnName={'Raise Concern'}
                btnStyle={[MystaysStyle.RadiusBtnStyle]}
                onPress={() => gotoRaiseRequest()}
              />
              <Button
                flexContainer={{flex: 0.456}}
                btnStyle={[MystaysStyle.RadiusRoomBtnStyle]}
                btnName={'Vacate Room'}
                onPress={() => gotoVacateRoom()}
                btnTextColor={Colors.secondary}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

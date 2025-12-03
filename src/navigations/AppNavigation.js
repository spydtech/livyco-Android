import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Svg, Path} from 'react-native-svg';
import {navigationRef} from '../utils/navigationRef';

//Screens list
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import SuccessScreen from '../screens/auth/SuccessScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/Dashboard/HomeScreen';
import Colors from '../styles/Colors';
import PayRentScreen from '../screens/payment/PayRentScreen';
import PayRentBookingScreen from '../screens/payment/PayRentBookingScreen';
import ChatsScreen from '../screens/chats/ChatsScreen';
import MystaysScreen from '../screens/mystays/MystaysScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import {Icons} from '../components';
import {Text, View} from 'react-native';
import {deviceHight, deviceWidth} from '../utils/DeviceInfo';
import TrendingScreen from '../screens/Dashboard/TrendingScreen';
import PGBookingScreen from '../screens/Dashboard/PGBookingScreen';
import MySelfBookingScreen from '../screens/Dashboard/MySelfBookingScreen';
import HistoryScreen from '../screens/payment/HistoryScreen';
import CancelScreen from '../screens/payment/CancelScreen';
import BookingPolicyScreen from '../screens/Dashboard/BookingPolicyScreen';
import HistoryDetailScreen from '../screens/payment/HistoryDetailScreen';
import GroupBookingScreen from '../screens/Dashboard/GroupBookingScreen';
import MessageListScreen from '../screens/chats/MessageListScreen';
import ChatListScreen from '../screens/chats/ChatListScreen';
import CallScreen from '../screens/chats/CallScreen';
import SuccessIDScreen from '../screens/auth/SuccessIDScreen';
import BookingOptionScreen from '../screens/Dashboard/BookingOptionScreen';
import GuestDetailsScreen from '../screens/Dashboard/GuestDetailsScreen';
import MystayDetailScreen from '../screens/mystays/MystayDetailScreen';
import FoodManuScreen from '../screens/mystays/FoodManuScreen';
import ChangeRequestScreen from '../screens/mystays/ChangeRequestScreen';
import SuccessRequestScreen from '../screens/mystays/SuccessRequestScreen';
import ViewStatusScreen from '../screens/mystays/ViewStatusScreen';
import VacateRoomScreen from '../screens/Dashboard/VacateRoomScreen';
import VacateSuccessScreen from '../screens/Dashboard/VacateSuccessScreen';
import VacateStatusScreen from '../screens/Dashboard/VacateStatusScreen';
import WishlistScreen from '../screens/Dashboard/WishlistScreen';
import NotificationScreen from '../screens/Dashboard/NotificationScreen';
import Registerotp from '../screens/auth/Registerotp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
      })}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="PGBooking" component={PGBookingScreen} />
      <HomeStack.Screen name="Cancel" component={CancelScreen} />
    </HomeStack.Navigator>
  );
}
const PaymentStack = createNativeStackNavigator();

function PaymentStackScreen() {
  return (
    <PaymentStack.Navigator
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
      })}>
      <PaymentStack.Screen name="PayRent" component={PayRentScreen} />
      <PaymentStack.Screen name="Cancel" component={CancelScreen} />
      <PaymentStack.Screen name="History" component={HistoryScreen} />
      <PaymentStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
      />
    </PaymentStack.Navigator>
  );
}
const ChatsStack = createNativeStackNavigator();

function ChatsStackScreen() {
  return (
    <ChatsStack.Navigator
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
      })}>
      <ChatsStack.Screen name="Chats" component={ChatsScreen} />
    </ChatsStack.Navigator>
  );
}
const MystaysStack = createNativeStackNavigator();

function MystaysStackScreen() {
  return (
    <MystaysStack.Navigator
      initialRouteName="Mystays"
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
      })}>
      <MystaysStack.Screen name="Mystays" component={MystaysScreen} />
      <MystaysStack.Screen name="MystayDetail" component={MystayDetailScreen} />
    </MystaysStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
      })}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <PaymentStack.Screen name="History" component={HistoryScreen} />
    </ProfileStack.Navigator>
  );
}

function HomeTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true,
          swipeEnabled: false,
          tabBarHideOnKeyboard: true,
          unmountOnBlur: true,
          tabBarStyle: {
            // alignItems: 'center',
            // alignSelf: 'center',
            backgroundColor: "transparent",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            color: '#FFF',
          },
          tabBarIcon: ({ focused }) => {
            let iconSetName;
            let iconName;
            let label;

            switch (route.name) {
              case 'HomeTab':
                iconSetName = 'Ionicons';
                iconName = 'home';
                label = 'Home';
                break;
              case 'PayTab':
                iconSetName = 'Ionicons';
                iconName = 'wallet-outline';
                label = 'Pay Rent';
                break;
              case 'ChatsTab':
                iconSetName = 'Ionicons';
                iconName = 'chatbubbles-outline';
                label = 'Chats';
                break;
              case 'MystaysTab':
                iconSetName = 'FontAwesome';
                iconName = 'building-o';
                label = 'My stays';
                break;
              case 'ProfileTab':
                iconSetName = 'FontAwesome';
                iconName = 'user-o';
                label = 'Profile';
                break;
            }
            return (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: focused ? 'transparent' : Colors.charcol,
                }}
              >
                <Svg
                  width={deviceWidth / 5}
                  height={65}
                  viewBox="0 140 800 400"
                >
                  <Path
                    d="M0 0
                      L0 22
                      C220 40, 200 420, 420 420
                      C620 420, 620 70, 820 20
                      L820 20
                      V1000
                      H0
                      Z"
                    fill={Colors.charcol}
                  />
                  <View
                    style={{
                      alignItems: 'center',
                      borderRadius: focused ? 100 : 0,
                      width: "40",
                      alignSelf: 'center',
                      padding: 10,
                      backgroundColor: Colors.charcol,
                      marginTop: focused ? -10 : 10,
                      marginLeft: focused ? 3 : 0,
                    }}
                  >
                    <Icons
                      iconSetName={iconSetName}
                      iconName={iconName}
                      iconColor={focused ? Colors.primary : Colors.white}
                      iconSize={20}
                    />
                  </View>
                </Svg>
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackScreen} />
        <Tab.Screen name="PayTab" component={PaymentStackScreen} />
        <Tab.Screen name="ChatsTab" component={ChatsStackScreen} />
        <Tab.Screen name="MystaysTab" component={MystaysStackScreen} />
        <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
      </Tab.Navigator>
    </>
  );
}

function AppNavigation(props) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={({route, navigation}) => ({
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true,
        })}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registerotp" component={Registerotp} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="SuccessID" component={SuccessIDScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Tab" component={HomeTabs} />
        <Stack.Screen name="Trending" component={TrendingScreen} />
        <Stack.Screen name="PGBooking" component={PGBookingScreen} />
        <Stack.Screen name="MySelfBooking" component={MySelfBookingScreen} />
        <Stack.Screen name="BookingOption" component={BookingOptionScreen} />
        <Stack.Screen name="BookingPolicy" component={BookingPolicyScreen} />
        <Stack.Screen name="PayRentBooking" component={PayRentBookingScreen} />
        <Stack.Screen name="GroupBooking" component={GroupBookingScreen} />
        <Stack.Screen name="GuestDetails" component={GuestDetailsScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="MessageList" component={MessageListScreen} />
        <Stack.Screen name="Call" component={CallScreen} />
        <Stack.Screen name="FoodManu" component={FoodManuScreen} />
        <Stack.Screen name="ChangeRequest" component={ChangeRequestScreen} />
        <Stack.Screen name="SuccessRequest" component={SuccessRequestScreen} />
        <Stack.Screen name="ViewStatus" component={ViewStatusScreen} />
        <Stack.Screen name="VacateRoom" component={VacateRoomScreen} />
        <Stack.Screen name="VacateSuccess" component={VacateSuccessScreen} />
        <Stack.Screen name="VacateStatus" component={VacateStatusScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;

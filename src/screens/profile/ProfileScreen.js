import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import React from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import ProfileStyle from '../../styles/ProfileStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';

const ProfileScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={MystaysStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View style={MystaysStyle.headerContainerBlue}>
          <View style={MystaysStyle.profileImgContainer}>
            <TouchableOpacity onPress={() => gotoBack()}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-left'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <Text style={[ProfileStyle.headerTitle]}>{'Profile'}</Text>
          </View>
          <View style={MystaysStyle.iconContainer}>
            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'notifications-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
              <View style={MystaysStyle.smallRound}></View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <View style={[ProfileStyle.mainContainer]}>
        <View style={{...CommonStyles.directionRowSB}}>
          <View style={[ProfileStyle.userNameContainer]}>
            <View style={[ProfileStyle.imageContaienr]}>
              <Image
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_1280.png',
                }}
                style={[ProfileStyle.profileImg]}
              />
            </View>
            <View style={{...LayoutStyle.marginLeft20}}>
              <Text style={[ProfileStyle.userName]}>{'Satish CH'}</Text>
              <Text style={[ProfileStyle.fontLite]}>{'+911234567890'}</Text>
              <Text style={[ProfileStyle.fontLite]}>{'LV08089'}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Icons
              iconSetName={'FontAwesome'}
              iconName={'edit'}
              iconColor={Colors.black}
              iconSize={26}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{...LayoutStyle.marginVertical20}}>
            <Text style={[ProfileStyle.accountInfoTitle]}>
              {'Account Info'}
            </Text>
          </View>
          <View
            style={{
              ...CommonStyles.directionRowSB,
              ...LayoutStyle.marginVertical10,
            }}>
            <Text style={[ProfileStyle.listOption]}>{'Theme'}</Text>
            <Switch />
          </View>
          <TouchableOpacity>
            <View
              style={{
                ...CommonStyles.directionRowSB,
                ...LayoutStyle.marginVertical10,
              }}>
              <Text style={[ProfileStyle.listOption]}>{'Payment History'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                ...CommonStyles.directionRowSB,
                ...LayoutStyle.marginVertical10,
              }}>
              <Text style={[ProfileStyle.listOption]}>{'My Wallet'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                ...CommonStyles.directionRowSB,
                ...LayoutStyle.marginVertical10,
              }}>
              <Text style={[ProfileStyle.listOption]}>{'Help & Support'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                ...CommonStyles.directionRowSB,
                ...LayoutStyle.marginVertical10,
              }}>
              <Text style={[ProfileStyle.listOption]}>{'Term & Policy'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                ...CommonStyles.directionRowSB,
                ...LayoutStyle.marginVertical10,
              }}>
              <Text style={[ProfileStyle.listOption]}>{'Delete Account'}</Text>
              <Icons
                iconSetName={'MaterialIcons'}
                iconName={'keyboard-arrow-right'}
                iconColor={Colors.gray}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={[ProfileStyle.deleteBtn]}>
          <View
            style={{
              ...CommonStyles.directionRowSB,
              ...LayoutStyle.marginVertical10,
              ...LayoutStyle.marginHorizontal20,
            }}>
            <Text style={[ProfileStyle.logoutText]}>{'Logout'}</Text>
            <Icons
              iconSetName={'MaterialIcons'}
              iconName={'logout'}
              iconColor={Colors.red}
              iconSize={26}
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

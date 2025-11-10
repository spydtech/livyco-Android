import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import IMAGES from '../../assets/Images';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import LayoutStyle from '../../styles/LayoutStyle';
import {useNavigation} from '@react-navigation/native';

const MystayScreen = props => {
  const navigation = useNavigation();

  const pgList = [
    {
      id: 1,
      name: '',
    },
    {
      id: 2,
      name: '',
    },
    {
      id: 3,
      name: '',
    },
  ];
  const gotoMystayDetails = () => {
    navigation.navigate('MystayDetail');
  };
  const renderMystays = () => {
    return (
      <TouchableOpacity onPress={() => gotoMystayDetails()}>
        <View style={[MystaysStyle.staysListContainer]}>
          <Image source={IMAGES.stays} style={[MystaysStyle.staysImg]} />
          <View style={{...LayoutStyle.marginLeft20}}>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Text style={[MystaysStyle.staysText]}>{'Abc Boys Hostel'}</Text>
              <TouchableOpacity>
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
                iconSetName={'FontAwesome6'}
                iconName={'location-dot'}
                iconColor={Colors.black}
                iconSize={18}
              />
              <Text style={[MystaysStyle.staysAddress]}>
                {'P.No 123,abc, dfg xxxx, Hyd 5xxxxxx '}
              </Text>
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <Text style={[MystaysStyle.checkDate]}>{'Check in Date: '}</Text>
              <Text style={[MystaysStyle.checkDateAns]}>{'DD/MM/YYYY'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <Text style={[MystaysStyle.checkDate]}>{'Check out Date: '}</Text>
              <Text style={[MystaysStyle.checkDateAns]}>{'NA'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Text style={[MystaysStyle.checkDate]}>{'Details: '}</Text>
              <Text style={[MystaysStyle.checkDateAns]}>
                {'5nd Floor, Room No 517, 2 Bed sharing'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[MystaysStyle.tabListcontainer]}>
      <FlatList
        data={pgList}
        renderItem={({item: staysItem}) => renderMystays(staysItem)}
        scrollEnabled={false}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MystayScreen;

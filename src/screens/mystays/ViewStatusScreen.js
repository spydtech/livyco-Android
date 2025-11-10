import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import MystaysStyle from '../../styles/MystaysStyle';
import {CommonActions} from '@react-navigation/native';

const ViewStatusScreen = props => {
  const timelineData = [
    {
      id: '1',
      label: 'Request raised',
      timestamp: 'DD/MM/YYYY HH:MM:SS',
      status: 'completed',
    },
    {
      id: '2',
      label: 'Label',
      timestamp: '',
      status: 'pending',
    },
    {
      id: '3',
      label: 'Label',
      timestamp: '',
      status: 'pending',
    },
  ];
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const TimelineItem = ({item, isLast}) => {
    const isCompleted = item.status === 'completed';
    return (
      <View style={MystaysStyle.itemContainer}>
        <View style={MystaysStyle.iconColumn}>
          <View
            style={[
              MystaysStyle.circle,
              {backgroundColor: isCompleted ? '#2e7d32' : '#757575'},
            ]}
          />
          {!isLast && <View style={MystaysStyle.verticalLine} />}
        </View>
        <View style={MystaysStyle.textColumn}>
          <Text
            style={isCompleted ? MystaysStyle.labelBold : MystaysStyle.label}>
            {item.label}
          </Text>
          {item.timestamp ? (
            <Text style={MystaysStyle.timestamp}>{item.timestamp}</Text>
          ) : null}
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
            <Text style={[MystaysStyle.pageHeader]}>{'Change Request'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <FlatList
        data={timelineData}
        renderItem={({item, index}) => (
          <TimelineItem
            item={item}
            isLast={index === timelineData.length - 1}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={MystaysStyle.statusContainer}
      />
    </KeyboardAvoidingView>
  );
};

export default ViewStatusScreen;

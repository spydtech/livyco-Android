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
import PaymentStyle from '../../styles/PaymentStyle';
import Colors from '../../styles/Colors';
import {Icons} from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import {CommonActions} from '@react-navigation/native';

const HistoryScreen = props => {
  const historyList = [
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
    {
      id: 4,
      name: '',
    },
    {
      id: 5,
      name: '',
    },
    {
      id: 6,
      name: '',
    },
  ];
  const gotoPayDetails = () => {
    props.navigation.navigate('HistoryDetail');
  };
  const renderHistoryList = () => {
    return (
      <View style={[PaymentStyle.historyList]}>
        <View style={[PaymentStyle.mainPayContainer]}>
          <View style={[PaymentStyle.listContainer]}>
            <View style={[PaymentStyle.alphabateContainer]}>
              <Text style={[PaymentStyle.alphabateText]}>{'SN'}</Text>
            </View>
            <View style={[PaymentStyle.paymentSender]}>
              <Text style={[PaymentStyle.paidToText]}>{'Paid to'}</Text>
              <Text style={[PaymentStyle.senderName]}>{'Sender’s Name'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => gotoPayDetails()}>
            <View style={[PaymentStyle.payArrow]}>
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'arrow-top-right'}
                iconColor={Colors.selectedGreen}
                iconSize={26}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[PaymentStyle.dateAmount]}>
          <Text style={[PaymentStyle.amountText]}>{'0000.00'}</Text>
          <Text style={[PaymentStyle.dateText]}>{'DD/MM/YYYYY'}</Text>
        </View>
      </View>
    );
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={PaymentStyle.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      <SafeAreaView
        style={{
          paddingTop: 10,
          backgroundColor: Colors.secondary,
        }}>
        <View
          style={[
            PaymentStyle.headerContainerBlue,
            {...CommonStyles.directionRowCenter},
          ]}>
          <TouchableOpacity onPress={() => gotoBack()}>
            <Icons
              iconSetName={'MaterialCommunityIcons'}
              iconName={'arrow-left'}
              iconColor={Colors.white}
              iconSize={26}
            />
          </TouchableOpacity>
          <Text style={[PaymentStyle.titleText]}>{'History'}</Text>
        </View>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={[PaymentStyle.payContainer]}>
          <FlatList
            data={historyList}
            renderItem={({item: historyItem, index}) =>
              renderHistoryList(historyItem, index)
            }
            scrollEnabled={false}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HistoryScreen;

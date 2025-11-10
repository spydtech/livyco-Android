import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, Icons} from '../../components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import LayoutStyle from '../../styles/LayoutStyle';
import CommonStyles from '../../styles/CommonStyles';
import {CommonActions} from '@react-navigation/native';

const VacateRoomScreen = props => {
  const [moveDate, setMoveDate] = useState('DD/MM/YYYY');
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [rating, setRating] = useState(4);

  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
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
            <Text style={[HomeStyle.pageHeader]}>{'Vacate room'}</Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={[HomeStyle.vacateRoomContainer]}>
          <View style={[HomeStyle.dateContainer]}>
            <Text style={[HomeStyle.dateText]}>{'Move In Date *'}</Text>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'calendar-clear-outline'}
              iconColor={Colors.gray}
              iconSize={24}
            />
          </View>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={[HomeStyle.dateView]}>
            <Text style={[HomeStyle.textDate]}>{moveDate}</Text>
            <DatePicker
              mode={'date'}
              modal
              open={open}
              date={new Date()}
              onConfirm={selectedDate => {
                handleMovingDate(selectedDate);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </TouchableOpacity>
          <View style={{...LayoutStyle.paddingTop20}}>
            <Text style={[HomeStyle.dateText]}>{'Reason for vacating'}</Text>
            <TextInput
              style={HomeStyle.textarea}
              multiline={true}
              numberOfLines={4}
              placeholder="Type something here..."
              value={reason}
              onChangeText={text => setReason(text)}
            />
          </View>
          <View style={{...LayoutStyle.paddingTop20}}>
            <Text style={[HomeStyle.dateText]}>
              {'Please drop your valuable feedback'}
            </Text>
            <View style={[HomeStyle.rateImg, {...LayoutStyle.marginTop5}]}>
              {Array.from({length: 5}, (_, index) => (
                <TouchableOpacity
                  key={'rate' + index}
                  onPress={() => handleRating(index + 1)}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={index < rating ? 'star' : 'star-outline'}
                    iconColor={Colors.rating}
                    iconSize={18}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={HomeStyle.textarea}
              multiline={true}
              numberOfLines={4}
              placeholder="Type something here..."
              value={reason}
              onChangeText={text => setReason(text)}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[HomeStyle.vacateBtnBottom]}>
        <View style={{...CommonStyles.directionRowSB}}>
          <Icons
            iconSetName={'Ionicons'}
            iconName={'radio-button-off-outline'}
            iconColor={Colors.gray}
            iconSize={22}
          />
          <Text style={[HomeStyle.textRadioBtn]}>
            {
              'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a.'
            }
          </Text>
        </View>
        <View style={{...LayoutStyle.marginTop20}}>
          <Button btnName={'Vacate Room'} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VacateRoomScreen;

import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {CalendarList, CalendarUtils} from 'react-native-calendars';
import MystaysStyle from '../../styles/MystaysStyle';
import {Button, Icons} from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import Colors from '../../styles/Colors';
import moment from 'moment';
import FontFamily from '../../assets/FontFamily';
import LayoutStyle from '../../styles/LayoutStyle';
import {Calendar} from 'react-native-calendars';

const TimeSheetScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  return (
    <View style={[MystaysStyle.tabListcontainer]}>
      <View style={{...CommonStyles.directionRowSB}}>
        <Text style={[MystaysStyle.timeSheetText]}>{'Abc Boys Hostel'}</Text>
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
          iconColor={Colors.gray}
          iconSize={18}
        />
        <Text style={[MystaysStyle.timesheetAddress]}>
          {'P.No 123,abc, dfg xxxx, Hyd 5xxxxxx '}
        </Text>
      </View>
      <View style={[MystaysStyle.calenderContainer]}>
        <Text style={[MystaysStyle.calenderTextDate]}>{'Mon, Aug 17'}</Text>
        <Calendar
          current={'2025-08-01'}
          markedDates={{
            '2025-08-01': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-02': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-03': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-04': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-05': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-06': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-07': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-08': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-09': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-10': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-11': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-12': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-13': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-14': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-15': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-16': {
              selected: true,
              selectedColor: '#F4C430',
              textColor: '#000',
            },
            '2025-08-17': {
              selected: true,
              selectedColor: '#0033A0',
              selectedTextColor: 'white',
            },
          }}
          theme={{
            backgroundColor: 'white',
            calendarBackground: 'white',
            monthTextColor: '#000',
            textDayFontSize: 14,
            textDayHeaderFontSize: 12,
            textDayFontFamily: 'Roboto',
            textMonthFontSize: 14,
            todayTextColor: '#0033A0',
            selectedDayBackgroundColor: '#0033A0',
            selectedDayTextColor: 'white',
            dayTextColor: '#000',
            textDisabledColor: '#d9d9d9',
            arrowColor: '#000',
          }}
        />
      </View>
      <View style={[MystaysStyle.calenderButton]}>
        <Button
          btnStyle={[MystaysStyle.btnStyle]}
          btnName={'Vacate Room'}
          btnTextColor={Colors.secondary}
        />
      </View>
    </View>
  );
};

export default TimeSheetScreen;

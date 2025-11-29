import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import {Button, Icons} from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import Colors from '../../styles/Colors';
import moment from 'moment';
import FontFamily from '../../assets/FontFamily';
import LayoutStyle from '../../styles/LayoutStyle';
import {Calendar} from 'react-native-calendars';

const TimeSheetScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(moment('2025-08-01'));
  const [selectedDate, setSelectedDate] = useState('2025-08-17');

  // Generate marked dates for the range (1-12) and selected date
  const getMarkedDates = () => {
    const marked = {};
    const monthStr = currentMonth.format('YYYY-MM');
    const selectedDateInMonth = moment(selectedDate).format('YYYY-MM');
    
    // Mark dates 1-12 with yellow/orange background for current month
    for (let i = 1; i <= 12; i++) {
      const dateStr = `${monthStr}-${String(i).padStart(2, '0')}`;
      marked[dateStr] = {
        customStyles: {
          container: {
            backgroundColor: '#F4C430',
            borderRadius: 0,
          },
          text: {
            color: '#000',
          },
        },
      };
    }
    
    // Mark selected date with blue circle (only if in current month)
    if (selectedDateInMonth === monthStr) {
      const selectedDay = moment(selectedDate).date();
      const selectedDateStr = `${monthStr}-${String(selectedDay).padStart(2, '0')}`;
      // Override the marking for selected date
      marked[selectedDateStr] = {
        selected: true,
        selectedColor: Colors.secondary,
        selectedTextColor: Colors.white,
        customStyles: {
          container: {
            backgroundColor: Colors.secondary,
            borderRadius: 20,
            borderWidth: 0,
          },
          text: {
            color: Colors.white,
            fontWeight: 'bold',
          },
        },
      };
    }
    
    return marked;
  };

  const formatSelectedDate = () => {
    return moment(selectedDate).format('ddd, MMM DD');
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(moment(month.dateString));
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    // Update current month if selected date is in a different month
    const dayMonth = moment(day.dateString);
    if (!dayMonth.isSame(currentMonth, 'month')) {
      setCurrentMonth(dayMonth);
    }
  };

  const goToPreviousMonth = () => {
    const newMonth = moment(currentMonth).subtract(1, 'month');
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = moment(currentMonth).add(1, 'month');
    setCurrentMonth(newMonth);
  };

  return (
    <ScrollView 
      style={[MystaysStyle.tabListcontainer]}
      contentContainerStyle={{paddingHorizontal: 15, paddingTop: 15, paddingBottom: 20}}
      showsVerticalScrollIndicator={false}>
      <View style={{...CommonStyles.directionRowSB, marginBottom: 8}}>
        <Text style={[MystaysStyle.timeSheetText, {fontSize: 16, fontFamily: FontFamily.RobotoMedium}]}>
          {'Abc Boys Hostel'}
        </Text>
        <TouchableOpacity>
          <Icons
            iconSetName={'Ionicons'}
            iconName={'share-social-outline'}
            iconColor={Colors.black}
            iconSize={20}
          />
        </TouchableOpacity>
      </View>
      <View style={[MystaysStyle.iconAddress, {marginBottom: 15}]}>
        <Icons
          iconSetName={'Ionicons'}
          iconName={'location-sharp'}
          iconColor={Colors.black}
          iconSize={16}
        />
        <Text style={[MystaysStyle.timesheetAddress, {flex: 1}]}>
          {'P.No 123,abc, dfg xxxx, Hyd 5xxxxxx'}
        </Text>
      </View>
      <View style={[MystaysStyle.calenderContainer, {padding: 15, marginTop: 0}]}>
        <Text style={[MystaysStyle.calenderTextDate, {fontSize: 28, marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.gray}]}>
          {formatSelectedDate()}
        </Text>
        
        {/* Month/Year Navigation */}
        <View style={{...CommonStyles.directionRowSB, marginBottom: 15, alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 16, fontFamily: FontFamily.RobotoMedium, color: Colors.black}}>
              {currentMonth.format('MMMM YYYY')}
            </Text>
            <TouchableOpacity style={{marginLeft: 8}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'chevron-down'}
                iconColor={Colors.black}
                iconSize={16}
              />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={goToPreviousMonth} style={{padding: 5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'chevron-back'}
                iconColor={Colors.black}
                iconSize={20}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextMonth} style={{padding: 5, marginLeft: 10}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'chevron-forward'}
                iconColor={Colors.black}
                iconSize={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Calendar
          current={currentMonth.format('YYYY-MM-DD')}
          markedDates={getMarkedDates()}
          onMonthChange={handleMonthChange}
          onDayPress={handleDayPress}
          markingType={'custom'}
          theme={{
            backgroundColor: 'white',
            calendarBackground: 'white',
            textSectionTitleColor: Colors.black,
            textDayFontSize: 14,
            textDayHeaderFontSize: 12,
            textDayFontFamily: FontFamily.RobotoRegular,
            textMonthFontSize: 0, // Hide default month text
            todayTextColor: Colors.secondary,
            selectedDayBackgroundColor: Colors.secondary,
            selectedDayTextColor: Colors.white,
            dayTextColor: Colors.black,
            textDisabledColor: '#d9d9d9',
            arrowColor: 'transparent', // Hide default arrows
            disabledArrowColor: 'transparent',
            monthTextColor: 'transparent',
            indicatorColor: 'transparent',
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 0,
              },
            },
          }}
          hideExtraDays={true}
          firstDay={0} // Start week on Sunday
          enableSwipeMonths={false}
        />
      </View>
      <View style={{marginTop: 30, marginBottom: 20, paddingHorizontal: 0, width: '100%'}}>
        <Button
          btnStyle={[MystaysStyle.btnStyle, {width: '100%', alignSelf: 'center'}]}
          btnName={'Vacate Room'}
          btnTextColor={Colors.secondary}
        />
      </View>
    </ScrollView>
  );
};

export default TimeSheetScreen;

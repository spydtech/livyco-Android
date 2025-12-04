import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import MystaysStyle from '../../styles/MystaysStyle';
import { Button, Icons } from '../../components';
import CommonStyles from '../../styles/CommonStyles';
import Colors from '../../styles/Colors';
import moment from 'moment';
import FontFamily from '../../assets/FontFamily';
import LayoutStyle from '../../styles/LayoutStyle';
import { Calendar } from 'react-native-calendars';
import { getMyStays } from '../../services/staysService';
import { useNavigation } from '@react-navigation/native';

const ACTIVE_BOOKING_STATUSES = ['approved', 'active', 'confirmed', 'pending'];
const { width: deviceWidth } = Dimensions.get('window');

const TimeSheetScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [stays, setStays] = useState([]);
  const [currentStayIndex, setCurrentStayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();


  // Fetch stays on component mount
  useEffect(() => {
    fetchStays();
  }, []);

  // Update calendar when switching stays - but keep current month
  useEffect(() => {
    // Don't change month when switching stays, just update the marked dates
    // Calendar stays at current month
  }, [currentStayIndex]);

  const getIsPresent = (booking) => {
    if (!booking) return false;
    const status = (booking?.bookingStatus || '').toLowerCase();
    const hasPastMoveOutDate = booking?.moveOutDate && moment(booking.moveOutDate).isBefore(moment(), 'day');
    return ACTIVE_BOOKING_STATUSES.includes(status) && !hasPastMoveOutDate;
  };

  const fetchStays = async () => {
    try {
      setLoading(true);
      const response = await getMyStays();
      if (response.success) {
        // Filter for present stays only (active and not past moveOutDate)
        const presentStays = (response.data || []).filter(booking => getIsPresent(booking));
        setStays(presentStays);

        // Set initial month and date to current month/date
        const today = moment();
        setCurrentMonth(today.format('YYYY-MM-DD'));
        setSelectedDate(today.format('YYYY-MM-DD'));
      }
    } catch (error) {
      console.error('Error fetching stays:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current stay
  const currentStay = stays[currentStayIndex] || null;

  // Get property details
  const getProperty = (booking) => {
    return booking?.property || booking?.propertyId || {};
  };

  const getAddress = (booking) => {
    const property = getProperty(booking);
    const addressParts = [property?.locality, property?.city]
      .filter(part => !!part)
      .join(', ');
    return addressParts || 'N/A';
  };

  // Generate marked dates for stay period
  // Memoize to prevent infinite re-renders
  const markedDates = useMemo(() => {
    const marked = {};
    const monthStr = moment(currentMonth).format('YYYY-MM');
    const today = moment();
    const todayStr = today.format('YYYY-MM-DD');

    if (currentStay) {
      // Parse dates correctly - handle both string and Date objects
      let moveInDate = null;
      let moveOutDate = null;

      if (currentStay?.moveInDate) {
        moveInDate = moment(currentStay.moveInDate).startOf('day');
        if (!moveInDate.isValid()) {
          moveInDate = null;
        }
      }

      if (currentStay?.moveOutDate) {
        moveOutDate = moment(currentStay.moveOutDate).startOf('day');
        if (!moveOutDate.isValid()) {
          moveOutDate = null;
        }
      }

      if (moveInDate && moveInDate.isValid()) {
        // Mark ALL dates from moveInDate to moveOutDate (or today if no moveOutDate)
        const endDate = moveOutDate && moveOutDate.isValid() ? moveOutDate : today.startOf('day');

        // Get the range for the current month view
        const monthStart = moment(currentMonth).startOf('month');
        const monthEnd = moment(currentMonth).endOf('month');

        // Calculate the actual start and end dates within the current month view
        // Get the later of moveInDate or monthStart, and earlier of endDate or monthEnd
        let start = moveInDate.clone();
        let end = endDate.clone();

        // If moveInDate is before month start, use month start
        if (moveInDate.isBefore(monthStart, 'day')) {
          start = monthStart.clone();
        }

        // If endDate is after month end, use month end
        if (endDate.isAfter(monthEnd, 'day')) {
          end = monthEnd.clone();
        }

        // Mark all dates in the range that are visible in current month
        // Check if there's any overlap between stay period and current month
        if (start.isSameOrBefore(end, 'day') && start.isSameOrBefore(monthEnd, 'day') && end.isSameOrAfter(monthStart, 'day')) {
          let current = start.clone();
          while (current.isSameOrBefore(end, 'day')) {
            const dateStr = current.format('YYYY-MM-DD');
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
            current.add(1, 'day');
          }
        }
      }
    }

    // Mark today's date with blue circle (always show current date as selected)
    const todayMonth = today.format('YYYY-MM');

    // Always mark today as selected if it's in the current month view
    if (todayMonth === monthStr) {
      // Override the marking for today's date
      if (marked[todayStr]) {
        marked[todayStr] = {
          ...marked[todayStr],
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
      } else {
        marked[todayStr] = {
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
    }

    return marked;
  }, [currentMonth, currentStay]);

  const formatSelectedDate = useCallback(() => {
    // Always show today's date in the format
    return moment().format('ddd, MMM DD');
  }, []);

  const handleMonthChange = useCallback((month) => {
    const newMonth = month.dateString;
    // Only update if different to prevent infinite loops
    if (newMonth !== currentMonth) {
      setCurrentMonth(newMonth);
    }
  }, [currentMonth]);

  const handleDayPress = useCallback((day) => {
    const newDate = day.dateString;
    // Always keep today selected, but allow month navigation
    // Update current month if selected date is in a different month
    const dayMonth = moment(newDate).format('YYYY-MM');
    const currentMonthStr = moment(currentMonth).format('YYYY-MM');
    if (dayMonth !== currentMonthStr) {
      setCurrentMonth(newDate);
    }
    // Keep selectedDate as today
    setSelectedDate(moment().format('YYYY-MM-DD'));
  }, [currentMonth]);

  const goToPreviousMonth = useCallback(() => {
    const newMonth = moment(currentMonth).subtract(1, 'month').format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    const newMonth = moment(currentMonth).add(1, 'month').format('YYYY-MM-DD');
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const gotoVacateRoom = () => {
    navigation.navigate('VacateRoom');
  };

  if (loading) {
    return (
      <View style={[MystaysStyle.tabListcontainer, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (stays.length === 0) {
    return (
      <View style={[MystaysStyle.tabListcontainer, { justifyContent: 'center', alignItems: 'center', flex: 1, padding: 20 }]}>
        <Text style={{ fontSize: 16, fontFamily: FontFamily.RobotoRegular, color: Colors.grayText, textAlign: 'center' }}>
          {'No active stays found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[MystaysStyle.tabListcontainer]}
      contentContainerStyle={{ paddingTop: 15, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}>

      {/* Stay Details - Always show current stay details (matching image UI) */}
      {currentStay && (
        <>
          <View style={{ paddingHorizontal: 15, ...CommonStyles.directionRowSB, marginBottom: 8 }}>
            <Text style={[MystaysStyle.timeSheetText, { fontSize: 16, fontFamily: FontFamily.RobotoMedium, flex: 1 }]}>
              {getProperty(currentStay)?.name || 'N/A'}
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
          <View style={[MystaysStyle.iconAddress, { marginBottom: 15, paddingHorizontal: 15 }]}>
            <Icons
              iconSetName={'Ionicons'}
              iconName={'location-sharp'}
              iconColor={Colors.black}
              iconSize={16}
            />
            <Text style={[MystaysStyle.timesheetAddress, { flex: 1 }]}>
              {getAddress(currentStay)}
            </Text>
          </View>
        </>
      )}

      {/* Page Indicators for multiple stays - hidden horizontal scroll for swipe functionality */}
      {stays.length > 1 && (
        <View style={{ marginBottom: 15, paddingHorizontal: 15 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / deviceWidth);
              if (index !== currentStayIndex && index >= 0 && index < stays.length) {
                setCurrentStayIndex(index);
              }
            }}
            style={{ height: 0, opacity: 0, position: 'absolute' }}
            contentContainerStyle={{ width: deviceWidth * stays.length }}>
            {stays.map((_, index) => (
              <View key={index} style={{ width: deviceWidth }} />
            ))}
          </ScrollView>

          {/* Page Indicators */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {stays.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrentStayIndex(index);
                  // Scroll to the selected stay
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                      x: index * deviceWidth,
                      animated: true,
                    });
                  }
                }}
                style={{ marginHorizontal: 4 }}>
                <View
                  style={{
                    width: index === currentStayIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === currentStayIndex ? Colors.secondary : Colors.lightGray,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={[MystaysStyle.calenderContainer, { padding: 15, marginTop: 0, marginHorizontal: 15 }]}>
        <Text style={[MystaysStyle.calenderTextDate, { fontSize: 28, marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.gray }]}>
          {formatSelectedDate()}
        </Text>

        {/* Month/Year Navigation */}
        <View style={{ ...CommonStyles.directionRowSB, marginBottom: 15, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: FontFamily.RobotoMedium, color: Colors.black }}>
              {moment(currentMonth).format('MMMM YYYY')}
            </Text>
            <TouchableOpacity style={{ marginLeft: 8 }}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'chevron-down'}
                iconColor={Colors.black}
                iconSize={16}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={goToPreviousMonth} style={{ padding: 5 }}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'chevron-back'}
                iconColor={Colors.black}
                iconSize={20}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextMonth} style={{ padding: 5, marginLeft: 10 }}>
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
          key={`calendar-${moment(currentMonth).format('YYYY-MM')}`}
          current={moment(currentMonth).format('YYYY-MM-DD')}
          markedDates={markedDates}
          onMonthChange={handleMonthChange}
          onDayPress={handleDayPress}
          selected={moment().format('YYYY-MM-DD')}
          markingType={'custom'}
          theme={{
            backgroundColor: 'white',
            calendarBackground: 'white',
            textSectionTitleColor: Colors.black,
            textDayFontSize: 14,
            textDayHeaderFontSize: 12,
            textDayFontFamily: FontFamily.RobotoRegular,
            textMonthFontSize: 1, // Minimal size to hide default month text (must be > 0)
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
      <View style={{ marginTop: 20, marginBottom: 20, paddingHorizontal: 0, }}>
        <Button
          btnStyle={[MystaysStyle.btnStyle, { alignSelf: 'center' }]}
          btnName={'Vacate Room'}
          btnTextColor={Colors.secondary}
          onPress={() => gotoVacateRoom()}
        />
      </View>
    </ScrollView>
  );
};

export default TimeSheetScreen;

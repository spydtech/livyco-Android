import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import FastImage from 'react-native-fast-image';
import LayoutStyle from '../../styles/LayoutStyle';
import {Button, Icons, Input} from '../../components';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import Carousel from 'react-native-reanimated-carousel';
import {deviceHight, deviceWidth} from '../../utils/DeviceInfo';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const HomeScreen = props => {
  const [rating, setRating] = useState(4);
  const [shortVisit, setShortVisit] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkOut, setCheckOut] = useState('');
  const [checkIn, setCheckIn] = useState('');

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
  const gotoPGDetails = () => {
    props.navigation.navigate('PGBooking');
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const renderPGList = () => {
    return (
      <TouchableOpacity onPress={() => gotoPGDetails()}>
        <View style={[HomeStyle.bedListContainer]}>
          <Image source={IMAGES.bed} style={[HomeStyle.bedimg]} />
          <View>
            <Text style={[HomeStyle.hostelTitle]}>
              {'Figma Deluxe  Hostel'}
            </Text>
            <View style={[HomeStyle.genderView]}>
              <Text style={[HomeStyle.servicesName]}>{'Male'}</Text>
            </View>
            <Text style={[HomeStyle.areaName]}>{'Uppal, Hyderabad'}</Text>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Text style={[HomeStyle.reviewText]}>{'Starting from '}</Text>
              <Text style={[HomeStyle.price]}>{'₹ 8000/-'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <View style={[HomeStyle.rateImg]}>
                {Array.from({length: 5}, (_, index) => (
                  <TouchableOpacity
                    key={index}
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
              <Text style={[HomeStyle.reviewText]}>{'  49 reviews'}</Text>
            </View>
            <View style={{...CommonStyles.directionRowCenter}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'wifi'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'Ionicons'}
                iconName={'car-sport'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'alpha-p-circle'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'Ionicons'}
                iconName={'bonfire-outline'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'iron'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'MaterialCommunityIcons'}
                iconName={'pot-steam-outline'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <Icons
                iconSetName={'FontAwesome6'}
                iconName={'user-secret'}
                iconColor={Colors.gray}
                iconSize={18}
              />
              <TouchableOpacity>
                <Text style={[HomeStyle.reviewText]}>{' View all '}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryList = () => {
    return (
      <View style={[HomeStyle.cateContainer]}>
        <Image
          source={IMAGES.category}
          style={[HomeStyle.categoryImg]}
          borderRadius={10}
        />
        <Text style={[HomeStyle.categoryLabel]}>{'For Professionals'}</Text>
        <View style={[HomeStyle.cateRoundContainer]}>
          <View style={[HomeStyle.round]} />
          <Text style={[HomeStyle.cateDesc]}>{'High-Speed Internet'}</Text>
        </View>
        <View style={[HomeStyle.cateRoundContainer]}>
          <View style={[HomeStyle.round]} />
          <Text style={[HomeStyle.cateDesc]}>{'Locker  facility'}</Text>
        </View>
        <View style={[HomeStyle.cateRoundContainer]}>
          <View style={[HomeStyle.round]} />
          <Text style={[HomeStyle.cateDesc]}>{'A.C & Room heaters'}</Text>
        </View>
        <View style={[HomeStyle.cateRoundContainer]}>
          <View style={[HomeStyle.round]} />
          <Text style={[HomeStyle.cateDesc]}>{'Left'}</Text>
        </View>
      </View>
    );
  };
  const gotoTrendingPG = () => {
    props.navigation.navigate('Trending');
  };
  const gotoGroupBooking = () => {
    props.navigation.navigate('GroupBooking');
  };
  const renderBanner = item => {
    return (
      <View>
        <Image source={IMAGES.banner} style={HomeStyle.homeBanner} />
      </View>
    );
  };
  const gotoUpdateShortVisit = () => {
    setShortVisit(!shortVisit);
  };
  const handleCheckInDate = date => {
    setOpen(true);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    console.log('in press date=>date', formattedDate);
    setCheckIn(formattedDate);
  };
  const handleCheckOutDate = date => {
    setOpen(true);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    console.log('in press date=>date', formattedDate);
    setCheckOut(formattedDate);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={HomeStyle.homeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <SafeAreaView
        style={{
          paddingTop: '6%',
          backgroundColor: Colors.white,
        }}>
        <ImageBackground
          source={IMAGES.primaryBG}
          style={HomeStyle.formContainer}
          resizeMode="cover">
          <View style={HomeStyle.headerContainer}>
            <View style={HomeStyle.profileImgContainer}>
              <View style={HomeStyle.profileView}>
                <FastImage
                  style={HomeStyle.profileImg}
                  source={{
                    uri: 'https://cdn.pixabay.com/photo/2014/03/25/16/32/user-297330_1280.png',
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <Text style={HomeStyle.userName}>{'Satish'}</Text>
            </View>
            <View style={HomeStyle.iconContainer}>
              <TouchableOpacity style={[HomeStyle.iconPadding10]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'notifications-outline'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
                <View style={HomeStyle.smallRound}></View>
              </TouchableOpacity>
              <TouchableOpacity style={[HomeStyle.iconPadding10]}>
                <Icons
                  iconSetName={'AntDesign'}
                  iconName={'questioncircle'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[HomeStyle.iconPadding10]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'share-social-outline'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[HomeStyle.iconPadding10]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'heart-outline'}
                  iconColor={Colors.gray}
                  iconSize={26}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              ...LayoutStyle.paddingBottom30,
            }}
            showsVerticalScrollIndicator={false}>
            <View style={{...LayoutStyle.marginTop20}}>
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Carousel
                  loop={true}
                  width={deviceWidth - 40}
                  height={deviceHight / 3.5}
                  snapEnabled={true}
                  pagingEnabled={true}
                  autoPlayInterval={2000}
                  data={pgList}
                  onSnapToItem={index => console.log('current index:', index)}
                  renderItem={() => renderBanner()}
                />
              </View>

              <View style={HomeStyle.searchView}>
                <Input
                  placeholder={'Search for locality or landmark'}
                  inputStyle={HomeStyle.searchInput}
                  leftIcon={true}
                  leftIconSet={'Ionicons'}
                  leftIconName={'search-outline'}
                  leftIconColor={Colors.gray}
                  leftIconSize={18}
                  rightIcon={true}
                  rightIconSet={'MaterialIcons'}
                  rightIconName={'my-location'}
                  rightIconColor={Colors.black}
                  rightIconSize={20}
                />
                <View style={[HomeStyle.filterOption]}>
                  {!shortVisit ? (
                    <TouchableOpacity>
                      <View style={[HomeStyle.iconTextContain]}>
                        <Icons
                          iconSetName={'Ionicons'}
                          iconName={'calendar-clear-outline'}
                          iconColor={Colors.gray}
                          iconSize={20}
                        />
                        <Text
                          style={[
                            HomeStyle.iconText,
                            {...LayoutStyle.marginLeft10},
                          ]}>
                          {'Move In'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[HomeStyle.checkoutContainer]}>
                      {checkIn == '' ? (
                        <TouchableOpacity onPress={() => handleCheckInDate()}>
                          <View style={[HomeStyle.iconTextContain]}>
                            <Icons
                              iconSetName={'Ionicons'}
                              iconName={'calendar-clear-outline'}
                              iconColor={Colors.gray}
                              iconSize={18}
                            />
                            <Text style={[HomeStyle.iconText]}>
                              {'Check - In'}
                            </Text>
                          </View>
                          <DatePicker
                            mode={'date'}
                            modal
                            open={open}
                            date={new Date()}
                            onConfirm={selectedDate => {
                              handleCheckInDate(selectedDate);
                            }}
                            onCancel={() => {
                              setOpen(false);
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View style={[HomeStyle.dateStyle]}>
                          <Text style={[HomeStyle.iconTextBold]}>
                            {'Check - In'}
                          </Text>
                          <Text style={[HomeStyle.iconText]}>{checkIn}</Text>
                        </View>
                      )}
                      {checkOut == '' ? (
                        <TouchableOpacity
                          style={{...LayoutStyle.marginLeft15}}
                          onPress={() => handleCheckOutDate()}>
                          <View style={[HomeStyle.iconTextContain]}>
                            <Icons
                              iconSetName={'Ionicons'}
                              iconName={'calendar-clear-outline'}
                              iconColor={Colors.gray}
                              iconSize={18}
                            />
                            <Text style={[HomeStyle.iconText]}>
                              {'Check - out'}
                            </Text>
                          </View>
                          <DatePicker
                            mode={'date'}
                            modal
                            open={open}
                            date={new Date()}
                            onConfirm={selectedDate => {
                              handleCheckOutDate(selectedDate);
                            }}
                            onCancel={() => {
                              setOpen(false);
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity>
                          <DatePicker
                            mode={'date'}
                            modal
                            open={open}
                            date={new Date()}
                            onConfirm={selectedDate => {
                              handleCheckOutDate(selectedDate);
                            }}
                            onCancel={() => {
                              setOpen(false);
                            }}
                          />
                          <View
                            style={[
                              HomeStyle.dateStyle,
                              {...LayoutStyle.marginLeft10},
                            ]}>
                            <Text style={[HomeStyle.iconTextBold]}>
                              {'Check - Out'}
                            </Text>
                            <Text style={[HomeStyle.iconText]}>{checkOut}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  <TouchableOpacity onPress={() => gotoUpdateShortVisit()}>
                    <View style={[HomeStyle.iconTextContain]}>
                      <Icons
                        iconSetName={'Ionicons'}
                        iconName={
                          shortVisit
                            ? 'radio-button-on'
                            : 'radio-button-off-outline'
                        }
                        iconColor={Colors.gray}
                        iconSize={20}
                      />
                      <Text
                        style={[
                          HomeStyle.iconText,
                          {...LayoutStyle.marginLeft10},
                        ]}>
                        {'Short Visit'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text>{'Sharing type'}</Text>
                </View>
                <View style={{...LayoutStyle.marginTop20}}>
                  <Button
                    btnName={'SEARCH'}
                    btnTextColor={Colors.blackText}
                    bgColor={Colors.primary}
                    btnStyle={{...LayoutStyle.padding15}}
                  />
                </View>

                <View style={HomeStyle.groupText}>
                  <Text style={HomeStyle.blackTextSmall}>
                    {'Booking for a group? '}
                  </Text>
                  <TouchableOpacity onPress={() => gotoGroupBooking()}>
                    <Text style={HomeStyle.blueTextSmall}>{'Click here'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Trending PG Card */}
                <View style={HomeStyle.trendingPGCard}>
                  <Text style={HomeStyle.blackTextMid}>{'Trending PGs'}</Text>
                  <TouchableOpacity onPress={() => gotoTrendingPG()}>
                    <Icons
                      iconSetName={'MaterialCommunityIcons'}
                      iconName={'arrow-right'}
                      iconColor={Colors.black}
                      iconSize={26}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={pgList}
                  renderItem={({item: destinationItem}) =>
                    renderPGList(destinationItem)
                  }
                  scrollEnabled={false}
                  keyExtractor={item => item.id}
                />
                <View style={HomeStyle.workCard}>
                  <Text style={HomeStyle.blackTextMid}>{'How It Works'}</Text>
                </View>

                {/* Description Cards */}
                <View style={CommonStyles.directionRowSB}>
                  <View style={HomeStyle.descImgContainer}>
                    <Image
                      source={IMAGES.searchImg}
                      style={HomeStyle.searchImg}
                    />
                    <Text style={HomeStyle.descText}>
                      {
                        'Browse verified listings tailored to your needs and within your budget.'
                      }
                    </Text>
                  </View>
                  <View style={HomeStyle.descImgContainer}>
                    <Image
                      source={IMAGES.formImg}
                      style={HomeStyle.homeDescImg}
                    />
                    <Text style={HomeStyle.descText}>
                      {'Check and verify amenities, prices, and reviews'}
                    </Text>
                  </View>
                  <View style={HomeStyle.descImgContainer}>
                    <Image
                      source={IMAGES.receiptImg}
                      style={HomeStyle.homeDescImg}
                    />
                    <Text style={HomeStyle.descText}>
                      {'Secure your pay instantly with easy payment options.'}
                    </Text>
                  </View>
                </View>

                <View style={HomeStyle.trendingPGCard}>
                  <Text style={HomeStyle.blackTextMid}>
                    {'Recently Viewed'}
                  </Text>
                  <TouchableOpacity>
                    <Icons
                      iconSetName={'MaterialCommunityIcons'}
                      iconName={'arrow-right'}
                      iconColor={Colors.black}
                      iconSize={26}
                    />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={pgList}
                  renderItem={({item: destinationItem}) =>
                    renderPGList(destinationItem)
                  }
                  scrollEnabled={false}
                  keyExtractor={item => item.id}
                />
                <View style={HomeStyle.workCard}>
                  <Text
                    style={[
                      HomeStyle.blackTextMid,
                      {...LayoutStyle.marginBottom10},
                    ]}>
                    {'Choice Best one by Category'}
                  </Text>
                  <FlatList
                    data={pgList}
                    horizontal
                    renderItem={({item: destinationItem}) =>
                      renderCategoryList(destinationItem)
                    }
                    scrollEnabled={false}
                    keyExtractor={item => item.id}
                  />
                </View>
              </View>
            </View>
            <View style={HomeStyle.chooseCard}>
              <Text style={[HomeStyle.blackTextMid, {alignSelf: 'center'}]}>
                {'Why Choose Us'}
              </Text>
              <View style={[HomeStyle.aboutContainer]}>
                <View style={[HomeStyle.aboutTextContainer]}>
                  <View>
                    <Text style={[HomeStyle.whiteTextBig]}>{'20+'}</Text>
                    <Text style={[HomeStyle.whiteTextMid]}>{'Cities'}</Text>
                  </View>
                  <View>
                    <Text style={[HomeStyle.whiteTextBig]}>{'190+'}</Text>
                    <Text style={[HomeStyle.whiteTextMid]}>{'Hostels'}</Text>
                  </View>
                  <View>
                    <Text style={[HomeStyle.whiteTextBig]}>{'10K+'}</Text>
                    <Text style={[HomeStyle.whiteTextMid]}>{'Customers'}</Text>
                  </View>
                </View>
              </View>
              <View style={[HomeStyle.mainServicesContainer]}>
                <View style={[HomeStyle.servicesContainer]}>
                  <Image
                    source={IMAGES.office}
                    style={[HomeStyle.officeIcon]}
                  />
                  <Text style={[HomeStyle.servicesText]}>
                    {'AVOID PHYSICAL VISIT'}
                  </Text>
                  <Text style={[HomeStyle.servicesDesc]}>
                    {
                      'Experience hassle-free PG selection without the need for physical visits. Our app offers detailed property photos, and verified reviews, allowing you to explore and decide from the comfort of your home.'
                    }
                  </Text>
                </View>
                <View style={[HomeStyle.servicesContainerRight]}>
                  <Image
                    source={IMAGES.review}
                    style={[HomeStyle.officeIcon]}
                  />
                  <Text style={[HomeStyle.servicesTextRight]}>
                    {'Customer REVIEWS'}
                  </Text>
                  <Text style={[HomeStyle.servicesDescRight]}>
                    {
                      'Make informed decisions with genuine customer reviews. Our app features verified feedback from previous tenants, giving you insights into the quality, amenities, and reliability of each PG before you book'
                    }
                  </Text>
                </View>
                <View style={[HomeStyle.servicesContainer]}>
                  <Image
                    source={IMAGES.points}
                    style={[HomeStyle.officeIcon]}
                  />
                  <Text style={[HomeStyle.servicesText]}>{'Amenities'}</Text>
                  <Text style={[HomeStyle.servicesDesc]}>
                    {
                      'Discover PGs with all the amenities you need! From Wi-Fi, air conditioning, and laundry services to fully furnished rooms, our app helps you find accommodations that match your lifestyle and comfort requirements.'
                    }
                  </Text>
                </View>
                <View style={[HomeStyle.servicesContainerRight]}>
                  <Image
                    source={IMAGES.review}
                    style={[HomeStyle.officeIcon]}
                  />
                  <Text style={[HomeStyle.servicesTextRight]}>
                    {'Pay online'}
                  </Text>
                  <Text style={[HomeStyle.servicesDescRight]}>
                    {
                      'Simplify your PG booking with secure online payment options. Instantly reserve your spot without the hassle of cash transactions. Safe, quick, and convenient!'
                    }
                  </Text>
                </View>
              </View>
            </View>
            <View style={HomeStyle.workCard}>
              <Text style={HomeStyle.blackTextMid}>
                {'Feedbacks From Our Users'}
              </Text>
            </View>
            <View style={[HomeStyle.feedbackComponent]}>
              <View style={[HomeStyle.feedbackProfile]}>
                <FastImage
                  style={HomeStyle.clientImg}
                  source={{
                    uri: 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
                  }}
                />
              </View>
              <View style={[HomeStyle.feedbackNameContainer]}>
                <Text style={[HomeStyle.feedbackName]}>{'Sravanthi'}</Text>
                <Text style={[HomeStyle.whiteTextSmall]}>
                  {'College Lecturer'}
                </Text>
                <View style={[HomeStyle.rateImgViewFeedback]}>
                  {Array.from({length: 5}, (_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRating(index + 1)}>
                      <Icons
                        iconSetName={'Ionicons'}
                        iconName={index < rating ? 'star' : 'star-outline'}
                        iconColor={Colors.primary}
                        iconSize={18}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[HomeStyle.feedbackDesc]}>
                  {
                    'I am unable to move my legs, Great app for finding accessible PG accommodations, with detailed listings and helpful filters for wheelchair users.....more'
                  }
                </Text>
              </View>
            </View>
            <View style={[HomeStyle.rateContainer]}>
              <View style={{...CommonStyles.directionRowCenter}}>
                <Image source={IMAGES.musicGirl} style={[HomeStyle.musicImg]} />
                <View style={[HomeStyle.rateList]}>
                  <View>
                    <Text style={[HomeStyle.whiteBold]}>{'50K+'}</Text>
                    <Text style={[HomeStyle.whiteTextRate]}>
                      {'Happy People'}
                    </Text>
                  </View>
                  <View style={{...LayoutStyle.marginLeft20}}>
                    <Text style={[HomeStyle.whiteBold]}>{'4.72'}</Text>
                    <Text style={[HomeStyle.whiteTextRate]}>
                      {'Overall rating'}
                    </Text>
                    <View style={[HomeStyle.rateImgView]}>
                      {Array.from({length: 5}, (_, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleRating(index + 1)}>
                          <Icons
                            iconSetName={'Ionicons'}
                            iconName={index < rating ? 'star' : 'star-outline'}
                            iconColor={Colors.primary}
                            iconSize={18}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={[HomeStyle.friendContainer]}>
              <View>
                <Text style={[HomeStyle.refFriend]}>{'Refer a friend'}</Text>
                <Text style={[HomeStyle.refFriendDesc]}>
                  {'Stay Connected Anywhere!'}
                </Text>
              </View>
              <Image source={IMAGES.appImg} style={[HomeStyle.appImg]} />
            </View>
          </ScrollView>
          <TouchableOpacity>
            <View style={[HomeStyle.chatContainer]}>
              <Image source={IMAGES.chat} style={[HomeStyle.chatImg]} />
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import HomeStyle from '../../styles/HomeStyle';
import Colors from '../../styles/Colors';
import {Button, Icons, BottomSheet} from '../../components';
import LayoutStyle from '../../styles/LayoutStyle';
import IMAGES from '../../assets/Images';
import CommonStyles from '../../styles/CommonStyles';
import FastImage from 'react-native-fast-image';
import {deviceHight} from '../../utils/DeviceInfo';
import {CommonActions} from '@react-navigation/native';

const PGBookingScreen = props => {
  const [rating, setRating] = useState(4);
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const [isContact, setIsContact] = useState(false);

  const servicesIcon = [
    {
      id: 1,
      iconName: '',
      iconSetName: '',
      name: '',
    },
    {
      id: 2,
      iconName: '',
      iconSetName: '',
      name: '',
    },
  ];

  const imgsList = [
    {
      id: 1,
      iconName: '',
      iconSetName: '',
      name: '',
    },
    {
      id: 2,
      iconName: '',
      iconSetName: '',
      name: '',
    },
    {
      id: 3,
      iconName: '',
      iconSetName: '',
      name: '',
    },
    {
      id: 4,
      iconName: '',
      iconSetName: '',
      name: '',
    },
  ];

  const gotoBottomSheetClose = () => {
    setIsBottomSheet(false);
  };

  const gotoContactClick = () => {
    setIsBottomSheet(true);
    setIsContact(true);
  };

  const gotoBookClick = () => {
    setIsBottomSheet(true);
    setIsContact(false);
  };

  const gotoMySelf = () => {
    props.navigation.navigate('MySelfBooking');
  };
  const handleRating = selectedRating => {
    setRating(selectedRating);
  };
  const renderServiceList = () => {
    return (
      <View style={{...CommonStyles.directionRowCenter}}>
        <Icons
          iconSetName={'Ionicons'}
          iconName={'star-outline'}
          iconColor={Colors.gray}
          iconSize={20}
        />
        <Text style={[HomeStyle.iconServicesName]}>{'Wi Fi'}</Text>
      </View>
    );
  };

  const renderSharingList = () => {
    return (
      <View style={[HomeStyle.sharingContainer]}>
        <Text style={[HomeStyle.sharingText]}>{'Single Sharing'}</Text>
        <Text style={[HomeStyle.sharingPrice]}>{'0000.00'}</Text>
        <Text style={[HomeStyle.sharingText, {...LayoutStyle.marginTop10}]}>
          {'Deposit'}
        </Text>
        <Text style={[HomeStyle.sharingPrice]}>{'0000.00'}</Text>
      </View>
    );
  };

  const renderReviewList = () => {
    return (
      <View style={{...LayoutStyle.marginBottom20}}>
        <View style={{...CommonStyles.directionRowCenter}}>
          <FastImage
            style={HomeStyle.reviewerImg}
            source={{
              uri: 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
            }}
          />
          <Text style={[HomeStyle.userName]}>{'Glenn'}</Text>
        </View>
        <View style={[HomeStyle.rateImg, {...LayoutStyle.marginVertical20}]}>
          {Array.from({length: 5}, (_, index) => (
            <TouchableOpacity
              key={'rate' + index}
              onPress={() => handleRating(index + 1)}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={index < rating ? 'star' : 'star-outline'}
                iconColor={Colors.rating}
                iconSize={20}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[HomeStyle.pgDesc]}>
          {
            'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.'
          }
        </Text>
      </View>
    );
  };

  const renderPropertyList = () => {
    return (
      <View style={{...LayoutStyle.marginRight10}}>
        <Image source={IMAGES.property} style={[HomeStyle.propertyImg]} />
        <Text style={[HomeStyle.propertyName]}>{'Property Name'}</Text>
        <Text style={[HomeStyle.propertyPrice]}>{'00000'}</Text>
        <View style={[HomeStyle.rateImg]}>
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
        <View style={[HomeStyle.withinKmContainer]}>
          <Text style={[HomeStyle.withinKm]}>{'Within a km'}</Text>
        </View>
      </View>
    );
  };

  const renderPGImgList = (item, index) => {
    return (
      <Image
        key={index}
        source={IMAGES.property}
        style={[HomeStyle.pgImgaesmall]}
        borderRadius={10}
      />
    );
  };
  const gotoBack = () => {
    props.navigation.dispatch(CommonActions.goBack());
  };
  const gotoGroupCheckIn = () => {
    props.navigation.navigate('GroupBooking');
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
          </View>
          <View style={HomeStyle.iconContainer}>
            <TouchableOpacity>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'notifications-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
              <View style={HomeStyle.smallRound}></View>
            </TouchableOpacity>
            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'share-social-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{...LayoutStyle.marginLeft5}}>
              <Icons
                iconSetName={'Ionicons'}
                iconName={'heart-outline'}
                iconColor={Colors.white}
                iconSize={26}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <ImageBackground
        source={IMAGES.primaryBG}
        style={[HomeStyle.formContainer, {flex: 1}]}
        resizeMode="cover">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: '10%'}}
          showsVerticalScrollIndicator={false}>
          <View style={[HomeStyle.PgListContainer]}>
            <View style={[HomeStyle.imageListContainer]}>
              <Image
                source={IMAGES.property}
                style={[HomeStyle.pgImgaeBig]}
                borderRadius={10}
              />
              <FlatList
                data={imgsList}
                renderItem={({item: imgItem, index}) =>
                  renderPGImgList(imgItem, index)
                }
                keyExtractor={item => item.id}
                horizontal={true}
              />
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <Text style={[HomeStyle.screenTitle]}>
                {'Figma Deluxe Hostel'}
              </Text>
              <Text style={[HomeStyle.screenTitle]}>{'00000.00'}</Text>
            </View>

            <View style={[HomeStyle.rateImg, {...LayoutStyle.marginTop10}]}>
              {Array.from({length: 5}, (_, index) => (
                <TouchableOpacity
                  key={'rate' + index}
                  onPress={() => handleRating(index + 1)}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={index < rating ? 'star' : 'star-outline'}
                    iconColor={Colors.rating}
                    iconSize={24}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[HomeStyle.pgDesc]}>
              {
                'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.'
              }
            </Text>
            <View style={[HomeStyle.listContainer]}>
              <FlatList
                horizontal
                data={servicesIcon}
                renderItem={({item: servicesIcon, index}) =>
                  renderServiceList(servicesIcon, index)
                }
                scrollEnabled={false}
                keyExtractor={item => item.id}
              />
              <TouchableOpacity>
                <Text style={[HomeStyle.viewallText]}>{'View all'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <Text style={[HomeStyle.screenTitle]}>{'Sharing'}</Text>
              <FlatList
                horizontal
                data={servicesIcon}
                renderItem={({item: servicesIcon, index}) =>
                  renderSharingList(servicesIcon, index)
                }
                scrollEnabled={false}
                keyExtractor={item => item.id}
              />
            </View>
            <View style={{...LayoutStyle.marginBottom20}}>
              <Text style={[HomeStyle.screenTitle]}>{'Pg Rules'}</Text>
              <Text style={[HomeStyle.pgDesc]}>
                {
                  'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.'
                }
              </Text>
            </View>
            <View style={{...CommonStyles.directionRowSB}}>
              <View style={{...CommonStyles.directionRowCenter}}>
                <FastImage
                  style={HomeStyle.ownerImg}
                  source={{
                    uri: 'https://cdn.pixabay.com/photo/2024/06/17/04/11/woman-8834904_1280.jpg',
                  }}
                />
                <View style={{...LayoutStyle.marginLeft20}}>
                  <Text style={[HomeStyle.ownerName]}>{'Owner name'}</Text>
                  <Text style={[HomeStyle.ownerTag]}>{'Tag'}</Text>
                </View>
              </View>
              <View style={{...CommonStyles.directionRowCenter}}>
                <View style={[HomeStyle.iconCall]}>
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'call-outline'}
                    iconColor={Colors.black}
                    iconSize={20}
                  />
                </View>
                <View
                  style={[HomeStyle.iconCall, {...LayoutStyle.marginLeft20}]}>
                  <Icons
                    iconSetName={'Feather'}
                    iconName={'message-circle'}
                    iconColor={Colors.black}
                    iconSize={20}
                  />
                </View>
              </View>
            </View>
            <View style={[HomeStyle.mapContainer]}>
              <Icons
                iconSetName={'Octicons'}
                iconName={'location'}
                iconColor={Colors.gray}
                iconSize={26}
              />
              <Text style={[HomeStyle.pgDescIcon]}>
                {
                  'Sapiente asperiores ut inventore. Voluptatem molestiae atque minima corrupti adipisci fugit a. Earum assumenda qui beatae aperiam quaerat est quis hic sit.'
                }
              </Text>
            </View>
            <Image source={IMAGES.map} style={[HomeStyle.mapImg]} />
            <View style={{...LayoutStyle.marginVertical20}}>
              <Text style={[HomeStyle.screenTitle]}>{'Neighborhood'}</Text>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'MaterialCommunityIcons'}
                  iconName={'airplane-takeoff'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Airport'}</Text>
              </View>
            </View>
            <View>
              <View style={{...CommonStyles.directionRowSB}}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'MaterialIcons'}
                  iconName={'train'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Metro'}</Text>
              </View>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <View style={[HomeStyle.kmContainer]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View
                style={[HomeStyle.kmContainer, {...LayoutStyle.marginTop10}]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'bus'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Bus'}</Text>
              </View>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <View style={[HomeStyle.kmContainer]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View
                style={[HomeStyle.kmContainer, {...LayoutStyle.marginTop10}]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View style={[HomeStyle.pathContainer]}>
                <Icons
                  iconSetName={'Ionicons'}
                  iconName={'train-sharp'}
                  iconColor={Colors.secondary}
                  iconSize={26}
                />
                <Text style={[HomeStyle.pathText]}>{'Railways'}</Text>
              </View>
            </View>
            <View style={{...LayoutStyle.marginVertical20}}>
              <View style={[HomeStyle.kmContainer]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <View
                style={[HomeStyle.kmContainer, {...LayoutStyle.marginTop10}]}>
                <Text style={[HomeStyle.pathHeading]}>
                  {'Sapiente asperiores ut inventore. '}
                </Text>
                <Text style={[HomeStyle.kmText]}>{'KM | hrs'}</Text>
              </View>
              <TouchableOpacity>
                <View style={[HomeStyle.iconViewAll]}>
                  <Text style={[HomeStyle.viewallTextIcon]}>{'View all'}</Text>
                  <Icons
                    iconSetName={'MaterialIcons'}
                    iconName={'keyboard-arrow-down'}
                    iconColor={Colors.gray}
                    iconSize={26}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={[
                  HomeStyle.screenTitle,
                  {...LayoutStyle.marginBottom20},
                ]}>
                {'Reviews'}
              </Text>
              <FlatList
                data={servicesIcon}
                renderItem={({item: servicesIcon, index}) =>
                  renderReviewList(servicesIcon, index)
                }
                scrollEnabled={false}
                keyExtractor={item => item.id}
              />
            </View>
            <View>
              <Text
                style={[
                  HomeStyle.screenTitle,
                  {...LayoutStyle.marginBottom20},
                ]}>
                {'Near by properties'}
              </Text>
              <FlatList
                horizontal
                data={servicesIcon}
                renderItem={({item: servicesIcon, index}) =>
                  renderPropertyList(servicesIcon, index)
                }
                scrollEnabled={false}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        </ScrollView>
        <View style={[HomeStyle.btnBookingContainer]}>
          <Button
            onPress={() => gotoContactClick()}
            btnStyle={[HomeStyle.btnRadius]}
            flexContainer={{flexGrow: 0.456}}
            btnName={'Contact'}
          />
          <Button
            onPress={() => gotoBookClick()}
            btnStyle={[HomeStyle.btnRadius]}
            flexContainer={{flexGrow: 0.456}}
            btnName={'Book now'}
          />
        </View>
        {isBottomSheet && (
          <BottomSheet
            maxHeight={deviceHight / 6}
            isOpen={isBottomSheet}
            onClose={() => gotoBottomSheetClose()}
            renderContent={() => {
              return (
                <View style={[HomeStyle.bottomSheetHeight]}>
                  {isContact ? (
                    <View style={[HomeStyle.btnBookingContainer]}>
                      <TouchableOpacity style={{flex: 0.48}}>
                        <View style={[HomeStyle.iconBtnContainer]}>
                          <Icons
                            iconSetName={'Ionicons'}
                            iconName={'call-outline'}
                            iconColor={Colors.goastWhite}
                            iconSize={20}
                          />
                          <Text style={[HomeStyle.iconChat]}>{'Call'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex: 0.48}}>
                        <View style={[HomeStyle.iconBtnContainer]}>
                          <Icons
                            iconSetName={'Feather'}
                            iconName={'message-circle'}
                            iconColor={Colors.goastWhite}
                            iconSize={20}
                          />
                          <Text style={[HomeStyle.iconChat]}>{'Chat'}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={[HomeStyle.btnBookingContainer]}>
                      <TouchableOpacity
                        style={{flex: 0.48}}
                        onPress={() => gotoMySelf()}>
                        <View style={[HomeStyle.iconBtnContainer]}>
                          <Icons
                            iconSetName={'FontAwesome'}
                            iconName={'user'}
                            iconColor={Colors.goastWhite}
                            iconSize={20}
                          />
                          <Text style={[HomeStyle.iconChat]}>{'My self'}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{flex: 0.48}}
                        onPress={() => gotoGroupCheckIn()}>
                        <View style={[HomeStyle.iconBtnContainer]}>
                          <Icons
                            iconSetName={'FontAwesome'}
                            iconName={'group'}
                            iconColor={Colors.goastWhite}
                            iconSize={20}
                          />
                          <Text style={[HomeStyle.iconChat]}>
                            {'Group check in'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default PGBookingScreen;

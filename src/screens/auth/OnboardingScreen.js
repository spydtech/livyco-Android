import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AuthStyle from '../../styles/AuthStyle';
import IMAGES from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import {Icons} from '../../components';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
const OnboardingScreen = props => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onboardingData = [
    {
      id: 1,
      gradient1: '#FEE123',
      gradient2: '#FFECBA',
      descText: 'Discover PGs in Your\nNeighborhood',
      imgName: IMAGES.boarding1,
    },
    {
      id: 2,
      gradient1: '#1889DF',
      gradient2: '#E4EEFF',
      descText:
        'Make a booking together with a \ngroup of friends for a shared \nexperience.',
      imgName: IMAGES.boarding2,
    },
    {
      id: 3,
      gradient1: '#FEE123',
      gradient2: '#FFECBA',
      descText: 'Never Miss a Rent Payment – Stay \nNotified, Stay Updated!',
      imgName: IMAGES.boarding3,
    },
  ];

  const nextItem = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      gotoLogin();
    }
  };
  const gotoLogin = () => {
    console.log('in skip');
    props.navigation.navigate('Login');
  };
  const renderOnBoardingData = (item, index) => {
    return (
      <LinearGradient colors={[item.gradient1, item.gradient2]}>
        <ImageBackground
          source={IMAGES.primaryBG}
          style={[AuthStyle.bgImageWel]}
        >
          <View style={[AuthStyle.boardingImgContainer, {justifyContent: "space-between",}]}>
            <View>
              <Image style={AuthStyle.boarding1Img} source={item.imgName} />
              <Text style={[AuthStyle.welScrDesc, { height: 130 }]}>
                {item.descText}
              </Text>
            </View>
            <View style={[AuthStyle.dotsPadding]}>
              <View style={[AuthStyle.dotsContainer]}>
                {onboardingData.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      AuthStyle.dots,
                      {
                        backgroundColor:
                          currentIndex == index
                            ? Colors.secondary
                            : Colors.gray,
                        borderColor:
                          currentIndex == index
                            ? Colors.secondary
                            : Colors.gray,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={{ ...CommonStyles.directionRowSB }}>
                <TouchableOpacity onPress={() => gotoLogin()}>
                  <Text style={[AuthStyle.skipText]}>{'Skip'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[AuthStyle.nextArrow]}
                  onPress={() => nextItem()}
                >
                  <Icons
                    iconSetName={'Ionicons'}
                    iconName={'arrow-forward'}
                    iconColor={Colors.white}
                    iconSize={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </LinearGradient>
    );
  };
  return (
    <View style={[AuthStyle.mainContainer]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[onboardingData[currentIndex]]}
        renderItem={({item: incidentItem, index}) =>
          renderOnBoardingData(incidentItem, index)
        }
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default OnboardingScreen;

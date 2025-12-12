import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View, Text} from 'react-native';
import IMAGES from '../assets/Images';
import Colors from '../styles/Colors';
import {deviceWidth} from '../utils/DeviceInfo';

const IntroLogoAnimation = ({
  size = deviceWidth / 1.6,
  text = 'Livyco',
  textColor = Colors.primary,
}) => {
  const logo1Opacity = useRef(new Animated.Value(0)).current;
  const logo1TranslateY = useRef(new Animated.Value(50)).current;
  const logo2Opacity = useRef(new Animated.Value(0)).current;
  const logo2Scale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logo1Opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logo1TranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(logo2Opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logo2Scale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 550,
          delay: 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 550,
          delay: 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [logo1Opacity, logo1TranslateY, logo2Opacity, logo2Scale, textOpacity, textTranslateY]);

  return (
    <View style={styles.container}>
      <View style={[styles.logoWrapper, {width: size, height: size}]}>
        <Animated.Image
          source={IMAGES.logo1}
          style={[
            styles.logo,
            {
              opacity: logo1Opacity,
              transform: [{translateY: logo1TranslateY}],
            },
          ]}
        />
        <Animated.Image
          source={IMAGES.logo2}
          style={[
            styles.logo,
            styles.overlay,
            {
              opacity: logo2Opacity,
              transform: [{scale: logo2Scale}],
            },
          ]}
        />
      </View>
      <Animated.Text
        style={[
          styles.title,
          {
            color: textColor,
            opacity: textOpacity,
            transform: [{translateY: textTranslateY}],
          },
        ]}>
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    marginTop: 16,
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: 5,
  },
});

export default IntroLogoAnimation;


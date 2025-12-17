import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Colors from '../styles/Colors';
import HomeStyle from '../styles/HomeStyle';
import LayoutStyle from '../styles/LayoutStyle';

const EmptyState = ({
  image,
  title,
  description,
  imageStyle,
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {image && (
        <Image
          source={image}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      )}
      {title && (
        <Text style={[styles.title, titleStyle]}>
          {title}
        </Text>
      )}
      {description && (
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: Colors.blackText,
    textAlign: 'center',
    marginTop: 10,
    ...HomeStyle.screenTitle,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.grayText,
    textAlign: 'center',
    marginTop: 10,
    ...HomeStyle.pgDesc,
  },
});

export default EmptyState;


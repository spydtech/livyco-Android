import React, {useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
import Icons from './Icons';
import Colors from '../styles/Colors';
import LayoutStyle from '../styles/LayoutStyle';

const BottomSheet = ({isOpen, onClose, renderContent, maxHeight}) => {
  const [animation] = React.useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [animation, isOpen]);

  const bottomSheetStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[styles.bottomSheet, bottomSheetStyle, {maxHeight}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icons
              iconName={'close-circle-outline'}
              iconSetName={'MaterialCommunityIcons'}
              iconColor={Colors.gray}
              iconSize={20}
            />
          </TouchableOpacity>
        </View>
        {renderContent && renderContent()}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...LayoutStyle.marginRight10,
  },
  closeButton: {
    position: 'absolute',
    top: -45,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  closeIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    paddingBottom: 20,
  },
});

export default BottomSheet;

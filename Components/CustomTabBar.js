// src/components/CustomTabBar.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width }   = Dimensions.get('window');
const BG          = '#262628';
const ACTIVE_CLR  = '#E4D408';
const INACTIVE_CLR= '#939393';
const TAB_WIDTH   = width / 5;                    // 5 кнопок

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  /* ─── индикатор ─────────────────────────────── */
  const indicatorX = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    Animated.timing(indicatorX, {
      toValue: state.index,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [state.index, indicatorX]);

  /* формула, смещающая индикатор по оси X */
  const translateX = indicatorX.interpolate({
    inputRange: [0, 4],                                   // 5 вкладок
    outputRange: [0, TAB_WIDTH * 4],
  });

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {/* скользящая линия */}
      <Animated.View
        style={[
          styles.slideBar,
          {
            transform: [
              { translateX },
            ],
          },
        ]}
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let iconSource, label;
        switch (route.name) {
          case 'Encyclopedia':
            iconSource = require('../assets/birds.png');
            label = 'Birds';
            break;
          case 'Journal':
            iconSource = require('../assets/journal.png');
            label = 'Journal';
            break;
          case 'Collection':
            iconSource = require('../assets/collection.png');
            label = 'Collection';
            break;
          case 'Game':
            iconSource = require('../assets/game.png');
            label = 'Game';
            break;
          case 'Settings':
            iconSource = require('../assets/gear.png');
            label = 'Settings';
            break;
          default:
            iconSource = null;
            label = '';
        }

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key });
          if (!event.defaultPrevented) navigation.navigate(route.name);
        };

        /* лёгкий “пульс” иконки/текста */
        const scale = isFocused ? 1.1 : 1;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.8}
          >
            {iconSource && (
              <Animated.Image
                source={iconSource}
                style={[
                  styles.icon,
                  {
                    tintColor: isFocused ? ACTIVE_CLR : INACTIVE_CLR,
                    transform: [{ scale }],
                  },
                ]}
              />
            )}
            <Animated.Text
              style={[
                styles.label,
                {
                  color: isFocused ? ACTIVE_CLR : INACTIVE_CLR,
                  transform: [{ scale }],
                },
              ]}
            >
              {label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ─── STYLES ───────────────────────────────────── */
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1A1A1A',
  },
  slideBar: {
    position: 'absolute',
    top: 0,
    left: (TAB_WIDTH - 60) / 2,      // центрируем 60‑px линию
    width: 60,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: ACTIVE_CLR,
  },
  tabItem: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 15,
  },
  icon: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
    paddingBottom: 5,
    paddingBottom:10,
  },
});

// src/components/Loader.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── CONSTANTS ───────────────────────────────────────── */
const { width, height } = Dimensions.get('window');
const BG               = '#262628';
const TITLE_FONT       = 40;          // под iPhone SE смотрится органично
const SUB_FONT         = 14;
const CHICKEN_SRC      = require('../assets/Logo.png'); // картинка курочки
/* ─────────────────────────────────────────────────────── */

export default function Loader({ onEnd }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start(() => typeof onEnd === 'function' && onEnd());
  }, [opacity, onEnd]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {Platform.OS === 'android' && (
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      )}
      <SafeAreaView style={styles.safe}>
        {/* Крупная курочка */}
        <Image
          source={CHICKEN_SRC}
          style={styles.chicken}
          resizeMode="contain"
        />

       

        {/* Стек‑заголовок внизу справа */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>Flock{'\n'}Fowl{'\n'}Play</Text>
          <View style={styles.underline} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

/* ─── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
  },
  safe: {
    flex: 1,
    justifyContent: 'center',
  },

  /* курочка */
  chicken: {
    position: 'absolute',
    left: -width * 0.06,   // cдвиг на 5 % ширины экрана влево
    bottom: height * 0.18, // то же вертикальное позиционирование, что было
    width:  width * 0.9,   // чуть шире, чем 80 %, но не во всю ширину
    height: height * 0.55,
  },

  /* бейдж */
  badge: {
    position: 'absolute',
    left: 50,
    bottom: height * 0.22,
    backgroundColor: BG,
    transform: [{ skewX: '-12deg' }],
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: SUB_FONT,
    transform: [{ skewX: '12deg' }], // выравниваем текст обратно
  },

  /* заголовок */
  titleBox: {
    position: 'absolute',
    right: 30,
    bottom: 80,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: TITLE_FONT,
    color: '#ffffff',
    fontWeight: '900',
    lineHeight: TITLE_FONT * 1.05,
    textAlign: 'right',
  },
  underline: {
    width: width * 0.45,
    height: 2,
    backgroundColor: '#ffffff',
    marginTop: 6,
  },
});

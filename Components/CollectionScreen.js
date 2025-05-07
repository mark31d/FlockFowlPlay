// src/screens/CollectionScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FEATHERS = [
  { id: '1', name: 'Sparrow Feather',       image: require('../assets/feather2.png'),       rarity: 'common',    description: 'Sparrows are small but energetic birds. Their feathers are often found in gardens' },
  { id: '2', name: 'Chicken Feather',       image: require('../assets/feather1.png'),       rarity: 'common',    description: 'Chicken feathers are the most common, but they remind us of homey comfort and simplicity' },
  { id: '3', name: 'Flamingo Feather',      image: require('../assets/feather3.png'),      rarity: 'rare',      description: 'Chicken feathers are the most common, but they remind us of homey comfort and simplicity' },
  { id: '4', name: 'Invisible Owl Feather', image: require('../assets/feather4.png'),      rarity: 'legendary', description: 'The Invisible Owl is a mythical bird, and its feather is considered a symbol of wisdom and mystery. It’s almost impossible to find' },
  { id: '5', name: 'Parrot Feather',        image: require('../assets/feather5.png'),       rarity: 'rare',      description: 'Parrots are bright and intelligent birds. Their green feathers remind us of the tropics and exoticism' },
  { id: '6', name: 'Jay Feather',           image: require('../assets/feather6.png'),       rarity: 'common',    description: '“Jays are bright and noisy birds. Their blue feathers are a rare find, symbolizing courage' },
  { id: '7', name: 'Pigeon Feather',        image: require('../assets/feather7.png'),       rarity: 'common',    description: 'Pigeons are a symbol of peace and tranquility. Their feathers are often found in parks and city streets' },
  { id: '8', name: 'Seagull Feather',       image: require('../assets/feather8.png'),       rarity: 'rare',      description: 'Seagulls are coastal dwellers. Their feathers remind us of the sea breeze and freedom' },
];

// две колонки
const COLS       = 2;
// число ячеек = число перьев
const SLOT_COUNT = FEATHERS.length;
// размер ячейки с учётом отступов
const SLOT_SIZE  = (width - 100 - 40) / COLS;

// фон полки и пустое состояние
const SHELF = require('../assets/shelf.png');
const MIRA  = require('../assets/chicken.png'); // персонаж

export default function CollectionScreen() {
  const [collected, setCollected]       = useState([]);     
  const [newFeather, setNewFeather]     = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const [selectedFeather, setSelectedFeather] = useState(null);

  // при монтировании «собираем» одно рандомное перо
  useEffect(() => {
    collectRandomFeather();
  }, []);

  function collectRandomFeather() {
    const remaining = FEATHERS.filter(f => !collected.includes(f.id));
    if (!remaining.length) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setNewFeather(pick);
    setModalVisible(true);
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setModalVisible(false);
        setCollected(c => [...c, pick.id]);
      });
    }, 2000);
  }

  // рендерим одну ячейку по индексу
  const renderSlot = idx => {
    const fid = collected[idx];
    if (!fid) return null;
    const f = FEATHERS.find(x => x.id === fid);
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;

    return (
      <TouchableOpacity
        key={idx}
        style={[st.slot, {
          top:  row * SLOT_SIZE + 30,
          left: col * SLOT_SIZE * 1.4 + (col === 0 ? 50 : 0),
        }]}
        onPress={() => setSelectedFeather(f)}
      >
        <Image source={f.image} style={st.featherThumb} />
      </TouchableOpacity>
    );
  };

  // экран деталей
  if (selectedFeather) {
    const f = selectedFeather;
    return (
      <SafeAreaView style={st.wrap}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={()=>setSelectedFeather(null)}>
            <Text style={st.back}>‹ Back</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={st.detailContainer}>
          <Image source={f.image} style={st.detailImg} />
          <Text style={st.detailTitle}>{f.name}</Text>

          {/* speech bubble */}
          <View style={st.bubbleDetailContainer}>
            <View style={st.bubbleDetail}>
              <Text style={st.bubbleTxtDetail}>{f.description}</Text>
            </View>
            <View style={st.bubbleArrow} />
          </View>

          {/* character */}
          <Image source={MIRA} style={st.character} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // основной экран
  return (
    <SafeAreaView style={st.wrap}>
      <Text style={st.title}>Feather Collection</Text>

      {collected.length === 0 ? (
        <View style={st.empty}>
          <Image source={MIRA} style={st.mira} />
          <View style={st.bubble}>
            <Text style={st.bubbleTxt}>
              Nothing here yet, as you haven’t saved any birds yet :(
            </Text>
          </View>
        </View>
      ) : (
        <View style={st.shelfContainer}>
          <Image source={SHELF} style={st.shelf} />
          {Array.from({ length: SLOT_COUNT }).map((_, i) => renderSlot(i))}
        </View>
      )}

      {/* модалка «новое перо» */}
      {modalVisible && newFeather && (
        <Animated.View style={[st.modalOverlay, { opacity: fade }]}>
          <View style={st.modal}>
            <Text style={st.modalTitle}>{newFeather.name}</Text>
            <Text style={st.modalSub}>You have a new feather</Text>
            <Image source={newFeather.image} style={st.modalImg} />
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    paddingTop: 12,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  back: {
    color: '#E6E02E',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mira: {
    width: 200,
    height: 200,
  },
  bubble: {
    position: 'absolute',
    top: 40,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    maxWidth: width * 0.8,
  },
  bubbleTxt: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  shelfContainer: {
    flex: 1,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelf: {
    width: width - 40,
    height: (width - 40) * 1.5,
    position: 'absolute',
    resizeMode: 'contain',
  },
  slot: {
    position: 'absolute',
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featherThumb: {
    width: SLOT_SIZE * 0.8,
    height: SLOT_SIZE * 0.8,
    resizeMode: 'contain',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: width * 0.8,
    backgroundColor: '#2E2E2E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSub: {
    color: '#EEE',
    fontSize: 14,
    marginBottom: 16,
  },
  modalImg: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
  detailContainer: {
    alignItems: 'center',
    padding: 20,
  },
  detailImg: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  detailTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  // speech bubble in detail view
  bubbleDetailContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bubbleDetail: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    maxWidth: width * 0.8,
  },
  bubbleTxtDetail: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  bubbleArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFF',
    marginTop: -1,
  },
  // character under bubble
  character: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: -8,
  },
});

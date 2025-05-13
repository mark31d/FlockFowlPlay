// src/context/CollectionContext.js
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

// Ваши константы из CollectionScreen
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

const CollectionContext = createContext();

export function CollectionProvider({ children }) {
  const [collected, setCollected]       = useState([]);
  const [newFeather, setNewFeather]     = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  // Собирает одно случайное перо
  const collectRandomFeather = () => {
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
  };

  // при первом монтировании сразу подбираем одно перо
  useEffect(() => { collectRandomFeather(); }, []);

  return (
    <CollectionContext.Provider value={{
      collected,
      newFeather,
      modalVisible,
      fade,
      collectRandomFeather,
      FEATHERS
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollection = () => useContext(CollectionContext);

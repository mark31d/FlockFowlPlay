// src/screens/CollectionScreen.js
import React, { useState } from 'react';
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

// NEW: підключаємо контекст
import { useCollection } from '../Components/CollectionContext';

const { width } = Dimensions.get('window');

// дві колонки
const COLS = 2;
const SLOT_SIZE = (width - 100 - 40) / COLS;

// фон полки й персонаж
const SHELF = require('../assets/shelf.png');
const MIRA  = require('../assets/chicken.png');

export default function CollectionScreen() {
  // NEW: забираємо дані й методи із контексту
  const {
    collected,
    FEATHERS,
    newFeather,
    modalVisible,
    fade,
  } = useCollection();

  const [selectedFeather, setSelectedFeather] = useState(null);

  // NEW: кількість слотів тепер рахуємо від FEATHERS із контексту
  const SLOT_COUNT = FEATHERS.length;

  // рендер однієї комірки
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
          width: SLOT_SIZE,
          height: SLOT_SIZE,
        }]}
        onPress={() => setSelectedFeather(f)}
      >
        <Image source={f.image} style={st.featherThumb}/>
      </TouchableOpacity>
    );
  };

  /* -------- ДЕТАЛІ ПЕРА ---------------------------------- */
  if (selectedFeather) {
    const f = selectedFeather;
    return (
      <SafeAreaView style={st.wrap}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => setSelectedFeather(null)}>
            <Text style={st.back}>‹ Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={st.detailContainer}>
          <Image source={f.image} style={st.detailImg}/>
          <Text style={st.detailTitle}>{f.name}</Text>

          <View style={st.bubbleDetailContainer}>
            <View style={st.bubbleDetail}>
              <Text style={st.bubbleTxtDetail}>{f.description}</Text>
            </View>
            <View style={st.bubbleArrow}/>
          </View>

          <Image source={MIRA} style={st.character}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* -------- ГОЛОВНИЙ ЕКРАН -------------------------------- */
  return (
    <SafeAreaView style={st.wrap}>
      <Text style={st.title}>Feather Collection</Text>

      {collected.length === 0 ? (
        <View style={st.empty}>
          <Image source={MIRA} style={st.mira}/>
          <View style={st.bubble}>
            <Text style={st.bubbleTxt}>
              Nothing here yet, as you haven’t saved any birds yet :(
            </Text>
          </View>
        </View>
      ) : (
        <View style={st.shelfContainer}>
          <Image source={SHELF} style={st.shelf}/>
          {Array.from({ length: SLOT_COUNT }).map((_, i) => renderSlot(i))}
        </View>
      )}

      {/* модалка «нове перо» */}
      {modalVisible && newFeather && (
        <Animated.View style={[st.modalOverlay, { opacity: fade }]}>
          <View style={st.modal}>
            <Text style={st.modalTitle}>{newFeather.name}</Text>
            <Text style={st.modalSub}>You have a new feather</Text>
            <Image source={newFeather.image} style={st.modalImg}/>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

/* ----------------- СТИЛІ ----------------------------- */
const st = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:'#1E1E1E', alignItems:'center', paddingTop:12 },
  topBar:{ width:'100%', paddingHorizontal:20, marginBottom:12 },
  back:{ color:'#E6E02E', fontSize:16, fontWeight:'600' },
  title:{ color:'#FFF', fontSize:24, fontWeight:'700', marginBottom:12 },

  empty:{ flex:1, justifyContent:'center', alignItems:'center' },
  mira:{ width:200, height:200 },
  bubble:{ position:'absolute', top:40, backgroundColor:'#FFF',
           padding:16, borderRadius:16, maxWidth:width*0.8 },
  bubbleTxt:{ color:'#000', fontSize:14, textAlign:'center' },

  shelfContainer:{ flex:1, width:width-40, alignItems:'center', justifyContent:'center' },
  shelf:{ width:width-40, height:(width-40)*1.5, position:'absolute', resizeMode:'contain' },

  slot:{ position:'absolute', justifyContent:'center', alignItems:'center' },
  featherThumb:{ width:SLOT_SIZE*0.8, height:SLOT_SIZE*0.8, resizeMode:'contain' },

  /* модалка */
  modalOverlay:{ ...StyleSheet.absoluteFillObject, backgroundColor:'#000C',
                 justifyContent:'center', alignItems:'center' },
  modal:{ width:width*0.8, backgroundColor:'#2E2E2E', borderRadius:20,
          padding:24, alignItems:'center' },
  modalTitle:{ color:'#FFF', fontSize:20, fontWeight:'700', marginBottom:8 },
  modalSub:{ color:'#EEE', fontSize:14, marginBottom:16 },
  modalImg:{ width:width*0.5, height:width*0.5, resizeMode:'contain' },

  /* деталі */
  detailContainer:{ alignItems:'center', padding:20 },
  detailImg:{ width:width*0.8, height:width*0.8, resizeMode:'contain', marginBottom:20 },
  detailTitle:{ color:'#FFF', fontSize:24, fontWeight:'700', marginBottom:12 },
  bubbleDetailContainer:{ alignItems:'center', marginBottom:16 },
  bubbleDetail:{ backgroundColor:'#FFF', padding:16, borderRadius:16, maxWidth:width*0.8 },
  bubbleTxtDetail:{ color:'#000', fontSize:14, textAlign:'center' },
  bubbleArrow:{ width:0, height:0, borderLeftWidth:8, borderRightWidth:8,
                borderTopWidth:8, borderLeftColor:'transparent',
                borderRightColor:'transparent', borderTopColor:'#FFF', marginTop:-1 },
  character:{ width:150, height:150, resizeMode:'contain', marginTop:-8 },
});

// src/screens/MiniGameScreen.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const NUM_COLS    = 3;
const NUM_ROWS    = 4;
const PAIR_COUNT  = 6;
const CARD_SIZE   = (width - 40) / NUM_COLS;
const TOTAL_CARDS = NUM_COLS * NUM_ROWS;

const BIRD_IMAGES = [
  require('../assets/b1.png'),
  require('../assets/b2.png'),
  require('../assets/b3.png'),
  require('../assets/b4.png'),
  require('../assets/b5.png'),
  require('../assets/b6.png'),
];
const ICON_PLAY   = require('../assets/play.png');
const ICON_EXIT   = require('../assets/exit.png');
const ICON_REPLAY = require('../assets/replay.png');
const MIRA        = require('../assets/chicken.png');
const BG          = require('../assets/back.png');

const ScreenWrap = ({ children }) => (
  <ImageBackground source={BG} style={styles.background}>
    {children}
  </ImageBackground>
);

const formatTime = sec => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Timer = React.memo(({ style, startRef }) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setT(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startRef]);
  return <Text style={style}>{formatTime(t)}</Text>;
});

const Card = React.memo(({ card, flipped, matched, onPress }) => (
  <TouchableOpacity
    activeOpacity={1}
    style={[styles.card, matched && styles.cardHidden]}
    onPress={() => onPress(card.id)}
  >
    {flipped || matched ? (
      <Image source={card.img} style={styles.cardImg} />
    ) : (
      <View style={styles.cardBack}>
        <Image source={MIRA} style={styles.cardBackIcon} />
      </View>
    )}
  </TouchableOpacity>
), (prev, next) =>
  prev.flipped === next.flipped &&
  prev.matched === next.matched
);

export default function MiniGameScreen() {
  const [gameState, setGameState] = useState('start');
  const [deck, setDeck]           = useState([]);
  const [flippedIds, setFlipped]  = useState([]);
  const [matchedIds, setMatched]  = useState([]);
  const [prevTime, setPrevTime]   = useState(null);
  const [busy, setBusy]           = useState(false);
  const startTimeRef               = useRef(0);

  const initGame = useCallback(() => {
    let cards = [];
    BIRD_IMAGES.slice(0, PAIR_COUNT).forEach(img => {
      const id1 = Math.random().toString();
      const id2 = Math.random().toString();
      cards.push({ id: id1, img });
      cards.push({ id: id2, img });
    });
    cards = cards.sort(() => Math.random() - 0.5).slice(0, TOTAL_CARDS);
    setDeck(cards);
    setFlipped([]);
    setMatched([]);
    setBusy(false);
  }, []);

  useEffect(() => {
    if (flippedIds.length < 2) return;
    setBusy(true);
    const [id1, id2] = flippedIds;
    const card1 = deck.find(c => c.id === id1);
    const card2 = deck.find(c => c.id === id2);
    const isMatch = card1.img === card2.img;

    setTimeout(() => {
      if (isMatch) setMatched(m => [...m, id1, id2]);
      setFlipped([]);
      setBusy(false);
    }, 500);
  }, [flippedIds, deck]);

  useEffect(() => {
    const pairsFound = matchedIds.length / 2;
    if (gameState === 'playing' && pairsFound === PAIR_COUNT) {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setPrevTime(elapsed);
      setTimeout(() => setGameState('over'), 500);
    }
  }, [matchedIds, gameState]);

  const onPressCard = id => {
    if (busy) return;
    if (flippedIds.includes(id) || matchedIds.includes(id)) return;
    setFlipped(f => [...f, id].slice(0, 2));
  };

  const getReaction = () => {
    if (prevTime < 60) return "Is it magic?! You did it faster than I can peck grain in time! ✨";
    if (prevTime < 120) return "You're faster than the wind! Even I didn't have time to blink! 🌪️";
    return "Perfect! Not a single extra card - you're a true master! 🏆";
  };

  if (gameState === 'start') {
    return (
      <ScreenWrap>
        <SafeAreaView style={styles.wrap}>
          {prevTime !== null && (
            <View style={styles.prevPanel}>
              <Text style={styles.prevLabel}>Your previous result</Text>
              <View style={styles.prevTimeBox}>
                <Text style={styles.prevTime}>{formatTime(prevTime)}</Text>
              </View>
            </View>
          )}
          <Text style={styles.heading}>Find a bird pair</Text>
          <View style={styles.bubbleContainer}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleTxt}>Let's go</Text>
            </View>
            <View style={styles.bubbleArrow}/>
          </View>
          <Image source={MIRA} style={styles.miraStart} />
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => {
              initGame();
              startTimeRef.current = Date.now();
              setGameState('playing');
            }}
          >
            <Image source={ICON_PLAY} style={styles.playIcon} />
          </TouchableOpacity>
        </SafeAreaView>
      </ScreenWrap>
    );
  }

  if (gameState === 'playing') {
    return (
      <ScreenWrap>
        <SafeAreaView style={styles.wrap}>
          <View style={styles.timerPanel}>
            <Timer style={styles.timerTxt} startRef={startTimeRef} />
          </View>
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => setGameState('start')}
          >
            <Image source={ICON_EXIT} style={styles.exitIcon} />
          </TouchableOpacity>
          <View style={styles.gridContainer}>
            {Array.from({ length: NUM_ROWS }).map((_, row) => (
              <View key={row} style={{ flexDirection: 'row' }}>
                {deck.slice(row * NUM_COLS, row * NUM_COLS + NUM_COLS).map(card => (
                  <Card
                    key={card.id}
                    card={card}
                    flipped={flippedIds.includes(card.id)}
                    matched={matchedIds.includes(card.id)}
                    onPress={onPressCard}
                  />
                ))}
              </View>
            ))}
          </View>
        </SafeAreaView>
      </ScreenWrap>
    );
  }

  return (
    <ScreenWrap>
      <SafeAreaView style={styles.wrap}>
        <View style={styles.prevPanel}>
          <Text style={styles.prevLabel}>Your previous result</Text>
          <View style={styles.prevTimeBox}>
            <Text style={styles.prevTime}>{formatTime(prevTime)}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Game over</Text>
        <View style={styles.bubbleContainer}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleTxt}>{getReaction()}</Text>
          </View>
          <View style={styles.bubbleArrow}/>
        </View>
        <Image source={MIRA} style={styles.miraEnd} />
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.ctrlBtn, { backgroundColor: '#E74C3C' }]}
            onPress={() => setGameState('start')}
          >
            <Image source={ICON_EXIT} style={styles.ctrlIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctrlBtn, { backgroundColor: '#3498DB' }]}
            onPress={() => {
              initGame();
              startTimeRef.current = Date.now();
              setGameState('playing');
            }}
          >
            <Image source={ICON_REPLAY} style={styles.ctrlIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScreenWrap>
  );
}

const styles = StyleSheet.create({
  background:     { flex:1, width, height },
  wrap:           { flex:1, alignItems:'center', justifyContent:'center' },

  prevPanel:      { flexDirection:'row', backgroundColor:'#333', padding:10,paddingHorizontal:20,marginHorizontal:10, borderRadius:12, alignItems:'center', marginBottom:12 },
  prevLabel:      { color:'#FFF', flex:1 },
  prevTimeBox:    { backgroundColor:'#555', borderRadius:8, padding:4 },
  prevTime:       { color:'#E6E02E', fontWeight:'600' },

  heading:        { color:'#333', fontSize:32, fontWeight:'700', marginBottom:16, textAlign:'center' },

  bubbleContainer:{ alignItems:'center', marginVertical:8 },
  bubble:         { backgroundColor:'#FFF', padding:12, borderRadius:16, maxWidth:width*0.8 },
  bubbleTxt:      { color:'#000', fontSize:14, textAlign:'center' },
  bubbleArrow:    { width:0, height:0, borderLeftWidth:8, borderRightWidth:8, borderTopWidth:8, borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor:'#FFF', marginTop:-2 },

  miraStart:      {marginTop:-20, width:200, height:200, resizeMode:'contain', marginBottom:16 },
  timerPanel:     { position:'absolute', top:25, left:12, backgroundColor:'#333', padding:6, borderRadius:8,  paddingVertical:12,},
  timerTxt:       { color:'#E6E02E', fontWeight:'600' },

  exitBtn:        { position:'absolute', top:25, right:12, width:40, height:40, borderRadius:10, backgroundColor:'#FF3B30', alignItems:'center', justifyContent:'center' },
  exitIcon:       { width:20, height:20, tintColor:'#FFF' },

  playBtn:        { width:80, height:80, borderRadius:40, backgroundColor:'#3E36FF', alignItems:'center', justifyContent:'center' },
  playIcon:       { width:60, height:60, tintColor:'#FFF' },

  gridContainer:  { marginTop:40, flex:1, justifyContent:'center', alignItems:'center', width:width-20 },

  card:           { width:CARD_SIZE, height:CARD_SIZE, margin:4, borderRadius:12, overflow:'hidden', backgroundColor:'#FFF', alignItems:'center', justifyContent:'center' },
  cardBack:       { flex:1, alignItems:'center', justifyContent:'center' },
  cardBackIcon:   { width:CARD_SIZE*0.5, height:CARD_SIZE*0.5 },
  cardImg:        { width:'100%', height:'100%', resizeMode:'cover' },
  cardHidden:     { opacity:0 },

  miraEnd:        { width:200, height:200 },
  controls:       { flexDirection:'row' },
  ctrlBtn:        { width:64, height:64, borderRadius:16, marginHorizontal:12, alignItems:'center', justifyContent:'center' },
  ctrlIcon:       { width:32, height:32, tintColor:'#FFF' },
});

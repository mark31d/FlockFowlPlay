// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { usePlaylist } from '../Components/PlaylistContext';
import AudioPlayer from './AudioPlayerTrack';

const { width } = Dimensions.get('window');
const MIRA = require('../assets/chicken.png');   // персонаж-курка

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const { playlist, removeFromPlaylist } = usePlaylist();

  /* ——— замість відкриття лінка показуємо “Coming soon” ——— */
  const openLink = (title) => {
    Alert.alert(
      'Coming soon',
      `${title} will be available in one of the next updates.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {showPlaylist ? (
          <TouchableOpacity onPress={() => setShowPlaylist(false)}>
            <Text style={styles.backArrow}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.title}>Settings</Text>
        )}
      </View>

      {/* Content */}
      {showPlaylist ? (
        playlist.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.bubbleContainer}>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>
                  You have nothing here :(
                </Text>
              </View>
              <View style={styles.bubbleArrow} />
            </View>
            <Image source={MIRA} style={styles.miraEmpty} />
          </View>
        ) : (
          <FlatList
            data={playlist}
            keyExtractor={t => t.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.playlistItem}>
                <Image source={item.image} style={styles.trackImage} />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle}>{item.name}</Text>
                  <AudioPlayer src={item.src} />
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFromPlaylist(item.id)}
                >
                  <Text style={styles.removeTxt}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )
      ) : (
        <View style={styles.body}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => setShowPlaylist(true)}
          >
            <Text style={styles.itemText}>Forest playlist</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.item}>
            <Text style={styles.itemText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={() => setNotificationsEnabled(v => !v)}
              trackColor={{ true: '#D94651', false: '#767577' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('Privacy policy')}
          >
            <Text style={styles.itemText}>Privacy policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('Terms of use')}
          >
            <Text style={styles.itemText}>Terms of use</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openLink('About Developer')}
          >
            <Text style={styles.itemText}>About Developer</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <Image source={MIRA} style={styles.miraImage} />
        </View>
      )}
    </View>
  );
}

/* ─── STYLES ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },

  header: {
    backgroundColor: '#1E1E1E',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  backArrow: {
    marginTop: 10,
    color: '#E4D408',
    fontSize: 18,
  },

  /* body + items */
  body: { flex: 1, justifyContent: 'space-between', paddingTop: 24, paddingHorizontal: 16 },
  item: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemText: { color: '#FFFFFF', fontSize: 16 },
  arrow: { color: '#FFFFFF', fontSize: 20 },

  /* empty playlist */
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bubbleContainer: { alignItems: 'center', marginBottom: 8 },
  bubble: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 16, maxWidth: width * 0.8 },
  bubbleText: { color: '#000000', fontSize: 14, textAlign: 'center' },
  bubbleArrow: {
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#FFFFFF',
    marginTop: -2,
  },
  miraEmpty: { width: 180, height: 180, resizeMode: 'contain' },

  /* playlist list */
  playlistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  trackImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#333' },
  trackInfo: { flex: 1, marginLeft: 12 },
  trackTitle: { color: '#FFFFFF', fontSize: 16, marginBottom: 8 },
  removeBtn: { marginLeft: 12 },
  removeTxt: { color: '#DDD', fontSize: 18 },

  /* bottom character */
  miraImage: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 8,
    left: 110,
    top: -30,
  },
});

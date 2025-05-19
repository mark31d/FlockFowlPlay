// src/screens/JournalScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useCollection } from '../Components/CollectionContext';

const { width } = Dimensions.get('window');
const TXT = '#FFFFFF';

const INITIAL_ENTRIES = [
  {
    id: '1',
    date: new Date(2025, 3, 18),
    bird: 'Sparrow',
    photo: require('../assets/bird1.png'),
    place: 'City park',
    note: 'Chirping on branch',
    tag: 'first appearance',
    season: 'spring',
  },
  {
    id: '2',
    date: new Date(2025, 3, 22),
    bird: 'Sparrow',
    photo: require('../assets/bird2.png'),
    place: 'Backyard',
    note: 'Feeding',
    tag: 'reappearance',
    season: 'winter',
  },
];

const SEASONS = ['winter','spring','summer','autumn'];
const TAGS    = ['first appearance','reappearance','surprise encounter'];

export default function JournalScreen() {
  const { collectRandomFeather } = useCollection();

  const [items, setItems]             = useState(INITIAL_ENTRIES);
  const [filterSeason, setFS]         = useState(null);
  const [filterSheet, setFSheet]      = useState(false);

  // three modes: list, details, form
  const [selected, setSelected]       = useState(null);
  const [formMode, setFormMode]       = useState(null); // 'add' | 'edit' | null
  const [editingId, setEditingId]     = useState(null);

  // form fields
  const [date, setDate]               = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bird, setBird]               = useState('');
  const [place, setPlace]             = useState('');
  const [note, setNote]               = useState('');
  const [tag, setTag]                 = useState(null);
  const [season, setSeason]           = useState(null);
  const [photo, setPhoto]             = useState(null);

  // filtered entries
  const filtered = useMemo(() => {
    if (!filterSeason) return items;
    return items.filter(e => e.season === filterSeason);
  }, [items, filterSeason]);

  // date formatter
  const fmt = d => {
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}`;
  };

  // start adding
  function startAdd() {
    setFormMode('add');
    setEditingId(null);
    setDate(new Date());
    setBird('');
    setPlace('');
    setNote('');
    setTag(null);
    setSeason(null);
    setPhoto(null);
  }

  // start editing
  function startEdit(entry) {
    setFormMode('edit');
    setEditingId(entry.id);
    setDate(entry.date);
    setBird(entry.bird);
    setPlace(entry.place);
    setNote(entry.note);
    setTag(entry.tag);
    setSeason(entry.season);
    setPhoto(entry.photo);
    setSelected(null);
  }

  // save form
  function onDone() {
    const newEntry = {
      id: editingId || Date.now().toString(),
      date, bird, place, note, tag, season,
      photo: photo || require('../assets/birds.png'),
    };
    if (formMode === 'edit') {
      setItems(items.map(i => i.id === editingId ? newEntry : i));
    } else {
      setItems([newEntry, ...items]);
      collectRandomFeather();
    }
    setFormMode(null);
  }

  // delete entry
  function onDelete(id) {
    setItems(items.filter(i => i.id !== id));
    setSelected(null);
  }

  // pick photo
  function pickImage() {
    launchImageLibrary({ mediaType:'photo' }, res => {
      if (res.assets?.[0]) setPhoto({ uri: res.assets[0].uri });
    });
  }

  // date change handler
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // === FORM MODE ===
  if (formMode) {
    return (
      <SafeAreaView style={st.wrap}>
        <View style={st.top}>
          <TouchableOpacity style={st.backBtn} onPress={() => setFormMode(null)}>
            <Text style={st.backIcon}>‹</Text>
            <Text style={st.backTxt}>Back</Text>
          </TouchableOpacity>
          <Text style={st.title}>
            {formMode === 'edit' ? 'Edit observation' : 'Add observation'}
          </Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={st.form}>
          {/* date selector */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={st.dateButton}
          >
            <Text style={st.dateButtonText}>Select date</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              textColor="#FFF"              // white text on iOS spinner
              onChange={onChangeDate}
            />
          )}

          {/* photo */}
          <TouchableOpacity style={st.photoPicker} onPress={pickImage}>
            {photo
              ? <Image source={photo} style={st.photoThumb}/>
              : <Image source={require('../assets/camera-icon.png')} style={st.cameraIcon}/>
            }
          </TouchableOpacity>

          {/* other inputs */}
          <TextInput
            placeholder="Name"
            placeholderTextColor="#888"
            style={st.input}
            value={bird}
            onChangeText={setBird}
          />
          <TextInput
            placeholder="Place"
            placeholderTextColor="#888"
            style={st.input}
            value={place}
            onChangeText={setPlace}
          />
          <TextInput
            placeholder="Notes"
            placeholderTextColor="#888"
            style={[st.input, { height: 100, textAlignVertical: 'top' }]}
            multiline
            value={note}
            onChangeText={setNote}
          />

          <Text style={[st.section, { marginTop: 24 }]}>Mark as</Text>
          <View style={st.chipWrap}>
            {TAGS.map(t => {
              const sel = tag === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[st.chip, sel && st.chipActive]}
                  onPress={() => setTag(sel ? null : t)}
                >
                  <Text style={[st.chipTxt, sel && st.chipTxtActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[st.section, { marginTop: 32 }]}>Time of year</Text>
          <View style={st.chipWrap}>
            {SEASONS.map(s => {
              const sel = season === s;
              const ico = { winter:'❄️', spring:'🌸', summer:'☀️', autumn:'🍂' }[s];
              return (
                <TouchableOpacity
                  key={s}
                  style={[st.chip, sel && st.chipActive]}
                  onPress={() => setSeason(sel ? null : s)}
                >
                  <Text style={[st.chipTxt, sel && st.chipTxtActive]}>
                    {`${ico} ${s}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[st.doneBtn, !(bird && tag) && st.doneBtnDisabled]}
            disabled={!(bird && tag)}
            onPress={onDone}
          >
            <Text style={st.doneTxt}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // === DETAILS MODE ===
  if (selected) {
    const e = selected;
    return (
      <SafeAreaView style={st.wrap}>
        <View style={st.top}>
          <TouchableOpacity style={st.backBtn} onPress={() => setSelected(null)}>
            <Text style={st.backIcon}>‹</Text>
            <Text style={st.backTxt}>Back</Text>
          </TouchableOpacity>
          <Text style={st.title}>Details</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView>
          <Image source={e.photo} style={st.hero}/>
          <View style={st.pad}>
            {e.tag && (
              <View style={st.badge_first}>
                <Text style={st.badgeTxt_first}>{e.tag}</Text>
              </View>
            )}
            <Text style={st.h2}>{e.bird}</Text>

            <Text style={[st.label, { marginTop: 16 }]}>Date</Text>
            <Text style={st.value}>{fmt(e.date)}</Text>

            <Text style={[st.label, { marginTop: 16 }]}>Place</Text>
            <Text style={st.value}>{e.place}</Text>

            <Text style={[st.label, { marginTop: 16 }]}>Notes</Text>
            <Text style={st.value}>{e.note}</Text>

            {e.season && (
              <>
                <Text style={[st.label, { marginTop: 24 }]}>Time of year</Text>
                <View style={st.chipWrap}>
                  <View style={st.chip}>
                    <Text style={st.chipTxt}>{{
                      winter:'❄️ winter',
                      spring:'🌸 spring',
                      summer:'☀️ summer',
                      autumn:'🍂 autumn',
                    }[e.season]}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <View style={st.actionRow}>
          <TouchableOpacity
            style={[st.btnEdit, { backgroundColor: '#3E36FF' }]}
            onPress={() => startEdit(e)}
          >
            <Text style={st.btnEditTxt}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[st.btnDel, { backgroundColor: '#E40808' }]}
            onPress={() => onDelete(e.id)}
          >
            <Text style={st.btnDelTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // === LIST MODE ===
  return (
    <SafeAreaView style={st.wrap}>
      <View style={st.top}>
        <Text style={st.title}>Observation log</Text>
        <TouchableOpacity onPress={() => setFSheet(true)}>
          <Text style={st.filter}>Filter</Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 ? (
        <View style={st.empty}>
          <Image source={require('../assets/chicken.png')} style={st.mira}/>
          <View style={st.bubbleWrap}>
            <View style={st.bubble}>
              <Text style={st.bubbleTxt}>You haven’t added anything yet :(</Text>
            </View>
            <View style={st.bubbleTail}/>
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => setSelected(item)}>
              <View style={st.card}>
                <Image source={item.photo} style={st.pic}/>
                <View style={st.info}>
                  <Text style={st.bird}>{item.bird}</Text>
                  <Text style={[st.meta, { color: TXT }]}>
                    {fmt(item.date)} · {item.place}
                  </Text>
                </View>
                <View style={st.chipsRow}>
                  {item.season && (
                    <View style={st.chip}>
                      <Text style={st.chipTxt}>{{
                        winter:'❄️ winter',
                        spring:'🌸 spring',
                        summer:'☀️ summer',
                        autumn:'🍂 autumn',
                      }[item.season]}</Text>
                    </View>
                  )}
                  {item.tag && (
                    <View style={st.chip}>
                      <Text style={st.chipTxt}>{item.tag}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={st.sep}/>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={st.addBtn} onPress={startAdd}>
        <Text style={st.addTxt}>Add observation</Text>
      </TouchableOpacity>

      {/* filter modal */}
      <Modal
        visible={filterSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setFSheet(false)}
      >
        <Pressable style={st.backdrop} onPress={() => setFSheet(false)}/>
        <View style={st.sheet}>
          <View style={st.sheetHandle}/>
          <View style={st.sheetHead}>
            <TouchableOpacity onPress={() => { setFS(null); setFSheet(false); }}>
              <Text style={st.cancel}>×</Text>
            </TouchableOpacity>
            <Text style={st.sheetTitle}>Time of year</Text>
            <TouchableOpacity onPress={() => setFSheet(false)}>
              <Text style={st.done}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chipWrap}>
            {SEASONS.map(s => {
              const sel = filterSeason === s;
              const label = {winter:'❄️ winter', spring:'🌸 spring', summer:'☀️ summer', autumn:'🍂 autumn'}[s];
              return (
                <TouchableOpacity
                  key={s}
                  style={[st.chip, sel && st.chipActive]}
                  onPress={() => setFS(sel ? null : s)}
                >
                  <Text style={[st.chipTxt, sel && st.chipTxtActive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const BG = '#262628', DIV = '#373737', YEL = '#E4D408';
const st = StyleSheet.create({
 
  
  // FORM
  form: { padding:20, paddingBottom:40 },
  dateButton: {
    backgroundColor:'#333',
    paddingVertical:12,
    borderRadius:8,
    alignItems:'center',
    marginBottom:16,
  },
  dateButtonText: {
    color:'#FFF',
    fontSize:16,
    fontWeight:'600',
  },

    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',  // push chips to the right
      padding: 12,
    },
  
    info: {
      flexShrink: 1,    // allows title/meta to yield space
      marginRight: 12,   // little gap between info & chips
    },
  
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',  // wrap extra chips onto the next line
      maxWidth: width * 0.4,  // optional: prevent chips growing too wide
    },
  
    chip: {
      backgroundColor: '#444',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginLeft: 6,
      marginBottom: 4,   // space when wrapping onto second row
    },
    chipTxt: {
      color: TXT,
      fontSize: 12,
    },
    wrap:{ flex:1, backgroundColor:BG },
    top:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingVertical:12 },
    backBtn:{ flexDirection:'row', alignItems:'center' },
    backIcon:{ color:YEL, fontSize:22, fontWeight:'700', marginRight:4, top:-1 },
    backTxt:{ color:YEL, fontSize:16, fontWeight:'600' },
    title:{ color:TXT, fontSize:22, fontWeight:'700' },
    filter:{ color:YEL, fontSize:14, fontWeight:'600' },
  
    pic:{ width:48, height:48, borderRadius:8, marginRight:12 },
    badgeRow:{ flexDirection:'row', flexWrap:'wrap' },
    badge:{ backgroundColor:'#444', borderRadius:10, paddingHorizontal:8, paddingVertical:4, marginRight:6, marginBottom:4 },
    badgeTxt:{ color:TXT, fontSize:12 },
    badge_first:{ backgroundColor:'#444', borderRadius:10, paddingHorizontal:12, paddingVertical:10, marginRight:180, marginBottom:4 },
    badgeTxt_first:{ color:TXT, fontSize:15 },
    bird:{ color:TXT, fontSize:16, fontWeight:'600' },
    meta:{ fontSize:12, marginTop:2 },
    sep:{ height:1, backgroundColor:DIV, marginHorizontal:20 },
  
    empty:{ flex:1, justifyContent:'center', alignItems:'center' },
    mira:{ width:200, height:200 },
    bubbleWrap:{ alignItems:'center', position:'absolute', top:'23%' },
    bubble:{ backgroundColor:'#FFF', borderRadius:16, padding:16, maxWidth:width*0.8 },
    bubbleTxt:{ color:'#000', fontSize:14 },
    bubbleTail:{ width:0, height:0, borderLeftWidth:12, borderRightWidth:12, borderTopWidth:14, borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor:'#FFF' },
  
    addBtn:{ backgroundColor:YEL, borderRadius:14, margin:20, paddingVertical:18, alignItems:'center' },
    addTxt:{ fontWeight:'700', fontSize:16, color:'#000' },
  
    backdrop:{ flex:1, backgroundColor:'#0007' },
    sheet:{ backgroundColor:'#2E2E2E', paddingBottom:20, borderTopLeftRadius:20, borderTopRightRadius:20 },
    sheetHandle:{ width:40, height:4, borderRadius:2, backgroundColor:'#666', alignSelf:'center', marginTop:8 },
    sheetHead:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, marginTop:8 },
    cancel:{ color:TXT, fontSize:26, lineHeight:26 },
    done:{ color:YEL, fontWeight:'700', fontSize:16 },
    sheetTitle:{ color:TXT, fontSize:14 },
  
    chipWrap:{ flexDirection:'row', flexWrap:'wrap', paddingHorizontal:16, paddingVertical:12 },
    
    chipActive:{ borderWidth:2, borderColor:YEL },
    
    chipTxtActive:{ color:YEL, fontWeight:'600' },
  
    form:{ padding:20, paddingBottom:40 },
    dateText:{ color:TXT, alignSelf:'center', marginVertical:8 },
    photoPicker:{ width:100, height:100, backgroundColor:'#333', borderRadius:8, justifyContent:'center', alignItems:'center', marginBottom:20 },
    cameraIcon:{ width:48, height:48, tintColor:'#777' },
    photoThumb:{ width:100, height:100, borderRadius:8 },
    input:{ backgroundColor:'#333', borderRadius:8, color:TXT, paddingHorizontal:12, paddingVertical:10, marginBottom:12 },
    section:{ color:TXT, fontWeight:'600' },
  
    doneBtn:{ backgroundColor:YEL, borderRadius:14, paddingVertical:18, alignItems:'center', marginTop:32 },
    doneBtnDisabled:{ backgroundColor:'#555' },
    doneTxt:{ fontWeight:'700', fontSize:16, color:'#000' },
  
    hero:{ width:'100%', height:250, borderRadius:8 },
    pad:{ padding:20 },
    h2:{ color:TXT, fontSize:26, fontWeight:'700', marginVertical:4 },
    label:{ color:TXT, marginTop:16, fontSize:13 },
    value:{ color:TXT, fontSize:15, marginTop:4 },
  
    actionRow:{ flexDirection:'row', padding:20 },
    btnEdit:{ flex:1, borderRadius:8, paddingVertical:16, alignItems:'center', marginRight:8 },
    btnEditTxt:{ color:'#FFF', fontWeight:'700' },
    btnDel:{ flex:1, borderRadius:8, paddingVertical:16, alignItems:'center' },
    btnDelTxt:{ color:'#FFF', fontWeight:'700' },
  }); 
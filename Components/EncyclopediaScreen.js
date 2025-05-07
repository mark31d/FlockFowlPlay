// src/Components/EncyclopediaScreen.js
import React, {useState, useEffect} from 'react';
import { View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBirds} from './BirdContext';
import AudioPlayer from './AudioPlayerTrack';
import {useRoute} from '@react-navigation/native';
import { usePlaylist } from '../Components/PlaylistContext';
/* ─── UI constants ───────────────────────────────────── */
const {width} = Dimensions.get('window');
const BG   = '#262628';
const TXT  = '#FFFFFF';
const NOTE = '#AAAAAA';
const DIV  = '#373737';
const TAG  = '#444444';
const YEL  = '#E4D408';
const CELL = 64;

/* ─── Demo playlist ──────────────────────────────────── */
const PLAYLIST = [
  {id:'trk1',title:'Cossack Blackbird',img:require('../assets/CossackBlackbird.png'),
   src:require('../assets/blackbird_singing.mp3')},
  {id:'trk2',title:'Dove',img:require('../assets/Dove.png'),
   src:require('../assets/owl.mp3')},
  {id:'trk3',title:'Grey owl',img:require('../assets/Grey_Owl.png'),
   src:require('../assets/dove.mp3')},
  {id:'trk4',title:'Korostel',img:require('../assets/Korostel.png'),
   src:require('../assets/korostel.mp3')},
  {id:'trk5',title:'Oriole',img:require('../assets/Oriole.png'),
   src:require('../assets/oriole.mp3')},
];

/* ─── Main screen ────────────────────────────────────── */
export default function EncyclopediaScreen({navigation}) {
  const { addToPlaylist } = usePlaylist();
  const {birds, observed, toggleObserved} = useBirds();
  const [selected,setSelected] = useState(null);
  const route = useRoute();
  useEffect(()=>{
    if (route.params?.pick) {
      const bird = birds.find(b => b.id === route.params.pick);
      if (bird) setSelected(bird);
    }
  }, [route.params, birds]);
  /* ─── bird list item ─── */
  const renderBird = ({item})=>(
    <>
      <TouchableOpacity style={st.row} onPress={()=>setSelected(item)}>
        <Image source={item.image} style={st.thumb}/>
        <View style={{flex:1}}>
          <Text style={st.name}>{item.name}</Text>
          <View style={st.tagWrap}>
            {item.tags.slice(0,2).map(tag=>(
              <View key={tag} style={st.tag}><Text style={st.tagTxt}>{tag}</Text></View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
      <View style={st.divider}/>
    </>
  );

  /* ─── playlist item ─── */
  const renderTrack = ({ item }) => (
    <View style={st.plCard}>
      <Image source={item.img} style={st.plThumb} />
      <View style={{ flex: 1 }}>
        <View style={st.trHeader}>
          <Text style={st.trTitle}>{item.title}</Text>
          <TouchableOpacity
            onPress={() =>
              addToPlaylist({
                id: item.id,
                name: item.title,
                image: item.img,
                src: item.src,
              })
            }
          >
            <Text style={st.addTxt}>+ Add to playlist</Text>
          </TouchableOpacity>
        </View>
        {/* Здесь можно подставить либо AudioPlayerVideo, либо ваш AudioPlayer */}
        <AudioPlayer src={item.src} />
      </View>
    </View>
  );


  /* ─── Detail overlay ─── */
  const Detail = ({bird})=>(
    <View style={st.detailWrap}>
      {/* Back */}
     

      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={st.detailHead}>
        <TouchableOpacity style={st.backBtn}  onPress={()=>{
    if (route.params?.pick) {
      // пришли из Observed → вернуться обратно
      navigation.goBack();
    } else {
      // открыли из списка → просто закрыть карточку
      setSelected(null);
    }
  }}
 >
          <Text style={st.backIcon}>‹</Text>
          <Text style={st.backTxt}>Back</Text>
        </TouchableOpacity>
      </View>
        <Image source={bird.image} style={st.hero} resizeMode="cover" />

        <View style={st.pad}>
          {/* tags */}
          <View style={st.tagWrap}>
            {bird.tags.map(t=>(
              <View key={t} style={[st.tag,{marginBottom:8}]}>
                <Text style={st.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>

          {/* title */}
          <Text style={st.h2}>{bird.name}</Text>

          {/* info */}
          <Text style={st.label}>Range</Text>
          <Text style={st.value}>{bird.range}</Text>

          <Text style={st.label}>Behavioral traits</Text>
          <Text style={st.value}>{bird.traits}</Text>
           
          {!!bird.tagsplays?.length && (
            <View style={st.tagWrap}>
              {bird.tagsplays.map(t=>(
                <View key={t} style={[st.tag,{marginBottom:8}]}>
                  <Text style={st.tagTxt}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {bird.extraTag && (
            <View style={[st.tag,{alignSelf:'flex-start',marginTop:12}]}>
              <Text style={st.tagTxt}>{bird.extraTag}</Text>
            </View>
          )}

          {/* speech bubble */}
          <View style={st.bubbleWrap}>
            <View style={st.bubble}>
              <Text style={st.bubbleTxt}>{bird.comment}</Text>
            </View>
            <View style={st.bubbleTail}/>
          </View>

          {/* Mira */}
          <Image source={require('../assets/chicken.png')} style={st.mira}/>
         
        </View>
        <TouchableOpacity
        style={[
          st.observeBtn,
          observed.includes(bird.id) && st.observeBtnRemove,
        ]}
        onPress={()=>toggleObserved(bird.id)}
      >
        <Text style={st.observeTxt}>
          {observed.includes(bird.id)
            ? 'Remove from “observed by myself”'
            : 'Observed for myself'}
        </Text>
      </TouchableOpacity>
      </ScrollView>

     
     
    </View>
  );

  /* ─── render ─── */
  return (
    <SafeAreaView style={st.container}>
      <View style={st.header}>
        <Text style={st.h1}>Bird Encyclopedia</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Observed')}>
          <Text style={st.observedLink}>Observed</Text>
        </TouchableOpacity>
      </View>
      <View style={st.divider}/>

      <FlatList
        data={birds}
        keyExtractor={b=>b.id}
        renderItem={renderBird}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <Text style={st.playlistHdr}>Bird playlist</Text>
            <FlatList
              data={PLAYLIST}
              keyExtractor={t=>t.id}
              renderItem={renderTrack}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal:20}}
            />
            <View style={{height:selected?0:32}}/>
          </>
        }
      />

      {selected && <Detail bird={selected}/>}
    </SafeAreaView>
  );
}

/* ─── Styles ─────────────────────────────────────────── */
const st = StyleSheet.create({
  container:{flex:1,backgroundColor:BG},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',
          paddingTop:8,paddingBottom:12,paddingHorizontal:20},
  h1:{color:TXT,fontSize:28,fontWeight:'700'},
  observedLink:{color:YEL,fontSize:14,fontWeight:'600' , top:-5,},

  /* list */
  row:{flexDirection:'row',paddingHorizontal:20,paddingVertical:20},
  thumb:{width:CELL,height:CELL,borderRadius:8,marginRight:12},
  name:{color:TXT,fontSize:18,marginBottom:4},
  tagWrap:{flexDirection:'row',flexWrap:'wrap'},
  tag:{backgroundColor:TAG,borderRadius:10,paddingHorizontal:15,paddingVertical:10,marginRight:6},
  tagTxt:{color:TXT,fontSize:15},
  divider:{height:1,backgroundColor:DIV,marginHorizontal:20},

  /* playlist */
  playlistHdr:{color:TXT,fontSize:18,fontWeight:'700',marginTop:24,marginBottom:12,
               marginHorizontal:20},
  plCard:{flexDirection:'row',alignItems:'flex-start',
          paddingVertical:14,marginBottom:8,paddingRight:8},
  plThumb:{width:56,height:56,borderRadius:6,marginRight:12},
  trHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',
            marginBottom:4},
  trTitle:{color:TXT,fontSize:16,fontWeight:'600',flexShrink:1},
  addTxt:{color:YEL,fontSize:12,fontWeight:'700',marginLeft:10},

  /* detail */
  detailWrap:{...StyleSheet.absoluteFillObject,backgroundColor:BG},
  detailHead:{paddingHorizontal:10,paddingTop:30,paddingBottom:10,},
  backBtn:{flexDirection:'row',alignItems:'center',paddingHorizontal:4},
  backIcon:{color:YEL,fontSize:22,fontWeight:'700',marginRight:2,top:-1,},
  backTxt:{color:YEL,fontSize:16,fontWeight:'600'},
  hero:{width:'100%',height:250,borderTopLeftRadius:8,borderTopRightRadius:8},
  pad:{padding:20,paddingTop:16},
  h2:{color:TXT,fontSize:26,fontWeight:'700',marginVertical:4},
  label:{color:NOTE,fontSize:13,marginTop:16},
  value:{color:TXT,fontSize:15,marginTop:2 , marginBottom:10,},

  /* bubble + tail */
  bubbleWrap:{alignSelf:'center',marginTop:24,alignItems:'center'},
  bubble:{backgroundColor:'#FFF',borderRadius:16,padding:16,maxWidth:width*0.8},
  bubbleTxt:{color:'#000',fontSize:14,lineHeight:20},
  bubbleTail:{width:0,height:0,borderLeftWidth:12,borderRightWidth:12,
              borderTopWidth:14,borderLeftColor:'transparent',
              borderRightColor:'transparent',borderTopColor:'#FFF'},

  /* Mira */
  mira:{width:250,height:250,alignSelf:'center',marginTop:-4},
  miraLabel:{backgroundColor:'#333',borderRadius:4,alignSelf:'center',
             paddingHorizontal:8,paddingVertical:2,marginTop:2},
  miraLabelTxt:{color:'#FFF',fontSize:10},

  /* observed button */
  observeBtn:{backgroundColor:YEL,borderRadius:14,margin:20,paddingVertical:18,
              alignItems:'center'},
  observeBtnRemove:{backgroundColor:'#E40808'},
  observeTxt:{fontWeight:'700',fontSize:16,color:'#fff'},
});

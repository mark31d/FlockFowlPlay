// src/Components/ObservedScreen.js
import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useBirds} from '../Components/BirdContext';

export default function ObservedScreen({navigation}) {
  const {birds, observed} = useBirds();
  const data = birds.filter(b => observed.includes(b.id));

  /* ----- row renderer ----- */
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={s.row}
      onPress={() =>
        navigation.navigate('Tabs', {
          screen: 'Encyclopedia',
          params: {pick: item.id},
        })
      }
    >
      <Image source={item.image} style={s.thumb}/>
      <View style={{flex:1}}>
        <Text style={s.name}>{item.name}</Text>
        <View style={s.line}/>
      </View>
      {!!item.tags[0] && (
        <View style={s.tag}><Text style={s.tagTxt}>{item.tags[0]}</Text></View>
      )}
    </TouchableOpacity>
  );

  /* ----- render ----- */
  return (
    <SafeAreaView style={s.container}>
      {/* header with back */}
      <View style={s.head}>
        <TouchableOpacity style={s.backBtn} onPress={()=>navigation.goBack()}>
          <Text style={s.backIcon}>‹</Text>
          <Text style={s.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={s.h1}>Observed for myself</Text>
      </View>

      {data.length === 0 ? (
        <View style={s.empty}>
          <Image source={require('../assets/chicken.png')} style={s.mira}/>
          {/* speech bubble */}
          <View style={s.speechWrap}>
            <View style={s.speech}>
              <Text style={s.speechTxt}>
                You don’t have any marked birds yet :(
              </Text>
            </View>
            <View style={s.speechTail}/>
          </View>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal:16, paddingTop:8}}
        />
      )}
    </SafeAreaView>
  );
}

/* ----- styles ----- */
const BG='#262628',TXT='#FFFFFF',YEL='#E4D408';
const s = StyleSheet.create({
  container:{flex:1,backgroundColor:BG},

  /* header */
  head:{flexDirection:'row',alignItems:'center',padding:12},
  backBtn:{flexDirection:'row',alignItems:'center',marginRight:12},
  backIcon:{color:YEL,fontSize:22,fontWeight:'700',marginRight:2,top:-1},
  backTxt:{color:YEL,fontSize:16,fontWeight:'600'},
  h1:{color:TXT,fontSize:20,fontWeight:'700'},

  /* list row */
  row:{flexDirection:'row',alignItems:'center',marginBottom:16},
  thumb:{width:56,height:56,borderRadius:8,marginRight:12},
  name:{color:TXT,fontSize:16,marginBottom:4},
  line:{height:1,backgroundColor:'#333'},
  tag:{backgroundColor:'#444',borderRadius:10,paddingHorizontal:8,paddingVertical:2},
  tagTxt:{color:'#FFF',fontSize:12},

  /* empty state */
  empty:{flex:1,alignItems:'center',justifyContent:'center'},
  mira:{width:200,height:200 , marginTop:30,},

  /* bubble */
  speechWrap:{position:'absolute',top:'25%',left:'12%',alignItems:'center'},
  speech:{backgroundColor:'#FFF',borderRadius:12,padding:14,maxWidth:240},
  speechTail:{width:0,height:0,borderLeftWidth:12,borderRightWidth:12,
              borderTopWidth:14,borderLeftColor:'transparent',
              borderRightColor:'transparent',borderTopColor:'#FFF'},
  speechTxt:{color:'#000',fontSize:14,textAlign:'center'},
});

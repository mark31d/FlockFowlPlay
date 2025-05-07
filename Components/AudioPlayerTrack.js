import React, {useRef, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';

export default function AudioPlayerVideo({src}) {
  const player = useRef(null);

  const [duration,setDuration]   = useState(1);    // сек
  const [position,setPosition]   = useState(0);    // сек
  const [playing, setPlaying]    = useState(false);

  /* ——— callbacks ——— */
  const onLoad = d=>{
    setDuration(d.duration);        // полная длина
  };

  const onProgress = p=>{
    setPosition(p.currentTime);     // каждые 250 мс
  };

  const onEnd = ()=>{
    setPlaying(false);
    setPosition(duration);
  };

  /* ——— helpers ——— */
  const fmt = s=>{
    const m=Math.floor(s/60), sec=Math.floor(s%60);
    return `${m<10?'0'+m:m}:${sec<10?'0'+sec:sec}`;
  };

  /* ——— controls ——— */
  const toggle = ()=>{
    setPlaying(prev=>!prev);
  };

  const seek = sec=>{
    player.current?.seek(sec);
    setPosition(sec);
  };

  /* ——— UI ——— */
  return (
    <View>
      {/* скрытый плеер */}
      <Video
        source={src}
        ref={player}
        paused={!playing}
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        audioOnly      // не создаёт video‑surface
        playInBackground={true}
        progressUpdateInterval={250}
        ignoreSilentSwitch="ignore"
      />

      {/* кастомный интерфейс */}
      <View style={st.row}>
        <TouchableOpacity style={st.btn} onPress={toggle}>
          <Text style={st.icon}>{playing ? '❚❚' : '▶︎'}</Text>
        </TouchableOpacity>

        <Slider
          style={st.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seek}
          thumbImage={require('../assets/thumb.png')}
          minimumTrackTintColor="#E4D408"
          maximumTrackTintColor="#555"
        />
      </View>
      <Text style={st.time}>{fmt(position)}</Text>
    </View>
  );
}

/* ——— styles ——— */
const BTN=34;
const st = StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center'},
  btn:{width:BTN,height:BTN,borderRadius:BTN/2,backgroundColor:'#FFF',
       justifyContent:'center',alignItems:'center',marginRight:12},
  icon:{fontSize:17,fontWeight:'700'},
  slider:{flex:1,height:22},
  time:{alignSelf:'flex-end',color:'#FFFFFF',fontSize:12,marginTop:2},
});

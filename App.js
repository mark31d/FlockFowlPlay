import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* ------------- контекст ------------- */
import { BirdProvider } from './Components/BirdContext';

/* ------------- экраны --------------- */
import Loader             from './Components/Loader';
import EncyclopediaScreen from './Components/EncyclopediaScreen';
import ObservedScreen     from './Components/ObservedScreen';
import JournalScreen      from './Components/JournalScreen';
import CollectionScreen   from './Components/CollectionScreen';
import MiniGameScreen     from './Components/MiniGameScreen';
import SettingsScreen     from './Components/SettingsScreen';
import CustomTabBar       from './Components/CustomTabBar';
import { PlaylistProvider } from './Components/PlaylistContext';
import { CollectionProvider } from './Components/CollectionContext';
/* ---------- навигация --------------- */
const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Encyclopedia"
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Encyclopedia" component={EncyclopediaScreen} />
      <Tab.Screen name="Journal"      component={JournalScreen} />
      <Tab.Screen name="Collection"   component={CollectionScreen} />
      <Tab.Screen name="Game"         component={MiniGameScreen} />
      <Tab.Screen name="Settings"     component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loaderEnded, setLoaderEnded] = useState(false);

  return (
    
    <PlaylistProvider>
    <BirdProvider>
    <CollectionProvider>
      <NavigationContainer>
        {!loaderEnded ? (
          <Loader onEnd={() => setLoaderEnded(true)} />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs"     component={BottomTabs} />
            <Stack.Screen name="Observed" component={ObservedScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
      </CollectionProvider>
    </BirdProvider>
    </PlaylistProvider>
  );
}

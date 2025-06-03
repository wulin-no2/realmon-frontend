// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import HomeScreen from '../screens/HomeScreen';
// import ScannerScreen from '../screens/ScannerScreen';
// import QuestScreen from '../screens/QuestScreen';
// import MyScreen from '../screens/MyScreen';
// import MessagesScreen from '../screens/MessagesScreen';
// import CommunityScreen from '../screens/CommunityScreen';
// import RealmonDetailScreen from '../screens/RealmonDetailScreen';
// import RealmonDexScreen from '../screens/RealmonDexScreen';

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {/* Home page: full screen, no header */}
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ headerShown: false }}
//         />

//         {/* All other pages: header shown with default title and back */}
//         <Stack.Screen
//           name="Realmon"
//           component={RealmonDexScreen}
//           options={{ title: 'RealMon Dex' }}
//         />
//         <Stack.Screen
//           name="Scan"
//           component={ScannerScreen}
//           options={{ title: 'Scan RealMon' }}
//         />
//         <Stack.Screen
//           name="Quest"
//           component={QuestScreen}
//           options={{ title: 'Daily Quests' }}
//         />
//         <Stack.Screen
//           name="My"
//           component={MyScreen}
//           options={{ title: 'My Profile' }}
//         />
//         <Stack.Screen
//           name="Messages"
//           component={MessagesScreen}
//           options={{ title: 'Messages' }}
//         />
//         <Stack.Screen
//           name="Community"
//           component={CommunityScreen}
//           options={{ title: 'Community' }}
//         />
//         <Stack.Screen
//           name="RealmonDetail"
//           component={RealmonDetailScreen}
//           options={{ title: 'Realmon Details' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import CommunityScreen from "../screens/CommunityScreen";
import HomeScreen from "../screens/HomeScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MyScreen from "../screens/MyScreen";
import QuestScreen from "../screens/QuestScreen";
import RealmonDetailScreen from "../screens/RealmonDetailScreen";
import RealmonDexScreen from "../screens/RealmonDexScreen";
import ScannerScreen from "../screens/ScannerScreen";

export type RootStackParamList = {
  Home: undefined;
  Realmon: undefined;
  Scan: undefined;
  Quest: undefined;
  My: undefined;
  Messages: undefined;
  Community: undefined;
  RealmonDetail: {
    id: number | null;
    latitude: number;
    longitude: number;
    timestamp: string;
    imageUrl: string;
    source: string;
    speciesName: string;
    scientificName: string;
    speciesIcon: string;
    category: string;
    observerName: string;
    wikiUrl: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Realmon"
          component={RealmonDexScreen}
          options={{ title: "RealMon Dex" }}
        />
        <Stack.Screen
          name="Scan"
          component={ScannerScreen}
          options={{ title: "Scan RealMon" }}
        />
        <Stack.Screen
          name="Quest"
          component={QuestScreen}
          options={{ title: "Daily Quests" }}
        />
        <Stack.Screen
          name="My"
          component={MyScreen}
          options={{ title: "My Profile" }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ title: "Messages" }}
        />
        <Stack.Screen
          name="Community"
          component={CommunityScreen}
          options={{ title: "Community" }}
        />
        <Stack.Screen
          name="RealmonDetail"
          component={RealmonDetailScreen}
          options={{ title: "Realmon Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

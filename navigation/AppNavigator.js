import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ScannerScreen from '../screens/ScannerScreen';
import QuestScreen from '../screens/QuestScreen';
import MyScreen from '../screens/MyScreen';
import MessagesScreen from '../screens/MessagesScreen';
import CommunityScreen from '../screens/CommunityScreen';
import RealmonDetailScreen from '../screens/RealmonDetailScreen';
import RealmonDexScreen from '../screens/RealmonDexScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Home page: full screen, no header */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* All other pages: header shown with default title and back */}
        <Stack.Screen
          name="Realmon"
          component={RealmonDexScreen}
          options={{ title: 'RealMon Dex' }}
        />
        <Stack.Screen
          name="Scan"
          component={ScannerScreen}
          options={{ title: 'Scan RealMon' }}
        />
        <Stack.Screen
          name="Quest"
          component={QuestScreen}
          options={{ title: 'Daily Quests' }}
        />
        <Stack.Screen
          name="My"
          component={MyScreen}
          options={{ title: 'My Profile' }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ title: 'Messages' }}
        />
        <Stack.Screen
          name="Community"
          component={CommunityScreen}
          options={{ title: 'Community' }}
        />
        <Stack.Screen
          name="RealmonDetail"
          component={RealmonDetailScreen}
          options={{ title: 'Realmon Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

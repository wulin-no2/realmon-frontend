// import React from 'react';
// import AppNavigator from './navigation/AppNavigator';

// export default function App() {
//   return <AppNavigator />;
// }


// App.tsx
import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainerRef } from '@react-navigation/native';

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    })();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked!');
      navigationRef.current?.navigate('Messages');
    });

    return () => subscription.remove();
  }, []);

  return <AppNavigator ref={navigationRef} />;
}

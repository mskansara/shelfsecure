import Navigation from './src/components/Navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { sendPushNotification, registerForPushNotificationsAsync, checkExpiredProducts } from './src/api';




export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  let notificationTriggeredToday = false
  Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
  }); 
  const sendNotification = async () => {
    if(notificationTriggeredToday === false) {
      const fetchExpiredProducts = await checkExpiredProducts();
      if (fetchExpiredProducts) {
        await sendPushNotification(expoPushToken);
        
      }
    }
    notificationTriggeredToday = true;
    console.log('In sendNotification function - ', notificationTriggeredToday);
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    console.log(expoPushToken)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
    });
    // sendNotification();
    const interval = setInterval(() => {
      notificationTriggeredToday = false;
      sendNotification();
      console.log('In set interval - ', notificationTriggeredToday)
    }, 10000);
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      clearInterval(interval);
    };
  }, []);


  return (
    <Navigation/>
  );
}



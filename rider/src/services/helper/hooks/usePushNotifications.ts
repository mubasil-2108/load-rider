
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { pushNotification } from '../../../store/notificationSlice';
import { Toast } from 'toastify-react-native';
import axios from 'axios';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function sendPushNotification(expoPushToken: string, formData: any) {
    console.log(expoPushToken, 'Expo Push Token');
    console.log(formData, 'Form Data');
    if (!expoPushToken) {
        console.warn('Expo Push Token is missing!');
        return;
    }
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Load Rider',
        body: 'You have a new message',
        data: formData,
    };
    console.log(message, 'Message');
    const response = await axios.post('https://exp.host/--/api/v2/push/send',
        message,
        {
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
        }
    )
    console.log(response?.config?.data, 'Push Notification');

}



function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export const usePushNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return {
        expoPushToken,
        notification,
    }
}



// import * as Notifications from 'expo-notifications';
// import * as Device from "expo-device";
// import Constants from "expo-constants";
// import { useEffect, useRef, useState } from 'react';
// import { Platform } from 'react-native';

// export interface PushNotificationState {
//     notification?: Notifications.Notification;
//     expoPushToken?: Notifications.ExpoPushToken;
// }

// export const usePushNotifications = () : PushNotificationState =>{
//     Notifications.setNotificationHandler({
//         handleNotification: async () => ({
//             shouldShowAlert: true,
//             shouldPlaySound: true,
//             shouldSetBadge: false,
//         }),
//     })

//     const [expoPushToken, setExpoPushToken] = useState<
//     Notifications.ExpoPushToken | undefined
//     >();

//     const [notification, setNotification] = useState<
//     Notifications.Notification | undefined
//     >();

//     const notificationListener = useRef<Notifications.Subscription>();
//     const responseListener = useRef<Notifications.Subscription>();

//     async function registerForPushNotificationsAsync() {
//         let token;

//         if(Device.isDevice){
//             const {status: existingStatus} = await Notifications.getPermissionsAsync();
//             let finalStatus = existingStatus;

//             if(existingStatus !== 'granted'){
//                 const {status} = await Notifications.requestPermissionsAsync();
//                 finalStatus = status;
//             }

//             if(finalStatus !== 'granted'){
//                 alert('Failed to get push token for push notification!');
//             }

//             token = await Notifications.getExpoPushTokenAsync({
//                 projectId: Constants.expoConfig?.extra?.eas?.projectId,
//             })

//             if(Platform.OS === 'android'){
//                 Notifications.setNotificationChannelAsync('default', {
//                   name: 'default',
//                   importance: Notifications.AndroidImportance.MAX,
//                   vibrationPattern: [0, 250, 250, 250],
//                   lightColor: '#FF231F7C',
//                 })
//             }
//             return token;

//         }else{
//             console.log('Must use physical device for Push Notifications');
//         }
//     }

//     useEffect(()=>{
//         registerForPushNotificationsAsync().then((token)=>{
//             setExpoPushToken(token);
//         });

//         notificationListener.current =
//             Notifications.addNotificationReceivedListener((notification)=>{
//                 setNotification(notification);
//             })

//             responseListener.current =
//             Notifications.addNotificationResponseReceivedListener(response => {
//                 console.log(response);
//             })

//             return ()=>{
//                 Notifications.removeNotificationSubscription(
//                     notificationListener.current!
//                 )

//                 Notifications.removeNotificationSubscription(
//                     responseListener.current!
//                 )
//             }
//     },[])

//     return{
//         expoPushToken,
//         notification
//     }
// }
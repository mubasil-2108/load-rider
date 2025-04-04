import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Spacer from '../../../components/spacer'
import { Appbar, Divider } from 'react-native-paper'
import { fontSizes, sizes, usePushNotifications } from '../../../services'
import { Notification, Scrollviews } from '../../../components'


const NotificationsList = (props) => {
    const { goBack, navigate } = props.navigation;
    const params = props.route?.params || {};

    const [notificationList, setNotificationList] = useState([]);
    useEffect(() => {
        if (params && Object.keys(params).length > 0) {
            setNotificationList(prevList => {
                // Avoid duplicates by checking if the notification already exists
                const isDuplicate = prevList.some(notif => notif?.id === params?.id);
                if (!isDuplicate) {
                    return [...prevList, params];
                }
                return prevList;
            });
        }
    }, [params]);

    console.log(notificationList, 'Notification List ')
    console.log(notificationList[0]?.request?.content?.data, 'Notification List Data')
    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <StatusBar animated={true} style='dark' backgroundColor="#fff" translucent={true} />
            {/* <Spacer isStatusBarHeigt /> */}
            <Appbar.Header mode='center-aligned' style={{
                columnGap: 3,
                shadowColor: '#000',  // Shadow color for iOS
                shadowOffset: { width: 0, height: 4 }, // Shadow direction and distance
                shadowOpacity: 0.3,  // Shadow transparency
                shadowRadius: 4,  // Blur effect
                elevation: 5,  // Shadow for Android
            }} statusBarHeight={sizes.statusBarHeight}>
                <Appbar.BackAction onPress={() => goBack()} iconColor='#000' size={sizes.icons.medium} />
                <Appbar.Content title="Account" titleStyle={{ fontSize: fontSizes.h6, fontWeight: 'bold', color: '#000' }} />
            </Appbar.Header>
            <Scrollviews.KeyboardAvoiding animation persistTaps={'handled'} contentContainerStyle={{ flexGrow: 1 }}>
                <Spacer isSmall />

                {
                    notificationList && notificationList.length > 0 ?
                        notificationList.map((notification, index) => (
                            <Notification.NotificationTile key={index} params={notification} navigate={()=>navigate('NotificationScreen', notificationList[index]?.request?.content?.data)} />
                        ))
                        :
                        null
                }
            </Scrollviews.KeyboardAvoiding>
        </View>
    )
}

export default NotificationsList
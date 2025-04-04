import { View, } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Appbar, Avatar, Text } from 'react-native-paper';
import { fontSizes, sizes } from '../../../services';
import { Scrollviews } from '../../../components';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        // color += `00${value.toString(16)}`.slice(-2);
        color += ('00' + value.toString(16)).slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    const nameParts = name.split(' ');
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        // children: nameParts.length > 1
        //     ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
        //     : `${nameParts[0][0]}`,
        children: nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[1][0]}`
            : `${nameParts[0][0]}`
    };
}

const NotificationScreen = (props) => {
    const { goBack } = props.navigation;
    const params = props.route?.params || {};
    console.log(params, 'params');
    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <StatusBar animated={true} style='dark' backgroundColor="#fff" translucent={true} />
            {/* <Spacer isStatusBarHeigt /> */}
            <Appbar.Header style={{
                // columnGap: 2,
                shadowColor: '#000',  // Shadow color for iOS
                shadowOffset: { width: 0, height: 4 }, // Shadow direction and distance
                shadowOpacity: 0.3,  // Shadow transparency
                shadowRadius: 4,  // Blur effect
                elevation: 5,  // Shadow for Android
            }} statusBarHeight={sizes.statusBarHeight}>
                <Appbar.BackAction onPress={() => goBack()} iconColor='#000' size={sizes.icons.medium} />
                <Appbar.Action 
                    icon={()=><Avatar.Text label={params && stringAvatar(params?.fullName).children} style={{ backgroundColor: params && stringAvatar(params?.fullName).sx.bgcolor }} labelStyle={{ fontSize: fontSizes.h4, fontWeight: '700', color: '#fff' }} size={sizes.icons.large1} />}
                    size={sizes.icons.large1}
                />
                <Appbar.Content title={params && params?.fullName} titleStyle={{ fontSize: fontSizes.h6, fontWeight: 'bold', color: '#000' }} />
            </Appbar.Header>
            <Scrollviews.KeyboardAvoiding animation persistTaps={'handled'} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ backgroundColor: 'red' }}>
                    {/* <Text>Item</Text> */}
                </View>
            </Scrollviews.KeyboardAvoiding>
        </View>
    )
}

export default NotificationScreen
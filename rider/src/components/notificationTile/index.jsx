import { TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Avatar, Divider, Text } from 'react-native-paper';
import { fontSizes, sizes } from '../../services';
import Spacer from '../spacer';

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

export const NotificationTile = ({ params, navigate }) => {

    // console.log(params, 'Notification 000000');

    const date = new Date(params?.date);
    const options = { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
    return (
        <>
            <TouchableOpacity activeOpacity={0.8} onPress={navigate}>
                <View style={{ flexDirection: 'row', backgroundColor: '#e9eef6', justifyContent: 'space-between', alignItems: 'center', padding: sizes.smallMargin, paddingVertical: sizes.marginVertical }}>
                    <Avatar.Text label={params && stringAvatar(params?.request?.content?.data?.fullName).children} style={{ backgroundColor: params && stringAvatar(params?.request?.content?.data?.fullName).sx.bgcolor }} labelStyle={{ fontSize: fontSizes.h4, fontWeight: '700', color: '#fff' }} size={sizes.icons.large1} />
                    <Spacer horizontal isSmall />
                    <View style={{ flex: 1 }} >
                        <Text style={{ fontSize: fontSizes.h5, color: '#000' }}>{params?.request?.content?.data?.fullName}</Text>
                        <Text style={{ fontSize: fontSizes.medium, color: '#000', opacity: 0.5 }}>New Notification</Text>
                    </View>
                    <Text>{formattedDate}</Text>
                </View>
            </TouchableOpacity>
            <Divider bold style={{ color: '#e9eef6' }} />
        </>
    )
}

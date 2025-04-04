import { Clipboard, View, } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Avatar, Card, DataTable, Divider, Text } from 'react-native-paper'
import { fontSizes, formatPhoneNumber, responsiveWidth, sizes } from '../../services';
import { totalSize } from 'react-native-dimension'
import { Toast } from 'toastify-react-native';

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
const CardComponent = ({data}) => {
    const handleCopyPhoneNumber = () => {
        Clipboard.setString('+92 301 6494843');
        Toast.success('Phone number copied!');
    };
    return (
            <Card elevation={2} style={{ 
                height: sizes.screenHeight / 2, 
                width: responsiveWidth(80), 
                borderRadius: totalSize(5), 
                backgroundColor: '#f6f8fa',
            }}>
                <Avatar.Text 
                    label={stringAvatar(data?.clientName).children} 
                    style={{ 
                        position: 'absolute', 
                        top: -sizes.mediumMargin, 
                        alignSelf: 'center', 
                        backgroundColor: stringAvatar(data?.clientName).sx.bgcolor 
                    }} 
                    labelStyle={{ fontSize: fontSizes.h3, fontWeight: '700', color: '#fff' }} 
                    size={sizes.icons.xxl} 
                />
                <Spacer isDoubleBase />
                <Spacer isMedium />
                <Card.Title 
                    title={data.name} 
                    titleStyle={{ 
                        fontSize: fontSizes.h5, 
                        fontWeight: '700', 
                        color: '#000', 
                        textAlign: 'center' 
                    }} 
                />
                <Text onLongPress={handleCopyPhoneNumber} style={{textAlign:'center',fontSize: fontSizes.medium, color: '#000', fontWeight: 'thin'}}>{formatPhoneNumber(data?.clientPhoneNumber)}</Text>
                <Spacer isBasic />
                <Divider bold horizontalInset />
                <Spacer isBasic />
                <Card.Content style={{ justifyContent: 'center' }}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={{ justifyContent: 'center' }} textStyle={{ fontSize: fontSizes.medium, color: '#000', fontWeight: '700' }}>
                                Items
                            </DataTable.Title>
                            <DataTable.Title style={{ justifyContent: 'center' }} textStyle={{ fontSize: fontSizes.medium, color: '#000', fontWeight: '700' }}>
                                Vehicles
                            </DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row>
                            <DataTable.Cell style={{ justifyContent: 'center' }} textStyle={{ fontSize: fontSizes.medium, color: '#000', fontWeight: '500' }}>
                                {data?.itemsNo}
                            </DataTable.Cell>
                            <DataTable.Cell style={{ justifyContent: 'center' }} textStyle={{ fontSize: fontSizes.medium, color: '#000', fontWeight: '500' }}>
                                {data?.vehicleType}
                            </DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                    <Spacer isBasic />
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        <Text style={{ fontSize: fontSizes.medium, color: '#000', fontWeight: 'bold' }}>Furniture: </Text>
                        <Text style={{ fontSize: fontSizes.medium, color: '#000', fontWeight: '500' }}>{data?.furnitureType?.join(', ')}</Text>
                    </View>
                </Card.Content>
            </Card>
    )
}

export default CardComponent
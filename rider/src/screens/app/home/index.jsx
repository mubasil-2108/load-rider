import { Image, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Spacer from '../../../components/spacer'
import { Scrollviews } from '../../../components'
import { totalSize } from 'react-native-dimension'
import { Appbar, Avatar, Badge, Button, Checkbox, Divider, IconButton, RadioButton, Text, TextInput } from 'react-native-paper'
import { fontSizes, responsiveHeight, sizes, usePushNotifications } from '../../../services'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Toast } from 'toastify-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../../store/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { sendPushNotification } from '../../../services/helper/hooks/usePushNotifications'
import { createBooking } from '../../../store/bookingSlice'
import { getClientProfile } from '../../../store/clientSlice'

const initialState = {
    itemsNo: 0,
    furnitureType: [],
    vehicleType: ''
}

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

const Home = (props) => {
    const { navigate } = props.navigation;
    const { user } = useSelector((state) => state.auth);
    const {clientProfile} = useSelector((state)=> state.client);
    const [formData, setFormData] = useState(initialState);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [iAccountOpen, setIAccountOpen] = useState(false);
    // const {expoPushToken, notification} = usePushNotifications();
    //     const data = JSON.stringify(notification, undefined, 2);
    //     console.log(expoPushToken?.data, 'expoPushToken');   
    //     console.log(data, 'data');
    const { notification } = usePushNotifications();

    const dispatch = useDispatch();

    console.log(user?.fullName, 'user');
    const toggleSelection = (value) => {

        setFormData((prev) => {
            const isSelected = prev.furnitureType.includes(value);
            let updateFurnitureType = [...prev.furnitureType];

            if (isSelected) {
                updateFurnitureType = updateFurnitureType.filter(item => item !== value);
            } else if (updateFurnitureType.length < prev.itemsNo) {
                updateFurnitureType.push(value);
            } else if (updateFurnitureType.length === prev.itemsNo) {
                Toast.error(<><Text style={{ fontSize: fontSizes.regular, }}>You can't select more than {prev.itemsNo} items</Text></>)
                updateFurnitureType = updateFurnitureType.filter(item => item !== value);
            }
            return { ...prev, furnitureType: updateFurnitureType }
        })
    };
useEffect(() => {
        dispatch(getClientProfile(user?.id));
    }, [dispatch, user?.id]);

    // console.log(clientProfile, 'clientProfile');
    const getRecommendation = (vehicle) => {
        console.log(vehicle)
        if (formData.itemsNo > 14 && vehicle === "Truck") return " (Recommended)";
        if (formData.itemsNo > 10 && formData.itemsNo <= 14 && vehicle === "Van") return " (Recommended)";
        if (formData.itemsNo > 5 && formData.itemsNo <= 10 && vehicle === "Car") return " (Recommended)";
        if (formData.itemsNo <= 5 && formData.itemsNo > 0 && vehicle === "Rickshaw") return " (Recommended)";
        return "";
    };

    const handleAccountClick = () => {
        navigate('Account');
        setIAccountOpen((prev) => !prev);
    }

    const handleDropdownClick = async () => {
        dispatch(logoutUser()).then(() => {
            Toast.success(<><Text style={{ fontSize: fontSizes.regular, }}>You have been logged out</Text></>)
            setIAccountOpen((prev) => !prev);
        })
    }
    const handleFormSubmit = async () => {
        // console.log(user?.id,' ',formData, 'Form Data', user?.fullName, ' ', clientProfile?.phoneNumber,' ');
        if(clientProfile?.phoneNumber === null || clientProfile?.phoneNumber === undefined){
            Toast.error(<><Text style={{ fontSize: fontSizes.regular, }}>Please complete your profile first</Text></>)
            return;
        }
        dispatch(createBooking({
            userId: user?.id,
            ...formData,
            clientName: user?.fullName,
            clientPhoneNumber: clientProfile?.phoneNumber
        })).then(async(data) => {
            console.log(data, 'Booking Data');
            if(data?.payload?.success){
                Toast.success(<><Text style={{ fontSize: fontSizes.regular, }}>{data?.payload?.message}</Text></>)
                setFormData(initialState);
                await sendPushNotification('ExponentPushToken[Zf1L7HKejqYFEGBUnHYXfn]',{
                    fullName: user?.fullName,
                    ...formData,
                });
            }
            else{
                Toast.error(<><Text style={{ fontSize: fontSizes.regular, }}>{data?.payload?.message}</Text></>)
            }
        })
    }

    useEffect(() => {
        if (notification) {
            console.log(notification?.request?.content?.data, 'notification');
        }
    }, [notification])
    // console.log(formData, 'furnitureType');
    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <StatusBar animated={true} style='dark' backgroundColor="#fff" translucent={true} />
            <Spacer isStatusBarHeigt />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: sizes.marginHorizontal, paddingTop: sizes.smallMargin }}>
                <Image source={require('../../../../assets/splash-icon.png')}
                    style={{ height: sizes.images.medium, width: sizes.images.medium }}
                />
                <View style={{ flexDirection: 'row', columnGap: sizes.smallMargin, alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <IconButton
                            icon={() => <Icon name="notifications-none" size={sizes.icons.medium} color="#000" />}
                            background={'transparent'}
                            onPress={() => navigate('NotificationsList', notification)}
                        />
                        {
                            notification && (
                                <Badge
                                    size={8}
                                    style={{ position: 'absolute', top: 15, right: 16 }}
                                    visible
                                />
                            )
                        }
                    </View>
                    <TouchableOpacity onPress={() => setIAccountOpen((prev) => !prev)} activeOpacity={0.8} style={{ backgroundColor: 'red', padding: 0, width: sizes.icons.large, borderRadius: 100 }}>
                        <Avatar.Text label={user && stringAvatar(user?.fullName?.toUpperCase()).children} style={{ backgroundColor: user && stringAvatar(user?.fullName?.toUpperCase()).sx.bgcolor }} labelStyle={{ fontSize: fontSizes.medium, fontWeight: '700', color: '#fff' }} size={sizes.icons.large} />
                    </TouchableOpacity>
                </View>
            </View>
            {
                iAccountOpen && (
                    <Animatable.View
                        duration={300} animation={iAccountOpen ? 'fadeIn' : 'fadeOut'}
                        style={{
                            width: '60%', padding: sizes.smallMargin, position: 'absolute', top: '14%', right: 10, zIndex: 1, borderRadius: totalSize(1), backgroundColor: '#fff',
                            borderWidth: 1,
                            shadowColor: '#000',  // Shadow color for iOS
                            shadowOffset: { width: 0, height: 4 }, // Shadow direction and distance
                            shadowOpacity: 0.3,  // Shadow transparency
                            shadowRadius: 4,  // Blur effect
                            elevation: 5,  // Shadow for Android
                        }}>
                        <Spacer isTiny />
                        <Text style={{ fontSize: fontSizes.medium, fontWeight: '700', textAlign: 'center' }}>Hello 👋, {user?.fullName}</Text>
                        <Spacer isSmall />
                        <Divider bold />
                        <Spacer isSmall />
                        <Button icon='account' rippleColor={'transparent'} onPress={handleAccountClick} labelStyle={{ fontSize: fontSizes.medium, fontWeight: '600', color: '#000' }} contentStyle={{ justifyContent: 'flex-start' }}>Account</Button>
                        <Spacer isSmall />
                        <Divider bold />
                        <Spacer isSmall />
                        <Button icon='logout' rippleColor={'transparent'} onPress={handleDropdownClick} labelStyle={{ fontSize: fontSizes.medium, fontWeight: '600', color: '#000' }} contentStyle={{ justifyContent: 'flex-start' }}>Logout</Button>

                    </Animatable.View>
                )
            }

            <Scrollviews.KeyboardAvoiding contentContainerStyle={{ flexGrow: 1 }}>
                <Spacer isMedium />
                <View style={{ paddingHorizontal: sizes.marginHorizontal }}>
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Items No.</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon={() => <Icon name="category" size={20} color="#000" />}
                                color="#000"
                            />
                        }
                        mode='outlined'
                        value={formData.itemsNo}
                        onChangeText={text => setFormData({ ...formData, itemsNo: parseInt(text) || 0 })}
                        keyboardType='numeric'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isMedium />
                    <Text style={{ fontSize: fontSizes.medium, fontWeight: '700' }}>Does this item includes any of the following?</Text>
                    <Spacer isSmall />
                    {["SOFA", "Bed", "Cupboard", "Dinning Table"].map((item, index) => (
                        <Checkbox.Item
                            key={index}
                            label={item}
                            status={formData.furnitureType.includes(item) ? 'checked' : 'unchecked'}
                            onPress={() => toggleSelection(item)}
                            labelStyle={{ fontSize: fontSizes.large, color: '#000' }}
                            color='#000'
                        />
                    ))}
                    <Spacer isSmall />
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Select Vehical</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon={() => <Icon name="train" size={20} color="#000" />}
                                color="#000"
                            />
                        }
                        right={
                            <TextInput.Icon
                                icon={() => <Icon name="expand-more" size={20} color="#000" />}
                                color="#000"
                                onPress={() => setIsDropdownOpen((prev) => !prev)}
                            />
                        }
                        editable={false}
                        mode='outlined'
                        placeholder='Select Vehical'
                        value={formData.vehicleType}
                        keyboardType='numeric'
                        style={{ height: responsiveHeight(7) }}
                    />
                    {
                        isDropdownOpen && (<>
                            <Spacer isSmall />
                            <Animatable.View duration={500} animation={isDropdownOpen ? 'fadeIn' : 'fadeOut'}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: totalSize(2),
                                    borderWidth: 1,
                                    padding: responsiveHeight(2),
                                    shadowColor: '#000',  // Shadow color for iOS
                                    shadowOffset: { width: 0, height: 4 }, // Shadow direction and distance
                                    shadowOpacity: 0.3,  // Shadow transparency
                                    shadowRadius: 4,  // Blur effect
                                    elevation: 5,  // Shadow for Android
                                }}>
                                <RadioButton.Group
                                    value={formData.vehicleType}
                                    onValueChange={newValue => setFormData({ ...formData, vehicleType: newValue })}
                                >
                                    {["Car", "Truck", "Rickshaw", "Van"].map((vehicle, index) => (
                                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: fontSizes.large, color: '#000' }}>
                                                    {vehicle}
                                                </Text>
                                                <Text style={{ fontSize: fontSizes.large, color: 'red', fontWeight: 'bold' }}>
                                                    {getRecommendation(vehicle)}
                                                </Text>
                                            </View>
                                            <RadioButton value={vehicle} color='#000' />
                                        </View>
                                    ))}
                                </RadioButton.Group>
                            </Animatable.View>
                        </>
                        )
                    }
                    <Spacer isMedium />
                    <Button icon='thumb-up' disabled={formData.itemsNo === 0 || formData.furnitureType.length <= 0 || !formData.vehicleType} onPress={handleFormSubmit} mode='contained' buttonColor='#000' contentStyle={{ flexDirection: 'row-reverse' }} style={{ paddingVertical: sizes.TinyMargin, borderRadius: 50 }}>
                        <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#fff" }}>Submit</Text>
                    </Button>
                    <Spacer isSmall />
                </View>
            </Scrollviews.KeyboardAvoiding>
        </View>
    )
}

export default Home
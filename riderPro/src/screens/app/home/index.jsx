import { Image, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Spacer from '../../../components/spacer'
import { CardComponent, Scrollviews } from '../../../components'
import { totalSize } from 'react-native-dimension'
import { Avatar, Badge, Button, Card, DataTable, Divider, IconButton, Text } from 'react-native-paper'
import { fontSizes, responsiveHeight, responsiveWidth, sizes, usePushNotifications } from '../../../services'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-deck-swiper'
import { Toast } from 'toastify-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../../store/authSlice'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { getBookings } from '../../../store/bookingSlice'

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
    const { bookingData } = useSelector((state) => state.booking)
    const [isReady, setIsReady] = useState(false);
    const [allSwiped, setAllSwiped] = useState(false);
    const [iAccountOpen, setIAccountOpen] = useState(false);
    const { expoPushToken, notification } = usePushNotifications();
    // console.log()
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const swiperRef = useRef(null);

    const onSwipedLeft = () => {
        const currentCard = bookingData[index];
        if (!currentCard) return;
        console.log('Rejected:', bookingData[index]);
        Toast.error(`Rejected ${bookingData[index]?.name}`);
        const nextIndex = index + 1;
        if (nextIndex >= bookingData.length) {
            setAllSwiped(true);
        }
        setIndex((nextIndex) % bookingData.length);
    };

    const onSwipedRight = () => {
        const currentCard = bookingData[index];
        if (!currentCard) return;
        console.log('Accepted:', bookingData[index]);
        Toast.success(`Accepted ${bookingData[index]?.name}`);
        const nextIndex = index + 1;
        if (nextIndex >= bookingData.length) {
            setAllSwiped(true);
        }
        setIndex((nextIndex) % bookingData.length);
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

    useEffect(() => {
        if (notification) {
            console.log(notification?.request?.content?.data, 'notification');
        }
    }, [notification])


    useEffect(() => {
        if(notification){
            dispatch(getBookings()).then(() => {
                setAllSwiped(false);
                setIsReady(true)
            });
            return
        }
        dispatch(getBookings()).then(() => {
            setAllSwiped(false);
            setIsReady(true)
        });
        
    }, [dispatch,notification])
    // console.log(bookingData, 'booking')

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
                            zIndex: bookingData.length + 1,
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
            <Spacer isDoubleBase />
            {isReady && Array.isArray(bookingData) && bookingData.length > 0 && !allSwiped ? (
                <Swiper
                    ref={swiperRef}
                    cards={bookingData}
                    cardIndex={index}
                    renderCard={(card) => <CardComponent data={card} />}
                    onSwipedLeft={onSwipedLeft}
                    onSwipedRight={onSwipedRight}
                    stackSize={3}
                    stackScale={10}
                    stackSeparation={20}
                    disableBottomSwipe
                    disableTopSwipe
                    containerStyle={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                        backgroundColor: '#fff',
                        height: sizes.screenHeight / 2,
                        width: responsiveWidth(80),
                        padding: 0,
                        top: 0,
                        left: 0,
                        margin: 0
                    }}
                    cardStyle={{
                        top: 0,
                        left: 0,
                    }}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: fontSizes.h3, fontWeight: "bold", color: "#000" }}>No bookings available</Text>
                </View>
            )}
            <Spacer isMedium />
            <View style={{ flex: 1, paddingBottom: sizes.mediumMargin, justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: 'row' }}>
                <Button disabled={allSwiped} onPress={() => swiperRef?.current?.swipeLeft()} icon={() => <Icon name='thumb-down-alt' size={sizes.icons.medium} color="#fff" />} mode='contained' buttonColor='#000' style={{ zIndex: 2, paddingVertical: sizes.TinyMargin, borderRadius: 50 }}>
                    <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#fff" }}>Reject</Text>
                </Button>
                <Button disabled={allSwiped} onPress={() => swiperRef?.current?.swipeRight()} icon={() => <Icon name='thumb-up-alt' size={sizes.icons.medium} color="#fff" />} mode='contained' buttonColor='#000' style={{ zIndex: 2, paddingVertical: sizes.TinyMargin, borderRadius: 50 }}>
                    <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#fff" }}>Accept</Text>
                </Button>
            </View>
        </View>
    )
}

export default Home
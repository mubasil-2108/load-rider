import { Image, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Appbar, Banner, Button, Modal, Portal, Text, TextInput } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import Spacer from '../../../components/spacer'
import { totalSize } from 'react-native-dimension'
import { fontSizes, responsiveHeight, responsiveWidth, sizes } from '../../../services'
import { Scrollviews } from '../../../components'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { createClientProfile, getClientProfile, sendOTP, updateClientProfile, verifyOTP } from '../../../store/clientSlice'
import { Toast } from 'toastify-react-native'

const initialState = {
    address: '',
    city: '',
    phoneNumber: '',
    postalCode: '',
}

const Account = (props) => {
    const { navigate, goBack } = props.navigation;
    const { user } = useSelector(state => state.auth);
    const { clientProfile } = useSelector(state => state.client);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(initialState);
    const userId = user?.id?.toString();

    const addressRef = useRef(null);
    const cityRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const postalCodeRef = useRef(null);

    const handleCreateClientProfile = () => {
        if (formData.address === '') {
            Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Address is required</Text>);
            addressRef.current?.focus();
            return;
        }
        if (formData.city === '') {
            Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>City is required</Text>);
            cityRef.current?.focus();
            return;
        }
        if (formData.phoneNumber === '') {
            Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Phone number is required</Text>);
            phoneNumberRef.current?.focus();
            return;
        }
        if (formData.postalCode === '') {
            Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Postal code is required</Text>);
            postalCodeRef.current?.focus();
            return;
        }

        dispatch(createClientProfile({
            userId: user?.id,
            fullName: user?.fullName,
            email: user?.email,
            ...formData
        })).then((data) => {
            if (data?.payload?.success) {
                Toast.success(<><Text style={{ fontSize: fontSizes.regular, }}>{data?.payload?.message}</Text></>)
                dispatch(getClientProfile(user?.id));
            } else {
                Toast.error(<><Text style={{ fontSize: fontSizes.regular, }}>{data?.payload?.message}</Text></>)
            }
        })
    }

    useEffect(() => {
        dispatch(getClientProfile(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (clientProfile) {
            setFormData(prevData => ({
                ...prevData,
                address: clientProfile?.address || '',
                city: clientProfile?.city || '',
                phoneNumber: clientProfile?.phoneNumber || '',
                postalCode: clientProfile?.postalCode || ''
            }));
        }
    }, [clientProfile]);

    const handleUpdateClientProfile = () => {
        if (createClientProfile) {
            dispatch(updateClientProfile({
                userId: user?.id,
                ...formData
            })).then((data) => {
                if(data?.payload?.success){
                    Toast.success(<><Text style={{ fontSize: fontSizes.regular, }}>{data?.payload?.message}</Text></>)
                }
                else{
                    Toast.error(<><Text style={{ fontSize: fontSizes.regular, }}>{data?.payload?.message}</Text></>)
                }
            })
        }

    }

    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <StatusBar animated={true} style='dark' backgroundColor="#fff" translucent={true} />
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
            <Scrollviews.KeyboardAvoiding animation persistTaps={'handled'} contentContainerStyle={{ flexGrow: 1, paddingBottom: responsiveHeight(10) }}>
                <Spacer isSmall />
                <Image
                    source={require('../../../../assets/banner.jpg')}
                    style={{ height: '20%', resizeMode: 'cover', width: '100%' }}
                />
                <Spacer isDoubleBase />
                <View style={{ justifyContent: 'center', paddingHorizontal: sizes.marginHorizontal }}>
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Full Name</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon='account'
                                color="#8b8b8b"
                            />
                        }
                        mode='outlined'
                        editable={false}
                        value={user?.fullName}
                        textColor='#8b8b8b'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isSmall />
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Email</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon='email'
                                color="#8b8b8b"
                            />
                        }
                        mode='outlined'
                        editable={false}
                        value={user?.email}
                        textColor='#8b8b8b'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isSmall />
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Phone</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon='phone'
                                color="#000"
                            />
                        }
                        ref={phoneNumberRef}
                        mode='outlined'
                        inputMode='tel'
                        maxLength={11}
                        value={formData.phoneNumber}
                        onChangeText={text => setFormData({ ...formData, phoneNumber: text.toString() })}
                        textColor='#000'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isSmall />
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Address</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon='home'
                                color="#000"
                            />
                        }
                        ref={addressRef}
                        mode='outlined'
                        inputMode='text'
                        value={formData.address}
                        onChangeText={text => setFormData({ ...formData, address: text })}
                        textColor='#000'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isSmall />
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>City</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon={() => <Icon name='location-on' size={sizes.icons.medium} />}
                                color="#000"
                            />
                        }
                        ref={cityRef}
                        mode='outlined'
                        inputMode='text'
                        value={formData.city}
                        onChangeText={text => setFormData({ ...formData, city: text })}
                        textColor='#000'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isSmall />
                    <TextInput
                        label={
                            <Text style={{ fontWeight: "bold", }}>Postal Code</Text>
                        }
                        left={
                            <TextInput.Icon
                                icon={() => <Icon name='pin' size={sizes.icons.medium} />}
                                color="#000"
                            />
                        }
                        ref={postalCodeRef}
                        mode='outlined'
                        maxLength={5}
                        inputMode='numeric'
                        value={formData.postalCode}
                        onChangeText={text => setFormData({ ...formData, postalCode: text.toString() })}
                        textColor='#000'
                        style={{ height: responsiveHeight(7) }}
                    />
                    <Spacer isBasic />
                    <Button icon='check' mode='contained'
                        onPress={()=>{
                            clientProfile? handleUpdateClientProfile() : handleCreateClientProfile()
                        }} buttonColor='#000' contentStyle={{ flexDirection: 'row-reverse', }} style={{ paddingVertical: sizes.TinyMargin, borderRadius: 50 }}>
                        <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#fff" }}>{clientProfile ? 'Update Profile' : 'Confirm'}</Text>
                    </Button>
                    <Spacer isBottomTabBarHeight />
                </View>
            </Scrollviews.KeyboardAvoiding>
        </View>
    )
}

const styles = StyleSheet.create({

    optInputFieldView: {
        borderBottomWidth: 1,
        width: 50,
        justifyContent: 'center'
    },

    optInputField: {
        backgroundColor: '#fff',
        fontSize: fontSizes.h2,
        fontWeight: 'bold'
    }
})

export default Account
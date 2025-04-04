import { ImageBackground, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { fontSizes, responsiveHeight, sizes, validateEmail } from '../../../services'
import { StatusBar } from 'expo-status-bar'
import { Button, Icon, Text, TextInput } from 'react-native-paper'
import Spacer from '../../../components/spacer'
import { LinearGradient } from 'expo-linear-gradient'
import { Scrollviews } from '../../../components'
import useKeyboardStatus from '../../../services/helper/hooks/useKeyboardStatus'
import { Toast } from 'toastify-react-native'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../../store/authSlice'

const initialState = {
  email: '',
  password: ''
}

const Login = (props) => {
  const { navigate, replace } = props.navigation;
  const [formData, setFormData] = useState(initialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { user, userRole } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async () => {

    if (formData.email === '') {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Email is required</Text>);
      emailRef.current?.focus();
      return;
    }

    if (formData.password === '') {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Password is required</Text>);
      passwordRef.current?.focus();
      return;
    }

    if (!validateEmail(formData.email)) {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Invalid email address</Text>);
      emailRef.current?.focus();
      return;
    }
    if (userRole?.role === 'user'){
      dispatch(loginUser(formData)).then((data) => {
        if (data?.payload?.success) {
          Toast.success(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>{data?.payload?.message}</Text>);
          setFormData(initialState);
          // replace('Home');
        } else {
          Toast.success(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>{data?.payload?.message}</Text>);
        }
      })
    }else{
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>You are not a user</Text>);
    }
      
    // goBack();
  }
  // useEffect(()=>{
  //   if(user){
  //     replace('Home');
  //   }
  // },[user])
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require("../../../../assets/backgroundImage.jpg")}>
        <StatusBar animated={true} style='dark' backgroundColor="transparent" translucent={true} />
        <Spacer isStatusBarHeigt />
        <Scrollviews.KeyboardAvoiding animation persistTaps={'handled'} contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient
            colors={['transparent', '#fff', '#fff']} // Customize gradient colors
            style={{ flex: 1 }}
            start={{ x: 0.2, y: 0.2 }}
          >
            <Spacer height={responsiveHeight(50)} />
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: sizes.marginHorizontal }}>
              <Text style={{ color: "#000", fontWeight: "bold", textAlign: 'center', fontSize: fontSizes.h1 }}>Login</Text>
              <Spacer isBasic />
              <TextInput
                label={
                  <Text style={{ fontWeight: "bold", }}>Email</Text>
                }
                left={
                  <TextInput.Icon
                    icon='email'
                    color="#000"
                  />
                }
                ref={emailRef}
                mode='outlined'
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                style={{ height: responsiveHeight(7) }}
              />
              <Spacer isSmall />
              <TextInput
                label={
                  <Text style={{ fontWeight: "bold", }}>Password</Text>
                }
                mode='outlined'
                secureTextEntry={isPasswordVisible}
                left={
                  <TextInput.Icon
                    icon='key'
                    color="#000"
                  />
                }
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    color="#000"
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                }
                ref={passwordRef}
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                style={{ height: responsiveHeight(7) }}
              />
              <Spacer isBasic />
              <Button icon='login' mode='contained' onPress={handleLogin} buttonColor='#000' style={{ paddingVertical: sizes.TinyMargin, borderRadius: 50 }}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#fff" }}>Login</Text>
              </Button>
              <Spacer isBasic />
              <Button mode='text' style={{ paddingHorizontal: 0 }} onPress={() => navigate('Register')}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#000" }}>Don't have an account?</Text>
              </Button>
              <Spacer isMedium />
            </View>
          </LinearGradient>
        </Scrollviews.KeyboardAvoiding>
      </ImageBackground>
    </View>
  )
}

export default Login
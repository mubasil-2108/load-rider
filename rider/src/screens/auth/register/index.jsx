import { ImageBackground, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Spacer from '../../../components/spacer';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Scrollviews } from '../../../components';
import { Button, Text, TextInput } from 'react-native-paper';
import { fontSizes, responsiveHeight, sizes, validateEmail } from '../../../services';
import { useDispatch } from 'react-redux';
import { Toast } from 'toastify-react-native';
import { registerUser } from '../../../store/authSlice';

const initialState ={
  fullName: '',
  email: '',
  password: '',
}

const Register = (props) => {
  const { navigate, goBack } = props.navigation;
 const [formData, setFormData] = useState(initialState);
 const [confirmPassword, setConfirmPassword] = useState('');
 const [isPasswordVisible, setIsPasswordVisible] = useState(false);
 const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
 const dispatch = useDispatch();

 const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleRegister = () => {
    if (formData.fullName === '') {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Full Name is required</Text>);
      nameRef.current?.focus();
      return;
    }

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

    if (confirmPassword === '') {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Confirm Password is required</Text>);
      confirmPasswordRef.current?.focus();
      return;
    }

    if (formData.password !== confirmPassword) {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Passwords do not match</Text>);
      confirmPasswordRef.current?.focus();
      return;
    }

    if (!validateEmail(formData.email)) {
      Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>Invalid email address</Text>);
      emailRef.current?.focus();
      return;
    }

    dispatch(registerUser({
      role: 'user',
      ...formData
    })).then((data)=>{
      console.log(data, 'register Data');
      if(data?.payload?.success){
        Toast.success(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>{data?.payload?.message}</Text>);
        setFormData(initialState);
        setConfirmPassword('');
        goBack();
      }else{
        Toast.error(<Text style={{ fontSize: fontSizes.small, fontWeight: '600' }}>{data?.payload?.message}</Text>);
      }
    })
    // goBack();
  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require("../../../../assets/backgroundImage.jpg")}>
        <StatusBar animated={true} style='dark' backgroundColor="transparent" translucent={true} />
        <Spacer isStatusBarHeigt />
        <Scrollviews.KeyboardAvoiding animation persistTaps={'handled'} contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient
            colors={['transparent', '#fff', '#fff']} // Customize gradient colors
            style={{ flex: 1 }}
            start={{ x: 0.2, y: 0 }}
          >
            <Spacer height={responsiveHeight(30)} />
            <View style={{ flex: 1, justifyContent:'flex-end', paddingHorizontal: sizes.marginHorizontal }}>
              <Text style={{ color: "#000", fontWeight: "bold", textAlign: 'center', fontSize: fontSizes.h1 }}>Register</Text>
              <Spacer isBasic />
              <TextInput
                label={
                  <Text style={{ fontWeight: "bold", }}>Full Name</Text>
                }
                left={
                  <TextInput.Icon
                    icon='account'
                    color="#000"
                  />
                }
                ref={nameRef}
                mode='outlined'
                value={formData.fullName}
                onChangeText={text => setFormData({ ...formData, fullName: text })}
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
                    onPress={()=> setIsPasswordVisible(!isPasswordVisible)}
                  />
                }
                ref={passwordRef}
                value={formData.password}
                onChangeText={text => setFormData({ ...formData, password: text })}
                style={{ height: responsiveHeight(7) }}
              />
              <Spacer isSmall />
              <TextInput
                label={
                  <Text style={{ fontWeight: "bold", }}>Confirm Password</Text>
                }
                ref={confirmPasswordRef}
                mode='outlined'
                secureTextEntry={isConfirmPasswordVisible}
                left={
                  <TextInput.Icon
                    icon='key'
                    color="#000"
                  />
                }
                right={
                  <TextInput.Icon
                    icon={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                    color="#000"
                    onPress={()=> setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  />
                }
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                style={{ height: responsiveHeight(7) }}
              />
              <Spacer isBasic />
              <Button onPress={handleRegister} icon='account' mode='contained' buttonColor='#000' style={{ paddingVertical: sizes.TinyMargin, borderRadius: 50 }}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#fff" }}>Register</Text>
              </Button>
              <Spacer isBasic />
              <Button mode='text' style={{ paddingHorizontal: 0 }} onPress={() => goBack()}>
                <Text style={{ fontSize: fontSizes.large, fontWeight: "bold", color: "#000" }}>Already have an account?</Text>
              </Button>
              <Spacer isMedium/>
            </View>
          </LinearGradient>
        </Scrollviews.KeyboardAvoiding>
      </ImageBackground>
    </View>
  )
}

export default Register
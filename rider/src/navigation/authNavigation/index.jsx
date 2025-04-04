import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { Login, Register } from '../../screens/auth';

const AuthStack = createStackNavigator();
const AuthNavigation = () => {
    return (
        <AuthStack.Navigator initialRouteName="Login"
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right'
            }}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Register" component={Register} />
        </AuthStack.Navigator>
    )
}

export default AuthNavigation
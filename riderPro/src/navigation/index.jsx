import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './rootNavigation'
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import CheckAuth from '../components/common'
import { checkAuth } from '../store/authSlice'
import AppNavigation from './appNavigation'
import AuthNavigation from './authNavigation'

const Stack = createStackNavigator();

const Navigation = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={isAuthenticated ? "AppNavigation" : "AuthNavigation"} screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right'
            }}
            >
                {isAuthenticated ? (
                    <Stack.Screen name="AppNavigation" component={AppNavigation} />
                ) : (
                    <Stack.Screen name='AuthNavigation' component={AuthNavigation} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
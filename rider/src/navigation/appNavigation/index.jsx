import { createStackNavigator } from '@react-navigation/stack';
import { Account, Home, NotificationScreen, NotificationsList } from '../../screens/app';

const AppStack = createStackNavigator();

const AppNavigation = () => {
    return (
        <AppStack.Navigator initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                animation: 'slide_from_right'
            }}
        >
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="Account" component={Account} />
            <AppStack.Screen name="NotificationsList" component={NotificationsList} />
            <AppStack.Screen name='NotificationScreen' component={NotificationScreen} />
        </AppStack.Navigator>
    )
}

export default AppNavigation
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import { configureFonts, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store, { persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import ToastManager from 'toastify-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately


SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 1000,
    fadeInOut: true
})

const fontConfig = {
    web: {
        regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
        light: { fontFamily: 'sans-serif-light', fontWeight: 'normal' },
        thin: { fontFamily: 'sans-serif-thin', fontWeight: 'normal' },
        bodySmall: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        bodyLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' }, // ✅ Add this line
        labelLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        titleLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' },
    },
    ios: {
        regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
        light: { fontFamily: 'sans-serif-light', fontWeight: 'normal' },
        thin: { fontFamily: 'sans-serif-thin', fontWeight: 'normal' },
        bodySmall: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        bodyLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' }, // ✅ Add this line
        labelLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        titleLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' },
    },
    android: {
        regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
        light: { fontFamily: 'sans-serif-light', fontWeight: 'normal' },
        thin: { fontFamily: 'sans-serif-thin', fontWeight: 'normal' },
        bodySmall: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        bodyLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' }, // ✅ Add this line
        labelLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' },
        titleLarge: { fontFamily: 'sans-serif', fontWeight: 'normal' },
    },
};

const theme = {
    fonts: configureFonts({ config: fontConfig, isV3: false }),
};

export default function Main() {
    const [appIsReady, setAppIsReady] = useState(false);
    useEffect(() => {
        async function prepare() {
            try {
                // await AsyncStorage.clear();
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        prepare();
    }, [])

    const onLayoutRootView = useCallback(() => {
        if (appIsReady) {
            SplashScreen.hideAsync();
        }
    }, [appIsReady])

    if (!appIsReady) {
        return null;
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider onLayout={onLayoutRootView}>
                    <PaperProvider theme={theme}>
                        <ToastManager showCloseIcon={false} animationIn='fadeInDown' animationOut='fadeOutUp' />
                        <App />
                    </PaperProvider>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>

    );

}

registerRootComponent(Main);

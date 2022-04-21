/**
 * @format
 */

 import React, { useEffect } from 'react';
 import { SafeAreaView, StatusBar } from 'react-native';
 import AppContainer from './AppContainer';
 import { DefaultTheme, Provider as PaperProvider, configureFonts } from 'react-native-paper';
 import { colors, gStyle } from './constants';
 // import SplashScreen from 'react-native-splash-screen';
 import { NetInfoProvider } from './lib/NetInfo/Context';
 import { Provider } from 'react-redux';
 import { appInit } from './actions/app';
 import store from './lib/createStore';
 
 const theme = {
     ...DefaultTheme,
     colors: {
         ...DefaultTheme.colors,
         ...colors.default_theme
     },
     font: configureFonts(gStyle.fontConfig),
 };
 
export default function App() {
     // useEffect(() => {
     //     SplashScreen.hide()
     // }, [])
 
     useEffect(() => {
         setTimeout(() => store.dispatch(appInit()), 1000)
     }, [])
 
     return (
        <SafeAreaView style={{ backgroundColor:"#ffffff", flex: 1 }}>
            <NetInfoProvider>
                <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
                <Provider store={store}>
                    <PaperProvider theme={theme}>
                    <AppContainer />
                    </PaperProvider>
                </Provider>
            </NetInfoProvider>
        </SafeAreaView>
    );
}

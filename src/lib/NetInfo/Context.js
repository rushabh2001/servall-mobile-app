import React, { useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import useNetInfo from "./NetInfo";

const NetContext = React.createContext();

export const NetInfoProvider = ({ children }) => {
    const { width } = Dimensions.get('window');
    const netInfo = useNetInfo();
    const styles = StyleSheet.create({
        offlineContainer: {
            backgroundColor: '#b52424',
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width,
        },
        offlineText: { color: '#fff' }
    });
    const MiniOfflineSign = () =>
        (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}> No Internet Connection </Text>
            </View>
        );
    return (
        <NetContext.Provider value={netInfo}>
            {children}
            {!netInfo.isConnected &&
                <MiniOfflineSign />
            }
        </NetContext.Provider>
    );
};

export default NetContext;

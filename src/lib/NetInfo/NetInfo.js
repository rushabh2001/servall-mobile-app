import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const inititalState = {
    type: null,
    effectiveType: null,
    isConnected: true
};

const useNetInfo = () => {
    const [netInfo, setNetInfo] = useState(inititalState);

    onChange = (newState) => {
        setNetInfo(newState);
    };

    useEffect(() => {
        NetInfo.fetch().then(connectionInfo => {
            setNetInfo(connectionInfo);
        });
    }, []);

    useEffect(() => {
        const unsubscriber = NetInfo.addEventListener(onChange);

        return () => {
            unsubscriber();
        };
    }, []);

    return netInfo;
};

const isNetworkConnected = async () => {
    let netInfo=await NetInfo.fetch();
    return netInfo.isConnected;
}

export {
    isNetworkConnected
}
export default useNetInfo;

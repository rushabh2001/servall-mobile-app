import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveValue = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
      
    }
}

export const getValue = async (key) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value==null) return false;

        return value;
    } catch (e) {
    }
}

export const removeValue = async(key) => {
    await AsyncStorage.removeItem(key);
}

export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.log("LOG_Async Storage access Failed", e);
    }
}
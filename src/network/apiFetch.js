import { BASE_URL } from '../constants/config';
import NetInfo from "@react-native-community/netinfo";


const getContentType = (res) => {
    const isJSON = res.headers.get("Content-Type")?.startsWith("application/json") || false

    if (isJSON) return "JSON"

    const isText = res.headers.get("Content-Type")?.startsWith("text") || false

    if (isText) return "Text"

    return "Unsupported"
}

export const apiPost = async (url, body, headers = {}) => {
    try {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        const contentType = getContentType(res);

        if (contentType === "JSON") {

            const json = await res.json();
            if (json !== undefined) {
                return {
                    status: res.status,
                    data: json
                }
            }

            return false;
        } else {
            return res;
        }
    } catch (e) {
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected && e.message === 'Network request failed') {
            throw { message: 'No Internet Connection. Please check your internet connectivity and try again.' }
        }
        else if (e.message === 'Network request failed') {
            throw { message: 'No Internet Connection. Please check your internet connectivity and try again.' }
        }
        else {
            throw { message: e.message }
        }
    }
}

export const apiGet = async (url, headers = {}, base_url = BASE_URL) => {
    try {
        const res = await fetch(`${base_url}${url}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers
            }
        });

        const contentType = getContentType(res);

        if (contentType === "JSON") {

            const json = await res.json();
            if (json !== undefined) {

                return {
                    status: res.status,
                    data: json
                }
            }

            return false;
        } else {
            return res;
        }
    } catch (e) {
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected && e.message === 'Network request failed') {
            throw { message: 'No Internet Connection. Please check your internet connectivity and try again.' }
        }
        else if (e.message === 'Network request failed') {
            throw { message: 'No Internet Connection. Please check your internet connectivity and try again.' }
        }
        else {
            throw { message: e.message }
        }
    }
}
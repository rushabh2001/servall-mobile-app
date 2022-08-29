import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Share, Linking, NativeModules, Platform, PermissionsAndroid  } from "react-native";
import { Button } from "react-native-paper";
import { connect } from 'react-redux';
import { colors } from  "../constants";
import { API_URL } from "../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from 'react-native-webview';
import RNShareFile from 'react-native-share-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';

const InvoicePreview = ({ userToken, selectedGarageId, route  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOrderId, setOrderId] = useState(route?.params?.data?.order_id);
    const [webViewLink, setWebViewLink] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const getInvoicePreview = async () => {
        try {
            const res = await fetch(`${API_URL}preview_invoice/${isOrderId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setWebViewLink(json.links);
                setDownloadLink(json.download_pdf);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };


    function historyDownload() {
        if (Platform.OS === 'ios') {
            downloadHistory();
        } else {
            try {
                PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title:'storage title',
                    message:'storage_permission',
                },
                ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    downloadHistory();
                } else {
                    //If permission denied then show alert 'Storage Permission 
                    // 'Not Granted'
                Alert.alert('storage_permission');
                }
                });
            } catch (err) {
                //To handle permission related issue
                console.log('error', err);
            }
        }
    }

    const downloadHistory = async () => {
        const {config, fs} = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let date = new Date();
        let fname = Math.floor(date.getTime() + date.getSeconds() / 2) + '.pdf';
        let options = {
            fileCache: true,
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: fname,
            path: PictureDir + '/ServeAll' + fname,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir + '/ServeAll' + fname,
                description: 'downloading file...',
            },
        };
        config(options)
            .fetch('GET', downloadLink)
            .then((res) => {
            //Showing alert after successful downloading
            console.log('res -> ', JSON.stringify(res));
            Toast.show({
                type: 'success',
                text1: 'Invoice started downloading!',
            });
            // alert('Report Downloaded Successfully.');
            })
            .catch((err) => {
            console.log(err);
        })
        .finally(() => {});
    }
        // RNFetchBlob.fetch('GET', downloadLink)
        //   .then((res) => {
        //     let status = res.info().status;
         
        //     if(status == 200) {
        //       // the conversion is done in native code
        //       let base64Str = res.base64()
        //       // the following conversions are done in js, it's SYNC
        //       let text = res.text()
        //       let json = res.json()
        //     } else {
        //       // handle other status codes
        //     }
        //   })
        //   // Something went wrong:
        //   .catch((errorMessage, statusCode) => {
        //     // error handling
        //   })
    // };
  
    useEffect(() => {
        getInvoicePreview();
    }, []);

    return (
        <View style={styles.surfaceContainer}>
            {isLoading ? <ActivityIndicator style={{ marginVertical: 30 }}></ActivityIndicator> :
                <>  
                    <View style={{ marginHorizontal: 20, flexDirection: 'row' }}>
                        <Button
                            style={{ marginBottom:15, flex: 1, borderColor: colors.primary, borderWidth: 1, }}
                            mode={'outline'}
                            onPress={historyDownload}
                        >
                            Download
                        </Button>
                    </View>
                    <WebView
                        source={{
                        uri: `${webViewLink}`
                        }}
                        style={{ paddingTop: 20,}}
                        automaticallyAdjustContentInsets={false}
                        // useWebKit={true}
                        // domStorageEnabled={true}
                        // javaScriptEnabled={false}
                    />
                </>
            }
            <Toast />
            {/* <TouchableOpacity onPress={() => loadAndSharePDF()}><Text>Click Me</Text></TouchableOpacity> */}
        </View>
    );
}


const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        paddingBottom:15,
        // marginBottom: 0,
        backgroundColor: colors.white,
        paddingTop: 15
    },
    buttonStyle: {
        letterSpacing: 0,
        lineHeight:0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    }
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
})

export default connect(mapStateToProps)(InvoicePreview);

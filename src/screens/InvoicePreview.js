import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Share, } from "react-native";
import { connect } from 'react-redux';
import { colors } from  "../constants";
import { API_URL } from "../constants/config"
import { WebView } from 'react-native-webview';
import RNShareFile from 'react-native-share-pdf';

const InvoicePreview = ({ userToken, selectedGarageId, route  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOrderId, setOrderId] = useState(route?.params?.data?.order_id);
    const [webViewLink, setWebViewLink] = useState('');

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
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    // async function loadAndSharePDF() {
    //     const showError = await RNShareFile.sharePDF(mockData.document, mockData.filename);
    //     if (showError) {
    //       // Do something with the error
    //     }
    //   }

    const onShare = async () => {
        try {
          const result = await Share.share({
            url: `${webViewLink}`,
            message:
              'React Native | A framework for building native apps using React',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };
  
    useEffect(() => {
        getInvoicePreview();
    }, []);

    return (
        <View style={styles.surfaceContainer}>
            {isLoading ? <ActivityIndicator style={{ marginVertical: 30 }}></ActivityIndicator> :
                <WebView
                    source={{
                    uri: `${webViewLink}`
                    }}
                    style={{ paddingTop: 20 }}
                />
            }
            <TouchableOpacity onPress={() => loadAndSharePDF()}><Text>Click Me</Text></TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        padding:15,
        marginBottom: 0,
        backgroundColor: colors.white,
        paddingTop: 10
    },
    buttonStyle: {
        letterSpacing: 0,
        lineHeight:0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    cards: {
        elevation: 3,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    cardActions: {
        alignItems: 'center'
    },
    smallActionButton: {
        fontSize: 18,
        color: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
        width: 150, 
        marginTop:8,
    },
    btnActions: {
        width: '100%',
        flexDirection: 'row',
    },
    btnAction: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: colors.secondary, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    btnActionText: {
        color: colors.white,
        fontSize: 12,
    },
    upperInfo: {
        padding: 25,
        paddingBottom: 10,
    },
    cardTags: {
        flexDirection: "row",
    },
    tags: {
        fontSize: 12,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: colors.black,
        color: colors.black,
        marginRight: 3,
    },
    cardOrderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 7,
        width: '100%'
    },
    orderStatus: {
        fontSize: 16,
        backgroundColor: colors.secondary,
        paddingVertical: 3,
        paddingHorizontal: 7,
        color: colors.white,
        marginHorizontal: 10,
    },
    orderID: {
        color: colors.black,
        borderColor: colors.black,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 7,
    },
    orderAmount: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4        
    },
    cardCustomerName: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4      
    },
    orderDate: {
        color: colors.black,
        paddingVertical: 4,
        fontSize: 16,
    },
    kmNoted: {
        color: colors.black,
        paddingVertical: 4,
        fontSize: 16,   
    },
    modalContainerStyle: {
        backgroundColor: 'white', 
        padding: 20,
        marginHorizontal: 30,
        marginTop: 40,
        marginBottom: 70
    },
    cardDetailsHeading: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: 'bold' 
    }, 
    cardDetailsData: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4
    },
    headingStyle: {
        color: colors.black,
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    smallButton: {
        fontSize: 16,
        color: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
    },
    verticleImage: {
        height: 150,
        resizeMode: 'contain',  
        flex: 1, 
    }, 
    lightBoxWrapper: {
        width: 150,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
})

export default connect(mapStateToProps)(InvoicePreview);

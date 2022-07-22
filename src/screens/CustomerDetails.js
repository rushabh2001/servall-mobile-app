import React, { useEffect, useState, useRef } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useTheme, Badge, Divider, Modal, Portal, Button, List } from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL, WEB_URL } from "../constants/config";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import DocumentPicker from 'react-native-document-picker';
import Lightbox from 'react-native-lightbox-v2';
import RBSheet from "react-native-raw-bottom-sheet";

const customerTopTabs = createMaterialTopTabNavigator();

const CustomerDetails = ({ navigation, route, userToken, userRole }) => {

    const [isCustomerData, setIsCustomerData] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [imageUri, setImageUri] = useState(`${WEB_URL}img/placeolder_servall.jpg`);
    const [singleFile, setSingleFile] = useState(null);
    const [resizeImage, setResizeImage] = useState("cover");
    const refRBSheet = useRef();
    const [viewVehicleDetailsModal, setViewVehicleDetailsModal] = useState(false);

    const isFocused = useIsFocused();

    const getCustomerDetails = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_customer_details?id=${route?.params?.userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            // console.log(res);
            if (json !== undefined) {
                // console.log(json);
                setIsCustomerData(json?.user_details);
                if(json.user_details.profile_image != null) {
                    setImageUri( WEB_URL + 'uploads/profile_image/' + json?.user_details.profile_image);
                } else {
                    setImageUri( WEB_URL + 'img/placeolder_servall.jpg');
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const changeProfileImage = async () => {
        try {
            const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
            });
            // console.log('res : ' + JSON.stringify(res));
            setSingleFile(res[0]);
        } catch (err) {
            setSingleFile(null);
            if (DocumentPicker.isCancel(err)) {
            alert('Canceled');
            } else {
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
            }
        } 
    };

    useEffect(() => {
        if (singleFile != null) {
            uploadImage();
        }
    }, [singleFile]);

    const uploadImage = async () => {
        if (singleFile != null) {
            const fileToUpload = singleFile;
            const data = new FormData();
            data.append('profile_image', fileToUpload);
            let res = await fetch(`${API_URL}update_profile_image/${route?.params?.userId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; ',
                    'Authorization': 'Bearer ' + userToken
                },
                body: data
            });
            let responseJson = await res.json();
            // console.log(responseJson);
            if (responseJson.message == true) {
                getCustomerDetails();
            }
        } else {
            console.log('Please Select File first');
        }
    };

    // const changeProfileImage = async (data) => {
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.images],
    //         });
    //         // console.log(res);
    //         setImageFile(res[0]);
            
    //         } 
    //     catch (err) {
    //             setImageFile(null);
    //         if (DocumentPicker.isCancel(err)) {
    //             alert('Canceled');
    //         } else {
    //             // For Unknown Error
    //             alert('Unknown Error: ' + JSON.stringify(err));
    //             throw err;
    //         }
    //     } 
    //     finally {
    //         if(imageFile != null) { 
    //             const formData = new FormData();
    //             // const fileToUpload = imageFile;
    //             formData.append('profile_image', imageFile);
    //             console.log("formdata" , formData);        
    //             uploadFileToServer(formData)
    //         }
    //     }
    // };

    // const uploadFileToServer = async(formData) => {
    //     try {
    //         console.log(1);
    //         const res = await fetch(`${API_URL}update_profile_image/${route?.params?.userId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data; ',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //             body: formData
    //         })
    //         // .then(response => {
    //         //     const statusCode = response.status;
    //         //     let data;
    //         //     return response.json().then(obj => {
    //         //         data = obj;
    //         //         return { statusCode, data };
    //         //     });
    //         // });
    //         console.log(2);
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             console.log(json);
    //             // if()
    //             console.log("Profile Image Updated SuccessFully");
    //             // setStateList(json.states);
    //             // navigation.navigate('AllStack', { screen: 'ChooseGarage'});
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
    
  
    
    useEffect(() => {
        // setImageUri('http://demo2.webstertech.in/servall_garage_api/public/img/placeolder_servall.jpg');
        getCustomerDetails();
        console.log(userRole);
    }, [isFocused]);
    
    return (
        <View style={styles.surfaceContainer}>
            <View style={styles.upperContainer}>
                <View>
                   {imageUri &&  <Lightbox onOpen={() => setResizeImage("contain")} willClose={() => setResizeImage("cover")} activeProps={styles.activeImage} navigator={navigator} style={styles.lightBoxWrapper}><Image resizeMode={resizeImage} style={styles.verticleImage} source={{uri: imageUri}} /></Lightbox>}
                   <Icon style={styles.iconChangeImage} onPress={changeProfileImage} name={"camera"} size={16} color={colors.white} />
                </View>
                <View style={{flexDirection: "row", alignItems:"center",}}>
                    <Text style={styles.customerName}>{ isCustomerData != null ? isCustomerData.name : null }</Text>
                    {/* <Text style={styles.customerName}>{ isCustomerData != null ? isCustomerData.name : '' }</Text> */}
                    <Icon onPress={() => navigation.navigate('CustomerInfo', { userId: route?.params?.userId })} name={"pencil"} size={20} color={colors.gray} />
                </View>
                <View>
                    <Text style={styles.customerPhonenumber}>{ isCustomerData != null ? isCustomerData?.phone_number : '' }</Text>
                    {/* <Text style={styles.customerPhonenumber}>{ isCustomerData != null ? isCustomerData?.phone_number : '' }</Text> */}
                </View>
                <View style={{flexDirection:"row", marginTop: 15, flexWrap:"wrap", alignSelf:"center", justifyContent:'center', width:"80%",   flexFlow: "row wrap" }}>
                    {userRole == "Super Admin" || userRole == "Admin" ?
                        <>
                            <TouchableOpacity onPress={()=> Linking.openURL(`tel:${isCustomerData.phone_number}`) } style={styles.smallButton}><Icon name={"phone"} size={20} color={colors.primary} /></TouchableOpacity>
                            <TouchableOpacity onPress={()=> Linking.openURL(`sms:${isCustomerData.phone_number}?&body=Hello%20ServAll`) } style={styles.smallButton}><Icon name={"comment-multiple"} size={20} color={colors.primary} /></TouchableOpacity>
                            <TouchableOpacity onPress={()=> Linking.openURL(`https://wa.me/${isCustomerData.phone_number}`) } style={styles.smallButton}><Icon name={"whatsapp"} size={20} color={colors.primary} /></TouchableOpacity>
                            <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Icon name={"bell"} size={20} color={colors.primary} /><Text style={{marginLeft:4, color:colors.primary}}>Reminders</Text></TouchableOpacity>
                        </>
                    : null }
                    <TouchableOpacity onPress={()=>{navigation.navigate('UserVehicleTab', { userId: route?.params?.userId }) }} style={styles.smallButton}><Text style={{color:colors.primary}}>Vehicles</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Text style={{color:colors.primary}}>Appointments</Text></TouchableOpacity>
                </View>
                <View style={styles.cardContainer}>
                    <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                        <Text style={{color: colors.danger2, fontSize: 16}}>Outstanding</Text>
                        <Text style={{color: colors.danger2, fontSize: 16}}>₹ 0</Text>
                    </View>
                    <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                        <Text style={{color: colors.green, fontSize: 16}}>Paid</Text>
                        <Text style={{color: colors.green, fontSize: 16}}>₹ 8,818</Text>
                    </View>
                </View>
            </View>

            <View style={styles.lowerContainer}>
                <customerTopTabs.Navigator>
                    <customerTopTabs.Screen name="CustomerOrders" component={CustomerOrders}
                        options={{ 
                            title: () => ( 
                                <View style={styles.haveBadge}>
                                    <Badge style={styles.badgeTag}  rounded="full" mb={-14} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>
                                            4
                                    </Badge>
                                    <Text style={styles.badgeBtn}>
                                        Orders
                                    </Text>
                                </View>
                            ),
                        }}
                    />
                    <customerTopTabs.Screen name="CustomerNotifications" component={CustomerNotifications} 
                        options={{ 
                            title: () => ( 
                                <View style={styles.haveBadge}>
                                    <Badge style={styles.badgeTag} rounded="full" mb={-14} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>
                                        0
                                    </Badge>
                                    <Text style={styles.badgeBtn}>
                                        Notifications
                                    </Text>
                                </View>
                            ),
                        }} 
                    />
                </customerTopTabs.Navigator>
            </View>

            <Portal>
                <Modal visible={viewVehicleDetailsModal} onDismiss={() => {}} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Order Details</Text>
                    {/* {vehicleDataLoading 
                    ? 
                        <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> 
                    : */}
                        <ScrollView>
                        <Text style={styles.cardDetailsHeading}>Vehicle Owner Name:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Vehicle Owner`s Phone Number:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Vehicle Owner`s Email:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Vehicle Registration Number:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Vehicle Brand:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Vehicle Model:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Purchase Date:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Manufacturing Date:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Engine Number:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Chasis Number:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Insurance Provider Company:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Insurer GSTIN:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Insurer Address:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Policy Number:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Insurance Expiry Date:</Text>
                        <Text style={styles.cardDetailsData}>Test</Text>
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Registration Certificate:</Text>
                        {/* {VehicleData?.registration_certificate_img !== null ? */}
                            {/* <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/registration_certificate_img/' + VehicleData?.registration_certificate_img }} /> 
                            </Lightbox> */}
                        {/* : */}
                            <Text style={styles.cardDetailsData}>Not Uploaded Registration Certificate</Text>
                        {/* } */}
                        <Divider />
                        <Text style={styles.cardDetailsHeading}>Insurance Policy:</Text>
                        {/* {VehicleData?.insurance_img !== null ? */}
                            {/* <Lightbox navigator={navigator} style={styles.lightBoxWrapper}>
                                <Image resizeMode={'cover'} style={styles.verticleImage} source={{uri: WEB_URL + 'uploads/insurance_img/' + VehicleData?.insurance_img }} />
                            </Lightbox> */}
                        {/* : */}
                            <Text style={styles.cardDetailsData}>Not Uploaded Insurance Policy</Text>
                        {/* } */}
    
                        </ScrollView>
                    {/* } */}
                    <View style={{flexDirection: "row",}}>
            
                        <View style={{flex: 1}}></View>
                        <Button
                            style={{marginTop:15, flex: 1.4, alignSelf: 'center'}}
                            mode={'contained'}
                            onPress={() => { setVehicleDataLoading(true); setViewVehicleDetailsModal(false); }}
                        >
                            Close
                        </Button>
                        <View style={{flex: 1}}></View>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

const CustomerNotifications = () => {
    return (
        <ScrollView style={styles.innerTabContainer}>
           <View style={styles.cards}>
               <View style={styles.cardTags} >
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                </View>
                <View style={styles.cardOrderDetails}>
                    <Text style={styles.orderID}>Order ID: 11469</Text>
                    <Text style={styles.orderStatus}>Completed</Text>
                </View>
                <View>
                <Text style={styles.orderAmount}>Order Amount: ₹ 8,818</Text>
                <Divider />
                <Text style={styles.cardCustomerName}>Name: Karankumar Bilimoria</Text>
                <Divider />
                <Text style={styles.orderDate}>Order Date: 21 Sep 2021 10:02</Text>
                <Divider />
                <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                </View>
           </View>

           <View style={styles.cards}>
               <View style={styles.cardTags} >
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                </View>
                <View style={styles.cardOrderDetails}>
                    <Text style={styles.orderID}>Order ID: 11469</Text>
                    <Text style={styles.orderStatus}>Completed</Text>
                </View>
                <View>
                <Text style={styles.orderAmount}>Order Amount: ₹ 8,818</Text>
                <Divider />
                <Text style={styles.cardCustomerName}>Name: Karankumar Bilimoria</Text>
                <Divider />
                <Text style={styles.orderDate}>Order Date: 21 Sep 2021 10:02</Text>
                <Divider />
                <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                </View>
           </View>

           <View style={styles.cards}>
               <View style={styles.cardTags} >
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                </View>
                <View style={styles.cardOrderDetails}>
                    <Text style={styles.orderID}>Order ID: 11469</Text>
                    <Text style={styles.orderStatus}>Completed</Text>
                </View>
                <View>
                <Text style={styles.orderAmount}>Order Amount: ₹ 8,818</Text>
                <Divider />
                <Text style={styles.cardCustomerName}>Name: Karankumar Bilimoria</Text>
                <Divider />
                <Text style={styles.orderDate}>Order Date: 21 Sep 2021 10:02</Text>
                <Divider />
                <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                </View>
           </View>
        </ScrollView>
    )
}

const CustomerOrders = () => {
const refRBSheet = useRef();
    return (
        <ScrollView style={styles.innerTabContainer}>
            <View style={styles.cards}>
                <View style={{right: 30, top: 35,position: 'absolute'}} >
                    <Icon onPress={() => {refRBSheet.current.open();}} type={"MaterialCommunityIcons"} name={'dots-vertical'} size={22}  color={colors.gray} />
                    {/* <Icon onPress={() => {refRBSheet.current.open();}} type={"MaterialCommunityIcons"} style={{right: 5, top: 8,position: 'absolute'}} name={'dots-vertical'} size={22}  color={colors.gray} /> */}
                </View>
                <View style={styles.cardTags} >
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                </View>
                <View style={styles.cardOrderDetails}>
                    <Text style={styles.orderID}>Order ID: 11469</Text>
                    <Text style={styles.orderStatus}>Completed</Text>
                </View>
                <View>
                <Text style={styles.orderAmount}>Order Amount: ₹ 8,818</Text>
                <Divider />
                <Text style={styles.cardCustomerName}>Name: Karankumar Bilimoria</Text>
                <Divider />
                <Text style={styles.orderDate}>Order Date: 21 Sep 2021 10:02</Text>
                <Divider />
                <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                </View>

                <RBSheet
                    ref={refRBSheet}
                    height={126}
                    openDuration={250}
                    >
                    <View style={{flexDirection:"column", flex:1}}>
                        <List.Item
                            title="View Order Details"
                            style={{paddingVertical:15}}
                            onPress={() => { setViewVehicleDetailsModal(true); refRBSheet.current.close(); }}
                            left={() => (<Icon type={"MaterialCommunityIcons"} name="eye" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                        />
                        <Divider />
                        <List.Item
                            title="Change Order Status"
                            style={{paddingVertical:15}}
                            onPress={() =>  { navigation.navigate("MyCustomers"); refRBSheet.current.close(); }}
                            left={() => (<Icon type={"MaterialCommunityIcons"} name="clipboard-list-outline" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                        />
                        <Divider />
                        {/* <List.Item
                            title="Add Note"
                            style={{paddingVertical:15}}
                            onPress={() => { navigation.navigate("MyCustomers"); refRBSheet.current.close(); }}
                            left={() => (<Icon type={"MaterialCommunityIcons"} name="notebook-plus-outline" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                        /> */}
                    </View>
                </RBSheet>
            </View>

            <View style={styles.cards}>
                <View style={styles.cardTags} >
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                </View>
                <View style={styles.cardOrderDetails}>
                    <Text style={styles.orderID}>Order ID: 11469</Text>
                    <Text style={styles.orderStatus}>Completed</Text>
                </View>
                <View>
                <Text style={styles.orderAmount}>Order Amount: ₹ 8,818</Text>
                <Divider />
                <Text style={styles.cardCustomerName}>Name: Karankumar Bilimoria</Text>
                <Divider />
                <Text style={styles.orderDate}>Order Date: 21 Sep 2021 10:02</Text>
                <Divider />
                <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                </View>
            </View>

            <View style={styles.cards}>
                <View style={styles.cardTags} >
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                    <Text style={styles.tags}>Running Repair</Text>
                </View>
                <View style={styles.cardOrderDetails}>
                    <Text style={styles.orderID}>Order ID: 11469</Text>
                    <Text style={styles.orderStatus}>Completed</Text>
                </View>
                <View>
                    <Text style={styles.orderAmount}>Order Amount: ₹ 8,818</Text>
                    <Divider />
                    <Text style={styles.cardCustomerName}>Name: Karankumar Bilimoria</Text>
                    <Divider />
                    <Text style={styles.orderDate}>Order Date: 21 Sep 2021 10:02</Text>
                    <Divider />
                    <Text style={styles.kmNoted}>KM: 9311 KM</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flexDirection: "column",
        // padding: 10,
        flex: 1,
    },
    upperContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    lowerContainer: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    customerName: {
        fontSize: 18,
        color: colors.black,
        marginRight: 10,
    },
    customerPhonenumber: {
        color: colors.black,
        marginTop: 5,
        fontSize: 16,
    },
    smallButton: {
        fontSize: 16,
        color: colors.primary,
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
        // alignSelf: 'space-between'
    },
    cardContainer: {
        flexDirection: "row", 
        alignItems:"center", 
        elevation: 3, 
        backgroundColor: colors.white,
        padding: 8,
        margin: 10,
        justifyContent:"space-around",
        width: "70%",
    },
    badgeValue: {
        top: 5,
        right: 0,
        left: 0,
        bottom: 0,
    },
    haveBadge: {
        position: "relative",
        color: colors.black
    },
    badgeTag: {
        top: -5,
        right: -10,
        position: "absolute",
    },
    badgeBtn: {
        // paddingTop: 8,
        fontSize: 16,
        // paddingTop: 10,
        left: -15,
        color: colors.black
    },
    innerTabContainer: {
        padding:10,
        marginBottom: 10
    },
    cards: {
        padding: 25,
        elevation: 3,
        backgroundColor: colors.white,
        marginBottom: 10,
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
    iconChangeImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.black,
        padding: 5,
        borderRadius: 500,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 500,
        // resizeMode: 'cover',    
        marginBottom: 10
    },
    verticleImage: {
        width: '100%',
        height: '100%',
        // flex:1,
        // borderRadius: 500,
        // overflow: "hidden",
        // resizeMode: 'contain',
        // resizeMode: 'cover',
    }, 
    activeImage: {
        width: '100%',
        height: null,
        resizeMode: 'contain',
        borderRadius: 0,
        // marginBottom: 0,
        flex: 1,
        // display: 'none',
    }, 
    lightBoxWrapper: {
        width: 80,
        height: 80,
        borderRadius: 500,    
        marginBottom: 10,
        overflow: "hidden",
        backgroundColor: colors.black
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
})

export default connect(mapStateToProps)(CustomerDetails);
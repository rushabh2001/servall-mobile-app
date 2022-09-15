import React, { useEffect, useRef, useState } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from "react-native";
import { Badge, Divider, Modal, Portal, Button, List } from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL, WEB_URL } from "../constants/config";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import DocumentPicker from 'react-native-document-picker';
import Lightbox from 'react-native-lightbox-v2';
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment";
import ServAllLogo from '../assets/images/placeholder_servall.jpg';

const customerTopTabs = createMaterialTopTabNavigator();

const CustomerDetails = ({ navigation, route, userToken, userRole, selectedGarageId, selectedGarage, user }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isCustomerData, setIsCustomerData] = useState('');
    const [imageUri, setImageUri] = useState(Image.resolveAssetSource(ServAllLogo).uri);
    const [singleFile, setSingleFile] = useState(null);
    const [resizeImage, setResizeImage] = useState("cover");
    const isFocused = useIsFocused();
    const [orderDataModal, setOrderDataModal] = useState(false);
    const [orderData, setOrderData] = useState(); 
    const [orderDataLoading, setOrderDataLoading] = useState(true);

    const getCustomerDetails = async () => {
        setIsLoading(true);
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
            if (json !== undefined) {
                // console.log('setIsCustomerData',json?.user_details);
                setIsCustomerData(json?.user_details);
                if(json.user_details.profile_image != null) {
                    setImageUri( WEB_URL + 'uploads/profile_image/' + json?.user_details.profile_image);
                } else {
                    setImageUri(Image.resolveAssetSource(ServAllLogo).uri);
                }
                // console.log('isCustomerData', isCustomerData.order);
                // console.log('isCustomerData Length', isCustomerData.order.length);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderDetails = async (orderId) => {
        try {
            const res = await fetch(`${API_URL}order/${orderId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setOrderData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setOrderDataLoading(false);
        }
    };


    const changeProfileImage = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
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
            if (responseJson.message == true) {
                getCustomerDetails();
            }
        } else {
            console.log('Please Select File first');
        }
    };

    const CustomerOrders = () => {
        return(   
            <ScrollView style={styles.innerTabContainer} showsVerticalScrollIndicator={false}>
                {isLoading ? <ActivityIndicator style={{marginVertical: 50}}></ActivityIndicator> :
                    ((isCustomerData?.order?.length == 0 || isCustomerData.order == undefined || isCustomerData.order == []) 
                    ?
                        <View style={[styles.cards, {alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: "transparent", marginVertical: 50 }]}>
                            <Text>No Order Found for this user!</Text>
                        </View>
                    :
                        <>
                            {isCustomerData?.order.map((order, i) => {
                                return (
                                    <View style={styles.cards}>
                                        {/* <View style={styles.cardTags} >
                                            <Text style={styles.tags}>Running Repair</Text>
                                            <Text style={styles.tags}>Running Repair</Text>
                                            <Text style={styles.tags}>Running Repair</Text>
                                        </View> */}
                                        <View style={styles.cardOrderDetails}>
                                            <Text style={styles.orderID}>Order ID: {order.id}</Text>
                                            <Text style={styles.orderStatus}>{order.status}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.orderAmount}>Order Amount: ₹ {order.total}</Text>
                                            <Divider />
                                            <Text style={styles.orderDate}>Order Date: {moment(order.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                            <Divider />
                                            <Text style={styles.kmNoted}>KM: {order.odometer}</Text>
                                        </View>
                                        <View style={styles.cardActions}>
                                            <TouchableOpacity onPress={()=>{setOrderDataModal(true); getOrderDetails(order.id); }} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </>
                    )
                }
            </ScrollView>
        )
    }

    const CustomerNotifications = () => {
        return(
            <ScrollView style={styles.innerTabContainer} showsVerticalScrollIndicator={false}>
                {isLoading ? <ActivityIndicator style={{marginVertical: 50}}></ActivityIndicator> :
                    ((isCustomerData?.order?.length == 0 || isCustomerData.order == undefined || isCustomerData.order == []) ?
                        <View style={[styles.cards, { marginVertical: 50, alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: "transparent" }]}>
                            <Text>No Order Found for this user!</Text>
                        </View>
                    :
                    <>
                            {isCustomerData?.order.map((order, i) => {
                                return (
                                    <View style={styles.cards}>
                                        {/* <View style={styles.cardTags} >
                                            <Text style={styles.tags}>Running Repair</Text>
                                            <Text style={styles.tags}>Running Repair</Text>
                                            <Text style={styles.tags}>Running Repair</Text>
                                        </View> */}
                                        <View style={styles.cardOrderDetails}>
                                            <Text style={styles.orderID}>Order ID: {order.id}</Text>
                                            <Text style={styles.orderStatus}>{order.status}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.orderAmount}>Order Amount: ₹ {order.total}</Text>
                                            <Divider />
                                            <Text style={styles.orderDate}>Order Date: {moment(order.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                            <Divider />
                                            <Text style={styles.kmNoted}>KM: {order.odometer}</Text>
                                        </View>
                                        <View style={styles.cardActions}>
                                            <TouchableOpacity onPress={()=>{setOrderDataModal(true); getOrderDetails(order.id); }} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>View Details</Text></TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </>
                    )
                }
            </ScrollView>
        )
    }

    useEffect(() => {
        if (singleFile != null) {
            uploadImage();
        }
    }, [singleFile]);

    useEffect(() => {
        getCustomerDetails();
        console.log('isCustomerData?.order?.length', isCustomerData?.order?.length);
        console.log('isCustomerData?.order', isCustomerData?.order);
    }, [isFocused]);
    
    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 35 }}>
            { selectedGarageId == 0 ? <Text style={styles.garageNameTitle}>All Garages - {user.name}</Text> : <Text style={styles.garageNameTitle}>{selectedGarage?.garage_name} - {user.name}</Text> }
            </View>
            <View style={styles.surfaceContainer}>
                <View style={styles.upperContainer}>
                    <View>
                    {imageUri &&  <Lightbox onOpen={() => setResizeImage("contain")} willClose={() => setResizeImage("cover")} activeProps={styles.activeImage} navigator={navigator} style={styles.lightBoxWrapper}><Image resizeMode={resizeImage} style={styles.verticleImage} source={{uri: imageUri}} /></Lightbox>}
                    <Icon style={styles.iconChangeImage} onPress={changeProfileImage} name={"camera"} size={16} color={colors.white} />
                    </View>
                    <View style={{flexDirection: "row", alignItems:"center",}}>
                        <Text style={styles.customerName}>{ isCustomerData != null ? isCustomerData.name : null }</Text>
                        <Icon onPress={() => navigation.navigate('CustomerInfo', { userId: route?.params?.userId })} name={"pencil"} size={20} color={colors.gray} />
                    </View>
                    <View>
                        <Text style={styles.customerPhonenumber}>{ isCustomerData != null ? isCustomerData?.phone_number : '' }</Text>
                    </View>
                    <View style={{flexDirection:"row", marginTop: 15, flexWrap:"wrap", alignSelf:"center", justifyContent:'center', width:"80%",   flexFlow: "row wrap" }}>
                        {userRole == "Super Admin" || userRole == "Admin" ?
                            <>
                                <TouchableOpacity onPress={()=> Linking.openURL(`tel:${isCustomerData.phone_number}`) } style={styles.smallButton}><Icon name={"phone"} size={20} color={colors.primary} /></TouchableOpacity>
                                <TouchableOpacity onPress={()=> Linking.openURL(`sms:${isCustomerData.phone_number}?&body=Hello%20ServAll`) } style={styles.smallButton}><Icon name={"comment-multiple"} size={20} color={colors.primary} /></TouchableOpacity>
                                <TouchableOpacity onPress={()=> Linking.openURL(`https://wa.me/${isCustomerData.phone_number}`) } style={styles.smallButton}><Icon name={"whatsapp"} size={20} color={colors.primary} /></TouchableOpacity>
                                {/* <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Icon name={"bell"} size={20} color={colors.primary} /><Text style={{marginLeft:4, color:colors.primary}}>Reminders</Text></TouchableOpacity> */}
                            </>
                        : null }
                        <TouchableOpacity onPress={()=>{navigation.navigate('UserVehicleTab', { userId: route?.params?.userId }) }} style={styles.smallButton}><Text style={{color:colors.primary}}>Vehicles</Text></TouchableOpacity>
                        {/* <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Text style={{color:colors.primary}}>Appointments</Text></TouchableOpacity> */}
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                            <Text style={{color: colors.danger2, fontSize: 16}}>Outstanding</Text>
                            <Text style={{color: colors.danger2, fontSize: 16}}>₹ {isCustomerData.due_payment}</Text>
                        </View>
                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                            <Text style={{color: colors.green, fontSize: 16}}>Paid</Text>
                            <Text style={{color: colors.green, fontSize: 16}}>₹ {isCustomerData.completed_payment}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.lowerContainer}>
                    <customerTopTabs.Navigator>
                        <customerTopTabs.Screen 
                            name="CustomerOrders" 
                            component={CustomerOrders}
                            // initialParams={{ isCustomerData: isCustomerData }}
                            options={{ 
                                title: () => ( 
                                    <View style={styles.haveBadge}>
                                        <Badge style={styles.badgeTag} rounded="full" mb={-14} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>
                                            {isCustomerData?.order?.length}
                                        </Badge>
                                        <Text style={styles.badgeBtn}>
                                            Orders
                                        </Text>
                                    </View>
                                ),
                            }}
                        />
                        <customerTopTabs.Screen name="CustomerNotifications" 
                            component={CustomerNotifications} 
                            options={{ 
                                title: () => ( 
                                    <View style={styles.haveBadge}>
                                        <Badge style={styles.badgeTag} rounded="full" mb={-14} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{fontSize: 12}}>
                                            {isCustomerData?.order?.length}
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
                    <Modal visible={orderDataModal} onDismiss={() => {setOrderDataModal(false); }} contentContainerStyle={styles.modalContainerStyle}>
                        <IconX name="times" size={20} color={colors.black} style={{ position: 'absolute', top: 25, right: 25, zIndex: 99 }} onPress={() => { setOrderDataModal(false); }} />
                        <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Order Details</Text>
                        {orderDataLoading 
                        ? 
                            <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> 
                        :
                            <ScrollView>
                                <Text style={styles.cardDetailsHeading}>Order ID:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.id}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Order Status:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.status}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Odometer:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.odometer}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Fuel Level:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.fuel_level}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Order Date:</Text>
                                <Text style={styles.cardDetailsData}>{moment(orderData.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Estimated Delivery Time:</Text>
                                <Text style={styles.cardDetailsData}>{moment(orderData.estimated_delivery_time, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A')}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Services Total:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.labor_total}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Parts Total:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.parts_total}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Total Discount:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.discount}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Order Total:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.total}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Order Belongs to Garage:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.garage.garage_name}</Text>
                                {/* <Divider /> */}
                    
                                <Text style={[styles.headingStyle, { marginTop: 10, color: colors.white, textAlign: "center", backgroundColor: colors.primary, width: '100%', justifyContent: 'center'}]}>User Details</Text>                                                   
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Name:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.user.name}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Phone Number:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.user.phone_number}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Email Address:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.user.email}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Address:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.user.address}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>State:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.user.state}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>City:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.user.city}</Text>
                                {/* <Divider /> */}

                                <Text style={[styles.headingStyle, { marginTop: 10, color: colors.white, textAlign: "center", backgroundColor: colors.primary, width: '100%', justifyContent: 'center'}]}>Vehicle Details</Text>                                                   
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Vehicle Registration Number:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.vehicle_registration_number ? orderData.vehicle?.vehicle_registration_number : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Vehicle Brand:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.brand?.name ? orderData.vehicle?.brand?.name : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Vehicle Model:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.vehicle_model?.model_name ? orderData.vehicle?.vehicle_model?.model_name : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Purchase Date:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.purchase_date ? moment(orderData.vehicle?.purchase_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Manufacturing Date:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.manufacturing_date ? moment(orderData.vehicle?.manufacturing_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Engine Number:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.engine_number ? orderData.vehicle?.engine_number : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Chasis Number:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.chasis_number ? orderData.vehicle?.chasis_number : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Insurance Provider Company:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurance_provider?.name ? orderData.vehicle?.insurance_provider?.name : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Insurer GSTIN:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurer_gstin ? orderData.vehicle?.insurer_gstin : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Insurer Address:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurer_address ? orderData.vehicle?.insurer_address : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Policy Number:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.policy_number ? orderData.vehicle?.policy_number : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Insurance Expiry Date:</Text>
                                <Text style={styles.cardDetailsData}>{orderData.vehicle?.insurance_expiry_date ? moment(orderData.vehicle?.insurance_expiry_date, 'YYYY MMMM D').format('DD-MM-YYYY') : null}</Text>
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Registration Certificate:</Text>
                                {orderData.vehicle?.registration_certificate_img !== null ?
                                    <Lightbox navigator={navigator} style={styles.lightBoxWrapperModal}>
                                        <Image resizeMode={'cover'} style={styles.verticleImageModal} source={{uri: WEB_URL + 'uploads/registration_certificate_img/' + orderData.vehicle?.registration_certificate_img }} /> 
                                    </Lightbox>
                                :
                                    <Text style={styles.cardDetailsData}>Not Uploaded Registration Certificate</Text>
                                }
                                <Divider />
                                <Text style={styles.cardDetailsHeading}>Insurance Policy:</Text>
                                {orderData.vehicle?.insurance_img !== null ?
                                    <Lightbox navigator={navigator} style={styles.lightBoxWrapperModal}>
                                        <Image resizeMode={'cover'} style={styles.verticleImageModal} source={{uri: WEB_URL + 'uploads/insurance_img/' + orderData.vehicle?.insurance_img }} />
                                    </Lightbox>
                                :
                                    <Text style={styles.cardDetailsData}>Not Uploaded Insurance Policy</Text>
                                }

                            </ScrollView>
                        }
                        <View style={{flexDirection: "row",}}>
                
                            <View style={{flex: 1}}></View>
                            <Button
                                style={{marginTop:15, flex: 1.4, alignSelf: 'center'}}
                                mode={'contained'}
                                onPress={() => { setOrderDataModal(false); }}
                            >
                                Close
                            </Button>
                            <View style={{flex: 1}}></View>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </View>
    )
}

// const CustomerNotifications = ({ route }) => {
//     return (
       
//     )
// }

// const CustomerOrders = ({ route }) => {
// const refRBSheet = useRef();
// useEffect(() => {
//   console.log('orders', isCustomerData);
// }, [])

//     return (
     
//     )
// }

const styles = StyleSheet.create({
    garageNameTitle: {
        textAlign: 'center', 
        fontSize: 17, 
        fontWeight: '500', 
        color: colors.white, 
        paddingVertical: 7, 
        backgroundColor: colors.secondary,
        position: 'absolute',
        top: 0,
        zIndex: 5,
        width: '100%',
        flex: 1,
        left: 0, 
        right: 0
    },
    surfaceContainer: {
        flexDirection: "column",
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
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
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
        fontSize: 16,
        left: -15,
        color: colors.black
    },
    innerTabContainer: {
        padding:10,
        marginBottom: 10,
        flex: 1,
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
        marginBottom: 10
    },
    verticleImage: {
        width: '100%',
        height: '100%',
    }, 
    activeImage: {
        width: '100%',
        height: null,
        resizeMode: 'contain',
        borderRadius: 0,
        flex: 1,
    }, 
    lightBoxWrapper: {
        width: 80,
        height: 80,
        borderRadius: 500,    
        marginBottom: 10,
        overflow: "hidden",
        backgroundColor: colors.black
    },

    // modal styles
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
    verticleImageModal: {
        height: 150,
        resizeMode: 'contain',  
        flex: 1, 
    }, 
    lightBoxWrapperModal: {
        width: 150,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
})

export default connect(mapStateToProps)(CustomerDetails);
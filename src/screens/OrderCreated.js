import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking, FlatList } from "react-native";
import { Checkbox, Button, Divider } from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import { connect } from 'react-redux';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import moment from "moment";
import { API_URL } from "../constants/config";

const OrderCreated = ({ navigation, userRole, route, userToken }) => {

    // const isFocused = useIsFocused();
    const [partData, setPartData] = useState([]);
    const [serviceData, setServiceData] = useState([]);

    const [isOrderId, setIsOrderId] = useState(route?.params?.data?.order_id);
    const [isGarageId, setIsGarageId] = useState(route?.params?.data?.garage_id);
    const [isUserId, setIsUserId] = useState(route?.params?.data?.user_id);
    const [isVehicleId, setIsVehicleId] = useState(route?.params?.data?.vehicle_id);
    const [isName, setIsName] = useState(route?.params?.data?.name);
    const [isEmail, setIsEmail] = useState(route?.params?.data?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(route?.params?.data?.phone_number);

    // Vehicle Fields
    const [isBrand, setIsBrand] = useState(route?.params?.data?.brand_id);
    const [isBrandName, setIsBrandName] = useState(route?.params?.data?.brand_name);
    const [isModel, setIsModel] = useState(route?.params?.data?.model_id);
    const [isModelName, setIsModelName] = useState(route?.params?.data?.model_name);
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] = useState(route?.params?.data?.vehicle_registration_number);

    const [isOdometerKMs, setIsOdometerKMs] = useState(route?.params?.data?.odometer);
    const [isFuelLevel, setIsFuelLevel] = useState(route?.params?.data?.fuel_level);
    const [isComment, setIsComment] = useState(route?.params?.data?.comment);
    const [isTotal, setIsTotal] = useState(route?.params?.data?.total);
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(route?.params?.data?.applicable_discount);

    // const [orderStatusArray, setOrderStatusArray] = useState([]);

    const [isEstimatedDeliveryDateTime, setIsEstimatedDeliveryDateTime] = useState(route?.params?.data?.estimated_delivery_time);
    const [estimatedDeliveryDateTime, setEstimatedDeliveryDateTime] = useState(moment(route?.params?.data?.estimated_delivery_time, 'YYYY-MM-DD hh:mm:ss').format('DD-MM-YYYY hh:mm A'));

    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(route?.params?.data?.labor_total);
    const [partsTotal, setPartsTotal] = useState(route?.params?.data?.parts_total);
    // const [isTotal, setIsTotal] = useState(route?.params?.data?.total);
    // const [isApplicableDiscount, setIsApplicableDiscount] = useState(route?.params?.data?.applicable_discount);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);
    
    const [fieldsServices, setFieldsServices] = useState([]);
    const [fieldsParts, setFieldsParts] = useState([]);

    // const getCustomerDetails = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_customer_details?id=${route?.params?.userId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         // console.log(res);
    //         if (json !== undefined) {
    //             // console.log(json);
    //             setIsCustomerData(json?.user_details);
    //             if(json.user_details.profile_image != null) {
    //                 setImageUri( WEB_URL + 'uploads/profile_image/' + json?.user_details.profile_image);
    //             } else {
    //                 setImageUri( WEB_URL + 'img/placeolder_servall.jpg');
    //             }
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const changeServicesStatus = async () => {
        let orderStatusArray = [];
        serviceData.forEach(item => {
            orderStatusArray.push({ order_service_id: item.id, is_done: item.is_done });
            // setFieldsServices(serviceValues);
        });
        console.log('orderStatusArray',orderStatusArray);
        try {
            const res = await fetch(`${API_URL}service_status/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    order_id: isOrderId,
                    order_service: orderStatusArray,
                }),
            });
            const json = await res.json();
            // console.log(res);
            if (json !== undefined) {
                console.log(json);
                // setIsCustomerData(json?.user_details);
                // if(json.user_details.profile_image != null) {
                //     setImageUri( WEB_URL + 'uploads/profile_image/' + json?.user_details.profile_image);
                // } else {
                //     setImageUri( WEB_URL + 'img/placeolder_servall.jpg');
                // }
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    }

    const changePartsStatus = async () => {
        let orderStatusArray = [];
        partData.forEach(item => {
            orderStatusArray.push({ order_part_id: item.id, is_done: item.is_done });
            // setFieldsParts(partValues);
        });
        console.log('orderStatusArray',orderStatusArray);
        try {
            const res = await fetch(`${API_URL}part_status/update`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    order_id: isOrderId,
                    order_part: orderStatusArray,
                }),
            });
            const json = await res.json();
            // console.log(res);
            if (json !== undefined) {
                console.log(json);
                // setIsCustomerData(json?.user_details);
                // if(json.user_details.profile_image != null) {
                //     setImageUri( WEB_URL + 'uploads/profile_image/' + json?.user_details.profile_image);
                // } else {
                //     setImageUri( WEB_URL + 'img/placeolder_servall.jpg');
                // }
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    }

   
    // const changeProfileImage = async () => {
    //     try {
    //         const res = await DocumentPicker.pick({
    //         type: [DocumentPicker.types.images],
    //         });
    //         // console.log('res : ' + JSON.stringify(res));
    //         setSingleFile(res[0]);
    //     } catch (err) {
    //         setSingleFile(null);
    //         if (DocumentPicker.isCancel(err)) {
    //         alert('Canceled');
    //         } else {
    //         alert('Unknown Error: ' + JSON.stringify(err));
    //         throw err;
    //         }
    //     } 
    // };

    useEffect(() => {
        setServiceData(route?.params?.data?.services_list);
        setPartData(route?.params?.data?.parts_list);
        // console.log(route?.params?.data?.parts_list);
    }, [route?.params?.data]);

    // useEffect(() => {
    //     // setAddPartModal(false);
    //     let values = [...fieldsServices];
    //     route?.params?.data?.services_list.forEach(item => {
    //         values.push({ 
    //             serviceId: item.service.id, 
    //             serviceName:item.service.name,
    //             rate: JSON.stringify(item.rate),
    //             quantity: JSON.stringify(item.qty),
    //             discount: JSON.stringify(item.discount),
    //             applicableDiscountForItem: (item.rate * item.qty) * (item.discount / 100),
    //             totalForThisService: item.amount,
    //             isDone: 0
    //         });
    //         // fieldsParts[idx].rate
    //     });
    //     setServiceData(values);
    //     // setFieldsServices(values);

    //     let values2 = [...fieldsParts];
    //     route?.params?.data?.parts_list.forEach(item => {
    //         values2.push({ 
    //             partId: item.parts.id, 
    //             partName:item.parts.name, 
    //             rate: JSON.stringify(item.rate), 
    //             quantity: JSON.stringify(item.qty), 
    //             discount: JSON.stringify(item.discount),  
    //             applicableDiscountForItem: (item.rate * item.qty) * (item.discount / 100),
    //             totalForThisPart: item.amount,
    //             isDone: 0
    //         });
    //     });
    //     setPartData(values2);
    //     // setFieldsParts(values2);

    //     // let servicesList =  [...fieldsServices];
    //     // route?.params?.data?.parts_list.forEach(item => {
    //     //     servicesList.push({ 
    //     //         partId: item.parts.id, 
    //     //         partName:item.parts.name, 
    //     //         rate: JSON.stringify(item.rate), 
    //     //         quantity: JSON.stringify(item.qty), 
    //     //         discount: JSON.stringify(item.discount),  
    //     //         applicableDiscountForItem: (item.rate * item.qty) * (item.discount / 100),
    //     //         totalForThisPart: item.amount
    //     //     });
    //     // });
    //     // setFieldsParts(values2);

    //     // setServiceData(route?.params?.data?.services_list);
    //     // setPartData(route?.params?.data?.parts_list);


    //     // setFieldsServices = 
    //     // route?.params?.data?.services_list
    //     // handlePartAdd();
    // }, [route?.params?.data]);


    // const uploadImage = async () => {
    //     if (singleFile != null) {
    //         const fileToUpload = singleFile;
    //         const data = new FormData();
    //         data.append('profile_image', fileToUpload);
    //         let res = await fetch(`${API_URL}update_profile_image/${route?.params?.userId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data; ',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //             body: data
    //         });
    //         let responseJson = await res.json();
    //         // console.log(responseJson);
    //         if (responseJson.message == true) {
    //             getCustomerDetails();
    //         }
    //     } else {
    //         console.log('Please Select File first');
    //     }
    // };
    
    // useEffect(() => {
    //     // setImageUri('http://demo2.webstertech.in/servall_garage_api/public/img/placeolder_servall.jpg');
    //     getCustomerDetails();
    //     console.log(userRole);
    // }, [isFocused]);
    
    return (
        <View style={styles.surfaceContainer}>
            <ScrollView>
                <View style={styles.upperContainer}>
                    <View style={styles.stepLables}>
                        <View style={{justifyContent: 'flex-start'}}>
                            <Text style={{lineHeight: 20}}>Created {'\n'}5 Minutes Ago</Text>
                        </View>
                        <View style={{justifyContent: 'flex-end'}}>
                            <Text style={{lineHeight: 20}}>Estimate Deliver Time {'\n'} {estimatedDeliveryDateTime}</Text>
                        </View>
                    </View>
                    <View>
                        <ProgressSteps
                            labelFontSize={12}
                            activeStep={0}
                            disabledStepIconColor="#616161"
                            labelColor="#616161"
                            progressBarColor="#616161"
                        >
                            <ProgressStep 
                                label="Created"
                                removeBtnRow={true}
                            >   
                                <View>
                                    <View style={{flexDirection: "row", alignItems:"center", justifyContent: 'center'}}>
                                        <Text style={styles.customerName}>{isName}</Text>
                                        {/* <Text style={styles.customerName}>{ isCustomerData != null ? isCustomerData.name : '' }</Text> */}
                                        {/* <Icon onPress={() => {}} name={"pencil"} size={20} color={colors.gray} /> */}
                                    </View>
                                    <View style={{flexDirection: "row", alignItems:"center", justifyContent: 'center'}}>
                                        <Text style={styles.customerPhonenumber}>{isPhoneNumber}</Text>
                                        {/* <Text style={styles.customerPhonenumber}>{ isCustomerData != null ? isCustomerData?.phone_number : '' }</Text> */}
                                    </View>
                                    <View style={{flexDirection: "row", alignItems:"center", justifyContent: 'center'}}>
                                        <Text style={styles.customerVehicle}>{isBrandName} ({isVehicleRegistrationNumber})</Text>
                                    </View>
                                    <View style={{flexDirection:"row", marginBottom: 10, marginTop: 15, flexWrap:"wrap", alignSelf:"center", justifyContent:'center', width:"80%",   flexFlow: "row wrap" }}>
                                        {userRole == "Super Admin" || userRole == "Admin" ?
                                            <>
                                                <TouchableOpacity onPress={()=> Linking.openURL(`tel:${isPhoneNumber}`) } style={styles.smallButton}><Icon name={"phone"} size={20} color={colors.primary} /></TouchableOpacity>
                                                <TouchableOpacity onPress={()=> Linking.openURL(`sms:${isPhoneNumber}?&body=Hello%20ServAll`) } style={styles.smallButton}><Icon name={"comment-multiple"} size={20} color={colors.primary} /></TouchableOpacity>
                                                <TouchableOpacity onPress={()=> Linking.openURL(`https://wa.me/${isPhoneNumber}`) } style={styles.smallButton}><Icon name={"whatsapp"} size={20} color={colors.primary} /></TouchableOpacity>
                                                <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Icon name={"bell"} size={20} color={colors.primary} /><Text style={{marginLeft:4, color:colors.primary}}>Reminders</Text></TouchableOpacity>
                                            </>
                                        : null }
                                        {/* <TouchableOpacity onPress={()=>{}} style={styles.smallButton}><Text style={{color:colors.primary}}>Vehicles</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Text style={{color:colors.primary}}>Appointments</Text></TouchableOpacity> */}
                                    </View>
                                    <View style={styles.cardContainer}>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                                            <Text style={{color: colors.black, fontSize: 16}}>Total</Text>
                                            <Text style={{color: colors.black, fontSize: 16}}>{isTotal}</Text>
                                        </View>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                                            <Text style={{color: colors.green, fontSize: 16}}>Received</Text>
                                            <Text style={{color: colors.green, fontSize: 16}}>₹ 0</Text>
                                        </View>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>Due</Text>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>{isTotal}</Text>
                                        </View>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>Discount</Text>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>{isApplicableDiscount}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:"row", marginTop: 15, alignSelf:"center", justifyContent:'center'}}>
                                        <TouchableOpacity onPress={()=> Linking.openURL(`tel:${isPhoneNumber}`) } style={{marginRight: 10}}><IconX name={"file-pdf"} size={28} color={colors.primary} /></TouchableOpacity>
                                        <TouchableOpacity onPress={()=> Linking.openURL(`sms:${isPhoneNumber}?&body=Hello%20ServAll`) } style={{}}><IconX name={"share-alt-square"} size={28} color={colors.primary} /></TouchableOpacity>

                                        {/* <TouchableOpacity onPress={()=> Linking.openURL(`https://wa.me/Text`) } style={styles.smallButton}><Icon name={"whatsapp"} size={20} color={colors.primary} /></TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Icon name={"bell"} size={20} color={colors.primary} /><Text style={{marginLeft:4, color:colors.primary}}>Reminders</Text></TouchableOpacity> */}
                                    </View>
                                    <View style={{marginTop: 5, alignSelf:"center", justifyContent:'center'}}>
                                        <Text style={{color: colors.black}}>Repair Order</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', marginTop: 20}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.secondary, padding: 10}}>
                                        <Text style={{fontSize: 18, color: colors.white}}>Services</Text>
                                        <TouchableOpacity onPress={changeServicesStatus} style={[styles.smallButton, {paddingHorizontal: 8, borderColor: colors.white}]}><IconX name={"edit"} size={16} color={colors.white} /><Text style={{marginLeft:4, color:colors.white}}>Progress</Text></TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection:'column', backgroundColor: colors.white}}>
                                        <FlatList
                                            ItemSeparatorComponent= {() => (<Divider />)}
                                            data={serviceData}
                                            // onEndReachedThreshold={1}
                                            keyExtractor={item => `services-${item.id}`}
                                            renderItem={({item, index}) => (
                                                <TouchableOpacity  
                                                    onPress={() => {
                                                        if(serviceData[index]['is_done'] == 0) {
                                                            let serviceValues2 = [...serviceData];
                                                            serviceValues2[index]['is_done'] = 1;
                                                            setServiceData(serviceValues2);
                                                        } else {                                                          
                                                              // item.is_done = 0 
                                                            let serviceValues2 = [...serviceData];
                                                    
                                                            // serviceValues2[index][value.name] = value.value;
                                                            serviceValues2[index]['is_done'] = 0;
                            
                                                            setServiceData(serviceValues2);
                                                            // serviceData[index]['is_done'] = 0
                                                            // setorderStatusArray([
                                                            //     ...orderStatusArray, 
                                                            //     {"order_service_id": item.id, "is_done": 0},
                                                            //     // {"order_service_id": item,"is_done":1}
                                                            // ])  
                                                        }
                                                        console.log(serviceData);
                                                        // setChecked(!checked);
                                                    }}
                                                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, paddingHorizontal: 10}}
                                                    activeOpacity={1}
                                                >
                                                    <Text style={{fontSize: 18, color: colors.black}}>- {item?.service?.name}</Text>
                                                    <Checkbox
                                                        // checked
                                                        status={serviceData[index]['is_done'] == 1 ? 'checked' : 'unchecked'}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        {/* <TouchableOpacity  
                                            onPress={() => {
                                                setChecked(!checked);
                                            }}
                                            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, paddingHorizontal: 10}}
                                            activeOpacity={1}
                                        >
                                            <Text style={{fontSize: 18, color: colors.black}}>- Air filter hose Cleaning</Text>
                                            <Checkbox
                                                status={checked ? 'checked' : 'unchecked'}

                                            />
                                        </TouchableOpacity> */}
                                        {/* <Checkbox.Item label="- Item" status="checked" /> */}
                                    </View>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, backgroundColor: colors.secondary, padding: 10}}>
                                        <Text style={{fontSize: 18, color: colors.white}}>Parts</Text>
                                        <TouchableOpacity onPress={changePartsStatus} style={[styles.smallButton, {paddingHorizontal: 8, borderColor: colors.white}]}><IconX name={"edit"} size={16} color={colors.white} /><Text style={{marginLeft:4, color:colors.white}}>Progress</Text></TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection:'column', backgroundColor: colors.white}}>
                                    <FlatList
                                        ItemSeparatorComponent= {() => (<Divider />)}
                                        data={partData}
                                        // onEndReachedThreshold={1}
                                        keyExtractor={item => `parts-${item.id}`}
                                        renderItem={({item, index}) => (
                                            <TouchableOpacity  
                                                onPress={() => {
                                                    if(partData[index]['is_done'] == 0) {
                                                        let partValues2 = [...partData];
                                                        partValues2[index]['is_done'] = 1;
                                                        setPartData(partValues2);
                                                    } else {                                                          
                                                        let partValues2 = [...partData];
                                                        partValues2[index]['is_done'] = 0;
                                                        setPartData(partValues2);
                                                    }
                                                    console.log(partData);
                                                }}
                                                style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, paddingHorizontal: 10}}
                                                activeOpacity={1}
                                            >
                                                <Text style={{fontSize: 18, color: colors.black}}>- {item?.parts?.name}</Text>
                                                <Checkbox
                                                    status={item.is_done == 1 ? 'checked' : 'unchecked'}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    />
                                        {/* // <TouchableOpacity  
                                        //     onPress={() => {
                                        //         setChecked(!checked);
                                        //     }}
                                        //     style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, paddingHorizontal: 10}}
                                        //     activeOpacity={1}
                                        // >
                                        //     <Text style={{fontSize: 18, color: colors.black}}>- Air filter hose Cleaning</Text>
                                        //     <Checkbox
                                        //         status={checked ? 'checked' : 'unchecked'}

                                        //     />
                                        // </TouchableOpacity>
                                        // <Checkbox.Item label="- Item" status="checked" /> */}
                                    </View>
                                </View>

                                <Button
                                    mode={'contained'}
                                    style={{marginTop:15}}
                                    onPress={() => navigation.navigate('ServicesStack', { screen: 'AddPayment' })}
                                >
                                    Add Payment
                                </Button>

                            </ProgressStep>
                            <ProgressStep 
                                label="In Progress"
                                removeBtnRow={true}
                            >
                            </ProgressStep>
                            <ProgressStep 
                                label="Vehicle Ready"
                                removeBtnRow={true}
                            >
                            </ProgressStep>
                            <ProgressStep 
                                label="Payment Due"
                                removeBtnRow={true}
                            >
                            </ProgressStep>
                            <ProgressStep 
                                label="Payment Done"
                                removeBtnRow={true}
                            >
                            </ProgressStep>
                        </ProgressSteps>
                    </View>
                    
                </View>
                {/* <View style={styles.lowerContainer}>
                </View> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        padding:15,
        // marginBottom: 35
    },
    stepLables: {
        // flexDirection: 'row',
        // width: '100%',
        // alignContent: 'space-between'
        flexDirection: "row", 
        alignItems:"center", 
        // elevation: 3, 
        // backgroundColor: colors.white,
        // padding: 8,
        marginBottom: -15,
        justifyContent:"space-between",
        width: "100%",
    },
    buttonStyle: {
        letterSpacing: 0,
        lineHeight:0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    upperContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
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
    customerVehicle: {
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
        width: "100%",
    },
})

const mapStateToProps = state => ({
    userRole: state.role.user_role,
    userToken: state.user.userToken,
})

export default connect(mapStateToProps)(OrderCreated);
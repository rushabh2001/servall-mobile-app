import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Linking, FlatList } from "react-native";
import { Checkbox, Divider } from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import { connect } from 'react-redux';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import moment from "moment";
import { API_URL } from "../constants/config";

const OrderWorkInProgress = ({ navigation, userRole, route, userToken }) => {

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

    const [isCreatedAt, setIsCreatedAt] = useState(route?.params?.data?.created_at);
    const [createdAt, setCreatedAt] = useState(moment(route?.params?.data?.created_at, 'YYYY-MM-DD hh:mm:ss').fromNow());

    const [isEstimatedDeliveryDateTime, setIsEstimatedDeliveryDateTime] = useState(route?.params?.data?.estimated_delivery_time);
    const [estimatedDeliveryDateTime, setEstimatedDeliveryDateTime] = useState(moment(route?.params?.data?.estimated_delivery_time, 'YYYY-MM-DD hh:mm:ss').format('DD-MM-YYYY hh:mm A'));

    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(route?.params?.data?.labor_total);
    const [partsTotal, setPartsTotal] = useState(route?.params?.data?.parts_total);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);
    
    const [fieldsServices, setFieldsServices] = useState([]);
    const [fieldsParts, setFieldsParts] = useState([]);

    const changeServicesStatus = async () => {
        let orderStatusArray = [];
        serviceData.forEach(item => {
            orderStatusArray.push({ order_service_id: item.id, is_done: item.is_done });
        });
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
            if (json !== undefined) {
                console.log(json);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const changePartsStatus = async () => {
        let orderStatusArray = [];
        partData.forEach(item => {
            orderStatusArray.push({ order_part_id: item.id, is_done: item.is_done });
        });
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
            if (json !== undefined) {
                {(partData.length != 0 && serviceData.length != 0) && navigation.navigate('OrderWorkInProgress')}
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        setServiceData(route?.params?.data?.services_list);
        setPartData(route?.params?.data?.parts_list);
    }, [route?.params?.data]);

    return (
        <View style={styles.surfaceContainer}>
            <ScrollView>
                <View style={styles.upperContainer}>
                    <View style={styles.stepLables}>
                        <View style={{justifyContent: 'flex-start'}}>
                            <Text style={{lineHeight: 20}}>Created {'\n'}{createdAt}
                            </Text>
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
                                    </View>
                                    <View style={{flexDirection: "row", alignItems:"center", justifyContent: 'center'}}>
                                        <Text style={styles.customerPhonenumber}>{isPhoneNumber}</Text>
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
                                            </>
                                        : null }
                                    </View>
                                    <View style={styles.cardContainer}>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                                            <Text style={{color: colors.black, fontSize: 16}}>Total</Text>
                                            <Text style={{color: colors.black, fontSize: 16}}>₹ {isTotal}</Text>
                                        </View>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                                            <Text style={{color: colors.green, fontSize: 16}}>Received</Text>
                                            <Text style={{color: colors.green, fontSize: 16}}>₹ 0</Text>
                                        </View>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>Due</Text>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>₹ {isTotal}</Text>
                                        </View>
                                        <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>Discount</Text>
                                            <Text style={{color: colors.danger2, fontSize: 16}}>{isApplicableDiscount}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:"row", marginTop: 15, alignSelf:"center", justifyContent:'center'}}>
                                        <TouchableOpacity 
                                            onPress={()=> Linking.openURL(`tel:${isPhoneNumber}`) } 
                                        >
                                            <IconX name={"file-pdf"} size={28} color={colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{marginTop: 5, alignSelf:"center", justifyContent:'center'}}>
                                        <Text style={{color: colors.black}}>Repair Order</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'column', marginTop: 20}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.secondary, padding: 10}}>
                                        <Text style={{fontSize: 18, color: colors.white}}>Services</Text>
                                        <TouchableOpacity onPress={changeServicesStatus} style={[styles.smallButton, {paddingHorizontal: 8, borderColor: colors.white}]}><IconX name={"edit"} size={16} color={colors.white} /><Text style={{marginLeft:4, color:colors.white}}>Save Progress</Text></TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection:'column', backgroundColor: colors.white}}>
                                        <FlatList
                                            ItemSeparatorComponent= {() => (<Divider />)}
                                            data={serviceData}
                                            keyExtractor={item => `services-${item.id}`}
                                            renderItem={({item, index}) => (
                                                <TouchableOpacity  
                                                    onPress={() => {
                                                        if(serviceData[index]['is_done'] == 0) {
                                                            let serviceValues2 = [...serviceData];
                                                            serviceValues2[index]['is_done'] = 1;
                                                            setServiceData(serviceValues2);
                                                        } else {                                                          
                                                            let serviceValues2 = [...serviceData];
                                                            serviceValues2[index]['is_done'] = 0;
                                                            setServiceData(serviceValues2); 
                                                        }
                                                    }}
                                                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, paddingHorizontal: 10}}
                                                    activeOpacity={1}
                                                >
                                                    <Text style={{fontSize: 18, color: colors.black}}>- {item?.service?.name}</Text>
                                                    <Checkbox
                                                        status={serviceData[index]['is_done'] == 1 ? 'checked' : 'unchecked'}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>

                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, backgroundColor: colors.secondary, padding: 10}}>
                                        <Text style={{fontSize: 18, color: colors.white}}>Parts</Text>
                                        <TouchableOpacity onPress={changePartsStatus} style={[styles.smallButton, {paddingHorizontal: 8, borderColor: colors.white}]}><IconX name={"edit"} size={16} color={colors.white} /><Text style={{marginLeft:4, color:colors.white}}>Save Progress</Text></TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection:'column', backgroundColor: colors.white}}>
                                        <FlatList
                                            ItemSeparatorComponent= {() => (<Divider />)}
                                            data={partData}
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
                                                    }}
                                                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, paddingHorizontal: 10}}
                                                    activeOpacity={1}
                                                >
                                                    <Text style={{fontSize: 18, color: colors.black}}>- {item?.parts?.name}</Text>
                                                    <Checkbox
                                                        status={item.is_done == 1 ? 'checked' : 'unchecked'}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </View>

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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        padding:15,
    },
    stepLables: {
        flexDirection: "row", 
        alignItems:"center", 
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
        width: "100%",
    },
})

const mapStateToProps = state => ({
    userRole: state.role.user_role,
    userToken: state.user.userToken,
})

export default connect(mapStateToProps)(OrderWorkInProgress);
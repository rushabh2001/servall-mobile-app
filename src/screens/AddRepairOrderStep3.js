import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Modal, Portal, Button, TextInput, List, Divider, Searchbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SliderPicker } from 'react-native-slider-picker';
import { Picker } from '@react-native-picker/picker';

// Step - 2 for Repair Order
const AddRepairOrderStep3 = ({ route, userToken, navigation }) => {

    // User / Customer Fields
    const [isGarageId, setIsGarageId] = useState(route?.params?.userVehicleDetails?.garage_id);
    const [isUserId, setIsUserId] = useState(route?.params?.userVehicleDetails?.user_id);
    const [isVehicleId, setIsVehicleId] = useState(route?.params?.userVehicleDetails?.vehicle_id);
    const [isName, setIsName] = useState(route?.params?.userVehicleDetails?.name);
    const [isEmail, setIsEmail] = useState(route?.params?.userVehicleDetails?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(route?.params?.userVehicleDetails?.phone_number);

    // Vehicle Fields
    const [isBrandName, setIsBrandName] = useState(route?.params?.userVehicleDetails?.brand_name);
    const [isModelName, setIsModelName] = useState(route?.params?.userVehicleDetails?.model_name);
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] = useState(route?.params?.userVehicleDetails?.vehicle_registration_number);

    const [isOdometerKMs, setIsOdometerKMs] = useState('');
    const [odometerKMsError, setOdometerKMsError] = useState('');
    const [isFuelLevel, setIsFuelLevel] = useState(5);
    // const [odometerKMsError, setOdometerKMsError] = useState();

    // const [isOdometerKMs, setIsOdometerKMs] = useState(route?.params?.userVehicleDetails?.odometer);
    // const [isFuelLevel, setIsFuelLevel] = useState(route?.params?.userVehicleDetails?.fuel_level);

    const [isOrderStatus, setIsOrderStatus] = useState("Vehicle Received");
    const [orderStatusError, setOrderStatusError] = useState();

    const [isVehicleImg, setIsVehicleImg] = useState();

    const [isComment, setIsComment] = useState();

    const [isPart, setIsPart] = useState('');
    const [isPartName, setIsPartName] = useState('');
    const [isService, setIsService] = useState('');
    const [isServiceName, setIsServiceName] = useState('');

    const [isNewService, setIsNewService] = useState('');
    const [newServiceError, setNewServiceError] = useState();
    const [addNewServiceModal, setAddNewServiceModal] = useState(false);

    const [isNewPart, setIsNewPart] = useState('');
    const [newPartError, setNewPartError] = useState();
    const [addNewPartModal, setAddNewPartModal] = useState(false);

    // const [isEstimatedDeliveryDateTime, setIsEstimatedDeliveryDateTime] = useState(new Date());
    const [estimatedDeliveryDateTime, setEstimatedDeliveryDateTime] = useState('');
    const [displayDeliveryDateCalender, setDisplayDeliveryDateCalender] = useState(false);
    const [displayDeliveryTimeClock, setDisplayDeliveryTimeClock] = useState(false);
    const [isDeliveryDate, setIsDeliveryDate] = useState(new Date());
    const [isDeliveryDate1, setIsDeliveryDate1] = useState('');
    const [isDeliveryTime, setIsDeliveryTime] = useState(new Date());
    const [estimateDeliveryDateError, setEstimateDeliveryDateError] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const [serviceError, setServiceError] = useState();
    const [serviceList, setServiceList] = useState([]);

    const [partError, setPartError] = useState();

    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(0);
    const [partsTotal, setPartsTotal] = useState(0);
    const [isTotal, setIsTotal] = useState(0);
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(0);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);

    const [fieldsServices, setFieldsServices] = useState([]);
    const [fieldsParts, setFieldsParts] = useState([]);

    const [partListModal, setPartListModal] = useState(false);
    const [isLoadingPartList, setIsLoadingPartList] = useState(false);
    const [partList, setPartList] = useState([]);
    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState(); 
    
    const [searchQueryForServices, setSearchQueryForServices] = useState(); 
    const [filteredServiceData, setFilteredServiceData] = useState([]);
    const [serviceListModal, setServiceListModal] = useState(false);
    const [isLoadingServiceList, setIsLoadingServiceList] = useState(false);

    const validate = () => {
        return !(
            !isOdometerKMs || isOdometerKMs?.trim().length === 0 ||
            (!fieldsServices && !fieldsParts) || (fieldsServices.length === 0 && fieldsParts.length === 0  ) || 
            !estimatedDeliveryDateTime || estimatedDeliveryDateTime?.trim().length === 0 
        )
    }

    const submit = () => {
        console.log('working fine');
        Keyboard.dismiss();  

        if (!validate()) {
            if (!isOdometerKMs) setOdometerKMsError("Odometer Kilometer is required"); else setOdometerKMsError('');
            if (!estimatedDeliveryDateTime || estimatedDeliveryDateTime?.trim().length === 0) setEstimateDeliveryDateError("Estimate Delivery Date is required"); else setEstimateDeliveryDateError('');
            return;
        }

        const data = new FormData();
        data.append('garage_id', isGarageId);
        data.append('user_id', isUserId);
        data.append('vehicle_id', isVehicleId);
        data.append('odometer', isOdometerKMs);
        data.append('fuel_level', isFuelLevel);
        data.append('order_service', JSON.stringify(fieldsServices));
        data.append('order_parts', JSON.stringify(fieldsParts));
        data.append('estimated_delivery_time', moment(estimatedDeliveryDateTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss'));
        data.append('labor_total', servicesTotal);
        data.append('parts_total', partsTotal);
        data.append('discount', isApplicableDiscount);
        if(isVehicleImg != null) data.append('orderimage', isVehicleImg);
        data.append('total', isTotal);
        data.append('comment', isComment?.trim());

        addOrder(data);
        console.log('data', data);
    }

    const addOrder = async (data) => {
        console.log('addOrder');
        try {
            await fetch(`${API_URL}add_order`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; ',
                    'Authorization': 'Bearer ' + userToken
                },
                body: data
            }) 
            .then(res => {
                const statusCode = res.status;
                let data;
                return res.json().then(obj => {
                    data = obj;
                    return { statusCode, data };
                });
            })
            .then((res) => {
                console.log('res', res);
                if(res.statusCode == 400) {
                  { res.data.message.estimated_delivery_time && setEstimateDeliveryDateError(res.data.message.estimated_delivery_time); }
                  return;
                } else if(res.statusCode == 201 || res.statusCode == 200) {
                    navigation.navigate('OpenOrderList');
                } else {
                    navigation.navigate('OpenOrderList');
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            navigation.navigate('OpenOrderList');
        }
    };

    function handleServiceChange(i, value) {
        const values = [...fieldsServices];

        // Calculation of Specific Part's total
        values[i][value.name] = value.value;
        values[i]['amount'] = (values[i]['rate'] * values[i]['qty']) - ((values[i]['rate'] * values[i]['qty']) * (values[i]['discount'] / 100))

        // Calculation of Total of all Parts
        serviceTotals[i] = values[i]['amount'];
        let total = 0;
        values.forEach(item => {
            total += item.amount;
        });
        setServicesTotal(total);
        setIsTotal(total + partsTotal);

        // Calculate Total of Order
        values[i]['applicableDiscountForItem'] = (values[i]['rate'] * values[i]['qty']) * (values[i]['discount'] / 100);
        let discountTotal = 0;
        values.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalServiceDiscount(discountTotal);
        setIsApplicableDiscount(discountTotal + isTotalPartDiscount);
    }

    function handleServiceAdd(data) {
        const values = [...fieldsServices];
        values.push({ service_id: data.service_id, serviceName: data.serviceName, rate: 0, qty: 0, discount: 0, applicableDiscountForItem: 0, amount: 0 });
        setFieldsServices(values);
        setServiceListModal(false);
    }

    function handleServiceRemove(i) {
        // Remove Field from Array Javascript
        const values = [...fieldsServices];
        values.splice(i, 1);
        setFieldsServices(values);

        // Recalculation of Totals
        let total = 0;
        values.forEach(item => {
            total += item.amount;
        });
        setServicesTotal(total);
        setIsTotal(total + partsTotal);

        // Calculate Total of Order
        let discountTotal = 0;
        values.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalServiceDiscount(discountTotal);
        setIsApplicableDiscount(discountTotal + isTotalPartDiscount);
    }

    // Function for Parts Fields
    function handlePartChange(i, value) {
        const partValues = [...fieldsParts];

        // Calculation of Specific Part's total
        partValues[i][value.name] = value.value;
        partValues[i]['amount'] = (partValues[i]['rate'] * partValues[i]['qty']) - ((partValues[i]['rate'] * partValues[i]['qty']) * (partValues[i]['discount'] / 100))
        setFieldsParts(partValues);
        partTotals[i] = partValues[i]['amount'];

        // Calculation of Total of all Parts
        let total = 0;
        partValues.forEach(item => {
            total += item.amount;
        });
        setPartsTotal(total);

        // Calculate Total of Order
        setIsTotal(total + servicesTotal);
        partValues[i]['applicableDiscountForItem'] = (partValues[i]['rate'] * partValues[i]['qty']) * (partValues[i]['discount'] / 100);
        let discountTotal = 0;
        partValues.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalPartDiscount(discountTotal);
        setIsApplicableDiscount(discountTotal + isTotalServiceDiscount);
    }

    function handlePartAdd(data) {
        const partValues = [...fieldsParts];
        partValues.push({ parts_id: data.parts_id, partName: data.partName, rate: 0, qty: 0, discount: 0, applicableDiscount: 0, amount: 0 });
        setFieldsParts(partValues);
        setPartListModal(false);
    }

    function handlePartRemove(i) {
        // Remove Field from Array Javascript
        const partValues = [...fieldsParts];
        partValues.splice(i, 1);
        setFieldsParts(partValues);

        // Recalculation of Totals
        let total = 0;
        partValues.forEach(item => {
            total += item.amount;
        });
        setPartsTotal(total);

        // Calculate Total of Order
        setIsTotal(total + servicesTotal);
        let discountTotal = 0;
        partValues.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });
        setIsTotalPartDiscount(discountTotal);
        setIsApplicableDiscount(discountTotal + isTotalServiceDiscount);
    }


    const selectVehicleImg = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true,
            });
            console.log(res);
            setIsVehicleImg(res);
        } catch (err) {
            setIsVehicleImg(null);
            if (DocumentPicker.isCancel(err)) {
                setVehicleImgError('Canceled');
            } else {
                setVehicleImgError('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const changeEstimateDeliverySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate;
            let formattedDate = moment(currentDate, 'YYYY MMMM D', true).format('DD-MM-YYYY');
            setDisplayDeliveryDateCalender(false);
            let formattedDate2 = new Date(currentDate);
            setIsDeliveryDate(formattedDate2);
            setIsDeliveryDate1(formattedDate);
            setDisplayDeliveryTimeClock(true);
        }
    };

    const changeSelectedTime = (event, selectedTime) => {
        if (selectedTime != null) {          
            let currentTime = selectedTime;
            let convertToTime = moment(currentTime, 'YYYY-MM-DD"T"hh:mm ZZ').format('hh:mm A');
            var formattedDate = isDeliveryDate1 + ' ' + convertToTime;
            setDisplayDeliveryTimeClock(false);
            setEstimatedDeliveryDateTime(formattedDate);            
            setIsDeliveryTime(new Date(currentTime));
            console.log({'setIsDeliveryTime': isDeliveryTime, 'Delivery Date': isDeliveryDate, 'Delivery Date1': isDeliveryDate1,'convertToTime': convertToTime, 'selectedTime': selectedTime, 'currentTime': currentTime });
        }
    };

    // Parts Functions ----- End Here
    const getPartList = async () => {
        setIsLoadingPartList(true);
        try {
            const res = await fetch(`${API_URL}fetch_parts`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setPartList(json.data);
                setFilteredPartData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingPartList(false)
        }
    };

    const getServiceList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_service`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setServiceList(json.data);
                setFilteredServiceData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingServiceList(false)
        }
    };

    const addNewService = async () => {
        let data = { 'name': isNewService }
        try {
            const res = await fetch(`${API_URL}add_service`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json !== undefined) {
                getServiceList();
                setIsService(parseInt(json.data.id));
                setIsServiceName(json.data.name);
                let data = {
                    service_id: json.data.id,
                    serviceName: json.data.name,
                }
                handleServiceAdd(data)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const addNewPart = async () => {
        let data = { 'name': isNewPart }
        try {
            const res = await fetch(`${API_URL}add_parts`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json !== undefined) {
                getPartList();
                setIsPart(parseInt(json.data.id));
                setIsPartName(json.data.name);

                let data = {
                    parts_id: json.data.id,
                    partName: json.data.name,
                }
                handlePartAdd(data)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const searchFilterForParts = (text) => {
        if (text) {
            let newData = partList.filter(
                function (listData) {
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredPartData(newData);
            setSearchQueryForParts(text);
        } else {
            setFilteredPartData(partList);
            setSearchQueryForParts(text);
        }
    };

    const searchFilterForServices = (text) => {
        if (text) {
            let newData = serviceList.filter(
                function (listData) {
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredServiceData(newData);
            setSearchQueryForServices(text);
        } else {
            setFilteredServiceData(serviceList);
            setSearchQueryForServices(text);
        }
    };

    useEffect(() => {
        getServiceList();
        getPartList();
    }, []);

    return (
        <View style={styles.pageContainer}>
            {(isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                <InputScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={8}
                    behavior="padding"
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Order Details: </Text>
                        <View style={styles.cardContainer}>
                            <View style={[styles.cardRightContent, { flex: 0.5 }]}>
                                <Text style={styles.cardMainTitle}>Customer Details:</Text>
                                <Text style={styles.cardTitle}>{isName}</Text>
                                <Text style={styles.cardTitle}>{isEmail}</Text>
                                <Text style={styles.cardTitle}>{isPhoneNumber}</Text>
                            </View>
                            <View style={[styles.cardRightContent, { flex: 0.5 }]}>
                                <Text style={styles.cardMainTitle}>Vehicle Details:</Text>
                                <Text style={styles.cardTitle}>{isBrandName}</Text>
                                <Text style={styles.cardTitle}>{isModelName}</Text>
                                <Text style={styles.cardTitle}>{isVehicleRegistrationNumber}</Text>
                            </View>
                        </View>

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Service:</Text>

                        {fieldsServices.map((field, idx) => {
                            return (
                                <>
                                    <View style={styles.addFieldContainerGroup} key={`service-${field}-${idx}`}>

                                        <TouchableOpacity style={styles.removeEntryIconContainer} onPress={() => handleServiceRemove(idx)}>
                                            <Icon style={styles.removeEntryIcon} name="close" size={30} color="#000" />
                                        </TouchableOpacity>
                                        
                                        <View style={[styles.cardRightContent, { flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 0 }]}>
                                            <Text style={[styles.partNameContent, {fontWeight: '600'}]}>Service Name: </Text>
                                            <Text style={styles.serviceNameContent}>{fieldsServices[idx].serviceName}</Text>
                                        </View>

                                        <View style={[styles.cardRightContent, { flex: 1 }]}>
                                            <View style={styles.addFieldContainer}>
                                                <TextInput
                                                    mode="outlined"
                                                    label='Rate'
                                                    style={styles.textEntryInput}
                                                    placeholder="Rate"
                                                    keyboardType="numeric"
                                                    onChangeText={
                                                        e => {
                                                            let parameter = {
                                                                name: 'rate',
                                                                value: e,
                                                            };
                                                            handleServiceChange(idx, parameter);
                                                        }
                                                    }
                                                />

                                                <TextInput
                                                    mode="outlined"
                                                    label='Quantity'
                                                    style={styles.textEntryInput}
                                                    placeholder="Quantity"
                                                    keyboardType="numeric"
                                                    onChangeText={
                                                        e => {
                                                            let parameter = {
                                                                name: 'qty',
                                                                value: e,
                                                            };
                                                            handleServiceChange(idx, parameter);
                                                        }
                                                    }
                                                />

                                                <TextInput
                                                    mode="outlined"
                                                    label='Discount'
                                                    style={styles.textEntryInput}
                                                    placeholder="Discount"
                                                    keyboardType="numeric"
                                                    onChangeText=
                                                    {
                                                        e => {
                                                            let parameter = {
                                                                name: 'discount',
                                                                value: e,
                                                            };
                                                            handleServiceChange(idx, parameter);
                                                        }
                                                    }
                                                />
                                        
                                            </View>

                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 0, fontWeight: '600'}}>Total for this Service: </Text>
                                                <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 5 }}>{(fieldsServices[idx]) ? fieldsServices[idx].amount : 0}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <Portal>
                                        <Modal visible={addNewServiceModal} onDismiss={() => { setAddNewServiceModal(false); setServiceListModal(true);  setIsNewService(0); setNewServiceError(''); }} contentContainerStyle={styles.modalContainerStyle}>
                                            <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Service</Text>
                                            <View>
                                                <TextInput
                                                    mode="outlined"
                                                    label='Service Name'
                                                    style={styles.input}
                                                    placeholder="Service Name"
                                                    value={isNewService}
                                                    onChangeText={(text) => setIsNewService(text)}
                                                />
                                            </View>
                                            {newServiceError?.length > 0 &&
                                                <Text style={styles.errorTextStyle}>{newServiceError}</Text>
                                            }

                                            <View style={{ flexDirection: "row", marginTop: 10}}>
                                                <Button
                                                    style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                                    mode={'contained'}
                                                    onPress={() => {
                                                        if(isNewService == "") {
                                                            setNewServiceError("Please Enter Service Name");
                                                        } else {
                                                            setAddNewServiceModal(false);
                                                            setIsNewService('');
                                                            setNewServiceError('');
                                                            addNewService();
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                                <Button
                                                    style={{ marginTop: 15, flex: 1 }}
                                                    mode={'contained'}
                                                    onPress={() => {
                                                        setAddNewServiceModal(false);
                                                        setServiceListModal(true);
                                                        setIsNewService('');
                                                        setNewServiceError('');
                                                    }}
                                                >
                                                    Close
                                                </Button>
                                            </View>
                                        </Modal>
                                    </Portal>
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={'contained'}
                                icon="plus"
                                onPress={() => 
                                        setServiceListModal(true)
                                    }
                            >
                                Add Service
                            </Button>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                                

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Parts:</Text>
                        {fieldsParts.map((field, idx) => {
                            return (
                                <>
                                    <View style={styles.addFieldContainerGroup} key={`fieldsParts-${field}-${idx}`}>
                                
                                        <TouchableOpacity style={styles.removeEntryIconContainer} onPress={() => handlePartRemove(idx)}>
                                            <Icon style={styles.removeEntryIcon} name="close" size={30} color="#000" />
                                        </TouchableOpacity>
                                    
                                        <View style={[styles.cardRightContent, { flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 0 }]}>
                                            <Text style={[styles.partNameContent, {fontWeight: '600'}]}>Part Name: </Text>
                                            <Text style={styles.partNameContent}>{fieldsParts[idx].partName}</Text>
                                        </View>

                                        <View style={[styles.cardRightContent, { flex: 1 }]}>
                                            <View style={styles.addFieldContainer} >
                                                <TextInput
                                                    mode="outlined"
                                                    label='Rate'
                                                    style={[styles.textEntryInput]}
                                                    placeholder="Rate"
                                                    keyboardType="numeric"
                                                    onChangeText={
                                                        e => {
                                                            let parameter = {
                                                                name: 'rate',
                                                                value: e,
                                                            };
                                                            handlePartChange(idx, parameter);
                                                        }
                                                    }
                                                />

                                                <TextInput
                                                    mode="outlined"
                                                    label='Quantity'
                                                    style={styles.textEntryInput}
                                                    placeholder="Quantity"
                                                    keyboardType="numeric"
                                                    onChangeText={
                                                        e => {
                                                            let parameter = {
                                                                name: 'qty',
                                                                value: e,
                                                            };
                                                            handlePartChange(idx, parameter);
                                                        }
                                                    }
                                                />

                                                <TextInput
                                                    mode="outlined"
                                                    label='Discount'
                                                    style={styles.textEntryInput}
                                                    placeholder="Discount"
                                                    keyboardType="numeric"
                                                    onChangeText=
                                                    {
                                                        e => {
                                                            let parameter = {
                                                                name: 'discount',
                                                                value: e,
                                                            };
                                                            handlePartChange(idx, parameter);
                                                        }
                                                    }
                                                />
                                            
                                            </View>
                                            
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 0, fontWeight: '600'}}>Total for this Part: </Text>
                                                <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 5 }}>{(fieldsParts[idx]) ? fieldsParts[idx].amount : 0}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <Portal>
                                        <Modal visible={addNewPartModal} onDismiss={() => { setAddNewPartModal(false); setPartListModal(true);  setIsNewPart(0); setNewPartError(''); }} contentContainerStyle={styles.modalContainerStyle}>
                                            <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Part</Text>
                                            <View>
                                                <TextInput
                                                    mode="outlined"
                                                    label='Part Name'
                                                    style={styles.input}
                                                    placeholder="Part Name"
                                                    value={isNewPart}
                                                    onChangeText={(text) => setIsNewPart(text)}
                                                />
                                            </View>
                                            {newPartError?.length > 0 &&
                                                <Text style={styles.errorTextStyle}>{newPartError}</Text>
                                            }

                                            <View style={{ flexDirection: "row", marginTop: 10}}>
                                                <Button
                                                    style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                                    mode={'contained'}
                                                    onPress={() => {
                                                        if(isNewPart == "") {
                                                            setNewPartError("Please Enter Part Name");
                                                        } else {
                                                            setAddNewPartModal(false);
                                                            setIsNewPart('');
                                                            setNewPartError('');
                                                            addNewPart();
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                                <Button
                                                    style={{ marginTop: 15, flex: 1 }}
                                                    mode={'contained'}
                                                    onPress={() => {
                                                        setAddNewPartModal(false);
                                                        setPartListModal(true);
                                                        setIsNewPart('');
                                                        setNewPartError('');
                                                    }}
                                                >
                                                    Close
                                                </Button>
                                            </View>
                                        </Modal>
                                    </Portal>
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={'contained'}
                                icon="plus"
                                onPress={() => {
                                        setPartListModal(true);
                                }}
                            >
                                Add Part
                            </Button>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        {/* Fieldset - Totals */}
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Totals:</Text>
                        <View style={styles.totalFieldContainerGroup}>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.8 }]}>
                                    <Text style={styles.partNameContent}>Services Total</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                        <Text style={{fontSize: 18, color: colors.black}}>{servicesTotal}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.8 }]}>
                                    <Text style={styles.partNameContent}>Parts Total</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                        <Text style={{fontSize: 18, color: colors.black}}>{partsTotal}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.8 }]}>
                                    <Text style={styles.partNameContent}>Applicable Discount</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                         <Text style={{fontSize: 18, color: colors.black}}>{isApplicableDiscount}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.9 }]}>
                                    <Text style={styles.partNameContent}>Total {'\n'} (Inclusive of Taxes)</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                        <Text style={{fontSize: 18, color: colors.black}}>{isTotal}</Text>
                                    </View>
                                </View>
                            </View>
                           
                        </View>

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Vehicle Images:</Text>

                        <View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.uploadButtonStyle}
                                onPress={selectVehicleImg}>
                                <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
                                <Text style={{ marginRight: 10, fontSize: 18, color: "#000" }}>
                                    Upload Vehicle Image
                                </Text>
                                {isVehicleImg != null ? (
                                    <Text style={styles.textStyle}>
                                        File Name: 
                                        {isVehicleImg?.map((isVehicleImg, i) => {
                                            return (
                                                isVehicleImg.name + ", "
                                            );
                                        })}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View>

                        {/* Additional Information */}
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Additional Information:</Text>

                        <View style={{borderBottomWidth:1, borderColor: colors.light_gray, borderRadius: 4, marginTop: 20, backgroundColor: '#F0F2F5'}}>
                            <Picker
                                selectedValue={isOrderStatus}
                                onValueChange={(v) => {setIsOrderStatus(v)}}
                                style={{padding: 0}}
                                itemStyle={{padding: 0}}
                            >
                                <Picker.Item key={1} label="Select Order Status" value="0" />
                                <Picker.Item key={2} label="Vehicle Received" value="Vehicle Received" />
                                <Picker.Item key={3} label="Work in Progress Order" value="Work in Progress Order" />
                                <Picker.Item key={4} label="Vehicle Ready" value="Vehicle Ready" />
                                <Picker.Item key={5} label="Completed Order" value="Completed Order" />
                            </Picker>
                        </View>
                        {orderStatusError?.length > 0 &&
                            <Text style={{color: colors.danger}}>{orderStatusError}</Text>
                        }

                        {/* <Text style={[styles.headingStyle, { marginTop: 20 }]}>Additional Information:</Text> */}
                        <TextInput
                            mode="outlined"
                            label='Odometer (in KMs)'
                            style={styles.input}
                            placeholder="Odometer (in KMs)"
                            value={isOdometerKMs}
                            onChangeText={(text) => setIsOdometerKMs(text)}
                            keyboardType="numeric"
                        />
                        {odometerKMsError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{odometerKMsError}</Text>
                        }

                        <View style={styles.odometerContainer}>
                            <SliderPicker
                                minLabel={"Empty"}
                                maxLabel={"Full"}
                                minValue={0}
                                maxValue={10}
                                callback={(position) => {
                                    setIsFuelLevel(position);
                                }}
                                defaultValue={5}
                                showFill={true}
                                fillColor={'green'}
                                labelFontWeight={'500'}
                                labelFontSize={14}
                                labelFontColor={colors.default_theme.black}
                                showNumberScale={false}
                                showSeparatorScale={true}
                                buttonBackgroundColor={'#fff'}
                                buttonBorderColor={"#6c7682"}
                                buttonBorderWidth={1}
                                scaleNumberFontWeight={'300'}
                                buttonDimensionsPercentage={6}
                                heightPercentage={1}
                                widthPercentage={80}
                                labelStylesOverride={{ marginTop: 25 }}
                            />
                            <Text style={{ fontWeight: "600", fontSize: 18, color: colors.black }}>Fuel Level: {isFuelLevel}</Text>
                        </View>

                        <TextInput
                            mode="outlined"
                            label='Comment'
                            style={styles.input}
                            placeholder="Comment"
                            value={isComment}
                            onChangeText={(text) => setIsComment(text)}
                            numberOfLines={3}
                            multiline={true}
                        />

                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setDisplayDeliveryDateCalender(true)} activeOpacity={1}>
                            <View style={styles.datePickerContainer} pointerEvents='none'>
                                <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                <TextInput
                                    mode="outlined"
                                    label='Estimate Delivery Time'
                                    style={styles.datePickerField}
                                    placeholder="Estimate Delivery Time"
                                    value={estimatedDeliveryDateTime}
                                />
                                {(displayDeliveryDateCalender == true) &&
                                    <DateTimePicker
                                        value={(isDeliveryDate) ? isDeliveryDate : null}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="spinner"
                                        onChange={changeEstimateDeliverySelectedDate}
                                    />}
                                {displayDeliveryTimeClock && (
                                    <DateTimePicker
                                        value={(isDeliveryTime) ? isDeliveryTime : null}
                                        mode={'time'}
                                        is24Hour={false}
                                        display="spinner"
                                        onChange={changeSelectedTime}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                        {estimateDeliveryDateError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{estimateDeliveryDateError}</Text>
                        }

                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            onPress={submit}
                        >
                            Create Repair Order
                        </Button>

                        <Portal>
                            {/* Parts List Modal */}
                            <Modal visible={partListModal} onDismiss={() => { setPartListModal(false); setIsPart(0); setIsPartName(''); setPartError(''); setSearchQueryForParts('');  searchFilterForParts();}} contentContainerStyle={styles.modalContainerStyle}>
                                <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Part</Text>
                                {(isLoadingPartList == true) ? <ActivityIndicator></ActivityIndicator>
                                    :
                                    <>
                                        <View style={{marginTop: 20, marginBottom: 10}}>
                                            <Searchbar
                                                placeholder="Search here..."
                                                onChangeText={(text) => { if(text != null) searchFilterForParts(text)}}
                                                value={searchQueryForParts}
                                                elevation={0}
                                                style={{ elevation: 0.8, marginBottom: 10}}
                                            />
                                            {filteredPartData?.length > 0 ?  
                                                <FlatList
                                                    ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                                    data={filteredPartData}
                                                    style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item}) => (
                                                        <>
                                                            <List.Item
                                                                title={
                                                                    <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                        <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                                    </View>
                                                                }
                                                                key={item.id}
                                                                onPress={() => {
                                                                        setIsPartName(item.name); 
                                                                        setIsPart(item.id); 
                                                                        let parameter = {
                                                                            parts_id: item.id,
                                                                            partName: item.name
                                                                        };
                                                                        handlePartAdd(parameter);

                                                                        setPartError('');
                                                                        setPartListModal(false);  
                                                                        setSearchQueryForParts(''); 
                                                                        searchFilterForParts();
                                                                    }
                                                                }
                                                            />
                                                        </>
                                                    )} 
                                                />
                                            :
                                                <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                                    <Text style={{ color: colors.black, textAlign: 'center'}}>No such part is associated!</Text>
                                                </View>
                                            }
                                            <View style={{justifyContent:"flex-end", flexDirection: 'row'}}>
                                                <TouchableOpacity  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginTop: 7, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4}} onPress={() => { setAddNewPartModal(true); setPartListModal(false); }}>
                                                    <Icon style={{color: colors.white, marginRight: 4}} name="plus" size={16} />
                                                    <Text style={{color: colors.white}}>Add Part</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                }
                            </Modal>

                            {/* Services List Modal */}
                            <Modal visible={serviceListModal} onDismiss={() => { setServiceListModal(false); setIsService(0); setIsServiceName(''); setServiceError(''); setSearchQueryForParts('');  searchFilterForParts();}} contentContainerStyle={styles.modalContainerStyle}>
                                <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Service</Text>
                                {(isLoadingServiceList == true) ? <ActivityIndicator></ActivityIndicator>
                                :
                                    <>
                                        <View style={{marginTop: 20, marginBottom: 10}}>
                                            <Searchbar
                                                placeholder="Search here..."
                                                onChangeText={(text) => { if(text != null) searchFilterForServices(text)}}
                                                value={searchQueryForServices}
                                                elevation={0}
                                                style={{ elevation: 0.8, marginBottom: 10}}
                                            />
                                            {filteredServiceData?.length > 0 ?  
                                                <FlatList
                                                    ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                                    data={filteredServiceData}
                                                    style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item}) => (
                                                        <>
                                                            <List.Item
                                                                title={
                                                                    <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                        <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                                    </View>
                                                                }
                                                                onPress={() => {
                                                                        setIsServiceName(item.name); 
                                                                        setIsService(item.id); 
                                                                        let parameter = {
                                                                            service_id: item.id,
                                                                            serviceName: item.name
                                                                        };
                                                                        handleServiceAdd(parameter);

                                                                        setServiceError('');
                                                                        setServiceListModal(false);  
                                                                        setSearchQueryForServices(''); 
                                                                        searchFilterForServices();
                                                                    }
                                                                }
                                                            />
                                                        </>
                                                    )} 
                                                />
                                            :
                                                <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                                    <Text style={{ color: colors.black, textAlign: 'center'}}>No such service is associated!</Text>
                                                </View>
                                            }
                                            <View style={{justifyContent:"flex-end", flexDirection: 'row'}}>
                                                <TouchableOpacity  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginTop: 7, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4}} onPress={() => { setAddNewServiceModal(true); setServiceListModal(false); }}>
                                                    <Icon style={{color: colors.white, marginRight: 4}} name="plus" size={16} />
                                                    <Text style={{color: colors.white}}>Add Service</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                }
                            </Modal>
                        </Portal>
                    </View>
                </InputScrollView>
            }
        </View>
    )
}



const styles = StyleSheet.create({
    repairOrderField: {
        fontSize: 16,
        color: colors.black,
        position: 'absolute',
        marginTop: 15,
        left: 0,
        top: 0,
        width: '100%',
        height: '80%',
        zIndex: 2,
    },
    totalFieldsGroup: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    serviceNameContent: {
        fontSize: 17,
        color: colors.black
    },
    partNameContent: {
        fontSize: 18,
        color: colors.black
    },
    totalFieldTextContainer: {
        flex: 0.23,
        fontSize: 18,
        color: colors.black,
        marginLeft: 10
    },
    totalFieldContainer: {
        flex: 0.77,
    },
    totalFieldsRightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalFieldsLeftContent: {
        justifyContent: 'center',
        paddingLeft: 10,
    },
    totalFieldContainerGroup: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#ecf5f9",
        padding: 10,
    },
    addFieldContainerGroup: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#ecf5f9",
        padding: 10,
    },
    addFieldContainer: {
        flexDirection: 'row',
        display: 'flex',
        flex: 1,
        marginTop: 15,
    },
    textEntryInput: {
        fontSize: 16,
        flex: 0.33,
        marginRight: 10,
    },
    removeEntryIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        borderColor: colors.light_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.gray,
        position: 'absolute',
        top: 10,
        right: 10,
    },
    removeEntryIcon: {
        color: colors.white,
    },
    addFieldBtnContainer: {
        flexDirection: 'row',
    },
    pageContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    input: {
        marginTop: 20,
        fontSize: 16,
    },
    headingStyle: {
        fontSize: 20,
        color: colors.black,
        fontWeight: '500',
    },
    uploadButtonStyle: {
        backgroundColor: "#F3F6F8",
        borderColor: colors.light_gray,
        borderStyle: "dashed",
        borderWidth: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    datePickerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 20,
    },
    datePickerField: {
        flex: 1,
        borderColor: colors.light_gray,
        borderBottomWidth: 1,
        borderRadius: 5,
        backgroundColor: '#F0F2F5',
        color: '#424242',
        // paddingHorizontal: 15,
        // height: 55,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: 'absolute',
        right: 7,
        top: 13,
        zIndex: 2,
    },
    dropDownContainer: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 5,
        marginTop: 20,
    },
    dropDownField: {
        padding: 0,
    },
    errorTextStyle: {
        color: colors.danger,
        marginTop: 5,
        marginLeft: 5,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 30
    },
    odometerContainer: {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
    },
    cardContainer: {
        marginTop: 10,
        elevation: 1,
        flex: 1,
        flexDirection: 'row',
        borderColor: colors.black,
        backgroundColor: "#ecf5f9",
        padding: 10,
    },
    cardMainTitle: {
        color: "#000",
        fontSize: 17,
        fontWeight: '600'
    },
    cardTitle: {
        color: "#000",
        fontSize: 16,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(AddRepairOrderStep3);
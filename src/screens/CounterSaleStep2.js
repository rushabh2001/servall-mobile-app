import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity, Pressable, Image, FlatList } from 'react-native';
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { useIsFocused } from "@react-navigation/native";
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


// Step - 2 for Repair Order

const CounterSaleStep2 = ({ route, userToken }) => {

    // User / Customer Fields
    const [isUserDetails, setIsUserDetails] = useState();

    const [isUserId, setIsUserId] = useState(route?.params?.data?.user_id);
    // const [isVehicleId, setIsVehicleId] = useState(route?.params?.data?.vehicle_id);
    const [isName, setIsName] = useState(route?.params?.data?.name);
    const [isEmail, setIsEmail] = useState(route?.params?.data?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(route?.params?.data?.phone_number);

    // Vehicle Fields
    // const [isBrand, setIsBrand] = useState(route?.params?.data?.brand_id);
    // const [isBrandName, setIsBrandName] = useState(route?.params?.data?.brand_name);
    // const [isModel, setIsModel] = useState(route?.params?.data?.model_id);
    // const [isModelName, setIsModelName] = useState(route?.params?.data?.model_name);
    // const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] = useState(route?.params?.data?.vehicle_registration_number);

    // const [isOdometerKMs, setIsOdometerKMs] = useState(route?.params?.data?.odometer);
    // const [isFuelLevel, setIsFuelLevel] = useState(route?.params?.data?.fuel_level);

    // const [isVehicleImg, setIsVehicleImg] = useState();
    // const [vehicleImgError, setVehicleImgError] = useState();

    const [isQuantity, setIsQuantity] = useState();
    const [isRate, setIsRate] = useState();
    const [isServiceName, setIsServiceName] = useState();
    // const [isComment, setIsComment] = useState();

    const [isPart, setIsPart] = useState('');
    const [isService, setIsService] = useState('');

    // const [isEstimateDeliveryDateTime, setIsEstimateDeliveryDateTime] = useState(new Date());
    // const [estimateDeliveryDateTime, setEstimateDeliveryDateTime] = useState('');
    // const [displayDeliveryDateCalender, setDisplayDeliveryDateCalender] = useState(false);
    // const [displayDeliveryTimeClock, setDisplayDeliveryTimeClock] = useState(false);
    // const [isDeliveryDate, setIsDeliveryDate] = useState(new Date());
    // const [isDeliveryDate1, setIsDeliveryDate1] = useState('');
    // const [isDeliveryTime, setIsDeliveryTime] = useState(new Date());

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(true);

    const [addPartModal, setAddPartModal] = useState(false);
    const [addServiceModal, setAddServiceModal] = useState(false);

    // const [newBrandName, setNewBrandName] = useState();
    // const [addNewBrand, setAddNewBrand] = useState();
    const [serviceError, setServiceError] = useState();
    const [serviceList, setServiceList] = useState([]);

    const [partError, setPartError] = useState();
    const [partList, setPartList] = useState([]);
    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(0);
    const [partsTotal, setPartsTotal] = useState(0);
    const [isTotal, setIsTotal] = useState(0);
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(0);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);

    const isFocused = useIsFocused();

    const [fields, setFields] = useState([{ serviceName: null, rate: null, quantity: 0, discount: 0, applicableDiscountForItem: 0, totalForThisService: 0 }]);
    const [fieldsParts, setFieldsParts] = useState([{ serviceName: null, rate: null, quantity: 0, discount: 0, applicableDiscountForItem: 0, totalForThisService: 0 }]);

    function handleServiceChange(i, value) {
        const values = [...fields];
        values[i][value.name] = value.value;
        // calculateServicePrice
        values[i]['totalForThisService'] = (values[i]['rate'] * values[i]['quantity']) - ((values[i]['rate'] * values[i]['quantity']) * (values[i]['discount'] / 100))
        // values[i] = ({ key: serviceName, key: rate, key: quantity });
        // values[i] = { key: value };

        // values[i].push({key: value});
        // values[i].rate = value.rate;
        // values[i].quantity = value.quantity;
        // values[i].serviceName = value.serviceName;
        // values[i].value = value.rate;
        // console.log(i);
        setFields(values);
        // console.log(fields);
        serviceTotals[i] = values[i]['totalForThisService'];

        let total = 0;
        values.forEach(item => {
            total += item.totalForThisService;
            // console.log(total);
        });
        setServicesTotal(total);

        setIsTotal(total + partsTotal);

        values[i]['applicableDiscountForItem'] = (values[i]['rate'] * values[i]['quantity']) * (values[i]['discount'] / 100);
        let discountTotal = 0;
        values.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });

        setIsTotalServiceDiscount(discountTotal);

        setIsApplicableDiscount(discountTotal + isTotalPartDiscount);
        // console.log(values);
    }

    function handleServiceAdd() {
        const values = [...fields];
        values.push({ serviceName: null, rate: null, quantity: 0, discount: 0, applicableDiscountForItem: 0, totalForThisService: 0 });
        setFields(values);
    }

    function handleServiceRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    }

    // Function for Parts Fields

    function handlePartChange(i, value) {
        const partValues = [...fieldsParts];

        // Calculation of Specific Part's total
        partValues[i][value.name] = value.value;
        partValues[i]['totalForThisService'] = (partValues[i]['rate'] * partValues[i]['quantity']) - ((partValues[i]['rate'] * partValues[i]['quantity']) * (partValues[i]['discount'] / 100))
        // console.log(i);
        setFieldsParts(partValues);
        partTotals[i] = partValues[i]['totalForThisService'];
        // console.log(fieldsParts);

        // Calculation of Total of all Parts
        let total = 0;
        partValues.forEach(item => {
            total += item.totalForThisService;
            // console.log(total);
        });
        setPartsTotal(total);

        // Calculate Total of Order
        setIsTotal(total + servicesTotal);

        partValues[i]['applicableDiscountForItem'] = (partValues[i]['rate'] * partValues[i]['quantity']) * (partValues[i]['discount'] / 100);
        let discountTotal = 0;
        partValues.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });
        // serviceTotals[i] = partValues[i]['applicableDiscountForItem'];
        // discountTotal += partValues[i]['applicableDiscountForItem'];

        setIsTotalPartDiscount(discountTotal);

        setIsApplicableDiscount(discountTotal + isTotalServiceDiscount);
        console.log(partValues);
    }

    function handlePartAdd() {
        const partValues = [...fieldsParts];
        partValues.push({ serviceName: null, rate: null, quantity: null, discount: 0, applicableDiscount: 0, totalForThisService: null });
        setFieldsParts(partValues);
    }

    function handlePartRemove(i) {
        const partValues = [...fieldsParts];
        partValues.splice(i, 1);
        setFieldsParts(partValues);
    }


    // const selectVehicleImg = async () => {
    //     // Opening Document Picker to select one file
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.images],
    //             allowMultiSelection: true,
    //         });
    //         console.log(res);
    //         setIsVehicleImg(res);
    //     } catch (err) {
    //         setIsVehicleImg(null);
    //         if (DocumentPicker.isCancel(err)) {
    //             setVehicleImgError('Canceled');
    //         } else {
    //             setVehicleImgError('Unknown Error: ' + JSON.stringify(err));
    //             throw err;
    //         }
    //     }
    // };

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

    // useEffect(() => {
      
    // }, [isDeliveryDate1]);

    // useEffect(() => {

    // }, [estimateDeliveryDateTime]);

    const changeSelectedTime = (event, selectedTime) => {
        if (selectedTime != null) {
            // setDisplayDeliveryDateCalender(false);
            
            let currentTime = selectedTime;
            let convertToTime = moment(currentTime, 'YYYY-MM-DD"T"hh:mm ZZ').format('hh:mm A');
            // console.log(isDeliveryDate1 + ' ' + convertToTime);
            var formattedDate = isDeliveryDate1 + ' ' + convertToTime;
            
            setDisplayDeliveryTimeClock(false);

            setEstimateDeliveryDateTime(formattedDate);            
            setIsDeliveryTime(new Date(currentTime));
            // setIsDeliveryTime(moment(currentTime, 'HH:mmallowMultiSelection: true, A').format('YYYY-MM-DD"T"HH:mm ZZ'));
            console.log({'setIsDeliveryTime': isDeliveryTime, 'Delivery Date': isDeliveryDate, 'Delivery Date1': isDeliveryDate1,'convertToTime': convertToTime, 'selectedTime': selectedTime, 'currentTime': currentTime });

            // let formateDateForDatabase = moment(isDeliveryDate1 + ' ' + currentTime, 'DD-MM-YYYY HH:mm A', "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');

        }
    };

    // const changeEstimateDeliverySelectedDate = (event, selectedDate) => {
       
    //     if (selectedDate != null) {
    //         let currentDate = selectedDate;
    //         // let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
    //         let formattedDate = moment(currentDate, 'YYYY MMMM D', true).format('DD-MM-YYYY');
          
    //         // setEstimateDeliveryDateTime(currentDate);
    //         // setEstimateDeliveryTime(formattedDate);
    //         // let formateDateForDatabase = moment(currentDate, 'YYYY MMMM D').format('YYYY-MM-DD');
    //         setIsDeliveryDate1(formattedDate);
    //         setIsDeliveryDate(currentDate);
    //         // console.log('formated date', formattedDate);
    //         // console.log('Delivery Date', isDeliveryDate1);
    //         setDisplayDeliveryDateCalender(false);
    //         setDisplayDeliveryTimeClock(true);
    //     }
    // };

    // const changeSelectedTime = (event, selectedTime) => {
    //     // console.log(selectedTime);
    //     if (selectedTime != null) {
    //         let currentTime = selectedTime;
    //         let convertToTime = moment(currentTime, 'YYYY-MM-DD"T"HH:mm ZZ').format('HH:mm A');
    //         console.log({'setIsDeliveryTime': new Date(convertToTime) ,'Delivery Date': isDeliveryDate, 'Delivery Date1': isDeliveryDate1,'convertToTime': convertToTime, 'selectedTime': selectedTime, 'currentTime': currentTime });
    //         console.log(isDeliveryDate1 + ' ' + convertToTime);
    //         // let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
    //         // let date = moment(isDeliveryDate, 'YYYY MMMM D').format('YYYY-MM-DD');
    //         // let time = moment(convertToTime, 'YYYY MMMM D').format('DD-MM-YYYY');
    //         // var formattedDate = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm ZZ', true).format();
    //         var formattedDate = isDeliveryDate1 + ' ' + convertToTime;
    //         // var formattedDate = moment(isDeliveryDate1 + ' ' + convertToTime, 'YYYY-MM-DD HH:mm ZZ', true).format('DD-MM-YYYY HH:mm ZZ');
    //         // console.log('formated Date', formattedDate, typeof(formattedDate));
    //         setEstimateDeliveryDateTime(formattedDate);
      
    //         setIsDeliveryTime(new Date(convertToTime));

    //         // setEstimateDeliveryDateTime(currentDate);
    //         // const utcDate = moment(str, new Date(formattedDate));
    //         // setEstimateDeliveryDateTime(formattedDate);
    //         let formateDateForDatabase = moment(isDeliveryDate1 + ' ' + currentTime, 'DD-MM-YYYY HH:mm A', "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    //         // console.log(formateDateForDatabase0)
    //         // setEstimateDeliveryDateTime(formateDateForDatabase);
    //         setDisplayDeliveryDateCalender(false);
    //         setDisplayDeliveryTimeClock(false);
    //         // setDisplayDeliveryTimeClock(true);
    //     }
    // };





    // Parts Functions ----- End Here

    const getPartList = async () => {
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
            // console.log(json);
            if (json !== undefined) {
                console.log('setPartList', json.data);
                setPartList(json.data);
                // handleServiceAdd();
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading2(false);
        }
    };

    useEffect(() => {
        getPartList();
        console.log(route?.params?.data);
    }, []);

    // useEffect(() => {
    //     setIsLoading2(true);
    //     if (isFocused) {
    //         getBrandList2();
    //     }
    // }, [isFocused]);

    return (
        <View style={styles.pageContainer}>
            {(isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                <InputScrollView
                    // ref={scroll1Ref}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={8}
                    // keyboardOffset={160}
                    behavior="padding"
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Order Details: </Text>
                        {/* <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            // onPress={() => changeStep(1)}
                        >
                            Back
                        </Button> */}
                        <View style={styles.cardContainer}>
                            <View style={[styles.cardRightContent, { flex: 1 }]}>
                                {/* <Text style={styles.cardMainTitle}>Customer Details:</Text> */}
                                <Text style={styles.cardTitle}>Name: {isName}</Text>
                                <Text style={styles.cardTitle}>Email: {isEmail}</Text>
                                <Text style={styles.cardTitle}>Phone Number: {isPhoneNumber}</Text>
                            </View>
                            {/* <View style={[styles.cardRightContent, { flex: 0.5 }]}>
                                <Text style={styles.cardMainTitle}>Vehicle Details:</Text>
                                <Text style={styles.cardTitle}>{isBrandName}</Text>
                                <Text style={styles.cardTitle}>{isModelName}</Text>
                                <Text style={styles.cardTitle}>{isVehicleRegistrationNumber}</Text>
                            </View> */}
                        </View>

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Service:</Text>

                        {fields.map((field, idx) => {
                            return (
                                <>
                                    {(idx != 0) &&
                                        <View style={styles.addFieldContainerGroup} key={'fields'+idx}>
                                            {/* <Text></Text> */}
                                    
                                                <TouchableOpacity style={styles.removeEntryIconContainer} onPress={() => handleServiceRemove(idx)}>
                                                    <Icon style={styles.removeEntryIcon} name="close" size={30} color="#000" />
                                                </TouchableOpacity>
                                            
                                            <View style={[styles.cardRightContent, { flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 0 }]}>
                                                <Text style={[styles.partNameContent, {fontWeight: '600'}]}>Service Name: </Text>
                                                <Text style={styles.serviceNameContent}>Oil Change</Text>
                                            </View>
                                            <View style={[styles.cardRightContent, { flex: 1 }]}>
                                                <View style={styles.addFieldContainer} key={`service-${field}-${idx}`}>
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Rate'
                                                        style={styles.textEntryInput}
                                                        placeholder="Rate"
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
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
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
                                                        onChangeText={
                                                            e => {
                                                                let parameter = {
                                                                    name: 'quantity',
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
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
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
                                                    <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 5 }}>{(fields[idx]) ? fields[idx]['totalForThisService'] : 0}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={'contained'}
                                icon="plus"
                                // onPress={submit}
                                onPress={() => {
                                    setAddServiceModal(true);
                                }}
                            >
                                Add Service
                            </Button>
                            <View style={{ flex: 0.5 }}>
                            </View>
                        </View>


                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Parts:</Text>
                        {fieldsParts.map((field, idx) => {
                            return (
                                <>
                                    {(idx != 0) &&
                                        <View style={styles.addFieldContainerGroup} key={'fieldsParts'+idx}>
                                    
                                            <TouchableOpacity style={styles.removeEntryIconContainer} onPress={() => handlePartRemove(idx)}>
                                                <Icon style={styles.removeEntryIcon} name="close" size={30} color="#000" />
                                            </TouchableOpacity>
                                        
                                            <View style={[styles.cardRightContent, { flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 0 }]}>
                                                <Text style={[styles.partNameContent, {fontWeight: '600'}]}>Part Name: </Text>
                                                <Text style={styles.partNameContent}>Oil Change</Text>
                                            </View>
                                            <View style={[styles.cardRightContent, { flex: 1 }]}>
                                                <View style={styles.addFieldContainer} key={`parts-${field}-${idx}`}>
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Rate'
                                                        style={[styles.textEntryInput]}
                                                        placeholder="Rate"
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
                                                        onChangeText={
                                                            e => {
                                                                let parameter = {
                                                                    name: 'rate',
                                                                    value: e,
                                                                };
                                                                handlePartChange(idx, parameter);
                                                                // console.log(fieldsParts[idx]['totalForThisService']);
                                                            }
                                                        }
                                                    />
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Quantity'
                                                        style={styles.textEntryInput}
                                                        placeholder="Quantity"
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
                                                        onChangeText={
                                                            e => {
                                                                let parameter = {
                                                                    name: 'quantity',
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
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
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
                                                {/* <View style={[styles.cardRightContent, { flex: 1, flexDirection: 'row' }]}> */}
                                                
                                                    {/* <TextInput
                                                        mode="outlined"
                                                        label='Total Amount for this Part'
                                                        style={styles.textEntryInput}
                                                        placeholder="Total Amount for this Part"
                                                        editable={false}
                                                        value={fieldsParts[idx]['totalForThisService']}
                                                        // onChangeText={(text) => setIsName(text)}
                                                        // onChangeText=
                                                        // {
                                                        //     e => {
                                                        //         let parameter = {
                                                        //             name: 'discount',
                                                        //             value: e,
                                                        //         };
                                                        //         handlePartChange(idx, parameter);
                                                        //     }
                                                        // }
                                                    /> */}
                                                
                                                {/* </View> */}
                                                <View style={{flexDirection: 'row'}}>
                                                    <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 0, fontWeight: '600'}}>Total for the Part: </Text>
                                                    <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 5 }}>{(fieldsParts[idx]) ? fieldsParts[idx]['totalForThisService'] : 0}</Text>
                                                </View>
                                            
                                            </View>
                                        </View>
                                    } 
                                </>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.3 }}
                                mode={'contained'}
                                icon="plus"
                                // onPress={submit}
                                onPress={() => {
                                    setAddPartModal(true);
                                }}
                            >
                                Add Part
                            </Button>
                            <View style={{ flex: 0.5 }}>
                            </View>
                        </View>

                     
                        {/* {vehicleImgError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{vehicleImgError}</Text>
                        } */}
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Totals:</Text>
                        <View style={styles.totalFieldContainerGroup}>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.8 }]}>
                                    <Text style={styles.partNameContent}>Services Total</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                        {/* <TextInput
                                            mode="outlined"
                                            label='Labor Total'
                                            style={styles.textEntryInput}
                                            placeholder="Labor Total"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setLaborTotal(value)}
                                        /> */}
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
                                        {/* <TextInput
                                            mode="outlined"
                                            label='Parts Total'
                                            style={styles.textEntryInput}
                                            placeholder="Parts Total"
                                            value={partsTotal}
                                            // onChangeText={(text) => setIsName(text)}
                                            // onChangeText={(value) => setPartsTotal(value)}
                                        /> */}
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
                                        {/* <TextInput
                                            mode="outlined"
                                            label='Applicable Amount'
                                            style={styles.textEntryInput}
                                            placeholder="Applicable Amount"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setApplicableAmount(value)}
                                        /> */}
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
                                        {/* <TextInput
                                            mode="outlined"
                                            label='Total'
                                            style={styles.textEntryInput}
                                            placeholder="Total"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setIsTotal(value)}
                                        /> */}
                                        <Text style={{fontSize: 18, color: colors.black}}>{isTotal}</Text>
                                    </View>
                                </View>
                            </View>
                           
                        </View>

                        {/* <Text style={[styles.headingStyle, { marginTop: 20 }]}>Vehicle Images:</Text> */}

                        {/* <View>
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
                                      {isVehicleImg[0].name ? isVehicleImg[0].name : ''}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View> */}

                        {/* <Text style={[styles.headingStyle, { marginTop: 20 }]}>Additional Information:</Text>
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
                                    label='Estimate Delivery Time'
                                    style={styles.datePickerField}
                                    placeholder="Estimate Delivery Time"
                                    value={estimateDeliveryDateTime}
                                />
                                {(displayDeliveryDateCalender == true) &&
                                    <DateTimePicker
                                        value={(isDeliveryDate) ? isDeliveryDate : null}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={changeEstimateDeliverySelectedDate}
                                    // display="spinner"
                                    />}
                                {displayDeliveryTimeClock && (
                                    <DateTimePicker
                                        value={(isDeliveryTime) ? isDeliveryTime : null}
                                        mode={'time'}
                                        is24Hour={false}
                                        display="spinner"
                                        // display="default"
                                        onChange={changeSelectedTime}
                                    />
                                )}
                            </View>
                        </TouchableOpacity> */}
                        {/* {estimateDeliveryDateError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{estimateDeliveryDateError}</Text>
                        } */}


                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                        // onPress={submit}
                        >
                            Prepare Invoice
                        </Button>
                        {/* <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            // onPress={() => changeStep(1)}
                        >
                            Back
                        </Button> */}
                    </View>
                </InputScrollView>
            }

            <Portal>
                <Modal visible={addServiceModal} onDismiss={() => { setAddServiceModal(false); setIsService(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Service</Text>
                    {(isLoading2 == true) ? <ActivityIndicator></ActivityIndicator>
                        :
                        <>
                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isService}
                                    onValueChange={(option) => { setIsService(option); }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item label="Select Service" value="0" />
                                    {serviceList?.map((serviceList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'part'+i}
                                                label={serviceList?.name}
                                                value={serviceList?.id}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                            {serviceError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{serviceError}</Text>
                            }
                            <View style={{ flexDirection: "row", }}>
                                <Button
                                    style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                    mode={'contained'}
                                    onPress={() => handleServiceAdd()}
                                // onPress={addNewBrand}
                                >
                                    Add
                                </Button>
                                <Button
                                    style={{ marginTop: 15, flex: 1 }}
                                    mode={'contained'}
                                    onPress={() => setAddServiceModal(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </>
                    }
                </Modal>
                <Modal visible={addPartModal} onDismiss={() => { setAddPartModal(false); setIsPart(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Part</Text>
                    {(isLoading2 == true) ? <ActivityIndicator></ActivityIndicator>
                        :
                        <>
                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isPart}
                                    onValueChange={(option) => { setIsPart(option); }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item label="Select Part" value="0" />
                                    {partList?.map((partList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'part'+i}
                                                label={partList?.name}
                                                value={partList?.id}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                            {partError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{partError}</Text>
                            }
                            <View style={{ flexDirection: "row", }}>
                                <Button
                                    style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                    mode={'contained'}
                                    onPress={() => handlePartAdd()}
                                // onPress={addNewBrand}
                                >
                                    Add
                                </Button>
                                <Button
                                    style={{ marginTop: 15, flex: 1 }}
                                    mode={'contained'}
                                    onPress={() => setAddPartModal(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </>
                    }
                </Modal>
            </Portal>
        </View>
    )
}



const styles = StyleSheet.create({
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
        // padding: 15,
        // height: 55,
        // borderColor: colors.light_gray, // 7a42f4
        // borderWidth: 1,
        // borderRadius: 5,
        // backgroundColor: colors.white,
        fontSize: 16,
        flex: 0.33,
        marginRight: 10,
    },
    removeEntryIconContainer: {
        // flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        // display: 'flex',
        // marginTop: 5,
        zIndex: 2,
        borderColor: colors.light_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.gray,
        position: 'absolute',
        top: 10,
        right: 10,
        // marginLeft: 8,
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
        // padding: 15,
        // height: 55,
        // borderColor: colors.light_gray, // 7a42f4
        // borderWidth: 1,
        // borderRadius: 5,
        // backgroundColor: colors.white,
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
        // borderColor: colors.light_gray, // 7a42f4
        // borderWidth: 1,
        // borderRadius: 5,
        // backgroundColor: '#fff',
        // color: '#424242',
        paddingHorizontal: 15,
        // height: 55,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: 'absolute',
        right: 7,
        top: 12,
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
        // borderWidth: 1,
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

export default connect(mapStateToProps)(CounterSaleStep2);
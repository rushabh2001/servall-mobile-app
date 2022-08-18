import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity, Pressable, Image, FlatList } from 'react-native';
import { Modal, Portal, Button, TextInput, List, Divider, Searchbar } from 'react-native-paper';
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

const AddRepairOrderStep3 = ({ route, userToken, navigation }) => {

    // User / Customer Fields
    const [isUserDetails, setIsUserDetails] = useState();

    const [isGarageId, setIsGarageId] = useState(route?.params?.userVehicleDetails?.garage_id);
    const [isUserId, setIsUserId] = useState(route?.params?.userVehicleDetails?.user_id);
    const [isVehicleId, setIsVehicleId] = useState(route?.params?.userVehicleDetails?.vehicle_id);
    const [isName, setIsName] = useState(route?.params?.userVehicleDetails?.name);
    const [isEmail, setIsEmail] = useState(route?.params?.userVehicleDetails?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(route?.params?.userVehicleDetails?.phone_number);

    // Vehicle Fields
    const [isBrand, setIsBrand] = useState(route?.params?.userVehicleDetails?.brand_id);
    const [isBrandName, setIsBrandName] = useState(route?.params?.userVehicleDetails?.brand_name);
    const [isModel, setIsModel] = useState(route?.params?.userVehicleDetails?.model_id);
    const [isModelName, setIsModelName] = useState(route?.params?.userVehicleDetails?.model_name);
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] = useState(route?.params?.userVehicleDetails?.vehicle_registration_number);

    const [isOdometerKMs, setIsOdometerKMs] = useState(route?.params?.userVehicleDetails?.odometer);
    const [isFuelLevel, setIsFuelLevel] = useState(route?.params?.userVehicleDetails?.fuel_level);

    const [isVehicleImg, setIsVehicleImg] = useState();
    const [vehicleImgError, setVehicleImgError] = useState();

    const [isQuantity, setIsQuantity] = useState();
    const [isRate, setIsRate] = useState();
    // const [isServiceName, setIsServiceName] = useState();
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

    const [isEstimatedDeliveryDateTime, setIsEstimatedDeliveryDateTime] = useState(new Date());
    const [estimatedDeliveryDateTime, setEstimatedDeliveryDateTime] = useState('');
    const [displayDeliveryDateCalender, setDisplayDeliveryDateCalender] = useState(false);
    const [displayDeliveryTimeClock, setDisplayDeliveryTimeClock] = useState(false);
    const [isDeliveryDate, setIsDeliveryDate] = useState(new Date());
    const [isDeliveryDate1, setIsDeliveryDate1] = useState('');
    const [isDeliveryTime, setIsDeliveryTime] = useState(new Date());
    const [estimateDeliveryDateError, setEstimateDeliveryDateError] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(true);

    // const [addPartModal, setAddPartModal] = useState(false);
    // const [addServiceModal, setAddServiceModal] = useState(false);

    // const [firstPartField, setFirstPartField] = useState(false);
    // const [firstServiceField, setFirstServiceField] = useState(false);
    
    // const [newBrandName, setNewBrandName] = useState();
    // const [addNewBrand, setAddNewBrand] = useState();
    const [serviceError, setServiceError] = useState();
    const [serviceList, setServiceList] = useState([]);

    const [partError, setPartError] = useState();
    const [odometerKMsError, setOdometerKMsError] = useState();

    const [partTotals, setPartTotals] = useState([]);
    const [serviceTotals, setSeviceTotals] = useState([]);

    const [servicesTotal, setServicesTotal] = useState(0);
    const [partsTotal, setPartsTotal] = useState(0);
    const [isTotal, setIsTotal] = useState(0);
    const [isApplicableDiscount, setIsApplicableDiscount] = useState(0);
    const [isTotalServiceDiscount, setIsTotalServiceDiscount] = useState(0);
    const [isTotalPartDiscount, setIsTotalPartDiscount] = useState(0);

    const isFocused = useIsFocused();

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
            (!fieldsServices && !fieldsParts) || (fieldsServices.length === 0 && fieldsParts.length === 0  ) || 
            // !isPhoneNumber || isPhoneNumber?.trim().length === 0 || 
            // !isBrand || isBrand === 0 ||
            // !isModel || isModel === 0 ||
            // !isGarageId || isGarageId === 0 ||
            !estimatedDeliveryDateTime || estimatedDeliveryDateTime?.trim().length === 0 
        )
    }

    const submit = () => {
     
        Keyboard.dismiss();  

        if (!validate()) {
            // if (!isName) setNameError("Customer Name is required"); else setNameError('');
            // if (!isPhoneNumber) setPhoneNumberError("Phone Number is required"); else setPhoneNumberError('');
            // if (!isEmail) setEmailError("Email is required");
            // else if (isEmail.length < 6) setEmailError("Email should be minimum 6 characters");
            // else if (isEmail?.indexOf(' ') >= 0) setEmailError('Email cannot contain spaces');
            // else if (isEmail?.indexOf('@') < 0) setEmailError('Invalid Email Format');
            // else setEmailError('');
            // if (!isBrand || isBrand === 0) setBrandError('Brand is required'); else setBrandError('');
            // if (!isModel || isModel === 0) setModelError('Model is required'); else setModelError('');
            // if (!isCity || isCity === 0) setCityError("City is required"); else setCityError('');
            // if (!isState || isState === 0) setStateError("State is required"); else setStateError('');
            // if (!isGarageId || isGarageId == 0) setGarageIdError("Customer Belongs to Garage Field is required"); else setGarageIdError('');
            if (!estimatedDeliveryDateTime || estimatedDeliveryDateTime?.trim().length === 0) setEstimateDeliveryDateError("Estimate Delivery Date is required"); else setEstimateDeliveryDateError('');
            return;
        }

        const data = new FormData();
        data.append('garage_id', isGarageId);
        data.append('user_id', isUserId);
        data.append('vehicle_id', isVehicleId);
        data.append('odometer', isOdometerKMs);
        data.append('fuel_level', isFuelLevel);

    
        // let order_service = [];
        // let order_parts = [];

      
        // fieldsServices.forEach((item, index) => {
        //     data.append(`order_service[${index}]['service_id']`, item['service_id']);
        //     data.append(`order_service[${index}]['rate']`,  item['rate']);
        //     data.append(`order_service[${index}]['qty']`, item['qty']);
        //     data.append(`order_service[${index}]['discount']`, item['discount']);
        //     data.append(`order_service[${index}]['amount']`, item['amount']);
        // });

        // function myFunction
  

        // for (let i = 0; i < fieldsServices.length; i++) {
        //     data.push(order_service[i]['service_id'], item.service_id);
        //     data.push(order_service[i]['rate'], item.rate);
        //     data.push(order_service[i]['qty'], item.qty);
        //     data.push(order_service[i]['discount'], item.discount);
        //     data.push(order_service[i]['amount'], item.amount);
        // }

        // for (let i = 0; i < fieldsParts.length; i++) {
        //     data.push(order_parts[i]['parts_id'], item.parts_id);
        //     data.push(order_parts[i]['rate'], item.rate);
        //     data.push(order_parts[i]['qty'], item.qty);
        //     data.push(order_parts[i]['discount'], item.discount);
        //     data.push(order_parts[i]['amount'], item.amount);
        // }

        // order_service.forEach(({item, index}) => {
        //     data.push(items[i])
        //     // console.log(total);
        // });
        data.append('order_service', JSON.stringify(fieldsServices));
        data.append('order_parts', JSON.stringify(fieldsParts));
        // if(isAddress) data.append('address', isAddress?.trim());
        data.append('estimated_delivery_time', moment(estimatedDeliveryDateTime, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss'));
        data.append('labor_total', servicesTotal);
        data.append('parts_total', partsTotal);
        data.append('discount', isApplicableDiscount);
        if(isVehicleImg != null) data.append('orderimage', isVehicleImg);
        data.append('total', isTotal);
        data.append('comment', isComment?.trim());

        addOrder(data);
        console.log(JSON.stringify(data));
        // console.log(isRegistrationCertificateImg);  
    }

    const addOrder = async (data) => {
        try {
            // console.log("working fine till here");
            // console.log(data);
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
                if(res.statusCode == 400) {
                //   { res.data.message.email && setEmailError(res.data.message.email); }
                //   { res.data.message.phone_number && setPhoneNumberError(res.data.message.phone_number); }
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
            // setIsLoading(false);
            navigation.navigate('OpenOrderList');
        }
    };

    function handleServiceChange(i, value) {
        const values = [...fieldsServices];
        values[i][value.name] = value.value;
        // calculateServicePrice
        values[i]['amount'] = (values[i]['rate'] * values[i]['qty']) - ((values[i]['rate'] * values[i]['qty']) * (values[i]['discount'] / 100))
        // values[i] = ({ key: serviceName, key: rate, key: qty });
        // values[i] = { key: value };

        // values[i].push({key: value});
        // values[i].rate = value.rate;
        // values[i].qty = value.qty;
        // values[i].serviceName = value.serviceName;
        // values[i].value = value.rate;
        // console.log(i);
        // setFieldsServices(values);
        // console.log(fieldsServices);
        serviceTotals[i] = values[i]['amount'];

        let total = 0;
        values.forEach(item => {
            total += item.amount;
            // console.log(total);
        });
        setServicesTotal(total);

        setIsTotal(total + partsTotal);

        values[i]['applicableDiscountForItem'] = (values[i]['rate'] * values[i]['qty']) * (values[i]['discount'] / 100);
        let discountTotal = 0;
        values.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });

        setIsTotalServiceDiscount(discountTotal);

        setIsApplicableDiscount(discountTotal + isTotalPartDiscount);
        console.log(values);
    }

    function handleServiceAdd(data) {
        const values = [...fieldsServices];
        values.push({ service_id: data.service_id, serviceName: data.serviceName, rate: 0, qty: 0, discount: 0, applicableDiscountForItem: 0, amount: 0 });
        setFieldsServices(values);
        console.log(fieldsServices);

        // setIsService(0);
        // setIsServiceName(null);
        // setServiceError('');
        setServiceListModal(false);
    }

    function handleServiceRemove(i) {
        const values = [...fieldsServices];
        values.splice(i, 1);
        setFieldsServices(values);

        let total = 0;
        values.forEach(item => {
            total += item.amount;
            // console.log(total);
        });
        setServicesTotal(total);
        setIsTotal(total + partsTotal);

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
        // console.log(i);
        setFieldsParts(partValues);
        partTotals[i] = partValues[i]['amount'];
        // console.log(fieldsParts);

        // Calculation of Total of all Parts
        let total = 0;
        partValues.forEach(item => {
            total += item.amount;
            // console.log(total);
        });
        setPartsTotal(total);

        // Calculate Total of Order
        setIsTotal(total + servicesTotal);

        partValues[i]['applicableDiscountForItem'] = (partValues[i]['rate'] * partValues[i]['qty']) * (partValues[i]['discount'] / 100);
        let discountTotal = 0;
        partValues.forEach(item => {
            discountTotal += item.applicableDiscountForItem;
        });
        // serviceTotals[i] = partValues[i]['applicableDiscountForItem'];
        // discountTotal += partValues[i]['applicableDiscountForItem'];

        setIsTotalPartDiscount(discountTotal);

        setIsApplicableDiscount(discountTotal + isTotalServiceDiscount);
        // console.log(partValues);
    }

    function handlePartAdd(data) {
        // console.log('isPart:', isPart, 'isPartName:', isPartName, 'fieldsParts.length - 1:', fieldsParts.length - 1);
        const partValues = [...fieldsParts];
        partValues.push({ parts_id: data.parts_id, partName: data.partName, rate: 0, qty: 0, discount: 0, applicableDiscount: 0, amount: 0 });
        setFieldsParts(partValues);
        
        // setIsPart(0);
        // setIsPartName(null);
        // setPartError('');
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

        console.log(fieldsParts.length);
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

    // useEffect(() => {
    //     setAddPartModal(false);
    //     // handlePartAdd();
    // }, [fieldsParts]);

    // useEffect(() => {

    // }, [estimatedDeliveryDateTime]);

    const changeSelectedTime = (event, selectedTime) => {
        if (selectedTime != null) {
            // setDisplayDeliveryDateCalender(false);
            
            let currentTime = selectedTime;
            let convertToTime = moment(currentTime, 'YYYY-MM-DD"T"hh:mm ZZ').format('hh:mm A');
            // console.log(isDeliveryDate1 + ' ' + convertToTime);
            var formattedDate = isDeliveryDate1 + ' ' + convertToTime;
            
            setDisplayDeliveryTimeClock(false);

            setEstimatedDeliveryDateTime(formattedDate);            
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
          
    //         // setEstimatedDeliveryDateTime(currentDate);
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
    //         setEstimatedDeliveryDateTime(formattedDate);
      
    //         setIsDeliveryTime(new Date(convertToTime));

    //         // setEstimatedDeliveryDateTime(currentDate);
    //         // const utcDate = moment(str, new Date(formattedDate));
    //         // setEstimatedDeliveryDateTime(formattedDate);
    //         let formateDateForDatabase = moment(isDeliveryDate1 + ' ' + currentTime, 'DD-MM-YYYY HH:mm A', "Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
    //         // console.log(formateDateForDatabase0)
    //         // setEstimatedDeliveryDateTime(formateDateForDatabase);
    //         setDisplayDeliveryDateCalender(false);
    //         setDisplayDeliveryTimeClock(false);
    //         // setDisplayDeliveryTimeClock(true);
    //     }
    // };





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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setPartList', json.data);
                setPartList(json.data);
                setFilteredPartData(json.data);
                // handleServiceAdd();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(false);
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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setServiceList', json.data);
                setServiceList(json.data);
                setFilteredServiceData(json.data);
                // let data = {
                //     service_id: json.data.id,
                //     serviceName: json.data.name,
                // }
                // handleServiceAdd(data)
                // handleServiceAdd();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(false);
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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setServiceList', json.data);
                // setIsLoading2(true);
                getServiceList();
                setIsService(parseInt(json.data.id));
                setIsServiceName(json.data.name);
                let data = {
                    service_id: json.data.id,
                    serviceName: json.data.name,
                }
                handleServiceAdd(data)
                // setTimeout(function(){setIsService(parseInt(json.data.id));}, 1000);
                // setServiceList([...serviceList, json.data]);
                // handleServiceAdd();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(true);
            // setAddServiceModal(true);
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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setPartList', json.data);
                // setIsLoading2(true);
                getPartList();
                setIsPart(parseInt(json.data.id));
                setIsPartName(json.data.name);
                let data = {
                    parts_id: json.data.id,
                    partName: json.data.name,
                }
                handlePartAdd(data)
                // setTimeout(function(){setIsPart(parseInt(json.data.id));}, 1000);
                // setPartList([...partList, json.data]);
                // handlePartAdd();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(true);
            // setAddPartModal(true);
        }
    }

    const searchFilterForParts = (text) => {
        if (text) {
            let newData = partList.filter(
                function (listData) {
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
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
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
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
    // console.log(route?.params?.userVehicleDetails);
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
                                    {/* {(firstServiceField == true) && */}
                                        <View style={styles.addFieldContainerGroup} key={`service-${field}-${idx}`}>
                                            {/* <Text></Text> */}
                                    
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
                                                        keyboardType="numeric"
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
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
                                                    <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 5 }}>{(fieldsServices[idx]) ? fieldsServices[idx].amount : 0}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    {/* } */}

                                        <Portal>
                                            {/* <Modal visible={addServiceModal} onDismiss={() => { setAddServiceModal(false); setIsService(0); setIsServiceName(''); setServiceError('');}} contentContainerStyle={styles.modalContainerStyle}>
                                                <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add Service</Text>
                                                <View>
                                                    <TouchableOpacity style={styles.repairOrderField} onPress={() => { setAddServiceModal(false); setServiceListModal(true); }}>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Service'
                                                        style={{marginTop: 10, backgroundColor: colors.white, width:'100%' }}
                                                        placeholder="Select Service"
                                                        value={isServiceName}
                                                    />
                                                </View>
                                       
                                                {serviceError?.length > 0 &&
                                                    <Text style={styles.errorTextStyle}>{serviceError}</Text>
                                                }
                                                <View style={{ flexDirection: "row", }}>
                                                    <Button
                                                        style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                                        mode={'contained'}
                                                        onPress={() => {
                                                            if(isService == 0) {
                                                                (setServiceError('Please Select Any Service'))
                                                            } else {
                                                                // console.log(fieldsServices.length);
                                                                if(firstServiceField === false) {
                                                                    // console.log('case 1');                                                          
                                                                    let parameter = {
                                                                        name: 'service_id',
                                                                        value: isService
                                                                    };
                                                                    handleServiceChange(fieldsServices.length - 1, parameter);

                                                                    // if(itemIndex != 0) {
                                                                    let parameter2 = {
                                                                        name: 'serviceName',
                                                                        value: isServiceName,
                                                                    };
                                                                    handleServiceChange(fieldsServices.length - 1, parameter2);

                                                                    // console.log('case 1');
                                                                    setFirstServiceField(true);
                                                                    setIsService(0);
                                                                    setIsServiceName('');
                                                                    setServiceError('');
                                                                    setAddServiceModal(false);
                                                                } else {
                                                                    // console.log('case 2');
                                                                    handleServiceAdd();
                                                                }
                                                            }
                                                        }}
                                                    // onPress={addNewBrand}
                                                    >
                                                        Add
                                                    </Button>
                                                    <Button
                                                        style={{ marginTop: 15, flex: 1 }}
                                                        mode={'contained'}
                                                        onPress={() => {
                                                            setAddServiceModal(false);
                                                            setIsService(0);
                                                            setIsServiceName(null);
                                                            setServiceError('');
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
                                                </View>
                                            </Modal> */}

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
                                                            // setAddServiceModal(true);
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
                                // onPress={submit}
                                onPress={() => 
                                    // if(fieldsServices.length!=0) {
                                        setServiceListModal(true)
                                    // } else {
                                    //     // const serviceValues = [...fieldsServices];
                                    //     serviceValues.push({ service_id: null, serviceName: null, rate: null, qty: null, discount: 0, applicableDiscount: 0, amount: null });
                                    //     setFieldsServices(serviceValues);
                                    //     setServiceListModal(true);
                                    //     setFirstServiceField(false);
                                    //     console.log(serviceValues);
                                    // }
                                    }
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
                                    {/* {(firstPartField == true) && */}
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
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
                                                        onChangeText={
                                                            e => {
                                                                let parameter = {
                                                                    name: 'rate',
                                                                    value: e,
                                                                };
                                                                handlePartChange(idx, parameter);
                                                                // console.log(fieldsParts[idx]['amount']);
                                                            }
                                                        }
                                                    />
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Quantity'
                                                        style={styles.textEntryInput}
                                                        placeholder="Quantity"
                                                        keyboardType="numeric"
                                                        // value={isName}
                                                        // onChangeText={(text) => setIsName(text)}
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
                                                        // editable={false}
                                                        value={fieldsParts[idx]['amount']}
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
                                                    <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 0, fontWeight: '600'}}>Total for this Part: </Text>
                                                    <Text style={{fontSize: 20, color: colors.black, marginTop: 15, marginBottom: 5 }}>{(fieldsParts[idx]) ? fieldsParts[idx].amount : 0}</Text>
                                                </View>
                                            
                                            </View>
                                        </View>
                                    {/* }  */}
                                        <Portal>
                                            {/* <Modal visible={addPartModal} onDismiss={() => { setAddPartModal(false); setIsPart(0); setIsPartName(''); setPartError(''); }} contentContainerStyle={styles.modalContainerStyle}>
                                                <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add Part</Text>
                                                <View>
                                                    <TouchableOpacity style={styles.repairOrderField} onPress={() => { setAddPartModal(false); setPartListModal(true); }}>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Part'
                                                        style={{marginTop: 10, backgroundColor: colors.white, width:'100%' }}
                                                        placeholder="Select Part"
                                                        value={isPartName}
                                                    />
                                                </View>
                                                {partError?.length > 0 &&
                                                    <Text style={styles.errorTextStyle}>{partError}</Text>
                                                }
                                                <View style={{ flexDirection: "row", }}>
                                                    <Button
                                                        style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                                        mode={'contained'}
                                                        onPress={() => {
                                                            if(isPart == 0) {
                                                                (setPartError('Please Select Any Part'))
                                                            } else {
                                                                console.log(fieldsParts.length);
                                                                if(firstPartField === false) {
                                                                    // console.log('case 1');                                                          
                                                                    let parameter = {
                                                                        name: 'parts_id',
                                                                        value: isPart
                                                                    };
                                                                    handlePartChange(fieldsParts.length - 1, parameter);

                                                                    // if(itemIndex != 0) {
                                                                    let parameter2 = {
                                                                        name: 'partName',
                                                                        value: isPartName,
                                                                    };
                                                                    handlePartChange(fieldsParts.length - 1, parameter2);

                                                                    // console.log('case 1');
                                                                    setFirstPartField(true);
                                                                    setIsPart(0);
                                                                    setIsPartName(null);
                                                                    setPartError('');
                                                                    setAddPartModal(false);
                                                                } else {
                                                                    // console.log('case 2');
                                                                    handlePartAdd();
                                                                }
                                                            }
                                                        }}
                                                    // onPress={addNewBrand}
                                                    >
                                                        Add
                                                    </Button>
                                                    <Button
                                                        style={{ marginTop: 15, flex: 1 }}
                                                        mode={'contained'}
                                                        onPress={() => {
                                                            setAddPartModal(false);
                                                            setIsPart(0); 
                                                            setIsPartName('');
                                                            setPartError('');
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
                                                </View>
                                            </Modal> */}

                                            {/* Parts List Modal */}
                                            {/* <Modal visible={partListModal} onDismiss={() => { setPartListModal(false);  setAddPartModal(true); setIsPart(0); setIsPartName(''); setPartError(''); setSearchQueryForParts('');  searchFilterForParts();}} contentContainerStyle={styles.modalContainerStyle}>
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
                                                                    // onEndReachedThreshold={1}
                                                                    style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                                                    keyExtractor={item => item.id}
                                                                    renderItem={({item}) => (
                                                                        <>
                                                                            <List.Item
                                                                                title={
                                                                                    // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setPartListModal(false);  setAddPartModal(true); }}>
                                                                                        <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                                            <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                                                        </View>
                                                                                    // </TouchableOpacity> 
                                                                                }
                                                                                onPress={() => {setPartListModal(false);  setAddPartModal(true); setIsPartName(item.name); setIsPart(item.id); setPartError(''); setSearchQueryForParts(''); searchFilterForParts();}}
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
                                                                <TouchableOpacity  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginTop: 7, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4}} onPress={() => {setAddNewPartModal(true); setPartListModal(false); }}>
                                                                    <Icon style={{color: colors.white, marginRight: 4}} name="plus" size={16} />
                                                                    <Text style={{color: colors.white}}>Add New Part</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </>
                                                }
                                            </Modal> */}

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
                                                            // setAddPartModal(true);
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
                                                </View>
                                            </Modal>

                                            {/* <Modal visible={addNewPartModal} onDismiss={() => { setAddNewPartModal(false); setIsNewPart(0); setNewPartError(''); setAddPartModal(true); }} contentContainerStyle={styles.modalContainerStyle}>
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
                                                                setAddPartModal(true);
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
                                                            setAddPartModal(true);
                                                            setIsNewPart('');
                                                            setNewPartError('');
                                                        }}
                                                    >
                                                        Close
                                                    </Button>
                                                </View>
                                            </Modal> */}
                                        </Portal>
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
                                    // if(fieldsParts.length!=0) {
                                        setPartListModal(true);
                                //     } else {
                                //         const partValues = [...fieldsParts];
                                //         partValues.push({ parts_id: null, partName: null, rate: null, qty: null, discount: 0, applicableDiscount: 0, amount: null });
                                //         setFieldsParts(partValues);
                                //         setAddPartModal(true);
                                //         setFirstPartField(false);
                                //     }
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
                                        {/* {isVehicleImg[0].name ? isVehicleImg[0].name : ''} */}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Additional Information:</Text>
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
                                    value={estimatedDeliveryDateTime}
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
                        </TouchableOpacity>
                        {/* {estimateDeliveryDateError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{estimateDeliveryDateError}</Text>
                        } */}


                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            onPress={submit}
                        >
                            Create Repair Order
                        </Button>
                        {/* <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            // onPress={() => changeStep(1)}
                        >
                            Back
                        </Button> */}


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
                                                    // onEndReachedThreshold={1}
                                                    style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item}) => (
                                                        <>
                                                            <List.Item
                                                                title={
                                                                    // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setPartListModal(false);  setAddPartModal(true); }}>
                                                                        <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                            <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                                        </View>
                                                                    // </TouchableOpacity> 
                                                                }
                                                                onPress={() => {
                                                                        setIsPartName(item.name); 
                                                                        setIsPart(item.id); 
                                                                        // console.log('case 2');
                                                                        // handlePartAdd();

                                                                        let parameter = {
                                                                            parts_id: item.id,
                                                                            partName: item.name
                                                                        };
                                                                        handlePartAdd(parameter);
                                                                        // setFirstPartField(true);
                                                                        // setIsPart(0);
                                                                        // setIsPartName('');
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
                                                    // onEndReachedThreshold={1}
                                                    style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({item}) => (
                                                        <>
                                                            <List.Item
                                                                title={
                                                                    // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setServiceListModal(false);  setAddServiceModal(true); }}>
                                                                        <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                                            <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                                        </View>
                                                                    // </TouchableOpacity> 
                                                                }
                                                                onPress={() => {
                                                                        setIsServiceName(item.name); 
                                                                        setIsService(item.id); 
                                                                        // console.log('case 2');
                                                                        // handleServiceAdd();

                                                                        let parameter = {
                                                                            service_id: item.id,
                                                                            serviceName: item.name
                                                                        };
                                                                        handleServiceAdd(parameter);
                                                                        // setFirstServiceField(true);
                                                                        // setIsService(0);
                                                                        // setIsServiceName('');
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
        // padding: 15,
        fontSize: 16,
        color: colors.black,
        position: 'absolute',
        // backgroundColor: colors.black,
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

export default connect(mapStateToProps)(AddRepairOrderStep3);
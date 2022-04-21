import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, TextInput, Keyboard, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import { Button } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditVehicle = ({ navigation, userToken, route }) => {
    
    // Vehicle Fields
    const [isBrand, setIsBrand] = useState();
    const [isModel, setIsModel] = useState();
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] = useState('');
    const [isPurchaseDate, setIsPurchaseDate] = useState(new Date());
    const [isManufacturingDate, setIsManufacturingDate] = useState(new Date());
    const [isEngineNumber, setIsEngineNumber] = useState('');
    const [isChasisNumber, setIsChasisNumber] = useState('');
    const [isInsuranceProvider, setIsInsuranceProvider] = useState();
    const [isInsurerGstin, setIsInsurerGstin] = useState('');
    const [isInsurerAddress, setIsInsurerAddress] = useState('');
    const [isPolicyNumber, setIsPolicyNumber] = useState('');
    const [isInsuranceExpiryDate, setIsInsuranceExpiryDate] = useState(new Date());
    const [isRegistrationCertificateImg, setIsRegistrationCertificateImg] = useState(null);
    const [isInsuranceImg, setIsInsuranceImg] = useState(null);

    const [brandError, setBrandError] = useState('');   // Error States
    const [modelError, setModelError] = useState('');
    const [vehicleRegistrationNumberError, setVehicleRegistrationNumberError] = useState('');
    const [purchaseDateError, setPurchaseDateError] = useState('');
    const [manufacturingDateError, setManufacturingDateError] = useState('');
    const [engineNumberError, setEngineNumberError] = useState('');
    const [chasisNumberError, setChasisNumberError] = useState('');
    const [insuranceProviderError, setInsuranceProviderError] = useState('');
    const [insurerGstinError, setInsurerGstinError] = useState('');
    const [insurerAddressError, setinsurerAddressError] = useState('');
    const [policyNumberError, setPolicyNumberError] = useState('');
    const [insuranceExpiryDateError, setInsuranceExpiryDateError] = useState('');
    const [registrationCertificateImgError, setRegistrationCertificateImgError] = useState('');
    const [insuranceImgError, setInsuranceImgError] = useState('');

    
    const [selectedVehicle, setSelectedVehicle] =  useState();
    const [vehicleList, setVehicleList] =  useState([]);
    const [brandList, setBrandList] =  useState([]);
    const [modelList, setModelList] =  useState([]);
    const [insuranceProviderList, setInsuranceProviderList] =  useState([]);
    const [modelFieldToggle, setModelFieldToggle] = useState(false);

    const [datePurchase, setDatePurchase] = useState();
    const [displayPurchaseCalender, setDisplayPurchaseCalender] = useState(false);

    const [dateManufacturing, setDateManufacturing] = useState();
    const [displayManufacturingCalender, setDisplayManufacturingCalender] = useState(false);

    const [dateInsuranceExpiry, setDateInsuranceExpiry] = useState();
    const [displayInsuranceExpiryCalender, setDisplayInsuranceExpiryCalender] = useState(false);

    const [addBrandModal, setAddBrandModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState();
    const [newBrandNameError, setNewBrandNameError] = useState();
    const [addModelModal, setAddModelModal] = useState(false);
    const [newModelName, setNewModelName] = useState();
    const [newModelNameError, setNewModelNameError] = useState();
    const [addInsuranceCompanyModal, setAddInsuranceCompanyModal] = useState(false);
    const [newInsuranceCompanyName, setNewInsuranceCompanyName] = useState();
    const [newInsuranceCompanyNameError, setNewInsuranceCompanyNameError] = useState();

    const [isLoading, setIsLoading] = useState(false);
    
    const scroll1Ref = useRef();

    const addNewInsuranceCompany = async () => {
        let data = {'name': newInsuranceCompanyName}
        try {
            const res = await fetch(`${API_URL}add_insurance_provider`, {
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
                await getInsuranceProviderList();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
            setAddInsuranceCompanyModal(false);
            setNewInsuranceCompanyName("");
            setIsInsuranceProvider(0);
        }
    };

    const addNewBrand = async () => {
        let data = {'name': newBrandName}
        try {
            const res = await fetch(`${API_URL}create_brand`, {
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
                await getBrandList();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
            setAddBrandModal(false);
            setNewBrandName("");
            setIsBrand(0);
        }
    };

    const addNewModel = async () => {
        let data = {'model_name': newModelName, 'brand_id': parseInt(isBrand)}
        try {
            const res = await fetch(`${API_URL}create_vehicle_model`, {
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
                await getModelList();
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
            setAddModelModal(false);
            setNewModelName("");
            setIsModel(0);
        }
    };

    const selectRegistrationCrtImg = async () => {
        // Opening Document Picker to select one file
        try {
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
        });
        // console.log(res);
        setIsRegistrationCertificateImg(res[0]);
        } catch (err) {
            setIsRegistrationCertificateImg(null);
        if (DocumentPicker.isCancel(err)) {
            setRegistrationCertificateImgError('Canceled');
        } else {
            // For Unknown Error
            setRegistrationCertificateImgError('Unknown Error: ' + JSON.stringify(err));
            throw err;
        }
        }
    };

    const selectInsurancePolicyImg = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            console.log(res);
            setIsInsuranceImg(res[0]);
        } catch (err) {
            setIsInsuranceImg(null);
            if (DocumentPicker.isCancel(err)) {
                setInsuranceImgError('Canceled');
            } else {
                setInsuranceImgError('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const changePurchaseSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || datePurchase;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            setIsPurchaseDate(selectedDate);
        }
     };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateManufacturing;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            setIsManufacturingDate(selectedDate);
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateInsuranceExpiry;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            setIsInsuranceExpiryDate(selectedDate);  
        }   
    };

    const validate = () => {
        return !(
            !isBrand || isBrand === 0 ||
            !isModel || isModel === 0 ||
            !isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0 
        )
    }

    const submit = () => {
     
        Keyboard.dismiss();  

        if (!validate()) {
            if (!isBrand || isBrand === 0) setBrandError('Brand is required');
            if (!isModel || isModel === 0) setModelError('Model is required');
            if (!isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0) setVehicleRegistrationNumberError("Vehicle Registration Number is required");
            return;
        }
        
        let dataCheck = ({'vehicle_registration_number': isVehicleRegistrationNumber});
        vehicleCheck(dataCheck);

        const data = new FormData();
        data.append('brand_id', JSON.stringify(isBrand));
        data.append('model_id', JSON.stringify(isModel));
        data.append('vehicle_registration_number', isVehicleRegistrationNumber?.trim());
        if(isPurchaseDate) data.append('purchase_date', isPurchaseDate);
        if(isManufacturingDate) data.append('manufacturing_date', isManufacturingDate);
        if(isEngineNumber) data.append('engine_number', isEngineNumber?.trim());
        if(isChasisNumber) data.append('chasis_number', isChasisNumber?.trim());
        if(isInsuranceProvider) data.append('insurance_provider', isInsuranceProvider);
        if(isInsurerGstin) data.append('insurer_gstin', isInsurerGstin?.trim());
        if(isInsurerAddress) data.append('insurer_address', isInsurerAddress?.trim());
        if(isPolicyNumber) data.append('policy_number', isPolicyNumber?.trim());
        if(isInsuranceExpiryDate) data.append('insurance_expiry_date', isInsuranceExpiryDate);
        if(isRegistrationCertificateImg != null) data.append('registration_certificate_img', { uri: isRegistrationCertificateImg.uri, type: isRegistrationCertificateImg.type, name: isRegistrationCertificateImg.name });
        if(isInsuranceImg != null) data.append('insurance_img', isInsuranceImg);
        data.append('user_id', parseInt(route?.params?.userId));

        addVehicle(data);
        // console.log(JSON.stringify(data));
        // console.log(isRegistrationCertificateImg);  
    }

    const addVehicle = async (data) => {
        try {
            console.log("working fine till here");
            // console.log(isRegistrationCertificateImg[0]);  
            // console.log(data);
            let res = await fetch(`${API_URL}add_new_customer`, {
                method: 'POST',
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data; ',
                    'Authorization': 'Bearer ' + userToken
                },
                body: data
            });
            let responseJson = await res.json();
            console.log(responseJson);

            // fetch(`${API_URL}add_new_customer`, {
            //     method: 'POST',
            //     mode: 'cors',
            //     headers: {
            //         'Accept': 'application/json, */*',
            //         'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
            //     },
            //     // ContentType: 'multipart/form-data',
            //     body: data
            // }).then(res => {console.log('abea', res); return res.json();})
            // .then(
            //     (result) => {
            //         console.log("res:" , result);
            //     }).catch(function(error) {
            //         console.log('There has been a problem with your fetch operation: ' + error.message);
            //           throw error;
            //         });
            
            // let responseJson = await res.json();

            // .then(res => {
            //     const statusCode = res.status;
            //     let data;
            //     return res.json().then(obj => {
            //         data = obj;
            //         return { statusCode, data };
            //     });
            // });
            // .then((res) => {
                // console.log(responseJson);
                // if(res.statusCode == 201) {
                // console.log("Customer Added SuccessFully");
                // navigation.navigate('MyCustomers');
                // } else if(res.statusCode == 400) {
                //     console.log("Some Other 400");
                // } else if(res.statusCode == 401) {
                //     console.log("Some Other 401!");
                // }
            // });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const vehicleCheck = (dataCheck) => { 
        fetch(`${API_URL}user_vehicle_check`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            body: JSON.stringify(dataCheck)
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
              { res.data.message.vehicle_registration_number && setVehicleRegistrationNumberError(res.data.message.vehicle_registration_number); }
              return;
            } 
        });
    }

    const getVehicleList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_customer_vehicles?user_id=${route?.params?.userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json.states);
                setVehicleList(json.user_vehicles.vehicles);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    };

    const getBrandList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_brand`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json.states);
                setBrandList(json.brand_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    };

    const getModelList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_vehicle_model?brand_id=${isBrand}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setModelList(json.vehicle_model_list);
                setModelFieldToggle(true);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        } finally {
            // setIsLoading(false);
        }
    };

    const getInsuranceProviderList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_insurance_provider`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json.states);
                setInsuranceProviderList(json.insurance_provider_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        getVehicleList();
        getBrandList();
        getInsuranceProviderList();
    }, []);
   
    useEffect(() => {
        if(isBrand != undefined) getModelList();
    }, [isBrand]);

    return (
        <View style={styles.pageContainer}>
                { (isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                    <InputScrollView
                        ref={scroll1Ref}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={8}
                        // keyboardOffset={160}
                        behavior="padding"
                    >
                        <View style={{flex:1}}>
                            <Text style={[styles.headingStyle]}>Your Vehicle</Text>
                            <View style={[styles.dropDownContainer, { marginTop: 10, marginBottom: 20 }]}>
                                <Picker
                                    selectedValue={selectedVehicle}
                                    onValueChange={(option) => setSelectedVehicle(option)}
                                    style={styles.dropDownField}
                                    itemStyle={{padding: 0}}
                                >
                                    <Picker.Item label="Select Your Vehicle" value="0" />
                                    {vehicleList.map((vehicleList, i) => {
                                        return (
                                            <Picker.Item
                                                key={i}
                                                label={vehicleList.brand_id}
                                                // label={vehicleList.brand.name}
                                                value={vehicleList.id}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                            {/* {brandError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{brandError}</Text>
                            } */}
                            
                            <Text style={[styles.headingStyle]}>Vehicle Details:</Text>
                                <View style={styles.dropDownContainer}>
                                    <Picker
                                        selectedValue={isBrand}
                                        onValueChange={(option) => {setIsBrand(option); if(option == "new_brand") setAddBrandModal(true) }}
                                        style={styles.dropDownField}
                                        itemStyle={{padding: 0}}
                                    >
                                        <Picker.Item label="Select Brand" value="0" />
                                        {brandList.map((brandList, i) => {
                                            return (
                                                <Picker.Item
                                                    key={i}
                                                    label={brandList.name}
                                                    value={brandList.id}
                                                />
                                            );
                                        })}
                                        <Picker.Item label="Add New Brand" value="new_brand" />
                                    </Picker>
                                </View>
                                {brandError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{brandError}</Text>
                                }
                                <View style={styles.dropDownContainer}>
                                    <Picker
                                        selectedValue={isModel}
                                        onValueChange={(option) => { setIsModel(option); if(option == "new_model") setAddModelModal(true) }}
                                        style={styles.dropDownField}
                                        itemStyle={{padding: 0}}
                                        enabled={modelFieldToggle}
                                    >
                                        <Picker.Item label="Select Vehicle Model" value="0" />
                                        {modelList.map((modelList, i) => {
                                            return (
                                                <Picker.Item
                                                    key={i}
                                                    label={modelList.model_name}
                                                    value={modelList.id}
                                                />
                                            );
                                        })}
                                        <Picker.Item label="Add New Model" value="new_model" />
                                    </Picker>
                                </View>
                                {modelError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{modelError}</Text>
                                }
                                <TextInput
                                    label='Vehicle Registration Number'
                                    style={styles.input}
                                    placeholder="Vehicle Registration Number"
                                    value={isVehicleRegistrationNumber}
                                    onChangeText={(text) => setIsVehicleRegistrationNumber(text)}
                                />
                                {vehicleRegistrationNumberError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{vehicleRegistrationNumberError}</Text>
                                }
                                <TouchableOpacity style={{flex:1}} onPress={() => setDisplayPurchaseCalender(true)} activeOpacity={1}>
                                    <View style={styles.datePickerContainer} pointerEvents='none'>
                                        <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                        <TextInput
                                            label='Purchase Date'
                                            style={styles.datePickerField}
                                            placeholder="Purchase Date"
                                            value={datePurchase}
                                        />
                                        {(displayPurchaseCalender == true) && 
                                        <DateTimePicker
                                            value={(isPurchaseDate) ? isPurchaseDate : null}
                                            mode='date'
                                            onChange={changePurchaseSelectedDate}
                                            display="spinner"
                                        /> }
                                    </View>
                                </TouchableOpacity>
                                {purchaseDateError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{purchaseDateError}</Text>
                                }
                                <TouchableOpacity style={{flex:1}} onPress={() => setDisplayManufacturingCalender(true)} activeOpacity={1}>
                                    <View style={styles.datePickerContainer} pointerEvents='none'>
                                        <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                        <TextInput
                                            label='Manufacturing Date'
                                            style={styles.datePickerField}
                                            placeholder="Manufacturing Date"
                                            value={dateManufacturing}
                                        />
                                        {(displayManufacturingCalender == true) && 
                                        <DateTimePicker
                                            value={(isManufacturingDate) ? isManufacturingDate : null}
                                            mode='date'
                                            onChange={changeManufacturingSelectedDate}
                                            display="spinner"
                                        /> }
                                    </View>
                                </TouchableOpacity>
                                {manufacturingDateError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{manufacturingDateError}</Text>
                                }
                                <TextInput
                                    label='Engine Number'
                                    style={styles.input}
                                    placeholder="Engine Number"
                                    value={isEngineNumber}
                                    onChangeText={(text) => setIsEngineNumber(text)}
                                />
                                {engineNumberError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{engineNumberError}</Text>
                                }
                                <TextInput
                                    label='Chasis Number'
                                    style={styles.input}
                                    placeholder="Chasis Number"
                                    value={isChasisNumber}
                                    onChangeText={(text) => setIsChasisNumber(text)}
                                />
                                {chasisNumberError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{chasisNumberError}</Text>
                                }
                                <View style={styles.dropDownContainer}>
                                    <Picker
                                        selectedValue={isInsuranceProvider}
                                        onValueChange={(option) => { setIsInsuranceProvider(option); if(option == "new_insurance_company") setAddInsuranceCompanyModal(true) }}
                                        style={styles.dropDownField}
                                        itemStyle={{padding: 0}}
                                    >
                                        <Picker.Item label="Select Insurance Provider Company" value="0" />
                                        {insuranceProviderList.map((insuranceProviderList, i) => {
                                            return (
                                                <Picker.Item
                                                    key={i}
                                                    label={insuranceProviderList.name}
                                                    value={insuranceProviderList.id}
                                                />
                                            );
                                        })}
                                         <Picker.Item label="Add New Insurance Company" value="new_insurance_company" />
                                    </Picker>
                                </View>
                                {insuranceProviderError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{insuranceProviderError}</Text>
                                }
                                <TextInput
                                    label='Insurer GSTIN'
                                    style={styles.input}
                                    placeholder="Insurer GSTIN"
                                    value={isInsurerGstin}
                                    onChangeText={(text) => setIsInsurerGstin(text)}
                                />
                                {insurerGstinError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{insurerGstinError}</Text>
                                }
                                <TextInput
                                    label='Insurer Address'
                                    style={styles.input}
                                    placeholder="Insurer Address"
                                    value={isInsurerAddress}
                                    onChangeText={(text) => setIsInsurerAddress(text)}
                                />
                                {insurerAddressError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{insurerAddressError}</Text>
                                }
                                <TextInput
                                    label='Policy Number'
                                    style={styles.input}
                                    placeholder="Policy Number"
                                    value={isPolicyNumber}
                                    onChangeText={(text) => setIsPolicyNumber(text)}
                                />
                                {policyNumberError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{policyNumberError}</Text>
                                }
                                <TouchableOpacity style={{flex:1}} onPress={() => setDisplayInsuranceExpiryCalender(true)} activeOpacity={1}>
                                    <View style={styles.datePickerContainer} pointerEvents='none'>
                                        <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                        <TextInput
                                            label='Insurance Expiry Date'
                                            style={styles.datePickerField}
                                            placeholder="Insurance Expiry Date"
                                            value={dateInsuranceExpiry}
                                        />
                                        {(displayInsuranceExpiryCalender == true) && 
                                        <DateTimePicker
                                            value={(isInsuranceExpiryDate) ? isInsuranceExpiryDate : null}
                                            mode='date'
                                            onChange={changeInsuranceExpirySelectedDate}
                                            display="spinner"
                                        /> }
                                    </View>
                                </TouchableOpacity>
                                {insuranceExpiryDateError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{insuranceExpiryDateError}</Text>
                                }
                                
                                <View>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.uploadButtonStyle}
                                        onPress={selectRegistrationCrtImg}>
                                        <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
                                        <Text style={{marginRight: 10, fontSize: 18, color: "#000"}}>
                                        Upload Registration Certificate
                                        </Text>
                                        {isRegistrationCertificateImg != null ? (
                                            <Text style={styles.textStyle}>
                                            File Name: {isRegistrationCertificateImg?.name ? isRegistrationCertificateImg.name : ''}
                                            </Text>
                                        ) : null}
                                    </TouchableOpacity>
                                </View>
                                {registrationCertificateImgError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{registrationCertificateImgError}</Text>
                                }
                                <View>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={styles.uploadButtonStyle}
                                        onPress={selectInsurancePolicyImg}>
                                        <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
                                        <Text style={{marginRight: 10, fontSize: 18, color: "#000"}}>
                                        Upload Insurance Policy
                                        </Text>
                                        {isInsuranceImg != null ? (
                                            <Text style={styles.textStyle}>
                                            File Name: {isInsuranceImg.name ? isInsuranceImg.name : ''}
                                            </Text>
                                        ) : null}
                                    </TouchableOpacity>
                                </View>
                                {insuranceImgError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{insuranceImgError}</Text>
                                }

                            <Button
                                style={{marginTop:15}}
                                mode={'contained'}
                                onPress={submit}
                            >
                                Submit
                            </Button>
                        </View>
                    </InputScrollView>
                }
            <Portal>
                <Modal visible={addBrandModal} onDismiss={() => { setAddBrandModal(false); setNewBrandName(""); setIsBrand(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Brand</Text>
                    <TextInput
                        label='Brand Name'
                        style={styles.input}
                        placeholder="Brand Name"
                        value={newBrandName}
                        onChangeText={(text) => setNewBrandName(text)}
                    />
                    {newBrandNameError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newBrandNameError}</Text>
                    }
                    <View style={{flexDirection: "row",}}>
                        <Button
                            style={{marginTop:15, flex: 1, marginRight: 10}}
                            mode={'contained'}
                            onPress={addNewBrand}
                        >
                            Add
                        </Button>
                        <Button
                            style={{marginTop:15, flex: 1}}
                            mode={'contained'}
                            onPress={() => setAddBrandModal(false)}
                        >
                            Close
                        </Button>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal visible={addModelModal} onDismiss={() => { setAddModelModal(false); setNewModelName(""); setIsModel(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Model</Text>
                    <TextInput
                        label='Model Name'
                        style={styles.input}
                        placeholder="Model Name"
                        value={newModelName}
                        onChangeText={(text) => setNewModelName(text)}
                    />
                    {newModelNameError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newModelNameError}</Text>
                    }
                    <View style={{flexDirection: "row",}}>
                        <Button
                            style={{marginTop:15, flex: 1, marginRight: 10}}
                            mode={'contained'}
                            onPress={addNewModel}
                        >
                            Add
                        </Button>
                        <Button
                            style={{marginTop:15, flex: 1}}
                            mode={'contained'}
                            onPress={() => setAddModelModal(false)}
                        >
                            Close
                        </Button>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal visible={addInsuranceCompanyModal} onDismiss={() => { setAddInsuranceCompanyModal(false); setNewInsuranceCompanyName(""); setIsInsuranceProvider(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Model</Text>
                    <TextInput
                        label='Insurance Company Name'
                        style={styles.input}
                        placeholder="Insurance Company Name"
                        value={newInsuranceCompanyName}
                        onChangeText={(text) => setNewInsuranceCompanyName(text)}
                    />
                    {newInsuranceCompanyNameError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newInsuranceCompanyNameError}</Text>
                    }
                    <View style={{flexDirection: "row",}}>
                        <Button
                            style={{marginTop:15, flex: 1, marginRight: 10}}
                            mode={'contained'}
                            onPress={addNewInsuranceCompany}
                        >
                            Add
                        </Button>
                        <Button
                            style={{marginTop:15, flex: 1}}
                            mode={'contained'}
                            onPress={() => setAddInsuranceCompanyModal(false)}
                        >
                            Close
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        padding:20,
        flex: 1,
        backgroundColor: colors.white, 
        justifyContent:'center',
    },
    input: {
        marginTop: 20,
        padding: 15,
        height: 55,
        borderColor: colors.light_gray, // 7a42f4
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
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
        borderColor: colors.light_gray, // 7a42f4
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#424242',
        paddingHorizontal: 15,
        height: 55,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: 'absolute',
        right: 7,
        top: 6,
        zIndex: 2,
    },
    dropDownContainer: {
        borderWidth:1,
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
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
})

export default connect(mapStateToProps)(EditVehicle);
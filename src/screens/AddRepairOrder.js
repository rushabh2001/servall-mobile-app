import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity, Pressable, Image } from 'react-native';
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
import { SliderPicker } from 'react-native-slider-picker';
import IconX from 'react-native-vector-icons/FontAwesome5';

const AddRepairOrder = ({ navigation, userRole, userToken, selectedGarageId, userId, garageId }) => {

    // User / Customer Fields
    const [isUserVehicleDetails, setIsUserVehicleDetails] = useState('');

    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isCity, setIsCity] = useState();
    const [isState, setIsState] = useState();
    const [isAddress, setIsAddress] = useState('');
    const [nameError, setNameError] = useState('');     // Error States
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');

    const [CityList, setCityList] = useState([]);
    const [StateList, setStateList] = useState([]);

    // Vehicle Fields
    const [isBrand, setIsBrand] = useState();
    const [isBrandName, setIsBrandName] = useState();
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

    const [isOdometerKMs, setIsOdometerKMs] = useState('');
    const [odometerKMsError, setOdometerKMsError] = useState('');
    const [isFuelLevel, setIsFuelLevel] = useState(1);

    const [isGarageId, setIsGarageId] = useState();
    const [garageIdError, setGarageIdError] = useState();

    const [garageList, setGarageList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [insuranceProviderList, setInsuranceProviderList] = useState([]);
    const [cityFieldToggle, setCityFieldToggle] = useState(false);
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

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const isFocused = useIsFocused();
    const scroll1Ref = useRef();
    // const brandRef = useRef(null);
    const modelRef = useRef(null);

    const changeStep = number => {
        setStep(number);
    }

    const addNewInsuranceCompany = async () => {
        let data = { 'name': newInsuranceCompanyName }
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
        let data = { 'name': newBrandName }
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
        let data = { 'model_name': newModelName, 'brand_id': parseInt(isBrand) }
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
            // console.log(res);
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
            let formateDateForDatabase = moment(currentDate, 'YYYY MMMM D').format('YYYY-MM-DD');
            setIsPurchaseDate(formateDateForDatabase);
        }
    };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateManufacturing;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY MMMM D').format('YYYY-MM-DD');
            setIsManufacturingDate(formateDateForDatabase);
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateInsuranceExpiry;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY MMMM D').format('YYYY-MM-DD');
            setIsInsuranceExpiryDate(formateDateForDatabase);
        }
    };

    const validate = () => {
        return !(
            !isName || isName?.trim().length === 0 ||
            !isPhoneNumber || isPhoneNumber?.trim().length === 0 ||
            !isEmail || isEmail?.trim().length === 0 || isEmail?.trim().length < 6 || isEmail?.indexOf('@') < 0 || isEmail?.indexOf(' ') >= 0 ||
            !isCity || isCity === 0 ||
            !isState || isState === 0 ||
            !isBrand || isBrand === 0 ||
            !isModel || isModel === 0 ||
            !isGarageId || isGarageId === 0 ||
            !isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0
        )
    }

    const submit = () => {

        Keyboard.dismiss();

        if (!validate()) {
            if (!isName) setNameError("Customer Name is required"); else setNameError('');
            if (!isPhoneNumber) setPhoneNumberError("Phone Number is required"); else setPhoneNumberError('');
            if (!isEmail) setEmailError("Email is required");
            else if (isEmail.length < 6) setEmailError("Email should be minimum 6 characters");
            else if (isEmail?.indexOf(' ') >= 0) setEmailError('Email cannot contain spaces');
            else if (isEmail?.indexOf('@') < 0) setEmailError('Invalid Email Format');
            else setEmailError('');
            if (!isBrand || isBrand === 0) setBrandError('Brand is required'); else setBrandError('');
            if (!isModel || isModel === 0) setModelError('Model is required'); else setModelError('');
            if (!isCity || isCity === 0) setCityError("City is required"); else setCityError('');
            if (!isState || isState === 0) setStateError("State is required"); else setStateError('');
            if (!isGarageId || isGarageId == 0) setGarageIdError("Customer Belongs to Garage Field is required"); else setGarageIdError('');
            if (!isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0) setVehicleRegistrationNumberError("Vehicle Registration Number is required"); else setVehicleRegistrationNumberError('');
            return;
        }

        // let dataCheck = ({'email': isEmail, 'phone_number': isPhoneNumber, 'vehicle_registration_number': isVehicleRegistrationNumber});
        // setEmailError("");
        // setPhoneNumberError("");
        // setVehicleRegistrationNumberError("");

        // userVehicleCheck(dataCheck);

        const data = new FormData();
        data.append('name', isName?.trim());
        data.append('email', isEmail?.trim());
        data.append('phone_number', isPhoneNumber?.trim());
        data.append('city', isCity);
        data.append('state', isState);
        if (isAddress) data.append('address', isAddress?.trim());
        data.append('brand_id', JSON.stringify(isBrand));
        data.append('model_id', JSON.stringify(isModel));
        data.append('vehicle_registration_number', isVehicleRegistrationNumber?.trim());
        if (isPurchaseDate) data.append('purchase_date', isPurchaseDate);
        if (isManufacturingDate) data.append('manufacturing_date', isManufacturingDate);
        if (isEngineNumber) data.append('engine_number', isEngineNumber?.trim());
        if (isChasisNumber) data.append('chasis_number', isChasisNumber?.trim());
        if (isInsuranceProvider) data.append('insurance_id', parseInt(isInsuranceProvider));
        if (isInsurerGstin) data.append('insurer_gstin', isInsurerGstin?.trim());
        if (isInsurerAddress) data.append('insurer_address', isInsurerAddress?.trim());
        if (isPolicyNumber) data.append('policy_number', isPolicyNumber?.trim());
        if (isInsuranceExpiryDate) data.append('insurance_expiry_date', isInsuranceExpiryDate);
        if (isRegistrationCertificateImg != null) data.append('registration_certificate_img', isRegistrationCertificateImg);
        if (isInsuranceImg != null) data.append('insurance_img', isInsuranceImg);
        data.append('vehicle_option', 'new_vehicle');
        data.append('garage_id', isGarageId);
        data.append('odometer_kms', isOdometerKMs);
        data.append('fuel_level', isFuelLevel);

        addCustomer(data);
        setIsUserVehicleDetails(data);
        // console.log(JSON.stringify(data));
        // console.log(isRegistrationCertificateImg);  
    }

    const addCustomer = async (data) => {
        try {
            console.log("working fine till here");
            // console.log(isRegistrationCertificateImg[0]);  
            // console.log(data);
            await fetch(`${API_URL}add_new_customer`, {
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
                    if (res.statusCode == 400) {
                        { res.data.message.email && setEmailError(res.data.message.email); }
                        { res.data.message.phone_number && setPhoneNumberError(res.data.message.phone_number); }
                        { res.data.message.vehicle_registration_number && setVehicleRegistrationNumberError(res.data.message.vehicle_registration_number); }
                        return;
                    } else if (res.statusCode == 201 || res.statusCode == 200) {
                        setIsUserVehicleDetails([...isUserVehicleDetails, { 'user_id': res.data.user_id, 'vehicle_id': res.data.vehicle_id }]);
                        setStep(2);
                        // navigation.navigate('MyCustomers');
                    } else {
                        navigation.navigate('MyCustomers');
                    }
                });

        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
            navigation.navigate('MyCustomers');
        }
    };

    const getStatesList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_states`, {
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
                setStateList(json.states);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading(false);
        }
    };

    const getCityList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_cities?state_id=${isState}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setCityList(json.cities);
                setCityFieldToggle(true);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
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

    const getGarageList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setGarageList(json.garage_list);
                // console.log(json);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
            setIsGarageId(selectedGarageId);
        }

        // try {
        //     const res = await fetch(`${API_URL}fetch_garages`, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + userToken
        //         },
        //     });
        //     const json = await res.json();
        //     if (json !== undefined) {
        //         // console.log(json.states);
        //         setGarageList(json.data);
        //     }
        // } catch (e) {
        //     console.log(e);
        // } finally {
        //     // setIsLoading(false);
        // }
    };

    const repairOrder = () => {
        return (
            <View style={styles.pageContainer}>
                <Text>Hello</Text>
            </View>
        )
    }

    useEffect(() => {
        setStep(2);
        console.log('use effect', isUserVehicleDetails);
    }, [isUserVehicleDetails]);

    useEffect(() => {
        getStatesList();
        getBrandList();
        getGarageList();
        getInsuranceProviderList();
        // console.log('garageId:', garageId);
        // console.log('selectedGarageId:',  selectedGarageId == 0 ? console.log('option1') : parseInt(garageId));
    }, []);

    useEffect(() => {
        if (isState != undefined) getCityList();
    }, [isState]);

    useEffect(() => {
        if (isBrand != undefined) getModelList();
    }, [isBrand]);

    // useEffect(() => {
    //     setIsLoading(true);
    //     if(isFocused) {
    //         setStep(1);
    //     }
    // }, [isFocused]);

    // useEffect(() => {
    //     console.log('garageId:', isGarageId);
    // }, [isGarageId]);

    return (
        <View style={styles.pageContainer}>
            {(step == 1) ?
                ((isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                    <InputScrollView
                        ref={scroll1Ref}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={8}
                        // keyboardOffset={160}
                        behavior="padding"
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.headingStyle, { marginTop: 20 }]}>Customer Details:</Text>
                            <TextInput
                                mode="outlined"
                                label='Customer Name'
                                style={styles.input}
                                placeholder="Customer Name"
                                value={isName}
                                onChangeText={(text) => setIsName(text)}
                            />
                            {nameError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{nameError}</Text>
                            }
                            <TextInput
                                mode="outlined"
                                label='Email Address'
                                style={styles.input}
                                placeholder="Email Address"
                                value={isEmail}
                                onChangeText={(text) => setIsEmail(text)}
                            />
                            {emailError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{emailError}</Text>
                            }
                            <TextInput
                                mode="outlined"
                                label='Phone Number'
                                style={styles.input}
                                placeholder="Phone Number"
                                value={isPhoneNumber}
                                onChangeText={(text) => setIsPhoneNumber(text)}
                                keyboardType={"phone-pad"}
                            />
                            {phoneNumberError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{phoneNumberError}</Text>
                            }
                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isState}
                                    onValueChange={(v) => { setIsState(v) }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item label="Select State" value="0" />
                                    {StateList.map((StateList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'state'+i}
                                                label={StateList.name}
                                                value={StateList.id}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                            {stateError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{stateError}</Text>
                            }
                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isCity}
                                    onValueChange={(v) => setIsCity(v)}
                                    style={styles.dropDownStyle}
                                    itemStyle={{ padding: 0 }}
                                    enabled={cityFieldToggle}
                                >
                                    <Picker.Item label="Select City" value="0" />
                                    {CityList.map((CityList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'city'+i}
                                                label={CityList.name}
                                                value={CityList.id}
                                            />
                                        );
                                    })}

                                </Picker>
                            </View>
                            {cityError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{cityError}</Text>
                            }
                            <TextInput
                                mode="outlined"
                                label='Address'
                                style={styles.input}
                                placeholder="Address"
                                value={isAddress}
                                onChangeText={(text) => setIsAddress(text)}
                            />
                            {addressError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{addressError}</Text>
                            }

                            {(userRole == "Super Admin" || garageId?.length > 1) &&
                                <View>
                                    <View style={styles.dropDownContainer}>
                                        <Picker
                                            selectedValue={isGarageId}
                                            onValueChange={(option) => setIsGarageId(option)}
                                            style={styles.dropDownField}
                                            itemStyle={{ padding: 0 }}
                                        >
                                            <Picker.Item label="Customer Belongs To Garage" value="0" />
                                            {garageList.map((garageList, i) => {
                                                return (
                                                    <Picker.Item
                                                        key={'garage'+i}
                                                        label={garageList.garage_name}
                                                        value={garageList.id}
                                                    />
                                                );
                                            })}
                                            {/* <Picker.Item label="Add New Insurance Company" value="new_insurance_company" /> */}
                                        </Picker>
                                    </View>
                                    {garageIdError?.length > 0 &&
                                        <Text style={styles.errorTextStyle}>{garageIdError}</Text>
                                    }
                                </View>
                            }

                            <Text style={[styles.headingStyle, { marginTop: 20 }]}>Vehicle Details:</Text>
                            <View style={styles.dropDownContainer}>
                                <Picker

                                    // key={brandRef}
                                    selectedValue={isBrand}
                                    onValueChange={(optionId) => { setIsBrand(optionId); if (optionId == "new_brand") setAddBrandModal(true) }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item label="Select Brand" value="0" />
                                    {brandList.map((brandList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'brand'+i}
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
                                    ref={modelRef}
                                    key={modelRef}
                                    selectedValue={isModel}
                                    onValueChange={(option) => { setIsModel(option); if (option == "new_model") setAddModelModal(true) }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                    enabled={modelFieldToggle}
                                >
                                    <Picker.Item label="Select Vehicle Model" value="0" />
                                    {modelList.map((modelList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'model'+i}
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
                                mode="outlined"
                                label='Vehicle Registration Number'
                                style={styles.input}
                                placeholder="Vehicle Registration Number"
                                value={isVehicleRegistrationNumber}
                                onChangeText={(text) => setIsVehicleRegistrationNumber(text)}
                            />
                            {vehicleRegistrationNumberError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{vehicleRegistrationNumberError}</Text>
                            }
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => setDisplayPurchaseCalender(true)} activeOpacity={1}>
                                <View style={styles.datePickerContainer} pointerEvents='none'>
                                    <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                    <TextInput
                                        mode="outlined"
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
                                        />}
                                </View>
                            </TouchableOpacity>
                            {purchaseDateError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{purchaseDateError}</Text>
                            }
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => setDisplayManufacturingCalender(true)} activeOpacity={1}>
                                <View style={styles.datePickerContainer} pointerEvents='none'>
                                    <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                    <TextInput
                                        mode="outlined"
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
                                        />}
                                </View>
                            </TouchableOpacity>
                            {manufacturingDateError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{manufacturingDateError}</Text>
                            }
                            <TextInput
                                mode="outlined"
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
                                mode="outlined"
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
                                    onValueChange={(option) => { setIsInsuranceProvider(option); if (option == "new_insurance_company") setAddInsuranceCompanyModal(true) }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item label="Select Insurance Provider Company" value="0" />
                                    {insuranceProviderList.map((insuranceProviderList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'insurance_company'+i}
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
                                mode="outlined"
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
                                mode="outlined"
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
                                mode="outlined"
                                label='Policy Number'
                                style={styles.input}
                                placeholder="Policy Number"
                                value={isPolicyNumber}
                                onChangeText={(text) => setIsPolicyNumber(text)}
                            />
                            {policyNumberError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{policyNumberError}</Text>
                            }
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => setDisplayInsuranceExpiryCalender(true)} activeOpacity={1}>
                                <View style={styles.datePickerContainer} pointerEvents='none'>
                                    <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                    <TextInput
                                        mode="outlined"
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
                                        />}
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
                                    <Text style={{ marginRight: 10, fontSize: 18, color: "#000" }}>
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
                                    <Text style={{ marginRight: 10, fontSize: 18, color: "#000" }}>
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

                            <Text style={[styles.headingStyle, { marginTop: 20 }]}>Additional Information:</Text>
                            <TextInput
                                mode="outlined"
                                label='Odometer (in KMs)'
                                style={styles.input}
                                placeholder="Odometer (in KMs)"
                                value={isOdometerKMs}
                                onChangeText={(text) => setIsOdometerKMs(text)}
                            />
                            {odometerKMsError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{odometerKMsError}</Text>
                            }
                            <View style={styles.odometerContainer}>
                                <SliderPicker
                                    minLabel={"Empty"}
                                    // minLabel={(color) => {<IconX name={'temperature-empty'} size={16} color={colors.secondary} />}} 
                                    // midLabel={'mid'}
                                    maxLabel={"Full"}
                                    // maxLabel={(color) => <IconX name={'temperature-full'} size={16} color={colors.secondary} />}
                                    maxValue={10}
                                    callback={(position) => {
                                        setIsFuelLevel(position);
                                        console.log(isFuelLevel)
                                    }}
                                    defaultValue={isFuelLevel}
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
                            <Button
                                style={{ marginTop: 15 }}
                                mode={'contained'}
                                onPress={submit}
                            >
                                Next
                            </Button>
                            <Button
                                style={{ marginTop: 15 }}
                                mode={'contained'}
                                onPress={() => {

                                    const data = {
                                        'name': isName?.trim(),
                                        'email': isEmail?.trim(),
                                        'phone_number': isPhoneNumber?.trim(),
                                        'brand_id': isBrand,
                                        'model_id': isModel,
                                        'vehicle_registration_number': isVehicleRegistrationNumber?.trim(),
                                        'user_id': 1,
                                        'vehicle_id': 2,
                                        'brand_name': isBrandName,
                                        // 'model_name': modelRef.props?.children,
                                    }
                                    // console.log('jjjjjj',data);
                                    // console.log('ref', brandRef.current.props.children);
                                    // console.log('pickerRef', brandRef.current.pickerRef.current.focus);
                                    setIsUserVehicleDetails(data);
                                    // console.log('jjjjjj',data)
                                    // console.log('jjjjjj',isUserVehicleDetails)
                                    //    setStep(2);
                                }}
                            >
                                Next Step
                            </Button>

                        </View>
                    </InputScrollView>
                )
                :
                <AddRepairOrderStep2
                    userVehicleDetails={isUserVehicleDetails}
                    changeStep={changeStep}
                />
            }
            <Portal>
                <Modal visible={addBrandModal} onDismiss={() => { setAddBrandModal(false); setNewBrandName(""); setIsBrand(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Brand</Text>
                    <TextInput
                        mode="outlined"
                        label='Brand Name'
                        style={styles.input}
                        placeholder="Brand Name"
                        value={newBrandName}
                        onChangeText={(text) => setNewBrandName(text)}
                    />
                    {newBrandNameError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newBrandNameError}</Text>
                    }
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            onPress={addNewBrand}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
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
                        mode="outlined"
                        label='Model Name'
                        style={styles.input}
                        placeholder="Model Name"
                        value={newModelName}
                        onChangeText={(text) => setNewModelName(text)}
                    />
                    {newModelNameError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newModelNameError}</Text>
                    }
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            onPress={addNewModel}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
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
                        mode="outlined"
                        label='Insurance Company Name'
                        style={styles.input}
                        placeholder="Insurance Company Name"
                        value={newInsuranceCompanyName}
                        onChangeText={(text) => setNewInsuranceCompanyName(text)}
                    />
                    {newInsuranceCompanyNameError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newInsuranceCompanyNameError}</Text>
                    }
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            onPress={addNewInsuranceCompany}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
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







// Step - 2 for Repair Order

const AddRepairOrderStep2 = ({ changeStep, navigation, userVehicleDetails, userRole, userToken, selectedGarageId, userId, garageId }) => {

    // User / Customer Fields
    const [isUserDetails, setIsUserDetails] = useState();

    const [isUserId, setIsUserId] = useState();
    const [isVehicleId, setIsVehicleId] = useState();
    const [isName, setIsName] = useState(userVehicleDetails.name);
    const [isEmail, setIsEmail] = useState(userVehicleDetails?.email);
    const [isPhoneNumber, setIsPhoneNumber] = useState(userVehicleDetails?.phone_number);

    // Vehicle Fields
    const [isBrand, setIsBrand] = useState(userVehicleDetails?.brand_id);
    const [isModel, setIsModel] = useState(userVehicleDetails?.model_id);
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] = useState(userVehicleDetails?.vehicle_registration_number);

    const [isOdometerKMs, setIsOdometerKMs] = useState('');
    const [isFuelLevel, setIsFuelLevel] = useState(1);

    const [isVehicleImg, setIsVehicleImg] = useState();
    const [vehicleImgError, setVehicleImgError] = useState();

    const [isQuantity, setIsQuantity] = useState();
    const [isRate, setIsRate] = useState();
    const [isServiceName, setIsServiceName] = useState();
    const [isComment, setIsComment] = useState();

    const [isEstimateDeliveryDateTime, setIsEstimateDeliveryDateTime] = useState(new Date());
    const [estimateDeliveryDateTime, setEstimateDeliveryDateTime] = useState('');
    const [displayDeliveryDateCalender, setDisplayDeliveryDateCalender] = useState(false);
    const [displayDeliveryTimeClock, setDisplayDeliveryTimeClock] = useState(false);
    const [isDeliveryDate, setIsDeliveryDate] = useState(new Date());
    const [isDeliveryTime, setIsDeliveryTime] = useState(new Date());

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(true);

    const [addBrandModal, setAddBrandModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState();
    const [addNewBrand, setAddNewBrand] = useState();
    const [brandError, setBranError] = useState();
    const [brandList2, setBrandList2] = useState([]);

    const isFocused = useIsFocused();

    const [fields, setFields] = useState([{ serviceName: null, rate: null, quantity: 0, discount: 0, totalForThisService: 0 }]);
    const [fieldsParts, setFieldsParts] = useState([{ serviceName: null, rate: null, quantity: 0, discount: 0, totalForThisService: 0 }]);

    function handleChange(i, value) {
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
        console.log(i);
        setFields(values);
        console.log(fields);
    }

    function handleAdd() {
        const values = [...fields];
        values.push({ serviceName: null, rate: null, quantity: 0, discount: 0, totalForThisService: 0 });
        setFields(values);
    }

    function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    }

    // Function for Parts Fields

    function handlePartChange(i, value) {
        const values = [...fieldsParts];
        values[i][value.name] = value.value;
        values[i]['totalForThisService'] = (values[i]['rate'] * values[i]['quantity']) - ((values[i]['rate'] * values[i]['quantity']) * (values[i]['discount'] / 100))

        console.log(i);
        setFields(values);
        console.log(fields);
    }

    function handlePartAdd() {
        const values = [...fieldsParts];
        values.push({ serviceName: null, rate: null, quantity: null, discount: 0, totalForThisService: null });
        setFields(values);
    }

    function handlePartRemove(i) {
        const values = [...fieldsParts];
        values.splice(i, 1);
        setFields(values);
    }


    const selectVehicleImg = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
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
        console.log(selectedDate);
        if (selectedDate != null) {
            let currentDate = selectedDate || isDeliveryDate;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayDeliveryDateCalender(false);
            // setEstimateDeliveryDateTime(currentDate);
            // setEstimateDeliveryTime(formattedDate);
            // let formateDateForDatabase = moment(currentDate, 'YYYY MMMM D').format('YYYY-MM-DD');
            setIsDeliveryDate(formattedDate);

            setDisplayDeliveryTimeClock(true);
        }
    };

    const changeSelectedTime = (event, selectedTime) => {
        // console.log(selectedTime);
        if (selectedTime != null) {
            let currentTime = selectedTime || isDeliveryTime;
            let convertToTime = moment(currentTime, 'HH:mm ZZ');
            console.log(isDeliveryDate + ' ' + convertToTime);
            // let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            var formattedDate = moment(isDeliveryDate + ' ' + convertToTime).format('YYYY-MM-DD HH:mm ZZ');
            console.log('formated Date', formattedDate);
            setEstimateDeliveryDateTime(formattedDate);
            setDisplayDeliveryTimeClock(false);
            // setIsDeliveryTime(formattedDate);

            // setEstimateDeliveryDateTime(currentDate);
            // const utcDate = moment(str, new Date(formattedDate));
            // setEstimateDeliveryDateTime(formattedDate);
            let formateDateForDatabase = moment(isDeliveryDate + ' ' + currentTime, "America/Los_Angeles");
            console.log(formateDateForDatabase)
            // setEstimateDeliveryDateTime(formateDateForDatabase);

            // setDisplayDeliveryTimeClock(true);
        }
    };

    // Parts Functions ----- End Here

    // const getBrandList2 = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_brand`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             console.log(json);
    //             setBrandList2(json.brand_list);
    //             handleAdd();
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setIsLoading2(false);
    //     }
    // };

    // useEffect(() => {
    // console.log(brandList2);
    // }, []);

    // useEffect(() => {
    //     setIsLoading2(true);
    //     if (isFocused) {
    //         getBrandList2();
    //     }
    // }, [isFocused]);

    return (
        <>
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
                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            onPress={() => changeStep(1)}
                        >
                            Back
                        </Button>
                        <View style={styles.cardContainer}>
                            <View style={[styles.cardRightContent, { flex: 0.5 }]}>
                                <Text style={styles.cardMainTitle}>Customer Details:</Text>
                                <Text style={styles.cardTitle}>{isName}</Text>
                                <Text style={styles.cardTitle}>{isEmail}</Text>
                                <Text style={styles.cardTitle}>{isPhoneNumber}</Text>
                            </View>
                            <View style={[styles.cardRightContent, { flex: 0.5 }]}>
                                <Text style={styles.cardMainTitle}>Vehicle Details:</Text>
                                <Text style={styles.cardTitle}>{isBrand}</Text>
                                <Text style={styles.cardTitle}>{isModel}</Text>
                                <Text style={styles.cardTitle}>{isVehicleRegistrationNumber}</Text>
                            </View>
                        </View>

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Service:</Text>

                        {fields.map((field, idx) => {
                            return (
                                <View style={styles.addFieldContainerGroup}>
                                    <View style={[styles.cardRightContent, { flex: 1 }]}>
                                        <Text style={styles.serviceNameContent}>Oil Change</Text>
                                    </View>
                                    <View style={[styles.cardRightContent, { flex: 1 }]}>
                                        <View style={styles.addFieldContainer} key={`service-${field}-${idx}`}>
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
                                                        handleChange(idx, parameter);
                                                    }
                                                }
                                            />
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
                                                        handleChange(idx, parameter);
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
                                                        handleChange(idx, parameter);
                                                    }
                                                }
                                            />
                                            {(idx != 0) ??
                                                <TouchableOpacity style={styles.removeEntryIconContainer} onPress={() => handleRemove(idx)}>
                                                    <Icon style={styles.removeEntryIcon} name="close" size={24} color="#000" />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.5 }}
                                mode={'contained'}
                                icon="plus"
                                // onPress={submit}
                                onPress={() => {
                                    setAddBrandModal(true);
                                }}
                            >
                                Add More Service
                            </Button>
                            <View style={{ flex: 0.5 }}>
                            </View>
                        </View>


                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Parts:</Text>
                        {fieldsParts.map((field, idx) => {
                            return (
                                <View style={styles.addFieldContainerGroup}>
                                    <View style={[styles.cardRightContent, { flex: 1 }]}>
                                        <Text style={styles.partNameContent}>Oil Change</Text>
                                    </View>
                                    <View style={[styles.cardRightContent, { flex: 1 }]}>
                                        <View style={styles.addFieldContainer} key={`parts-${field}-${idx}`}>
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
                                            {/* {(idx != 0) ?? */}
                                            <TouchableOpacity style={styles.removeEntryIconContainer} onPress={() => handlePartRemove(idx)}>
                                                <Icon style={styles.removeEntryIcon} name="close" size={24} color="#000" />
                                            </TouchableOpacity>
                                            {/* } */}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                        <View style={styles.addFieldBtnContainer}>
                            <Button
                                style={{ marginTop: 15, flex: 0.5 }}
                                mode={'contained'}
                                icon="plus"
                                // onPress={submit}
                                onPress={() => {
                                    setAddBrandModal(true);
                                }}
                            >
                                Add More Parts
                            </Button>
                            <View style={{ flex: 0.5 }}>
                            </View>
                        </View>

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
                                        File Name: {isVehicleImg[0].name ? isVehicleImg[0].name : ''}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View>
                        {/* {vehicleImgError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{vehicleImgError}</Text>
                        } */}

                        <View style={styles.totalFieldContainerGroup}>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.8 }]}>
                                    <Text style={styles.partNameContent}>Labor Total</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                        <TextInput
                                            mode="outlined"
                                            label='Labor Total'
                                            style={styles.textEntryInput}
                                            placeholder="Labor Total"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setLaborTotal(value)}
                                        />
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
                                        <TextInput
                                            mode="outlined"
                                            label='Parts Total'
                                            style={styles.textEntryInput}
                                            placeholder="Parts Total"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setPartsTotal(value)}
                                        />
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
                                        <TextInput
                                            mode="outlined"
                                            label='Total'
                                            style={styles.textEntryInput}
                                            placeholder="Total"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setTotal(value)}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.totalFieldsGroup}>
                                <View style={[styles.totalFieldsLeftContent, { flex: 0.8 }]}>
                                    <Text style={styles.partNameContent}>Applicable Amount</Text>
                                </View>
                                <View style={[styles.totalFieldsRightContent, { flex: 1 }]}>
                                    <Text style={styles.totalFieldTextContainer}>INR </Text>
                                    <View style={styles.totalFieldContainer}>
                                        <TextInput
                                            mode="outlined"
                                            label='Applicable Amount'
                                            style={styles.textEntryInput}
                                            placeholder="Applicable Amount"
                                            // value={isName}
                                            // onChangeText={(text) => setIsName(text)}
                                            onChangeText={(value) => setApplicableAmount(value)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Service:</Text>
                        <TextInput
                            mode="outlined"
                            label='Comment'
                            style={styles.input}
                            placeholder="Comment"
                            value={isComment}
                            onChangeText={(text) => setIsComment(text)}
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
                                        is24Hour={true}
                                        displsay="default"
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
                        // onPress={submit}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            onPress={() => changeStep(1)}
                        >
                            Back
                        </Button>
                    </View>
                </InputScrollView>
            }

            <Portal>
                <Modal visible={addBrandModal} onDismiss={() => { setAddBrandModal(false); setIsBrand(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Brand</Text>
                    {(isLoading2 == true) ? <ActivityIndicator></ActivityIndicator>
                        :
                        <>
                            <View style={styles.dropDownContainer}>
                                <Picker
                                    selectedValue={isBrand}
                                    onValueChange={(option) => { setIsBrand2(option); }}
                                    style={styles.dropDownField}
                                    itemStyle={{ padding: 0 }}
                                >
                                    <Picker.Item label="Select Brand" value="0" />
                                    {brandList2?.map((brandList, i) => {
                                        return (
                                            <Picker.Item
                                                key={'brand2'+i}
                                                label={brandList?.name}
                                                value={brandList?.id}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                            {brandError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{brandError}</Text>
                            }
                            <View style={{ flexDirection: "row", }}>
                                <Button
                                    style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                                    mode={'contained'}
                                // onPress={addNewBrand}
                                >
                                    Add
                                </Button>
                                <Button
                                    style={{ marginTop: 15, flex: 1 }}
                                    mode={'contained'}
                                    onPress={() => setAddBrandModal(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </>
                    }
                </Modal>
            </Portal>
        </>
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
        fontSize: 17,
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
        flex: 0.29,
        marginRight: 10,
    },
    removeEntryIconContainer: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: 5,
        zIndex: 2,
        borderColor: colors.light_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.gray,
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
    }
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(AddRepairOrder);
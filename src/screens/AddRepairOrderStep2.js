import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Modal, Portal, Divider, TextInput, Button, Searchbar, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioForm from 'react-native-simple-radio-button';
import { set } from 'react-hook-form';

const AddRepairOrderStep2 = ({ navigation, userRole, userToken, selectedGarageId, userId, garageId }) => {
    
    const [isUserVehicleDetails, setIsUserVehicleDetails] = useState('');

    // Customer Fields
    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isCity, setIsCity] = useState();
    const [isState, setIsState] = useState();
    const [isAddress, setIsAddress] = useState('');
    const [userOption, setUserOption] = useState('new_user');

    const [isUser, setIsUser] = useState();
    const [userList, setUserList] =  useState([]);
    const [userError, setUserError] = useState('');
    const [isUserName, setIsUserName] = useState('');
    const [userListModal, setUserListModal] = useState(false);
    const [isLoadingUserList, setIsLoadingUserList] = useState(false);
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [searchQueryForUsers, setSearchQueryForUsers] = useState(); 

    // Error States
    const [nameError, setNameError] = useState(''); 
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');

    const [CityList, setCityList] =  useState([]);
    const [StateList, setStateList] =  useState([]);

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

    // Error States
    const [brandError, setBrandError] = useState('');
    const [modelError, setModelError] = useState('');
    const [vehicleRegistrationNumberError, setVehicleRegistrationNumberError] = useState('');
    const [registrationCertificateImgError, setRegistrationCertificateImgError] = useState('');
    const [insuranceImgError, setInsuranceImgError] = useState('');

    const [isGarageId, setIsGarageId] =  useState();
    const [garageIdError, setGarageIdError] = useState();

    const [garageList, setGarageList] =  useState([]);
    const [brandList, setBrandList] =  useState([]);
    const [modelList, setModelList] =  useState([]);
    const [insuranceProviderList, setInsuranceProviderList] =  useState([]);
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
    const [addModelModal, setAddModelModal] = useState(false);
    const [newModelName, setNewModelName] = useState();
    const [addInsuranceCompanyModal, setAddInsuranceCompanyModal] = useState(false);
    const [newInsuranceCompanyName, setNewInsuranceCompanyName] = useState();

    const [isLoading, setIsLoading] = useState(false);
    
    const scroll1Ref = useRef();

    var radio_props = [
        {label: 'New User', value: 'new_user' },
        {label: 'Existing User', value: 'existing_user' }
      ];

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
            let formattedDate = moment(currentDate, 'YYYY-MM-DD', true).format('DD-MM-YYYY');
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsPurchaseDate(new Date(formateDateForDatabase));
        }
     };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateManufacturing;
            let formattedDate = moment(currentDate, 'YYYY-MM-DD', true).format('DD-MM-YYYY');
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsManufacturingDate(new Date(formateDateForDatabase));
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateInsuranceExpiry;
            let formattedDate = moment(currentDate, 'YYYY-MM-DD', true).format('DD-MM-YYYY');
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsInsuranceExpiryDate(new Date(formateDateForDatabase));  
        }   
    };

    const validate = () => {
        if(userOption == "new_user") {
            return !(
                !isName || isName?.trim().length === 0  || 
                !isPhoneNumber || isPhoneNumber?.trim().length === 0 || 
                !isEmail || isEmail?.trim().length === 0 ||  isEmail?.trim().length < 6 || isEmail?.indexOf('@') < 0 || isEmail?.indexOf(' ') >= 0 ||
                !isCity || isCity === 0 ||
                !isState || isState === 0 ||
                !isBrand || isBrand === 0 ||
                !isModel || isModel === 0 ||
                !isGarageId || isGarageId === 0 ||
                !isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0 
            )
        } else if(userOption == "existing_user") {
            return !(
                !isBrand || isBrand === 0 ||
                !isModel || isModel === 0 ||
                !isGarageId || isGarageId === 0 ||
                !isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0 
            )
        }
    }

    const submit = () => {
    
        Keyboard.dismiss();  

        if (!validate()) {
            if(userOption == "new_user") {
                if (!isName) setNameError("Customer Name is required"); else setNameError('');
                if (!isPhoneNumber) setPhoneNumberError("Phone Number is required"); else setPhoneNumberError('');
                if (!isEmail) setEmailError("Email is required");
                else if (isEmail.length < 6) setEmailError("Email should be minimum 6 characters");
                else if (isEmail?.indexOf(' ') >= 0) setEmailError('Email cannot contain spaces');
                else if (isEmail?.indexOf('@') < 0) setEmailError('Invalid Email Format');
                else setEmailError('');
            } else if(userOption == "existing_user") {
                if (!isUser || isUser === 0) setUserError('User is required'); else setUserError('');
            }
            if (!isBrand || isBrand === 0) setBrandError('Brand is required'); else setBrandError('');
            if (!isModel || isModel === 0) setModelError('Model is required'); else setModelError('');
            if (!isCity || isCity === 0) setCityError("City is required"); else setCityError('');
            if (!isState || isState === 0) setStateError("State is required"); else setStateError('');
            if (!isGarageId || isGarageId == 0) setGarageIdError("Customer Belongs to Garage Field is required"); else setGarageIdError('');
            if (!isVehicleRegistrationNumber || isVehicleRegistrationNumber?.trim().length === 0) setVehicleRegistrationNumberError("Vehicle Registration Number is required"); else setVehicleRegistrationNumberError('');
            return;
        }

        const data = new FormData();
 
        if(userOption == "new_user") {
            data.append("user_option", userOption);
            data.append('name', isName?.trim());
            data.append('email', isEmail?.trim());
            data.append('phone_number', isPhoneNumber?.trim());
            data.append('city', isCity);
            data.append('state', isState);
            if(isAddress) data.append('address', isAddress?.trim());
            data.append('vehicle_option', 'new_vehicle');
        } else if(userOption == "existing_user") {
            data.append('user_id', isUser);
        }
        data.append('brand_id', JSON.stringify(isBrand));
        data.append('model_id', JSON.stringify(isModel));
        data.append('vehicle_registration_number', isVehicleRegistrationNumber?.trim());
        if(isPurchaseDate) data.append('purchase_date', moment(isPurchaseDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD'));
        if(isManufacturingDate) data.append('manufacturing_date', moment(isManufacturingDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD'));
        if(isEngineNumber) data.append('engine_number', isEngineNumber?.trim());
        if(isChasisNumber) data.append('chasis_number', isChasisNumber?.trim());
        if(isInsuranceProvider) data.append('insurance_id', parseInt(isInsuranceProvider));
        if(isInsurerGstin) data.append('insurer_gstin', isInsurerGstin?.trim());
        if(isInsurerAddress) data.append('insurer_address', isInsurerAddress?.trim());
        if(isPolicyNumber) data.append('policy_number', isPolicyNumber?.trim());
        if(isInsuranceExpiryDate) data.append('insurance_expiry_date', moment(isInsuranceExpiryDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD'));
        if(isRegistrationCertificateImg != null) data.append('registration_certificate_img', isRegistrationCertificateImg);
        if(isInsuranceImg != null) data.append('insurance_img', isInsuranceImg);
        data.append('garage_id', isGarageId);

        if(userOption == "new_user") {
            console.log('new_user', data);
            addCustomer(data);
        } else if(userOption == "existing_user") {
            console.log('existing_user', data);
            addVehicle(data);
        }
   
    }

    const addCustomer = async (data) => {
        try {
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
                if(res.statusCode == 400) {
                  { res.data.message.email && setEmailError(res.data.message.email); }
                  { res.data.message.phone_number && setPhoneNumberError(res.data.message.phone_number); }
                  { res.data.message.vehicle_registration_number && setVehicleRegistrationNumberError(res.data.message.vehicle_registration_number); }
                  return;
                } else {
                    // console.log('res', res);
                    const jsonData = { 
                        'user_id': res.data.user_id, 
                        'vehicle_id': res.data.vehicle_id,
                        'name': res.data.user_data.name,
                        'email': res.data.user_data.email,
                        'phone_number': res.data.user_data.phone_number,
                        'brand_id': res.data.vehicle_data.brand_id,
                        'model_id': res.data.vehicle_data.model_id,
                        'vehicle_registration_number': res.data.vehicle_data.vehicle_registration_number,
                        'brand_name': brandList.find(data => data.id == isBrand).name,
                        'model_name': modelList.find(data => data.id == isModel).model_name,
                        'garage_id' : res.data.garage_id,
                    }
                    // console.log('res', jsonData);
                    setIsUserVehicleDetails(jsonData);
                    navigation.navigate('AddRepairOrderStep3', {'userVehicleDetails': jsonData})
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const addVehicle = async (data) => {
        try {
            await fetch(`${API_URL}add_new_vehicle_user`, {
                method: 'POST',
                headers: {
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
                // console.log('res', res);
                if (res.statusCode == 201 || res.statusCode == 200 || res.message == true) {
                    const jsonData = { 
                        'user_id': res.data.user_id, 
                        'vehicle_id': res.data.vehicle_id,
                        'name': res.data.user_data.name,
                        'email': res.data.user_data.email,
                        'phone_number': res.data.user_data.phone_number,
                        'brand_id': res.data.vehicle_data.brand_id,
                        'model_id': res.data.vehicle_data.model_id,
                        'vehicle_registration_number': res.data.vehicle_data.vehicle_registration_number,
                        'brand_name': brandList.find(data => data.id == isBrand).name,
                        'model_name': modelList.find(data => data.id == isModel).model_name,
                        'garage_id' : res.data.garage_id,
                    }
                    // console.log('jsonData', jsonData);
                    setIsUserVehicleDetails(jsonData);
                    navigation.navigate('AddRepairOrderStep3', {'userVehicleDetails': jsonData})
                } else if (res.statusCode == 400) {
                    { res.data.message.vehicle_registration_number && setVehicleRegistrationNumberError(res.data.message.vehicle_registration_number); }
                    return;
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
         
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
                setStateList(json.states);
            }
        } catch (e) {
            console.log(e);
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
                setBrandList(json.brand_list);
            }
        } catch (e) {
            console.log(e);
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
                setInsuranceProviderList(json.insurance_provider_list);
            }
        } catch (e) {
            console.log(e);
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
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
            setIsGarageId(selectedGarageId);
        }
    };

    const getUserList = async () => {
        // console.log('User List called');
        setIsLoadingUserList(true);
        try {
            const res = await fetch(`${API_URL}fetch_my_garage_customers?garage_id=${isGarageId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setUserList(json.user_list);
                setIsUserName(''); 
                setIsUser(0); 
                setFilteredUserData(json.user_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingUserList(false)
        }
    };

    const searchFilterForUsers = (text) => {
        if (text) {
            let newData = userList.filter(
                function (listData) {
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredUserData(newData);
            setSearchQueryForUsers(text);
        } else {
            setFilteredUserData(userList);
            setSearchQueryForUsers(text);
        }
    };

    useEffect(() => {
        getStatesList();
        getBrandList();
        getGarageList();
        getUserList();
        getInsuranceProviderList();
    }, []);

    useEffect(() => {
        if(isState != undefined) getCityList();
    }, [isState]);
   
    useEffect(() => {
        if(isBrand != undefined) {
            getModelList();
        }
    }, [isBrand]);

    useEffect(() => {
        getUserList();
    }, [isGarageId]);
    
    // useEffect(() => {
    //     if(isUserVehicleDetails != '') navigation.navigate('AddRepairOrderStep3', {'userVehicleDetails': isUserVehicleDetails})
    // }, [isUserVehicleDetails]);

    return (
        <View style={styles.pageContainer}>
                { (isLoading == true) ? <ActivityIndicator></ActivityIndicator> :
                    <InputScrollView
                        ref={scroll1Ref}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={8}
                        behavior="padding"
                    >
                        <View style={{flex:1}}>

                            {(userRole == "Super Admin" || garageId?.length > 1)  &&
                                <View>
                                    <View style={styles.dropDownContainer}>
                                        <Picker
                                            selectedValue={isGarageId}
                                            onValueChange={(option) => setIsGarageId(option)}
                                            style={styles.dropDownField}
                                            itemStyle={{padding: 0}}
                                        >
                                            <Picker.Item label="Customer Belongs To Garage" value="0" />
                                            {garageList.map((garageList, i) => {
                                                return (
                                                    <Picker.Item
                                                        key={i}
                                                        label={garageList.garage_name}
                                                        value={garageList.id}
                                                    />
                                                );
                                            })}
                                        </Picker>
                                    </View>
                                    {garageIdError?.length > 0 &&
                                        <Text style={styles.errorTextStyle}>{garageIdError}</Text>
                                    }
                                </View>
                            }
                         
                            <Divider style={{marginTop: 20}} />

                            <View style={{marginTop: 15}}>
                                <RadioForm
                                    radio_props={radio_props}
                                    initial={0}
                                    onPress={(value) => setUserOption(value)}
                                    animation={true}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    buttonWrapStyle={{marginLeft: 10}}
                                    labelStyle={{marginRight: 40}}
                                />
                            </View>
                            { userOption == "existing_user" ? 
                                <>
                                    <View>
                                        <TouchableOpacity 
                                            style={styles.userDropDownField} 
                                            onPress={() => {
                                                setUserListModal(true);
                                                searchFilterForUsers('');
                                            }}
                                        >
                                        </TouchableOpacity>
                                        <TextInput
                                            mode="outlined"
                                            label='User'
                                            style={{marginTop: 10, backgroundColor: '#f1f1f1', width:'100%' }}
                                            placeholder="Select User"
                                            value={isUserName}
                                            right={<TextInput.Icon name="menu-down" />}
                                        />
                                    </View>
                                    {userError?.length > 0 &&
                                        <Text style={styles.errorTextStyle}>{userError}</Text>
                                    } 
                                    {/* <View style={styles.dropDownContainer}>
                                        <Picker
                                            selectedValue={isUser}
                                            onValueChange={(option) => { setIsUser(option); }}
                                            style={styles.dropDownField}
                                            itemStyle={{padding: 0}}
                                        >
                                            <Picker.Item label="Select User" value="0" />
                                            {userList.map((userList, i) => {
                                                return (
                                                    <Picker.Item
                                                        key={i}
                                                        label={userList.name}
                                                        value={userList.id}
                                                    />
                                                );
                                            })}
                                        </Picker>
                                    </View>
                                    {userError?.length > 0 &&
                                        <Text style={styles.errorTextStyle}>{userError}</Text>
                                    } */}
                                </>
                            :
                                <>
                                    <Text style={[styles.headingStyle, { marginTop:20 }]}>Customer Details:</Text>
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
                                            onValueChange={(v) => {setIsState(v)}}
                                            style={styles.dropDownField}
                                            itemStyle={{padding: 0}}
                                        >
                                            <Picker.Item label="Select State" value="0" />
                                            {StateList.map((StateList, i) => {
                                                return (
                                                    <Picker.Item
                                                        key={i}
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
                                            itemStyle={{padding: 0}}
                                            enabled={cityFieldToggle}
                                        >
                                            <Picker.Item label="Select City" value="0" />
                                            {CityList.map((CityList, i) => {
                                                return (
                                                    <Picker.Item
                                                        key={i}
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

                                    
                                </>
                            }

                            <Divider style={{marginTop: 20}} />

                            <Text style={[styles.headingStyle, { marginTop:20 }]}>Vehicle Details:</Text>
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

                                <TouchableOpacity style={{flex:1}} onPress={() => setDisplayPurchaseCalender(true)} activeOpacity={1}>
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
                                        /> }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flex:1}} onPress={() => setDisplayManufacturingCalender(true)} activeOpacity={1}>
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
                                        /> }
                                    </View>
                                </TouchableOpacity>
                               
                                <TextInput
                                    mode="outlined"
                                    label='Engine Number'
                                    style={styles.input}
                                    placeholder="Engine Number"
                                    value={isEngineNumber}
                                    onChangeText={(text) => setIsEngineNumber(text)}
                                />
                              
                                <TextInput
                                    mode="outlined"
                                    label='Chasis Number'
                                    style={styles.input}
                                    placeholder="Chasis Number"
                                    value={isChasisNumber}
                                    onChangeText={(text) => setIsChasisNumber(text)}
                                />
                               
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
                                
                                <TextInput
                                    mode="outlined"
                                    label='Insurer GSTIN'
                                    style={styles.input}
                                    placeholder="Insurer GSTIN"
                                    value={isInsurerGstin}
                                    onChangeText={(text) => setIsInsurerGstin(text)}
                                />
                              
                                <TextInput
                                    mode="outlined"
                                    label='Insurer Address'
                                    style={styles.input}
                                    placeholder="Insurer Address"
                                    value={isInsurerAddress}
                                    onChangeText={(text) => setIsInsurerAddress(text)}
                                />
                              
                                <TextInput
                                    mode="outlined"
                                    label='Policy Number'
                                    style={styles.input}
                                    placeholder="Policy Number"
                                    value={isPolicyNumber}
                                    onChangeText={(text) => setIsPolicyNumber(text)}
                                />
                             
                                <TouchableOpacity style={{flex:1}} onPress={() => setDisplayInsuranceExpiryCalender(true)} activeOpacity={1}>
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
                                        /> }
                                    </View>
                                </TouchableOpacity>
                                
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
                        mode="outlined"
                        label='Brand Name'
                        style={styles.input}
                        placeholder="Brand Name"
                        value={newBrandName}
                        onChangeText={(text) => setNewBrandName(text)}
                    />
           
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
                        mode="outlined"
                        label='Model Name'
                        style={styles.input}
                        placeholder="Model Name"
                        value={newModelName}
                        onChangeText={(text) => setNewModelName(text)}
                    />
              
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
                        mode="outlined"
                        label='Insurance Company Name'
                        style={styles.input}
                        placeholder="Insurance Company Name"
                        value={newInsuranceCompanyName}
                        onChangeText={(text) => setNewInsuranceCompanyName(text)}
                    />
                 
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
            <Portal>
                {/* Users List Modal */}
                <Modal visible={userListModal} onDismiss={() => { setUserListModal(false); setIsUser(0); setIsUserName(''); setUserError(''); setSearchQueryForUsers('');  searchFilterForUsers();}} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select User</Text>
                    {(isLoadingUserList == true) ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator>
                        :
                        <>
                            <View style={{marginTop: 20, marginBottom: 10}}>
                                <Searchbar
                                    placeholder="Search here..."
                                    onChangeText={(text) => { if(text != null) searchFilterForUsers(text)}}
                                    value={searchQueryForUsers}
                                    elevation={0}
                                    style={{ elevation: 0.8, marginBottom: 10}}
                                />
                                {filteredUserData?.length > 0 ?  
                                    <FlatList
                                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                        data={filteredUserData}
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
                                                            setIsUserName(item.name); 
                                                            setIsUser(item.id); 
                                                            setUserError('');
                                                            setUserListModal(false);  
                                                            searchFilterForUsers('');
                                                        }
                                                    }
                                                />
                                            </>
                                        )} 
                                    />
                                    :
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                        <Text style={{ color: colors.black, textAlign: 'center'}}>No such user is associated!</Text>
                                    </View>
                                }
                            </View>
                        </>
                    }
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
        height: 55,
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
        borderWidth:1,
        borderColor: colors.light_gray, 
        borderRadius: 5, 
        marginTop: 20,
    },
    dropDownField: {
        padding: 0,
        backgroundColor: '#F0F2F5',
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
    userDropDownField: {
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
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(AddRepairOrderStep2);
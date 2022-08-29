import React, { useEffect, useRef, useState } from 'react';
import { View , Text, StyleSheet, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Modal, TextInput, Portal } from 'react-native-paper';
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

const AddVehicle = ({ navigation, userToken, route, userRole }) => {
    
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
    const [registrationCertificateImgError, setRegistrationCertificateImgError] = useState('');
    const [insuranceImgError, setInsuranceImgError] = useState('');

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

        const data = new FormData();
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
        data.append('user_id', parseInt(route?.params?.userId));

        addVehicle(data);
    }

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
            let currentDate = selectedDate || isPurchaseDate;
            let formattedDate = moment(currentDate, 'YYYY-MM-DD', true).format('DD-MM-YYYY');
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsPurchaseDate(new Date(formateDateForDatabase));
        }
     };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || isManufacturingDate;
            let formattedDate = moment(currentDate, 'YYYY-MM-DD', true).format('DD-MM-YYYY');
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsManufacturingDate(new Date(formateDateForDatabase));
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || isInsuranceExpiryDate;
            let formattedDate = moment(currentDate, 'YYYY-MM-DD', true).format('DD-MM-YYYY');
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            console.log('setDateInsuranceExpiry', setDateInsuranceExpiry);
            let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsInsuranceExpiryDate(new Date(formateDateForDatabase));  
            console.log('setIsInsuranceExpiryDate', currentDate);
        }   
    };

    const addVehicle = async (data) => {
        try {
            await fetch(`${API_URL}add_new_vehicle`, {
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
                if (res.statusCode == 201 || res.statusCode == 200 || res.message == true) {
                    navigation.navigate('CustomerDetails' , { userId : route.params.userId });
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

    useEffect(() => {
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
                    behavior="padding"
                >
                    <View style={{flex:1}}>
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
                                    {userRole == "Super Admin" || userRole == "Admin" ?
                                        <Picker.Item label="Add New Brand" value="new_brand" />
                                    : null }
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
                                    {userRole == "Super Admin" || userRole == "Admin" ?
                                        <Picker.Item label="Add New Model" value="new_model" />
                                    : null }
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
                                    {userRole == "Super Admin" || userRole == "Admin" ?
                                        <Picker.Item label="Add New Insurance Company" value="new_insurance_company" />
                                    : null }
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
                            Add
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

            {/* Add New Vehicle Modal */}
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

            {/* Add New Insurance Company Modal */}
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
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.user.user_role,
})

export default connect(mapStateToProps)(AddVehicle);
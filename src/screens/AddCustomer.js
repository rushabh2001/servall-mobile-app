import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    FlatList,
    Alert,
    Platform,
} from "react-native";
import {
    Searchbar,
    Divider,
    List,
    Modal,
    Portal,
    TextInput,
    Button,
} from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import InputScrollView from "react-native-input-scroll-view";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";
import BrandComponent from "../Component/BrandComponent";
import VehicalModalComponet from "../Component/VehicalModalComponet";

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneReg = /^[0-9]{10}$/;

const AddCustomer = ({
    navigation,
    userRole,
    userToken,
    selectedGarageId,
    userId,
    garageId,
    selectedGarage,
    user,
}) => {
    // Customer Fields
    const [isName, setIsName] = useState();
    const [isEmail, setIsEmail] = useState();
    const [isPhoneNumber, setIsPhoneNumber] = useState();
    // const [isCity, setIsCity] = useState();
    // const [isState, setIsState] = useState();
    const [isAddress, setIsAddress] = useState("");

    // Error States
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    // const [cityError, setCityError] = useState('');
    // const [stateError, setStateError] = useState('');

    // const [CityList, setCityList] =  useState([]);
    // const [StateList, setStateList] =  useState([]);

    // Vehicle Fields
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] =
        useState();
    const [isPurchaseDate, setIsPurchaseDate] = useState();
    const [isManufacturingDate, setIsManufacturingDate] = useState();
    const [isEngineNumber, setIsEngineNumber] = useState("");
    const [isChasisNumber, setIsChasisNumber] = useState("");
    const [isInsurerGstin, setIsInsurerGstin] = useState("");
    const [isInsurerAddress, setIsInsurerAddress] = useState("");
    const [isPolicyNumber, setIsPolicyNumber] = useState("");
    const [isInsuranceExpiryDate, setIsInsuranceExpiryDate] = useState();
    const [isRegistrationCertificateImg, setIsRegistrationCertificateImg] =
        useState(null);
    const [isInsuranceImg, setIsInsuranceImg] = useState(null);

    // Error States
    const [vehicleRegistrationNumberError, setVehicleRegistrationNumberError] =
        useState("");
    const [
        registrationCertificateImgError,
        setRegistrationCertificateImgError,
    ] = useState("");
    const [insuranceImgError, setInsuranceImgError] = useState("");

    const [cityFieldToggle, setCityFieldToggle] = useState(false);
    const [modelFieldToggle, setModelFieldToggle] = useState(false);

    const [isGarageId, setIsGarageId] = useState(selectedGarageId);
    const [isGarageName, setIsGarageName] = useState(
        !selectedGarage ? "" : selectedGarage.garage_name
    );
    const [garageList, setGarageList] = useState([]);
    const [garageListModal, setGarageListModal] = useState(false);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState();
    const [garageError, setGarageError] = useState(""); // Error State
    const [garageIdError, setGarageIdError] = useState();

    const [datePurchase, setDatePurchase] = useState();
    const [displayPurchaseCalender, setDisplayPurchaseCalender] =
        useState(false);

    const [dateManufacturing, setDateManufacturing] = useState();
    const [displayManufacturingCalender, setDisplayManufacturingCalender] =
        useState(false);

    const [dateInsuranceExpiry, setDateInsuranceExpiry] = useState();
    const [displayInsuranceExpiryCalender, setDisplayInsuranceExpiryCalender] =
        useState(false);

    const [addBrandModal, setAddBrandModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState();
    const [newBrandNameError, setNewBrandNameError] = useState();
    const [addModelModal, setAddModelModal] = useState(false);
    const [newModelName, setNewModelName] = useState();
    const [newModelNameError, setNewModelNameError] = useState();

    // Brand States
    const [isBrand, setIsBrand] = useState();
    const [isBrandName, setIsBrandName] = useState();
    const [brandList, setBrandList] = useState([]);
    const [brandListModal, setBrandListModal] = useState(false);
    const [filteredBrandData, setFilteredBrandData] = useState([]);
    const [searchQueryForBrands, setSearchQueryForBrands] = useState();
    const [brandError, setBrandError] = useState(""); // Error State

    // Vehicle Model States
    const [isModel, setIsModel] = useState();
    const [isModelName, setIsModelName] = useState();
    const [modelList, setModelList] = useState([]);
    const [modelListModal, setModelListModal] = useState(false);
    const [filteredModelData, setFilteredModelData] = useState([]);
    const [searchQueryForModels, setSearchQueryForModels] = useState();
    const [modelError, setModelError] = useState(""); // Error State

    // Insurance Provider Company for Dropdown
    const [isInsuranceProvider, setIsInsuranceProvider] = useState("");
    const [isInsuranceProviderName, setIsInsuranceProviderName] = useState("");
    const [insuranceProviderList, setInsuranceProviderList] = useState([]);
    const [insuranceProviderListModal, setInsuranceProviderListModal] =
        useState(false);
    const [filteredInsuranceProviderData, setFilteredInsuranceProviderData] =
        useState([]);
    const [
        searchQueryForInsuranceProviders,
        setSearchQueryForInsuranceProviders,
    ] = useState();
    const [insuranceProviderError, setInsuranceProviderError] = useState();

    const [isNewInsuranceProvider, setIsNewInsuranceProvider] = useState("");
    const [newInsuranceProviderError, setNewInsuranceProviderError] =
        useState();
    const [addNewInsuranceProviderModal, setAddNewInsuranceProviderModal] =
        useState(false);

    // States for Dropdown
    const [isState, setIsState] = useState();
    const [isStateName, setIsStateName] = useState("");
    const [stateList, setStateList] = useState([]);
    const [stateListModal, setStateListModal] = useState(false);
    const [filteredStateData, setFilteredStateData] = useState([]);
    const [searchQueryForStates, setSearchQueryForStates] = useState();
    const [stateError, setStateError] = useState();

    // Cities state for Dropdown
    const [isCity, setIsCity] = useState();
    const [isCityName, setIsCityName] = useState("");
    const [cityList, setCityList] = useState([]);
    const [cityListModal, setCityListModal] = useState(false);
    const [filteredCityData, setFilteredCityData] = useState([]);
    const [searchQueryForCity, setSearchQueryForCity] = useState();
    const [cityError, setCityError] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const isNameRef = useRef();
    const isEmailRef = useRef();
    const isPhoneRef = useRef();
    const isVehicalNumRef = useRef();
    const isAddressRef = useRef();
    const scrollViewRef = useRef();

    const addNewBrand = async () => {
        let data = { name: newBrandName };
        try {
            const res = await fetch(`${API_URL}create_brand`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            console.log('json', json);
            if (res.status == 200 || res.status == 201){
                getBrandList();
                setAddBrandModal(false);
                setIsBrandName(json.data.name);
                setIsBrand(json.data.id);
                // console.log('res', res);
            } else if(res.status == 400) {
                setNewBrandNameError(json.message.name);
            }
        } catch (e) {
            console.log(e);
        } 
    };

    const addNewModel = async () => {
        let data = { model_name: newModelName, brand_id: parseInt(isBrand) };
        try {
            const res = await fetch(`${API_URL}create_vehicle_model`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (res.status == 200 || res.status == 201){
                getModelList();
                setAddModelModal(false);
                setIsModelName(json.data.model_name);
                setIsModel(json.data.id);
            } else if(res.status == 400) {
                setNewModelNameError(json.message.model_name);
            }
        } catch (e) {
            console.log(e);
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
                setRegistrationCertificateImgError("Canceled");
            } else {
                // For Unknown Error
                setRegistrationCertificateImgError(
                    "Unknown Error: " + JSON.stringify(err)
                );
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
                setInsuranceImgError("Canceled");
            } else {
                setInsuranceImgError("Unknown Error: " + JSON.stringify(err));
                throw err;
            }
        }
    };

    const changePurchaseSelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || datePurchase;
            let formattedDate = moment(currentDate, "YYYY-MM-DD", true).format(
                "DD-MM-YYYY"
            );
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            let formateDateForDatabase = moment(
                currentDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD");
            setIsPurchaseDate(new Date(formateDateForDatabase));
        } else if(event.type == 'dismissed') {
            setDisplayPurchaseCalender(false);
        }
    };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || dateManufacturing;
            let formattedDate = moment(currentDate, "YYYY-MM-DD", true).format(
                "DD-MM-YYYY"
            );
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            let formateDateForDatabase = moment(
                currentDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD");
            setIsManufacturingDate(new Date(formateDateForDatabase));
        } else if(event.type == 'dismissed') {
            setDisplayManufacturingCalender(false);
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || dateInsuranceExpiry;
            let formattedDate = moment(currentDate, "YYYY-MM-DD", true).format(
                "DD-MM-YYYY"
            );
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            let formateDateForDatabase = moment(
                currentDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD");
            setIsInsuranceExpiryDate(new Date(formateDateForDatabase));
        } else if(event.type == 'dismissed') {
            setDisplayInsuranceExpiryCalender(false);
        }
    };

    const validate = (show = false) => {
        if (!show) {
            return !(
                !isName ||
                isName?.trim().length === 0 ||
                !isPhoneNumber ||
                isPhoneNumber?.trim().length === 0 ||
                !isEmail ||
                isEmail?.trim().length === 0 ||
                isEmail?.trim().length < 6 ||
                isEmail?.indexOf("@") < 0 ||
                isEmail?.indexOf(" ") >= 0 ||
                !isCity ||
                isCity === 0 ||
                !isState ||
                isState === 0 ||
                !isBrand ||
                isBrand === 0 ||
                !isModel ||
                isModel === 0 ||
                !isGarageId ||
                isGarageId === 0 ||
                !isVehicleRegistrationNumber ||
                isVehicleRegistrationNumber?.trim().length === 0
            );
        } else {
            if (!isName ||
                isName?.trim().length === 0) {
                isNameRef.current.focus();
                return false;
            }
            if (isEmail?.trim().length === 0 || isEmail?.trim().length < 6 || isEmail?.indexOf("@") < 0 || isEmail?.indexOf(" ") >= 0) {
                isEmailRef.current.focus();
                return false;
            }
            if (!isPhoneNumber ||
                isPhoneNumber?.trim().length === 0) {
                isPhoneRef.current.focus();
                return false;
            }
            if (!isState ||
                isState === 0) {
                isPhoneRef.current.focus();
                return false;
            }
            if (!isCity ||
                isCity === 0) {
                isPhoneRef.current.focus();
                return false;
            }
            if (!isGarageId ||
                isGarageId === 0) {
                isAddressRef.current.focus();
                return false;
            }
            if (!isBrand ||
                isBrand === 0) {
                isAddressRef.current.focus();
                return false;
            }
            if (!isModel ||
                isModel === 0) {
                isAddressRef.current.focus();
                return false;
            }
            if (!isVehicleRegistrationNumber ||
                isVehicleRegistrationNumber?.trim().length === 0) {
                isVehicalNumRef.current.focus();
                return false;
            }
        }
    };

    const submit = () => {
        Keyboard.dismiss();

        if (!validate(true)) {
            if (!isName) setIsName("");
            if (!isEmail) setIsEmail("");
            if (!isPhoneNumber) setIsPhoneNumber("");
            if (!isVehicleRegistrationNumber)
                setIsVehicleRegistrationNumber("");
            // if (!isName) setNameError("Customer Name is required");
            // else setNameError("");
            // if (!isPhoneNumber) setPhoneNumberError("Phone Number is required");
            // else setPhoneNumberError("");
            // if (!isEmail) setEmailError("Email is required");
            // else if (isEmail.length < 6)
            //     setEmailError("Email should be minimum 6 characters");
            // else if (isEmail?.indexOf(" ") >= 0)
            //     setEmailError("Email cannot contain spaces");
            // else if (isEmail?.indexOf("@") < 0)
            //     setEmailError("Invalid Email Format");
            // else setEmailError("");
            if (!isBrand || isBrand === 0) setBrandError("Brand is required");
            else setBrandError("");
            if (!isModel || isModel === 0) setModelError("Model is required");
            else setModelError("");
            if (!isCity || isCity === 0) setCityError("City is required");
            else setCityError("");
            if (!isState || isState === 0) setStateError("State is required");
            else setStateError("");
            if (!isGarageId || isGarageId == 0)
                setGarageIdError(
                    "Customer Belongs to Garage Field is required"
                );
            else setGarageIdError("");
            // if (
            //     !isVehicleRegistrationNumber ||
            //     isVehicleRegistrationNumber?.trim().length === 0
            // )
            //     setVehicleRegistrationNumberError(
            //         "Vehicle Registration Number is required"
            //     );
            // else setVehicleRegistrationNumberError("");
            return;
        }

        const data = new FormData();
        data.append("name", isName?.trim());
        data.append("email", isEmail?.trim());
        data.append("phone_number", isPhoneNumber?.trim());
        data.append("city", isCity);
        data.append("state", isState);
        if (isAddress) data.append("address", isAddress?.trim());
        data.append("brand_id", JSON.stringify(isBrand));
        data.append("model_id", JSON.stringify(isModel));
        data.append(
            "vehicle_registration_number",
            isVehicleRegistrationNumber?.toUpperCase()?.trim()
        );
        if (isPurchaseDate)
            data.append(
                "purchase_date",
                moment(isPurchaseDate, 'YYYY-MM-DD"T"hh:mm ZZ').format(
                    "YYYY-MM-DD"
                )
            );
        if (isManufacturingDate)
            data.append(
                "manufacturing_date",
                moment(isManufacturingDate, 'YYYY-MM-DD"T"hh:mm ZZ').format(
                    "YYYY-MM-DD"
                )
            );
        if (isEngineNumber)
            data.append("engine_number", isEngineNumber?.trim());
        if (isChasisNumber)
            data.append("chasis_number", isChasisNumber?.trim());
        if (isInsuranceProvider)
            data.append("insurance_id", parseInt(isInsuranceProvider));
        if (isInsurerGstin)
            data.append("insurer_gstin", isInsurerGstin?.trim());
        if (isInsurerAddress)
            data.append("insurer_address", isInsurerAddress?.trim());
        if (isPolicyNumber)
            data.append("policy_number", isPolicyNumber?.trim());
        if (isInsuranceExpiryDate)
            data.append(
                "insurance_expiry_date",
                moment(isInsuranceExpiryDate, 'YYYY-MM-DD"T"hh:mm ZZ').format(
                    "YYYY-MM-DD"
                )
            );
        if (isRegistrationCertificateImg != null)
            data.append(
                "registration_certificate_img",
                isRegistrationCertificateImg
            );
        if (isInsuranceImg != null) data.append("insurance_img", isInsuranceImg);
        data.append("vehicle_option", "new_vehicle");
        data.append("garage_id", isGarageId);

        addCustomer(data);
    };

    const addCustomer = async (data) => {
        setIsLoading(true);
        try {
            await fetch(`${API_URL}add_new_customer`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data; ",
                    Authorization: "Bearer " + userToken,
                },
                body: data,
            })
                .then((res) => {
                    const statusCode = res.status;
                    let data;
                    return res.json().then((obj) => {
                        data = obj;
                        return { statusCode, data };
                    });
                })
                .then((res) => {
                    setIsLoading(false);
                    if (res.statusCode == 201 || res.statusCode == 200) {
                        navigation.navigate("MyCustomers");
                    } else if (res.statusCode == 400) {
                        let errors_message = [];
                        Object.entries(res.data.message).map(([key, error], i) => {
                            error.map((item, index) => {
                                errors_message.push(item);
                            })
                        });
                        Alert.alert(
                            "Alert.",
                            errors_message[0],
                            [
                                { text: "OK", }
                            ]
                        );
                        return;
                    } else {
                        Alert.alert(
                            "Alert.",
                            'Something went wrong! Please try again later.',
                            [
                                { text: "OK", }
                            ]
                        );
                    }
                });
        } catch (e) {
            console.log(e);
        }
    };

    // State Functions Dropdown
    const searchFilterForStates = (text) => {
        if (text) {
            let newData = stateList.filter(function (listData) {
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase()
                let itemData = listData.name
                    ? listData.name.toUpperCase()
                    : "".toUpperCase();
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredStateData(newData);
            setSearchQueryForStates(text);
        } else {
            setFilteredStateData(stateList);
            setSearchQueryForStates(text);
        }
    };

    const getStateList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}fetch_states`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setStateList(json.states);
                setFilteredStateData(json.states);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    // City Functionalities
    const searchFilterForCity = (text) => {
        if (text) {
            let newData = cityList.filter(function (listData) {
                let itemData = listData.name
                    ? listData.name.toUpperCase()
                    : "".toUpperCase();
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredCityData(newData);
            setSearchQueryForCity(text);
        } else {
            setFilteredCityData(cityList);
            setSearchQueryForCity(text);
        }
    };

    const getCityList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_cities?state_id=${isState}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setCityList(json.cities);
                setFilteredCityData(json.cities);
                setIsLoading(false);
                setCityFieldToggle(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getBrandList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}fetch_brand`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setBrandList(json.brand_list);
                setFilteredBrandData(json.brand_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForBrands = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_brand`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await response.json();
            if (response.status == "200") {
                setBrandList(json.brand_list);
                setFilteredBrandData(json.brand_list);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getModelList = async () => {
        try {
            const res = await fetch(
                `${API_URL}fetch_vehicle_model?brand_id=${isBrand}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                }
            );
            const json = await res.json();
            console.log("model_json", json);
            if (json !== undefined) {
                setModelList(json.vehicle_model_list);
                setFilteredModelData(json.vehicle_model_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForModels = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_vehicle_model?brand_id=${isBrand}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await response.json();
            if (response.status == "200") {
                setModelList(json.vehicle_model_list);
                setFilteredModelData(json.vehicle_model_list);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Functions Dropdown for Insurance Provider
    const addNewInsuranceProvider = async () => {
        let data = { name: isNewInsuranceProvider };
        try {
            const res = await fetch(`${API_URL}add_insurance_provider`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            console.log("res", res);
            if (res.status == 200 || res.status == 201){
                console.log("setInsuranceProviderList", json.data);
                getInsuranceProviderList();
                setIsInsuranceProvider(parseInt(json.data.id));
                setIsInsuranceProviderName(json.data.name);
                setAddNewInsuranceProviderModal(false);
            } else if(res.status == 400) {
                setNewInsuranceProviderError(json.message.name);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForInsuranceProviders = (text) => {
        if (text) {
            let newData = insuranceProviderList.filter(function (listData) {
                let itemData = listData.name
                    ? listData.name.toUpperCase()
                    : "".toUpperCase();
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredInsuranceProviderData(newData);
            setSearchQueryForInsuranceProviders(text);
        } else {
            setFilteredInsuranceProviderData(insuranceProviderList);
            setSearchQueryForInsuranceProviders(text);
        }
    };

    const getInsuranceProviderList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}fetch_insurance_provider`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setInsuranceProviderList(json.insurance_provider_list);
                setFilteredInsuranceProviderData(json.insurance_provider_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    // Function for Garages
    const searchFilterForGarages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await response.json();
            if (response.status == "200") {
                setGarageList(json.garage_list.data);
                setFilteredGarageData(json.garage_list.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getGarageList = async () => {
        try {
            const res = await fetch(
                `${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                }
            );
            const json = await res.json();
            // console.log(json);
            if (json !== undefined) {
                setGarageList(json.garage_list);
                setFilteredGarageData(json.garage_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getStateList();
        getBrandList();
        getGarageList();
        getInsuranceProviderList();
    }, []);

    useEffect(() => {
        if (isState != undefined) {
            getCityList();
            setIsCity();
            setIsCityName("");
        }
    }, [isState]);

    useEffect(() => {
        if (isBrand != undefined) {
            getModelList();
            setIsModel();
            setIsModelName("");
            setModelFieldToggle(true);
        }
    }, [isBrand]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.pageContainer}>
                <InputScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                    }}
                    keyboardOffset={200}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardShouldPersistTaps={"always"}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[styles.headingStyle, { marginTop: 20 }]}
                        >
                            Customer Details:
                        </Text>
                        <TextInput
                            mode="outlined"
                            label="Customer Name"
                            ref={isNameRef}
                            style={styles.input}
                            placeholder="Customer Name"
                            value={isName}
                            onChangeText={(text) => setIsName(text)}
                        />
                        {isName?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Customer Name is required
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="Email Address"
                            ref={isEmailRef}
                            style={styles.input}
                            placeholder="Email Address"
                            value={isEmail}
                            onChangeText={(text) => setIsEmail(text)}
                        />
                        {isEmail?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Email is required.
                            </Text>
                        ) : isEmail && !reg.test(isEmail?.trim()) ? (
                            <Text style={styles.errorTextStyle}>
                                Invalid Email.
                            </Text>
                        ) : isEmail?.length > 200 ? (
                            <Text style={styles.errorTextStyle}>
                                Email must be a maximum 200 characters.
                            </Text>
                        ) : null}

                        <TextInput
                            mode="outlined"
                            label="Phone Number"
                            ref={isPhoneRef}
                            style={styles.input}
                            placeholder="Phone Number"
                            maxLength={10}
                            value={isPhoneNumber}
                            onChangeText={(text) => setIsPhoneNumber(text)}
                            keyboardType={"phone-pad"}
                        />
                        {isPhoneNumber?.trim()?.length === 0 ? (
                            <Text style={styles.errorTextStyle}>
                                Phone Number is required.
                            </Text>
                        ) : isPhoneNumber &&
                            !phoneReg.test(isPhoneNumber?.trim()) ? (
                            <Text style={styles.errorTextStyle}>
                                Phone Number must be 10 digits.
                            </Text>
                        ) : null}

                        <View style={{marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => {
                                    setStateListModal(true);
                                }}
                            >
                                <TextInput
                                    mode="outlined"
                                    label="State"
                                    style={{
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select State"
                                    editable={false}
                                    value={isStateName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </TouchableOpacity>
                            {stateError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {stateError}
                                </Text>
                            )}
                        </View>

                        {cityFieldToggle == true && (
                            <View style={{marginTop: 20}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setCityListModal(true);
                                    }}
                                >
                                    <TextInput
                                        mode="outlined"
                                        label="City"
                                        style={{
                                            backgroundColor: "#f1f1f1",
                                            width: "100%",
                                        }}
                                        placeholder="Select City"
                                        editable={false}
                                        value={isCityName}
                                        right={<TextInput.Icon name="menu-down" />}
                                    />
                                </TouchableOpacity>
                                {cityError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {cityError}
                                    </Text>
                                )}
                            </View>
                        )}

                        <TextInput
                            mode="outlined"
                            label="Address"
                            ref={isAddressRef}
                            style={styles.input}
                            placeholder="Address"
                            value={isAddress}
                            onChangeText={(text) => setIsAddress(text)}
                        />

                        {(userRole == "Super Admin" ||
                        garageId?.length > 1) && (
                            <View style={{marginTop: 20}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setGarageListModal(true);
                                    }}
                                >
                                    <TextInput
                                        mode="outlined"
                                        label="Garage"
                                        style={{
                                            backgroundColor: "#f1f1f1",
                                            width: "100%",
                                        }}
                                        placeholder="Select Garage"
                                        editable={false}
                                        value={isGarageName}
                                        right={
                                            <TextInput.Icon name="menu-down" />
                                        }
                                    />
                                </TouchableOpacity>
                                {garageIdError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {garageIdError}
                                    </Text>
                                )}
                            </View>
                        )}

                        <Text
                            style={[styles.headingStyle, { marginTop: 20 }]}
                        >
                            Vehicle Details:
                        </Text>

                        <View style={{marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => {
                                    setBrandListModal(true);
                                }}
                            >
                                <TextInput
                                    mode="outlined"
                                    label="Brand"
                                    style={{
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select Brand"
                                    editable={false}
                                    value={isBrandName}
                                    right={
                                        <TextInput.Icon name="menu-down" />
                                    }
                                />
                            </TouchableOpacity>
                            {brandError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {brandError}
                                </Text>
                            )}
                        </View>

                        {modelFieldToggle == true && (
                            <View style={{marginTop: 20}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModelListModal(true);
                                    }}
                                >
                                    <TextInput
                                        mode="outlined"
                                        label="Vehicle Model"
                                        style={{
                                            backgroundColor: "#f1f1f1",
                                            width: "100%",
                                        }}
                                        placeholder="Select Vehicle Model"
                                        editable={false}
                                        value={isModelName}
                                        right={
                                            <TextInput.Icon name="menu-down" />
                                        }
                                    />
                                </TouchableOpacity>
                                {modelError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {modelError}
                                    </Text>
                                )}
                            </View>
                        )}

                        <TextInput
                            mode="outlined"
                            label="Vehicle Registration Number"
                            ref={isVehicalNumRef}
                            style={styles.input}
                            placeholder="Vehicle Registration Number"
                            value={isVehicleRegistrationNumber}
                            onChangeText={(text) =>
                                setIsVehicleRegistrationNumber(text)
                            }
                        />
                        {isVehicleRegistrationNumber?.trim()?.length ===
                        0 ? (
                            <Text style={styles.errorTextStyle}>
                                Vehicle Registration Number is required.
                            </Text>
                        ) : null}

                        <TouchableOpacity
                            style={{ flex: 1, marginTop: 20 }}
                            onPress={() => setDisplayPurchaseCalender(true)}
                        >
                            <TextInput
                                mode="outlined"
                                label="Purchase Date"
                                placeholder="Purchase Date"
                                editable={false}
                                value={datePurchase}
                                right={
                                    <TextInput.Icon name="calendar-month" />
                                }
                            />
                            {displayPurchaseCalender == true && (
                                <DateTimePicker
                                    value={
                                        isPurchaseDate
                                            ? isPurchaseDate
                                            : new Date()
                                    }
                                    mode="date"
                                    maximumDate={new Date()}
                                    onChange={
                                        changePurchaseSelectedDate
                                    }
                                    display="spinner"
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1, marginTop: 20 }}
                            onPress={() =>
                                setDisplayManufacturingCalender(true)
                            }
                        >
                            <TextInput
                                mode="outlined"
                                label="Manufacturing Date"
                                placeholder="Manufacturing Date"
                                editable={false}
                                value={dateManufacturing}
                                right={
                                    <TextInput.Icon name="calendar-month" />
                                }
                            />
                            {displayManufacturingCalender == true && (
                                <DateTimePicker
                                    value={
                                        isManufacturingDate
                                            ? isManufacturingDate
                                            : new Date()
                                    }
                                    mode="date"
                                    maximumDate={new Date()}
                                    onChange={
                                        changeManufacturingSelectedDate
                                    }
                                    display="spinner"
                                />
                            )}
                        </TouchableOpacity>

                        <TextInput
                            mode="outlined"
                            label="Engine Number"
                            style={styles.input}
                            placeholder="Engine Number"
                            value={isEngineNumber}
                            onChangeText={(text) => setIsEngineNumber(text)}
                        />

                        <TextInput
                            mode="outlined"
                            label="Chasis Number"
                            style={styles.input}
                            placeholder="Chasis Number"
                            value={isChasisNumber}
                            onChangeText={(text) => setIsChasisNumber(text)}
                        />

                        <View style={{marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => {
                                    setInsuranceProviderListModal(true);
                                    setIsNewInsuranceProvider("");
                                    setNewInsuranceProviderError("");
                                }}
                            >
                                <TextInput
                                    mode="outlined"
                                    label="Insurance Provider"
                                    style={{
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select Insurance Provider"
                                    editable={false}
                                    value={isInsuranceProviderName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </TouchableOpacity>
                            {insuranceProviderError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {insuranceProviderError}
                                </Text>
                            )}
                        </View>

                        <TextInput
                            mode="outlined"
                            label="Insurer GSTIN"
                            style={styles.input}
                            placeholder="Insurer GSTIN"
                            value={isInsurerGstin}
                            onChangeText={(text) => setIsInsurerGstin(text)}
                        />

                        <TextInput
                            mode="outlined"
                            label="Insurer Address"
                            style={styles.input}
                            placeholder="Insurer Address"
                            value={isInsurerAddress}
                            onChangeText={(text) =>
                                setIsInsurerAddress(text)
                            }
                        />

                        <TextInput
                            mode="outlined"
                            label="Policy Number"
                            style={styles.input}
                            placeholder="Policy Number"
                            value={isPolicyNumber}
                            onChangeText={(text) => setIsPolicyNumber(text)}
                        />

                        <TouchableOpacity
                            style={{ flex: 1, marginTop: 20 }}
                            onPress={() =>
                                setDisplayInsuranceExpiryCalender(true)
                            }
                        >
                            <TextInput
                                mode="outlined"
                                label="Insurance Expiry Date"
                                placeholder="Insurance Expiry Date"
                                editable={false}
                                value={dateInsuranceExpiry}
                                right={
                                    <TextInput.Icon name="calendar-month" />
                                }
                            />
                            {displayInsuranceExpiryCalender == true && (
                                <DateTimePicker
                                    value={
                                        isInsuranceExpiryDate
                                            ? isInsuranceExpiryDate
                                            : new Date()
                                    }
                                    mode="date"
                                    minimumDate={new Date()}
                                    onChange={
                                        changeInsuranceExpirySelectedDate
                                    }
                                    display="spinner"
                                />
                            )}
                        </TouchableOpacity>

                        <View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.uploadButtonStyle}
                                onPress={selectRegistrationCrtImg}
                            >
                                <Icon
                                    name="upload"
                                    size={18}
                                    color={colors.primary}
                                    style={styles.downloadIcon}
                                />
                                <Text
                                    style={{
                                        marginRight: 10,
                                        fontSize: 18,
                                        color: "#000",
                                    }}
                                >
                                    Upload Registration Certificate
                                </Text>
                                {isRegistrationCertificateImg != null ? (
                                    <Text style={styles.textStyle}>
                                        File Name:{" "}
                                        {isRegistrationCertificateImg?.name
                                            ? isRegistrationCertificateImg.name
                                            : ""}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View>
                        {registrationCertificateImgError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {registrationCertificateImgError}
                            </Text>
                        )}

                        <View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.uploadButtonStyle}
                                onPress={selectInsurancePolicyImg}
                            >
                                <Icon
                                    name="upload"
                                    size={18}
                                    color={colors.primary}
                                    style={styles.downloadIcon}
                                />
                                <Text
                                    style={{
                                        marginRight: 10,
                                        fontSize: 18,
                                        color: "#000",
                                    }}
                                >
                                    Upload Insurance Policy
                                </Text>
                                {isInsuranceImg != null ? (
                                    <Text style={styles.textStyle}>
                                        File Name:{" "}
                                        {isInsuranceImg.name
                                            ? isInsuranceImg.name
                                            : ""}
                                    </Text>
                                ) : null}
                            </TouchableOpacity>
                        </View>
                        {insuranceImgError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {insuranceImgError}
                            </Text>
                        )}

                        <Button
                            style={{ marginTop: 15 }}
                            mode={"contained"}
                            onPress={submit}
                        >
                            Submit
                        </Button>
                    </View>
                </InputScrollView>
                <Portal>
                    <Modal
                        visible={addBrandModal}
                        onDismiss={() => {
                            setAddBrandModal(false);
                            setNewBrandName();
                            setNewBrandNameError();
                            setBrandListModal(true);
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Brand
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setAddBrandModal(false);
                                setNewBrandName();
                                setNewBrandNameError();
                                setBrandListModal(true);
                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Brand Name"
                            style={styles.input}
                            placeholder="Brand Name"
                            value={newBrandName}
                            onChangeText={(text) => setNewBrandName(text)}
                        />
                        {newBrandNameError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {newBrandNameError}
                            </Text>
                        )}
                        <View style={{ flexDirection: "row" }}>
                            <Button
                                style={{
                                    marginTop: 15,
                                    flex: 1,
                                    marginRight: 10,
                                }}
                                mode={"contained"}
                                onPress={addNewBrand}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => setAddBrandModal(false)}
                            >
                                Close
                            </Button>
                        </View>
                    </Modal>

                    <Modal
                        visible={addModelModal}
                        onDismiss={() => {
                            setAddModelModal(false);
                            setNewModelName("");
                            setNewModelNameError();
                            setModelListModal(true);
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Model
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setAddModelModal(false);
                                setNewModelName("");
                                setNewModelNameError();
                                setModelListModal(true);
                            }}
                        />
                        <TextInput
                            mode="outlined"
                            label="Model Name"
                            style={styles.input}
                            placeholder="Model Name"
                            value={newModelName}
                            onChangeText={(text) => setNewModelName(text)}
                        />
                        {newModelNameError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {newModelNameError}
                            </Text>
                        )}

                        <View style={{ flexDirection: "row" }}>
                            <Button
                                style={{
                                    marginTop: 15,
                                    flex: 1,
                                    marginRight: 10,
                                }}
                                mode={"contained"}
                                onPress={addNewModel}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => setAddModelModal(false)}
                            >
                                Close
                            </Button>
                        </View>
                    </Modal>

                    {/* Insurance Providers List Modal */}
                    <Modal
                        visible={insuranceProviderListModal}
                        onDismiss={() => {
                            setInsuranceProviderListModal(false);
                            setSearchQueryForInsuranceProviders("");
                            searchFilterForInsuranceProviders();
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select Insurance Provider
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setInsuranceProviderListModal(false);
                                setSearchQueryForInsuranceProviders("");
                                searchFilterForInsuranceProviders();
                            }}
                        />
                        <View
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                                flex: 1,
                            }}
                        >
                            <Searchbar
                                placeholder="Search here..."
                                onChangeText={(text) => {
                                    if (text != null)
                                        searchFilterForInsuranceProviders(
                                            text
                                        );
                                }}
                                value={searchQueryForInsuranceProviders}
                                elevation={0}
                                style={{ elevation: 0.8, marginBottom: 10 }}
                            />
                            <FlatList
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredInsuranceProviderData}
                                // onEndReachedThreshold={1}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No insurance company found!
                                            </Text>
                                        </View>
                                ))}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    !isLoading &&
                                        <List.Item
                                            title={
                                                // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setInsuranceProviderListModal(false);  setAddInsuranceProviderModal(true); }}>
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            color: colors.black,
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                </View>
                                                // </TouchableOpacity>
                                            }
                                            onPress={() => {
                                                setIsInsuranceProviderName(
                                                    item.name
                                                );
                                                setIsInsuranceProvider(
                                                    item.id
                                                );
                                                setInsuranceProviderError(
                                                    ""
                                                );
                                                setInsuranceProviderListModal(
                                                    false
                                                );
                                                setSearchQueryForInsuranceProviders("");
                                                searchFilterForInsuranceProviders();
                                            }}
                                        />
                                )}
                            />
                            <View
                                style={{
                                    justifyContent: "flex-end",
                                    flexDirection: "row",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: colors.primary,
                                        marginTop: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 10,
                                        borderRadius: 4,
                                    }}
                                    onPress={() => {
                                        setAddNewInsuranceProviderModal(
                                            true
                                        );
                                        setInsuranceProviderListModal(
                                            false
                                        );
                                    }}
                                >
                                    <Icon
                                        style={{
                                            color: colors.white,
                                            marginRight: 4,
                                        }}
                                        name="plus"
                                        size={16}
                                    />
                                    <Text style={{ color: colors.white }}>
                                        Add Insurance Provider
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        visible={addNewInsuranceProviderModal}
                        onDismiss={() => {
                            setAddNewInsuranceProviderModal(false);
                            setInsuranceProviderListModal(true);
                            setIsNewInsuranceProvider();
                            setNewInsuranceProviderError("");
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Insurance Provider
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setAddNewInsuranceProviderModal(false);
                                setInsuranceProviderListModal(true);
                                setIsNewInsuranceProvider(0);
                                setNewInsuranceProviderError("");
                            }}
                        />
                        <View>
                            <TextInput
                                mode="outlined"
                                label="Insurance Provider Name"
                                style={styles.input}
                                placeholder="Insurance Provider Name"
                                value={isNewInsuranceProvider}
                                onChangeText={(text) =>
                                    setIsNewInsuranceProvider(text)
                                }
                            />
                        </View>
                        {newInsuranceProviderError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {newInsuranceProviderError}
                            </Text>
                        )}
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Button
                                style={{
                                    marginTop: 15,
                                    flex: 1,
                                    marginRight: 10,
                                }}
                                mode={"contained"}
                                onPress={() => {
                                    if (isNewInsuranceProvider == "") {
                                        setNewInsuranceProviderError(
                                            "Please Enter Insurance Provider Name"
                                        );
                                    } else {
                                        addNewInsuranceProvider();
                                    }
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => {
                                    setAddNewInsuranceProviderModal(false);
                                    setInsuranceProviderListModal(true);
                                    setIsNewInsuranceProvider("");
                                    setNewInsuranceProviderError("");
                                }}
                            >
                                Close
                            </Button>
                        </View>
                    </Modal>

                    {/* Garage List Modal */}
                    <Modal
                        visible={garageListModal}
                        onDismiss={() => {
                            setGarageListModal(false);
                            getGarageList();
                            setSearchQueryForGarages("");
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select Garage
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setGarageListModal(false);
                                getGarageList();
                                setSearchQueryForGarages("");
                            }}
                        />
                        <View
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                                flex: 1,
                            }}
                        >
                            {/* Search Bar */}
                            <View>
                                <View
                                    style={{
                                        marginBottom: 15,
                                        flexDirection: "row",
                                    }}
                                >
                                    <TextInput
                                        mode={"flat"}
                                        placeholder="Search here..."
                                        onChangeText={(text) =>
                                            setSearchQueryForGarages(text)
                                        }
                                        value={searchQueryForGarages}
                                        activeUnderlineColor={
                                            colors.transparent
                                        }
                                        selectionColor="black"
                                        underlineColor={colors.transparent}
                                        style={{
                                            elevation: 4,
                                            height: 50,
                                            backgroundColor: colors.white,
                                            flex: 1,
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                            borderTopLeftRadius: 5,
                                            borderBottomLeftRadius: 5,
                                        }}
                                        right={
                                            searchQueryForGarages != null &&
                                            searchQueryForGarages != "" && (
                                                <TextInput.Icon
                                                    icon="close"
                                                    color={
                                                        colors.light_gray
                                                    }
                                                    onPress={() =>
                                                        getGarageList()
                                                    }
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            searchFilterForGarages()
                                        }
                                        style={{
                                            elevation: 4,
                                            borderTopRightRadius: 5,
                                            borderBottomRightRadius: 5,
                                            paddingRight: 25,
                                            paddingLeft: 25,
                                            zIndex: 2,
                                            backgroundColor: colors.primary,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <IconX
                                            name={"search"}
                                            size={17}
                                            color={colors.white}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredGarageData}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No garage found!
                                            </Text>
                                        </View>
                                ))}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    !isLoading && 
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            color: colors.black,
                                                        }}
                                                    >
                                                        {item.garage_name}
                                                    </Text>
                                                </View>
                                            }
                                            onPress={() => {
                                                setIsGarageName(
                                                    item.garage_name
                                                );
                                                setIsGarageId(item.id);
                                                setGarageError("");
                                                setGarageIdError("");
                                                setGarageListModal(false);
                                                getGarageList();
                                                setSearchQueryForGarages("");
                                            }}
                                        />
                                    )
                                }
                            />
                        </View>
                    </Modal>

                    {/* Brand List Modal */}
                    <BrandComponent visible={brandListModal}
                        closeModal={(val) => setBrandListModal(val)}
                        brandName={(val) => { setIsBrandName(val) }}
                        brandId={(val) => { setIsBrand(val) }}
                        setError={(val) => { setBrandError(val) }}

                    />
                    {/* Vehicle Model List Modal */}
                    <VehicalModalComponet visible={modelListModal} brand={isBrand}
                        closeModal={(val) => setModelListModal(val)}
                        modelName={(val) => { setIsModelName(val) }}
                        ModalId={(val) => { setIsModel(val) }}
                        modelError={(val) => { setModelError(val) }}
                        IsLoading={(val) => {setIsLoading(val)}}
                    />

                    {/* States List Modal */}
                    <Modal
                        visible={stateListModal}
                        onDismiss={() => {
                            setStateListModal(false);
                            setSearchQueryForStates("");
                            searchFilterForStates();
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select State
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setStateListModal(false);
                                setSearchQueryForStates("");
                                searchFilterForStates();
                            }}
                        />
                        <View
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                                flex: 1,
                            }}
                        >
                            <Searchbar
                                placeholder="Search here..."
                                onChangeText={(text) => {
                                    if (text != null)
                                        searchFilterForStates(text);
                                }}
                                value={searchQueryForStates}
                                elevation={0}
                                style={{ elevation: 0.8, marginBottom: 10 }}
                            />
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredStateData}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No state found!
                                            </Text>
                                        </View>
                                ))}
                                renderItem={({ item }) => (
                                    !isLoading && 
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            color: colors.black,
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            }
                                            onPress={() => {
                                                setIsStateName(item.name);
                                                setIsState(item.id);
                                                setStateError("");
                                                setStateListModal(false);
                                                setSearchQueryForStates("");
                                                searchFilterForStates();
                                            }}
                                        />
                                )}
                            />
                        </View>
                    </Modal>

                    {/* City List Modal */}
                    <Modal
                        visible={cityListModal}
                        onDismiss={() => {
                            setCityListModal(false);
                            setSearchQueryForCity("");
                            searchFilterForCity();
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select City
                        </Text>
                        <IconX
                            name="times"
                            size={20}
                            color={colors.black}
                            style={{
                                position: "absolute",
                                top: 25,
                                right: 25,
                                zIndex: 99,
                            }}
                            onPress={() => {
                                setCityListModal(false);
                                setSearchQueryForCity("");
                                searchFilterForCity();
                            }}
                        />
                        <View
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                                flex: 1,
                            }}
                        >
                            <Searchbar
                                placeholder="Search here..."
                                onChangeText={(text) => {
                                    if (text != null)
                                        searchFilterForCity(text);
                                }}
                                value={searchQueryForCity}
                                elevation={0}
                                style={{ elevation: 0.8, marginBottom: 10 }}
                            />
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredCityData}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                keyExtractor={(item) => item.id}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No city found!
                                            </Text>
                                        </View>
                                ))}
                                renderItem={({ item }) => (
                                    !isLoading && 
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
                                                        flexWrap:
                                                            "wrap",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            color: colors.black,
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            }
                                            onPress={() => {
                                                setIsCityName(
                                                    item.name
                                                );
                                                setIsCity(item.id);
                                                setCityError("");
                                                setCityListModal(false);
                                                setSearchQueryForCity("");
                                                searchFilterForCity();
                                            }}
                                        />
                                )}
                            />
                        </View>
                    </Modal>
                </Portal>
                {isLoading &&
                    <Spinner
                        visible={isLoading}
                        color="#377520"
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
                    />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    garageNameTitle: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "500",
        color: colors.white,
        paddingVertical: 7,
        backgroundColor: colors.secondary,
        position: "absolute",
        top: 0,
        zIndex: 5,
        width: "100%",
        flex: 1,
        left: 0,
        right: 0,
    },
    pageContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: "center",
    },
    input: {
        marginTop: 20,
        fontSize: 16,
    },
    headingStyle: {
        fontSize: 20,
        color: colors.black,
        fontWeight: "500",
    },
    uploadButtonStyle: {
        backgroundColor: "#F3F6F8",
        borderColor: colors.light_gray,
        borderStyle: "dashed",
        borderWidth: 1,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    datePickerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: 20,
    },
    datePickerField: {
        flex: 1,
        borderColor: colors.light_gray,
        borderBottomWidth: 1,
        borderRadius: 5,
        backgroundColor: "#F0F2F5",
        color: "#424242",
        // paddingHorizontal: 15,
        // height: 55,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: "absolute",
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
        backgroundColor: "#F0F2F5",
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
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 30,
    },
    footer: {
        marginVertical: 15,
    },
    garageDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    brandDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    modelDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    insuranceProviderDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    stateDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
    cityDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: "absolute",
        marginTop: 15,
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
        zIndex: 2,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
    user: state.user.user,
});

export default connect(mapStateToProps)(AddCustomer);

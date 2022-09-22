import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from "react-native";
import {
    Modal,
    Portal,
    Divider,
    TextInput,
    Button,
    List,
    Searchbar,
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
import RadioForm from "react-native-simple-radio-button";
import Spinner from "react-native-loading-spinner-overlay";

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneReg = /^[0-9]{10}$/;

const AddRepairOrderStep2 = ({
    navigation,
    userRole,
    userToken,
    selectedGarageId,
    selectedGarage,
    user,
    userId,
    garageId,
}) => {
    const [isUserVehicleDetails, setIsUserVehicleDetails] = useState("");

    // Customer Fields
    const [isName, setIsName] = useState();
    const [isEmail, setIsEmail] = useState();
    const [isPhoneNumber, setIsPhoneNumber] = useState();
    const [isAddress, setIsAddress] = useState();
    const [userOption, setUserOption] = useState("new_user");

    const [isUser, setIsUser] = useState();
    const [userList, setUserList] = useState([]);
    const [userError, setUserError] = useState("");
    // const [isName, setIsName] = useState("");
    const [userListModal, setUserListModal] = useState(false);
    const [isLoadingUserList, setIsLoadingUserList] = useState(false);
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [searchQueryForUsers, setSearchQueryForUsers] = useState();
    const [loadMoreUsers, setLoadMoreUsers] = useState(true);

    const [userPage, setUserPage] = useState(1);
    const [isUserScrollLoading, setIsUserScrollLoading] = useState(false);
    const [userRefreshing, setUserRefreshing] = useState(false);

    // Error States
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

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
    const [loadMoreGarages, setLoadMoreGarages] = useState(true);

    const [garagePage, setGaragePage] = useState(1);
    const [isGarageScrollLoading, setIsGarageScrollLoading] = useState(false);
    const [garageRefreshing, setGarageRefreshing] = useState(false);

    const [cityFieldToggle, setCityFieldToggle] = useState(false);
    const [modelFieldToggle, setModelFieldToggle] = useState(false);

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

    const [isLoading, setIsLoading] = useState(false);

    // Brand States
    const [isBrand, setIsBrand] = useState();
    const [isBrandName, setIsBrandName] = useState();
    const [brandList, setBrandList] = useState([]);
    const [brandListModal, setBrandListModal] = useState(false);
    const [filteredBrandData, setFilteredBrandData] = useState([]);
    const [searchQueryForBrands, setSearchQueryForBrands] = useState();
    const [brandError, setBrandError] = useState(""); // Error State
    const [loadMoreBrands, setLoadMoreBrands] = useState(true);

    const [brandPage, setBrandPage] = useState(1);
    const [isBrandScrollLoading, setIsBrandScrollLoading] = useState(false);
    const [brandRefreshing, setBrandRefreshing] = useState(false);

    // Vehicle Model States
    const [isModel, setIsModel] = useState();
    const [isModelName, setIsModelName] = useState();
    const [modelList, setModelList] = useState([]);
    const [modelListModal, setModelListModal] = useState(false);
    const [filteredModelData, setFilteredModelData] = useState([]);
    const [searchQueryForModels, setSearchQueryForModels] = useState();
    const [modelError, setModelError] = useState(""); // Error State
    const [loadMoreModels, setLoadMoreModels] = useState(true);

    const [modelPage, setModelPage] = useState(1);
    const [isModelScrollLoading, setIsModelScrollLoading] = useState(false);
    const [modelRefreshing, setModelRefreshing] = useState(false);

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

    const scroll1Ref = useRef();

    var radio_props = [
        { label: "New User", value: "new_user" },
        { label: "Existing User", value: "existing_user" },
    ];

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
            if (res.status == 200 || res.status == 201){
                pullBrandRefresh();
                setAddBrandModal(false);
                setNewBrandName("");
                setIsBrand(0);
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
                pullModelRefresh();
                setAddModelModal(false);
                setNewModelName("");
                setIsModel(0);
            } else if(res.status == 400) {
                setNewBrandNameError(json.message.model_name);
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
            // console.log('event', event);
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

    const validate = () => {
        if (userOption == "new_user") {
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
        } else if (userOption == "existing_user") {
            return !(
                !isBrand ||
                isBrand === 0 ||
                !isModel ||
                isModel === 0 ||
                !isGarageId ||
                isGarageId === 0 ||
                !isVehicleRegistrationNumber ||
                isVehicleRegistrationNumber?.trim().length === 0
            );
        }
    };

    const submit = () => {
        Keyboard.dismiss();

        if (!validate()) {
            if (userOption == "new_user") {
                if (!isName) setIsName("");
                if (!isEmail) setIsEmail("");
                if (!isPhoneNumber) setIsPhoneNumber("");
                // if (!isName) setNameError("Customer Name is required");
                // else setNameError("");
                // if (!isPhoneNumber)
                //     setPhoneNumberError("Phone Number is required");
                // else setPhoneNumberError("");
                // if (!isEmail) setEmailError("Email is required");
                // else if (isEmail.length < 6)
                //     setEmailError("Email should be minimum 6 characters");
                // else if (isEmail?.indexOf(" ") >= 0)
                //     setEmailError("Email cannot contain spaces");
                // else if (isEmail?.indexOf("@") < 0)
                //     setEmailError("Invalid Email Format");
                // else setEmailError("");
            } else if (userOption == "existing_user") {
                if (!isUser || isUser === 0) setUserError("User is required");
                else setUserError("");
            }
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
            if (!isVehicleRegistrationNumber)
                setIsVehicleRegistrationNumber("");
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

        if (userOption == "new_user") {
            data.append("user_option", userOption);
            data.append("name", isName?.trim());
            data.append("email", isEmail?.trim());
            data.append("phone_number", isPhoneNumber?.trim());
            data.append("city", isCity);
            data.append("state", isState);
            if (isAddress) data.append("address", isAddress?.trim());
            data.append("vehicle_option", "new_vehicle");
        } else if (userOption == "existing_user") {
            data.append("user_id", isUser);
        }
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
        if (isInsuranceImg != null)
            data.append("insurance_img", isInsuranceImg);
        data.append("garage_id", isGarageId);

        if (userOption == "new_user") {
            console.log("new_user", data);
            addCustomer(data);
        } else if (userOption == "existing_user") {
            console.log("existing_user", data);
            addVehicle(data);
        }
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
                    if (res.statusCode == 400) {
                        {
                            res.data.message.email &&
                                setEmailError(res.data.message.email);
                        }
                        {
                            res.data.message.phone_number &&
                                setPhoneNumberError(
                                    res.data.message.phone_number
                                );
                        }
                        {
                            res.data.message.vehicle_registration_number &&
                                setVehicleRegistrationNumberError(
                                    res.data.message.vehicle_registration_number
                                );
                        }
                        return;
                    } else {
                        // console.log('res', res);
                        const jsonData = {
                            user_id: res.data.user_id,
                            vehicle_id: res.data.vehicle_id,
                            name: res.data.user_data.name,
                            email: res.data.user_data.email,
                            phone_number: res.data.user_data.phone_number,
                            brand_id: res.data.vehicle_data.brand_id,
                            model_id: res.data.vehicle_data.model_id,
                            vehicle_registration_number:
                                res.data.vehicle_data
                                    .vehicle_registration_number,
                            brand_name: brandList.find(
                                (data) => data.id == isBrand
                            ).name,
                            model_name: modelList.find(
                                (data) => data.id == isModel
                            ).model_name,
                            garage_id: res.data.garage_id,
                        };
                        // console.log('res', jsonData);
                        setIsUserVehicleDetails(jsonData);
                        navigation.navigate("AddRepairOrderStep3", {
                            userVehicleDetails: jsonData,
                        });
                    }
                });
        } catch (e) {
            console.log(e);
        }
    };

    const addVehicle = async (data) => {
        setIsLoading(true);
        try {
            await fetch(`${API_URL}add_new_vehicle_user`, {
                method: "POST",
                headers: {
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
                    // console.log('res', res);
                    if (
                        res.statusCode == 201 ||
                        res.statusCode == 200 ||
                        res.message == true
                    ) {
                        setIsLoading(false);
                        const jsonData = {
                            user_id: res.data.user_id,
                            vehicle_id: res.data.vehicle_id,
                            name: res.data.user_data.name,
                            email: res.data.user_data.email,
                            phone_number: res.data.user_data.phone_number,
                            brand_id: res.data.vehicle_data.brand_id,
                            model_id: res.data.vehicle_data.model_id,
                            vehicle_registration_number:
                                res.data.vehicle_data
                                    .vehicle_registration_number,
                            brand_name: brandList.find(
                                (data) => data.id == isBrand
                            ).name,
                            model_name: modelList.find(
                                (data) => data.id == isModel
                            ).model_name,
                            garage_id: res.data.garage_id,
                        };
                        // console.log('jsonData', jsonData);
                        setIsUserVehicleDetails(jsonData);
                        navigation.navigate("AddRepairOrderStep3", {
                            userVehicleDetails: jsonData,
                        });
                    } else if (res.statusCode == 400) {
                        {
                            res.data.message.vehicle_registration_number &&
                                setVehicleRegistrationNumberError(
                                    res.data.message.vehicle_registration_number
                                );
                        }
                        return;
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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setStateList', json.data);
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
        if(brandPage == 1) setIsLoading(true)
        if(brandPage != 1) setIsBrandScrollLoading(true)
        try {
            const res = await fetch(`${API_URL}fetch_brand?page=${brandPage}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: searchQueryForBrands,
                }),
            });
            const json = await res.json();
            if (json !== undefined) {
                setBrandList([...brandList, ...json.brand_list.data]);
                setFilteredBrandData([
                    ...filteredBrandData,
                    ...json.brand_list.data,
                ]);
                setIsLoading(false);
                if(brandPage != 1) setIsBrandScrollLoading(false)
                {json.brand_list.current_page != json.brand_list.last_page ? setLoadMoreBrands(true) : setLoadMoreBrands(false)}
                {json.brand_list.current_page != json.brand_list.last_page ? setBrandPage(brandPage + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForBrands = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}fetch_brand`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: searchQueryForBrands,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setBrandList(json.brand_list.data);
                setFilteredBrandData(json.brand_list.data);
                {json.brand_list.current_page != json.brand_list.last_page ? setLoadMoreBrands(true) : setLoadMoreBrands(false)}
                {json.brand_list.current_page != json.brand_list.last_page ? setBrandPage(2) : null}
                setBrandRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullBrandRefresh = async () => {
        setSearchQueryForBrands(null);
        try {
            const response = await fetch(`${API_URL}fetch_brand`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: null,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setBrandList(json.brand_list.data);
                setFilteredBrandData(json.brand_list.data);
                {json.brand_list.current_page != json.brand_list.last_page ? setLoadMoreBrands(true) : setLoadMoreBrands(false)}
                {json.brand_list.current_page != json.brand_list.last_page ? setBrandPage(2) : null}
                setBrandRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderBrandFooter = () => {
        return (
            <>
                {isBrandScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onBrandRefresh = () => {
        setBrandRefreshing(true);
        pullBrandRefresh();
    };

    const getModelList = async () => {
        if(modelPage == 1) setIsLoading(true)
        if(modelPage != 1) setIsModelScrollLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_vehicle_model?page=${modelPage}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        brand_id: isBrand,
                        search: searchQueryForModels,
                    }),
                }
            );
            const json = await res.json();
            console.log("model_json", json);
            if (json !== undefined) {
                setModelList([...modelList, ...json.vehicle_model_list.data]);
                setFilteredModelData([
                    ...filteredModelData,
                    ...json.vehicle_model_list.data,
                ]);
                setIsLoading(false);
                if(modelPage != 1) setIsModelScrollLoading(false)
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setLoadMoreModels(true) : setLoadMoreModels(false)}
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setModelPage(modelPage + 1) : null}
                // setModelPage(modelPage + 1);
                // setModelList(json.vehicle_model_list);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForModels = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_vehicle_model`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    brand_id: isBrand,
                    search: searchQueryForModels,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setModelList(json.vehicle_model_list.data);
                setFilteredModelData(json.vehicle_model_list.data);
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setLoadMoreModels(true) : setLoadMoreModels(false)}
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setModelPage(2) : null}
                setIsLoading(false);
                setModelRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullModelRefresh = async () => {
        setSearchQueryForModels(null);
        try {
            const response = await fetch(`${API_URL}fetch_vehicle_model`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    brand_id: isBrand,
                    search: null,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setModelList(json.vehicle_model_list.data);
                setFilteredModelData(json.vehicle_model_list.data);
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setLoadMoreModels(true) : setLoadMoreModels(false)}
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setModelPage(2) : null}
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderModelFooter = () => {
        return (
            <>
                {isModelScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onModelRefresh = () => {
        setModelRefreshing(true);
        pullModelRefresh();
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
            if (res.status == 200 || res.status == 201){
                // console.log("setInsuranceProviderList", json.data);
                getInsuranceProviderList();
                setIsInsuranceProvider(
                    parseInt(json.insurance_provider_list.id)
                );
                setIsInsuranceProviderName(json.insurance_provider_list.name);
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

    const getGarageList = async () => {
        if(garagePage == 1) setIsLoading(true)
        if(garagePage != 1) setIsGarageScrollLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_owner_garages?page=${garagePage}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        user_role: userRole,
                        search: searchQueryForGarages,
                    }),
                }
            );
            const json = await res.json();
            console.log(json);
            if (json !== undefined) {
                setGarageList([...garageList, ...json.garage_list.data]);
                setFilteredGarageData([
                    ...filteredGarageData,
                    ...json.garage_list.data,
                ]);
                setIsLoading(false);
                if(garagePage != 1) setIsGarageScrollLoading(false)
                {json.garage_list.current_page != json.garage_list.last_page ? setLoadMoreGarages(true) : setLoadMoreGarages(false)}
                {json.garage_list.current_page != json.garage_list.last_page ? setGaragePage(garagePage + 1) : null}
                // setGarageList(json.garage_list);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForGarages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_owner_garages`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    user_id: userId,
                    user_role: userRole,
                    search: searchQueryForGarages,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setGarageList(json.garage_list.data);
                setFilteredGarageData(json.garage_list.data);
                {json.garage_list.current_page != json.garage_list.last_page ? setLoadMoreGarages(true) : setLoadMoreGarages(false)}
                {json.garage_list.current_page != json.garage_list.last_page ? setGaragePage(2) : null}
                setGarageRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullGarageRefresh = async () => {
        setSearchQueryForGarages(null);
        try {
            const response = await fetch(`${API_URL}fetch_owner_garages`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    user_id: userId,
                    user_role: userRole,
                    search: null,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setGarageList(json.garage_list.data);
                setFilteredGarageData(json.garage_list.data);
                {json.garage_list.current_page != json.garage_list.last_page ? setLoadMoreGarages(true) : setLoadMoreGarages(false)}
                {json.garage_list.current_page != json.garage_list.last_page ? setGaragePage(2) : null}
                setGarageRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderGarageFooter = () => {
        return (
            <>
                {isGarageScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onGarageRefresh = () => {
        setGarageRefreshing(true);
        pullGarageRefresh();
    };

    const getUserList = async () => {
        if(userPage == 1) setIsLoading(true)
        if(userPage != 1) setIsUserScrollLoading(true)
        // setIsLoadingUserList(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_my_garage_customers?page=${userPage}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        garage_id: isGarageId,
                        search: searchQueryForUsers,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setUserList([...userList, ...json.user_list.data]);
                setFilteredUserData([
                    ...filteredUserData,
                    ...json.user_list.data,
                ]);
                setIsLoading(false);
                if(userPage != 1) setIsUserScrollLoading(false)
                {json.user_list.current_page != json.user_list.last_page ? setLoadMoreUsers(true) : setLoadMoreUsers(false)}
                {json.user_list.current_page != json.user_list.last_page ? setUserPage(userPage + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}fetch_my_garage_customers`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        garage_id: isGarageId,
                        search: searchQueryForUsers,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setUserList(json.user_list.data);
                setFilteredUserData(json.user_list.data);
                {json.user_list.current_page != json.user_list.last_page ? setLoadMoreUsers(true) : setLoadMoreUsers(false)}
                {json.user_list.current_page != json.user_list.last_page ? setUserPage(2) : null}
                setUserRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullUserRefresh = async () => {
        setSearchQueryForUsers(null);
        try {
            const response = await fetch(
                `${API_URL}fetch_my_garage_customers`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        garage_id: isGarageId,
                        search: null,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setUserList(json.user_list.data);
                setFilteredUserData(json.user_list.data);
                {json.user_list.current_page != json.user_list.last_page ? setLoadMoreUsers(true) : setLoadMoreUsers(false)}
                {json.user_list.current_page != json.user_list.last_page ? setUserPage(2) : null}
                setUserRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderUserFooter = () => {
        return (
            <>
                {isUserScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onUserRefresh = () => {
        setUserRefreshing(true);
        pullUserRefresh();
    };

    useEffect(() => {
        getStateList();
        getBrandList();
        getGarageList();
        getUserList();
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
            setIsLoading(true);
            pullModelRefresh();
            setIsModel();
            setIsModelName("");
            setModelFieldToggle(true);
            // getModelList();
        }
    }, [isBrand]);

    useEffect(() => {
        if (isGarageId != undefined) {
            getUserList();
            setIsUser();
            setIsName();
        }
    }, [isGarageId]);

    // useEffect(() => {
    //     if(isUserVehicleDetails != '') navigation.navigate('AddRepairOrderStep3', {'userVehicleDetails': isUserVehicleDetails})
    // }, [isUserVehicleDetails]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 35 }}>
                {selectedGarageId == 0 ? (
                    <Text style={styles.garageNameTitle}>
                        All Garages - {user.name}
                    </Text>
                ) : (
                    <Text style={styles.garageNameTitle}>
                        {selectedGarage?.garage_name} - {user.name}
                    </Text>
                )}
            </View>
            <View style={styles.pageContainer}>

                <InputScrollView
                    keyboardOffset={200}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardShouldPersistTaps={"always"}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1 }}>
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
                                        value={isGarageName}
                                        editable={false}
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

                        <Divider style={{ marginTop: 20 }} />

                        <View style={{ marginTop: 15 }}>
                            <RadioForm
                                radio_props={radio_props}
                                initial={0}
                                onPress={(value) => {
                                    setUserOption(value);
                                    setIsName();
                                    setIsUser();
                                }}
                                animation={false}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonWrapStyle={{ marginLeft: 10 }}
                                labelStyle={{ marginRight: 40 }}
                            />
                        </View>
                        {userOption == "existing_user" ? (
                            <View style={{marginTop: 20}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setUserListModal(true);
                                        searchFilterForUsers("");
                                    }}
                                >
                                    <TextInput
                                        mode="outlined"
                                        label="User"
                                        style={{
                                            backgroundColor: "#f1f1f1",
                                            width: "100%",
                                        }}
                                        placeholder="Select User"
                                        value={isName}
                                        editable={false}
                                        right={
                                            <TextInput.Icon name="menu-down" />
                                        }
                                    />
                                </TouchableOpacity>
                                {userError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {userError}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            <>
                                <Text
                                    style={[
                                        styles.headingStyle,
                                        { marginTop: 20 },
                                    ]}
                                >
                                    Customer Details:
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    label="Customer Name"
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
                                    style={styles.input}
                                    placeholder="Email Address"
                                    value={isEmail}
                                    onChangeText={(text) =>
                                        setIsEmail(text)
                                    }
                                />
                                {isEmail?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Email is required.
                                    </Text>
                                ) : isEmail &&
                                    !reg.test(isEmail?.trim()) ? (
                                    <Text style={styles.errorTextStyle}>
                                        Invalid Email.
                                    </Text>
                                ) : isEmail?.length > 200 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Email must be a maximum 200
                                        characters.
                                    </Text>
                                ) : null}

                                {/* {emailError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {emailError}
                                    </Text>
                                )} */}

                                <TextInput
                                    mode="outlined"
                                    label="Phone Number"
                                    style={styles.input}
                                    placeholder="Phone Number"
                                    maxLength={10}
                                    value={isPhoneNumber}
                                    onChangeText={(text) =>
                                        setIsPhoneNumber(text)
                                    }
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
                                {/* {phoneNumberError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {phoneNumberError}
                                    </Text>
                                )} */}

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
                                            value={isStateName}
                                            editable={false}
                                            right={
                                                <TextInput.Icon name="menu-down" />
                                            }
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
                                                value={isCityName}
                                                editable={false}
                                                right={
                                                    <TextInput.Icon name="menu-down" />
                                                }
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
                                    style={styles.input}
                                    placeholder="Address"
                                    value={isAddress}
                                    onChangeText={(text) =>
                                        setIsAddress(text)
                                    }
                                />
                            </>
                        )}

                        <Divider style={{ marginTop: 20 }} />

                        <Text
                            style={[styles.headingStyle, { marginTop: 20 }]}
                        >
                            Vehicle Details:
                        </Text>

                        {/* <TouchableOpacity
                            onPress={() => {
                                setBrandListModal(true);
                            }}
                        >
                            <TextInput
                                mode="outlined"
                                label="Brand"
                                editable={false}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "#f1f1f1",
                                    width: "100%",
                                }}
                                placeholder="Select Brand"
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
                        )} */}
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
                                    value={isBrandName}
                                    editable={false}
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
                                        value={isModelName}
                                        editable={false}
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
                        
                        {/* <TouchableOpacity
                            onPress={() => {
                                setModelListModal(true);
                            }}
                        >
                            <TextInput
                                mode="outlined"
                                label="Vehicle Model"
                                editable={false}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "#f1f1f1",
                                    width: "100%",
                                }}
                                placeholder="Select Vehicle Model"
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
                        )} */}

                        <TextInput
                            mode="outlined"
                            label="Vehicle Registration Number"
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
                        {/* {vehicleRegistrationNumberError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {vehicleRegistrationNumberError}
                            </Text>
                        )} */}

                        <TouchableOpacity
                            style={{ flex: 1, marginTop: 20 }}
                            onPress={() => setDisplayPurchaseCalender(true)}
                        >
                            <TextInput
                                mode="outlined"
                                label="Purchase Date"
                                placeholder="Purchase Date"
                                value={datePurchase}
                                editable={false}
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
                                value={dateManufacturing}
                                editable={false}
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
                                value={dateInsuranceExpiry}
                                editable={false}
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
                            setNewBrandName("");
                            setIsBrand();
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
                                setNewBrandName("");
                                setIsBrand();
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
                            setIsModel();
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
                                setIsModel();
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
                            setIsInsuranceProvider();
                            setIsInsuranceProviderName("");
                            setInsuranceProviderError("");
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
                                setIsInsuranceProvider();
                                setIsInsuranceProviderName("");
                                setInsuranceProviderError("");
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
                                showsVerticalScrollIndicator={false}
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
                                                No insurance company found!
                                            </Text>
                                        </View>
                                ))}
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
                                                setSearchQueryForInsuranceProviders(
                                                    ""
                                                );
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
                            setIsNewInsuranceProvider(0);
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

                    {/* Users List Modal */}
                    <Modal
                        visible={userListModal}
                        onDismiss={() => {
                            setUserListModal(false);
                            // setIsUser();
                            // setIsName("");
                            // setUserError("");
                            onUserRefresh();
                            setSearchQueryForUsers("");
                            searchFilterForUsers();
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
                            Select User
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
                                setUserListModal(false);
                                onUserRefresh();
                                setSearchQueryForUsers("");
                                searchFilterForUsers();
                            }}
                        />
                        <View
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                                flex: 1,
                            }}
                        >
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
                                            setSearchQueryForUsers(text)
                                        }
                                        value={searchQueryForUsers}
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
                                            searchQueryForUsers != null &&
                                            searchQueryForUsers != "" && (
                                                <TextInput.Icon
                                                    icon="close"
                                                    color={
                                                        colors.light_gray
                                                    }
                                                    onPress={() => {
                                                        setSearchQueryForUsers !=
                                                            "";
                                                        searchFilterForUsers(
                                                            ""
                                                        );
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            searchFilterForUsers(
                                                searchQueryForUsers
                                            )
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
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredUserData}
                                onEndReached={loadMoreUsers ? getUserList : null}
                                onEndReachedThreshold={0.5}
                                contentContainerStyle={{ flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={userRefreshing}
                                        onRefresh={onUserRefresh}
                                        colors={["green"]}
                                    />
                                }
                                ListFooterComponent={loadMoreUsers ? renderUserFooter : null}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No user found!
                                            </Text>
                                        </View>
                                ))}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                keyExtractor={(item) =>
                                    `user-${item.id}`
                                }
                                renderItem={({ item }) => (
                                    !isLoading &&
                                        <List.Item
                                            title={
                                                <View
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                        display: "flex",
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
                                                setIsName(item.name);
                                                setIsUser(item.id);
                                                setUserError("");
                                                setUserListModal(false);
                                                onUserRefresh();
                                                // searchFilterForUsers('');
                                            }}
                                        />
                                )}
                            />
                        </View>
                    </Modal>

                    {/* Garage List Modal */}
                    <Modal
                        visible={garageListModal}
                        onDismiss={() => {
                            setGarageListModal(false);
                            // setIsGarageId(0);
                            // setIsGarageName("");
                            // setGarageError("");
                            onGarageRefresh();
                            setSearchQueryForGarages("");
                            searchFilterForGarages();
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
                                setSearchQueryForGarages("");
                                searchFilterForGarages();
                                onGarageRefresh();
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
                                                        onGarageRefresh()
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
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredGarageData}
                                onEndReached={loadMoreGarages ? getGarageList : null}
                                showsVerticalScrollIndicator={false}
                                onEndReachedThreshold={0.5}
                                contentContainerStyle={{ flexGrow: 1 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={garageRefreshing}
                                        onRefresh={onGarageRefresh}
                                        colors={["green"]}
                                    />
                                }
                                ListFooterComponent={loadMoreGarages ? renderGarageFooter : null}
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
                                                onGarageRefresh();
                                                setGarageListModal(false);
                                            }}
                                        />
                                    )
                                }
                            />
                        </View>
                    </Modal>

                    {/* Brand List Modal */}
                    <Modal
                        visible={brandListModal}
                        onDismiss={() => {
                            setBrandListModal(false);
                            setSearchQueryForBrands("");
                            searchFilterForBrands();
                            onBrandRefresh();
                        }}
                        contentContainerStyle={[
                            styles.modalContainerStyle,
                            { flex: 0.9 },
                        ]}
                    >
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
                                setBrandListModal(false);
                                setSearchQueryForBrands("");
                                searchFilterForBrands();
                                onBrandRefresh();
                            }}
                        />
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Select Brand
                        </Text>
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
                                            setSearchQueryForBrands(text)
                                        }
                                        value={searchQueryForBrands}
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
                                            searchQueryForBrands != null &&
                                            searchQueryForBrands != "" && (
                                                <TextInput.Icon
                                                    icon="close"
                                                    color={
                                                        colors.light_gray
                                                    }
                                                    onPress={() =>
                                                        onBrandRefresh()
                                                    }
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            searchFilterForBrands()
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
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredBrandData}
                                onEndReached={loadMoreBrands ? getBrandList : null}
                                showsVerticalScrollIndicator={false}
                                onEndReachedThreshold={0.5}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={brandRefreshing}
                                        onRefresh={onBrandRefresh}
                                        colors={["green"]}
                                    />
                                }
                                ListFooterComponent={loadMoreBrands ? renderBrandFooter : null}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No brand found!
                                            </Text>
                                        </View>
                                ))}
                                contentContainerStyle={{ flexGrow: 1 }}
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
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            }
                                            onPress={() => {
                                                setIsBrandName(item.name);
                                                setIsBrand(item.id);
                                                setBrandError("");
                                                onBrandRefresh();
                                                setBrandListModal(false);
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
                                        setAddBrandModal(true);
                                        setBrandListModal(false);
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
                                        Add Brand
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Vehicle Model List Modal */}
                    <Modal
                        visible={modelListModal}
                        onDismiss={() => {
                            setModelListModal(false);
                            onModelRefresh();
                            setSearchQueryForModels("");
                            searchFilterForModels();
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
                            Select Model
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
                                setModelListModal(false);
                                onModelRefresh();
                                setSearchQueryForModels("");
                                searchFilterForModels();
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
                                            setSearchQueryForModels(text)
                                        }
                                        value={searchQueryForModels}
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
                                            searchQueryForModels != null &&
                                            searchQueryForModels != "" && (
                                                <TextInput.Icon
                                                    icon="close"
                                                    color={
                                                        colors.light_gray
                                                    }
                                                    onPress={() =>
                                                        onModelRefresh()
                                                    }
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            searchFilterForModels()
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
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredModelData}
                                onEndReached={loadMoreModels ? getModelList : null}
                                showsVerticalScrollIndicator={false}
                                onEndReachedThreshold={0.5}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={modelRefreshing}
                                        onRefresh={onModelRefresh}
                                        colors={["green"]}
                                    />
                                }
                                ListFooterComponent={loadMoreModels ? renderModelFooter : null}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No vehicle model found!
                                            </Text>
                                        </View>
                                ))}
                                contentContainerStyle={{ flexGrow: 1 }}
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
                                                        {item.model_name}
                                                    </Text>
                                                </View>
                                            }
                                            onPress={() => {
                                                setIsModelName(
                                                    item.model_name
                                                );
                                                setIsModel(item.id);
                                                setModelError("");
                                                onModelRefresh();
                                                setModelListModal(false);
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
                                        setAddModelModal(true);
                                        setModelListModal(false);
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
                                        Add Model
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* States List Modal */}
                    <Modal
                        visible={stateListModal}
                        onDismiss={() => {
                            setStateListModal(false);
                            setSearchQueryForStates("");
                            searchFilterForStates();
                            setIsCity();
                            setIsCityName("");
                            setCityFieldToggle(false);
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
                                setIsCity();
                                setIsCityName("");
                                setCityFieldToggle(false);
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
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                showsVerticalScrollIndicator={false}
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
                                                setSearchQueryForStates("");
                                                searchFilterForStates();
                                                setStateListModal(false);
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
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                showsVerticalScrollIndicator={false}
                                data={filteredCityData}
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
                                                setSearchQueryForCity("");
                                                searchFilterForCity();
                                                setCityListModal(false);
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
        height: 55,
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
    userDropDownField: {
        // fontSize: 16,
        // color: colors.black,
        // position: "absolute",
        marginTop: 15,
        // left: 0,
        // top: 0,
        width: "100%",
        // height: "80%",
        // zIndex: 2,
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
    user: state.user.user,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
});

export default connect(mapStateToProps)(AddRepairOrderStep2);

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
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Spinner from "react-native-loading-spinner-overlay";

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
    const [isPurchaseDate, setIsPurchaseDate] = useState(new Date());
    const [isManufacturingDate, setIsManufacturingDate] = useState(new Date());
    const [isEngineNumber, setIsEngineNumber] = useState("");
    const [isChasisNumber, setIsChasisNumber] = useState("");
    const [isInsurerGstin, setIsInsurerGstin] = useState("");
    const [isInsurerAddress, setIsInsurerAddress] = useState("");
    const [isPolicyNumber, setIsPolicyNumber] = useState("");
    const [isInsuranceExpiryDate, setIsInsuranceExpiryDate] = useState(
        new Date()
    );
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
    const [isLoadingGarageList, setIsLoadingGarageList] = useState(true);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState();
    const [garageError, setGarageError] = useState(""); // Error State
    const [garageIdError, setGarageIdError] = useState();
    const [loadMoreGarages, setLoadMoreGarages] = useState(true);

    const [garagePage, setGaragePage] = useState(1);
    const [isGarageScrollLoading, setIsGarageScrollLoading] = useState(false);
    const [garageRefreshing, setGarageRefreshing] = useState(false);

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
    const [addModelModal, setAddModelModal] = useState(false);
    const [newModelName, setNewModelName] = useState();

    // Brand States
    const [isBrand, setIsBrand] = useState();
    const [isBrandName, setIsBrandName] = useState();
    const [brandList, setBrandList] = useState([]);
    const [brandListModal, setBrandListModal] = useState(false);
    const [isLoadingBrandList, setIsLoadingBrandList] = useState(true);
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
    const [isLoadingModelList, setIsLoadingModelList] = useState(true);
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
    const [isLoadingInsuranceProviderList, setIsLoadingInsuranceProviderList] =
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
    const [isLoadingStateList, setIsLoadingStateList] = useState(false);
    const [filteredStateData, setFilteredStateData] = useState([]);
    const [searchQueryForStates, setSearchQueryForStates] = useState();
    const [stateError, setStateError] = useState();

    // Cities state for Dropdown
    const [isCity, setIsCity] = useState();
    const [isCityName, setIsCityName] = useState("");
    const [cityList, setCityList] = useState([]);
    const [cityListModal, setCityListModal] = useState(false);
    const [isLoadingCityList, setIsLoadingCityList] = useState(false);
    const [filteredCityData, setFilteredCityData] = useState([]);
    const [searchQueryForCity, setSearchQueryForCity] = useState();
    const [cityError, setCityError] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const scroll1Ref = useRef();

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
            console.log(json);
            if (json !== undefined) {
                pullBrandRefresh();
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
            if (json !== undefined) {
                pullModelRefresh();
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
        if (selectedDate != null) {
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
        }
    };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
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
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
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
        }
    };

    const validate = () => {
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
    };

    const submit = () => {
        Keyboard.dismiss();

        if (!validate()) {
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
        if (isInsuranceImg != null)
            data.append("insurance_img", isInsuranceImg);
        data.append("vehicle_option", "new_vehicle");
        data.append("garage_id", isGarageId);

        addCustomer(data);
    };

    const addCustomer = async (data) => {
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
                    } else if (res.statusCode == 201 || res.statusCode == 200) {
                        navigation.navigate("MyCustomers");
                    } else {
                        navigation.navigate("MyCustomers");
                    }
                });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
            navigation.navigate("MyCustomers");
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
        setIsLoadingStateList(true);
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
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(false);
            setIsLoadingStateList(false);
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
        setIsLoadingCityList(true);
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
                setCityFieldToggle(true);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingCityList(false);
        }
    };

    // const getCityList = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_cities?state_id=${isState}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             setCityList(json.cities);
    //             setCityFieldToggle(true);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         return alert(e);
    //     }
    // };

    const getBrandList = async () => {
        {
            brandPage == 1 && setIsLoadingBrandList(true);
        }
        {
            brandPage != 1 && setIsBrandScrollLoading(true);
        }
        console.log("brand");
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
            console.log('Fetch Brand List');
            if (json !== undefined) {
                setBrandList([...brandList, ...json.brand_list.data]);
                setFilteredBrandData([
                    ...filteredBrandData,
                    ...json.brand_list.data,
                ]);
                setIsLoadingBrandList(false);
                {
                    brandPage != 1 && setIsBrandScrollLoading(false);
                }
                {json.brand_list.current_page != json.brand_list.last_page ? setLoadMoreBrands(true) : setLoadMoreBrands(false)}
                {json.brand_list.current_page != json.brand_list.last_page ? setBrandPage(brandPage + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForBrands = async () => {
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
            } else {
                setBrandRefreshing(false);
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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBrandRefreshing(false);
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
        {
            modelPage == 1 && setIsLoadingModelList(true);
        }
        {
            modelPage != 1 && setIsModelScrollLoading(true);
        }
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
                setIsLoadingModelList(false);
                {
                    modelPage != 1 && setIsModelScrollLoading(false);
                }
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setLoadMoreModels(true) : setLoadMoreModels(false)}
                {json.vehicle_model_list.current_page != json.vehicle_model_list.last_page ? setModelPage(modelPage + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForModels = async () => {
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
                setModelRefreshing(false);
            } else {
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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setModelRefreshing(false);
            setIsLoadingModelList(false);
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

            if (json !== undefined) {
                console.log("setInsuranceProviderList", json.data);
                getInsuranceProviderList();
                setIsInsuranceProvider(
                    parseInt(json.insurance_provider_list.id)
                );
                setIsInsuranceProviderName(json.insurance_provider_list.name);
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
        setIsLoadingInsuranceProviderList(true);
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
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingInsuranceProviderList(false);
        }
    };

    // Function for Garages
    const searchFilterForGarages = async () => {
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
            } else {
                setGarageRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getGarageList = async () => {
        {
            garagePage == 1 && setIsLoadingGarageList(true);
        }
        {
            garagePage != 1 && setIsGarageScrollLoading(true);
        }
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
            // console.log(json);
            if (json !== undefined) {
                setGarageList([...garageList, ...json.garage_list.data]);
                setFilteredGarageData([
                    ...filteredGarageData,
                    ...json.garage_list.data,
                ]);
                setIsLoadingGarageList(false);
                {
                    garagePage != 1 && setIsGarageScrollLoading(false);
                }
                {json.garage_list.current_page != json.garage_list.last_page ? setLoadMoreGarages(true) : setLoadMoreGarages(false)}
                {json.garage_list.current_page != json.garage_list.last_page ? setGaragePage(garagePage + 1) : null}
            }
        } catch (e) {
            console.log(e);
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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setGarageRefreshing(false);
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
            setIsLoadingModelList(true);
            pullModelRefresh();
            setIsModel();
            setIsModelName("");
            setModelFieldToggle(true);
            // getModelList();
        }
    }, [isBrand]);

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
                {isLoading == true ? (
                    <ActivityIndicator></ActivityIndicator>
                ) : (
                    <InputScrollView
                        ref={scroll1Ref}
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

                            <View>
                                <TouchableOpacity
                                    style={styles.stateDropDownField}
                                    onPress={() => {
                                        setStateListModal(true);
                                    }}
                                ></TouchableOpacity>
                                <TextInput
                                    mode="outlined"
                                    label="State"
                                    style={{
                                        marginTop: 10,
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select State"
                                    value={isStateName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </View>
                            {stateError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {stateError}
                                </Text>
                            )}

                            <View>
                                {cityFieldToggle == false && (
                                    <View
                                        style={[
                                            styles.cityDropDownField,
                                            {
                                                zIndex: 10,
                                                opacity: 0.6,
                                                backgroundColor: colors.white,
                                            },
                                        ]}
                                    ></View>
                                )}
                                <TouchableOpacity
                                    style={styles.cityDropDownField}
                                    onPress={() => {
                                        setCityListModal(true);
                                    }}
                                ></TouchableOpacity>
                                <TextInput
                                    mode="outlined"
                                    label="City"
                                    style={{
                                        marginTop: 10,
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select City"
                                    value={isCityName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </View>
                            {cityError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {cityError}
                                </Text>
                            )}

                            <TextInput
                                mode="outlined"
                                label="Address"
                                style={styles.input}
                                placeholder="Address"
                                value={isAddress}
                                onChangeText={(text) => setIsAddress(text)}
                            />

                            {(userRole == "Super Admin" ||
                                garageId?.length > 1) && (
                                <>
                                    <View>
                                        <TouchableOpacity
                                            style={styles.garageDropDownField}
                                            onPress={() => {
                                                setGarageListModal(true);
                                            }}
                                        ></TouchableOpacity>
                                        <TextInput
                                            mode="outlined"
                                            label="Garage"
                                            style={{
                                                marginTop: 10,
                                                backgroundColor: "#f1f1f1",
                                                width: "100%",
                                            }}
                                            placeholder="Select Garage"
                                            value={isGarageName}
                                            right={
                                                <TextInput.Icon name="menu-down" />
                                            }
                                        />
                                    </View>
                                    {garageIdError?.length > 0 && (
                                        <Text style={styles.errorTextStyle}>
                                            {garageIdError}
                                        </Text>
                                    )}
                                </>
                            )}

                            <Text
                                style={[styles.headingStyle, { marginTop: 20 }]}
                            >
                                Vehicle Details:
                            </Text>

                            <>
                                <View>
                                    <TouchableOpacity
                                        style={styles.brandDropDownField}
                                        onPress={() => {
                                            setBrandListModal(true);
                                        }}
                                    ></TouchableOpacity>
                                    <TextInput
                                        mode="outlined"
                                        label="Brand"
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
                                </View>
                                {brandError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {brandError}
                                    </Text>
                                )}
                            </>

                            <>
                                <View>
                                    {modelFieldToggle == false && (
                                        <View
                                            style={[
                                                styles.modelDropDownField,
                                                {
                                                    zIndex: 10,
                                                    opacity: 0.6,
                                                    backgroundColor:
                                                        colors.white,
                                                },
                                            ]}
                                        ></View>
                                    )}
                                    <TouchableOpacity
                                        style={[
                                            styles.modelDropDownField,
                                            modelFieldToggle == false && {
                                                opacity: 0.5,
                                            },
                                        ]}
                                        onPress={() => {
                                            setModelListModal(true);
                                        }}
                                    ></TouchableOpacity>
                                    <TextInput
                                        mode="outlined"
                                        label="Vehicle Model"
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
                                </View>
                                {modelError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {modelError}
                                    </Text>
                                )}
                            </>

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

                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => setDisplayPurchaseCalender(true)}
                                activeOpacity={1}
                            >
                                <View
                                    style={styles.datePickerContainer}
                                    pointerEvents="none"
                                >
                                    <Icon
                                        style={styles.datePickerIcon}
                                        name="calendar-month"
                                        size={24}
                                        color="#000"
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Purchase Date"
                                        style={styles.datePickerField}
                                        placeholder="Purchase Date"
                                        value={datePurchase}
                                    />
                                    {displayPurchaseCalender == true && (
                                        <DateTimePicker
                                            value={
                                                isPurchaseDate
                                                    ? isPurchaseDate
                                                    : null
                                            }
                                            mode="date"
                                            onChange={
                                                changePurchaseSelectedDate
                                            }
                                            display="spinner"
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() =>
                                    setDisplayManufacturingCalender(true)
                                }
                                activeOpacity={1}
                            >
                                <View
                                    style={styles.datePickerContainer}
                                    pointerEvents="none"
                                >
                                    <Icon
                                        style={styles.datePickerIcon}
                                        name="calendar-month"
                                        size={24}
                                        color="#000"
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Manufacturing Date"
                                        style={styles.datePickerField}
                                        placeholder="Manufacturing Date"
                                        value={dateManufacturing}
                                    />
                                    {displayManufacturingCalender == true && (
                                        <DateTimePicker
                                            value={
                                                isManufacturingDate
                                                    ? isManufacturingDate
                                                    : null
                                            }
                                            mode="date"
                                            onChange={
                                                changeManufacturingSelectedDate
                                            }
                                            display="spinner"
                                        />
                                    )}
                                </View>
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

                            <View>
                                <TouchableOpacity
                                    style={
                                        styles.insuranceProviderDropDownField
                                    }
                                    onPress={() => {
                                        setInsuranceProviderListModal(true);
                                        setIsNewInsuranceProvider("");
                                        setNewInsuranceProviderError("");
                                    }}
                                ></TouchableOpacity>
                                <TextInput
                                    mode="outlined"
                                    label="Insurance Provider"
                                    style={{
                                        marginTop: 10,
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select Insurance Provider"
                                    value={isInsuranceProviderName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </View>
                            {insuranceProviderError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {insuranceProviderError}
                                </Text>
                            )}

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
                                style={{ flex: 1 }}
                                onPress={() =>
                                    setDisplayInsuranceExpiryCalender(true)
                                }
                                activeOpacity={1}
                            >
                                <View
                                    style={styles.datePickerContainer}
                                    pointerEvents="none"
                                >
                                    <Icon
                                        style={styles.datePickerIcon}
                                        name="calendar-month"
                                        size={24}
                                        color="#000"
                                    />
                                    <TextInput
                                        mode="outlined"
                                        label="Insurance Expiry Date"
                                        style={styles.datePickerField}
                                        placeholder="Insurance Expiry Date"
                                        value={dateInsuranceExpiry}
                                    />
                                    {displayInsuranceExpiryCalender == true && (
                                        <DateTimePicker
                                            value={
                                                isInsuranceExpiryDate
                                                    ? isInsuranceExpiryDate
                                                    : null
                                            }
                                            mode="date"
                                            onChange={
                                                changeInsuranceExpirySelectedDate
                                            }
                                            display="spinner"
                                        />
                                    )}
                                </View>
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
                )}
                <Portal>
                    <Modal
                        visible={addBrandModal}
                        onDismiss={() => {
                            setAddBrandModal(false);
                            setNewBrandName("");
                            setIsBrand(0);
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
                                setIsBrand(0);
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
                            setIsModel(0);
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
                                setIsModel(0);
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
                            setIsInsuranceProvider(0);
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
                                setIsInsuranceProvider(0);
                                setIsInsuranceProviderName("");
                                setInsuranceProviderError("");
                                setSearchQueryForInsuranceProviders("");
                                searchFilterForInsuranceProviders();
                            }}
                        />
                        {isLoadingInsuranceProviderList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
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
                                {filteredInsuranceProviderData?.length > 0 ? (
                                    <FlatList
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredInsuranceProviderData}
                                        // onEndReachedThreshold={1}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
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
                                                }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginVertical: 50,
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such insurance provider is
                                            associated!
                                        </Text>
                                    </View>
                                )}
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
                        )}
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
                                        setAddNewInsuranceProviderModal(false);
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
                            setIsGarageId(0);
                            setIsGarageName("");
                            setGarageError("");
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
                                setIsGarageId(0);
                                setIsGarageName("");
                                setGarageError("");
                                setSearchQueryForGarages("");
                                searchFilterForGarages();
                            }}
                        />
                        {isLoadingGarageList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
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
                                {filteredGarageData?.length > 0 ? (
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredGarageData}
                                        onEndReached={loadMoreGarages ? getGarageList : null}
                                        onEndReachedThreshold={0.5}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={garageRefreshing}
                                                onRefresh={onGarageRefresh}
                                                colors={["green"]}
                                            />
                                        }
                                        ListFooterComponent={loadMoreGarages ? renderGarageFooter : null}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
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
                                                }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginVertical: 50,
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such garage found!
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </Modal>

                    {/* Brand List Modal */}
                    <Modal
                        visible={brandListModal}
                        onDismiss={() => {
                            setBrandListModal(false);
                            setIsBrand(0);
                            setIsBrandName("");
                            setBrandError("");
                            setSearchQueryForBrands("");
                            searchFilterForBrands();
                            setModelFieldToggle(false);
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
                            Select Brand
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
                                setBrandListModal(false);
                                setIsBrand(0);
                                setIsBrandName("");
                                setBrandError("");
                                setSearchQueryForBrands("");
                                searchFilterForBrands();
                                setModelFieldToggle(false);
                            }}
                        />
                        {isLoadingBrandList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
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
                                {filteredBrandData?.length > 0 ? (
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredBrandData}
                                        onEndReached={loadMoreBrands ? getBrandList : null}
                                        onEndReachedThreshold={0.5}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={brandRefreshing}
                                                onRefresh={onBrandRefresh}
                                                colors={["green"]}
                                            />
                                        }
                                        ListFooterComponent={loadMoreBrands ? renderBrandFooter : null}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
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
                                                    setBrandListModal(false);
                                                }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginVertical: 50,
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such brand found!
                                        </Text>
                                    </View>
                                )}
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
                        )}
                    </Modal>

                    {/* Vehicle Model List Modal */}
                    <Modal
                        visible={modelListModal}
                        onDismiss={() => {
                            setModelListModal(false);
                            setIsModel(0);
                            setIsModelName("");
                            setModelError("");
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
                                setIsModel(0);
                                setIsModelName("");
                                setModelError("");
                                setSearchQueryForModels("");
                                searchFilterForModels();
                            }}
                        />
                        {isLoadingModelList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
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
                                {filteredModelData?.length > 0 ? (
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredModelData}
                                        onEndReached={loadMoreModels ? getModelList : null}
                                        onEndReachedThreshold={0.5}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={modelRefreshing}
                                                onRefresh={onModelRefresh}
                                                colors={["green"]}
                                            />
                                        }
                                        ListFooterComponent={loadMoreModels ? renderModelFooter : null}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
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
                                                    setModelListModal(false);
                                                }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such vehicle model found!
                                        </Text>
                                    </View>
                                )}
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
                        )}
                    </Modal>

                    {/* States List Modal */}
                    <Modal
                        visible={stateListModal}
                        onDismiss={() => {
                            setStateListModal(false);
                            setIsState();
                            setIsStateName("");
                            setStateError("");
                            setSearchQueryForStates("");
                            searchFilterForStates();
                            setCityFieldToggle(false);
                            setIsCity();
                            setIsCityName("");
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
                                setIsState();
                                setIsStateName("");
                                setStateError("");
                                setSearchQueryForStates("");
                                searchFilterForStates();
                                setCityFieldToggle(false);
                                setIsCity();
                                setIsCityName("");
                            }}
                        />
                        {isLoadingStateList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
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
                                {filteredStateData?.length > 0 ? (
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredStateData}
                                        // onEndReachedThreshold={1}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
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
                                                }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginVertical: 50,
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such state is associated!
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </Modal>

                    {/* City List Modal */}
                    <Modal
                        visible={cityListModal}
                        onDismiss={() => {
                            setCityListModal(false);
                            setIsCity(0);
                            setIsCityName("");
                            setCityError("");
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
                                setIsCity(0);
                                setIsCityName("");
                                setCityError("");
                                setSearchQueryForCity("");
                                searchFilterForCity();
                            }}
                        />
                        {isLoadingCityList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
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
                                {filteredCityData?.length > 0 ? (
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredCityData}
                                        // onEndReachedThreshold={1}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <>
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
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginVertical: 50,
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such city is associated!
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </Modal>
                </Portal>
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

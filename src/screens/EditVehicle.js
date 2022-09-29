import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity,
    Pressable,
    Image,
    RefreshControl,
    FlatList,
    Alert,
    Platform,
} from "react-native";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL, WEB_URL } from "../constants/config";
import {
    Button,
    Divider,
    Modal,
    Portal,
    TextInput,
    List,
    Searchbar,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import InputScrollView from "react-native-input-scroll-view";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Lightbox from "react-native-lightbox-v2";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";
import BrandComponent from "../Component/BrandComponent";
import VehicalModalComponet from "../Component/VehicalModalComponet";

const EditVehicle = ({
    navigation,
    userToken,
    route,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    // Vehicle Fields
    const [isVehicleRegistrationNumber, setIsVehicleRegistrationNumber] =
        useState();
    const [isPurchaseDate, setIsPurchaseDate] = useState();
    const [isManufacturingDate, setIsManufacturingDate] = useState();
    const [isEngineNumber, setIsEngineNumber] = useState();
    const [isChasisNumber, setIsChasisNumber] = useState();
    const [isInsurerGstin, setIsInsurerGstin] = useState();
    const [isInsurerAddress, setIsInsurerAddress] = useState();
    const [isPolicyNumber, setIsPolicyNumber] = useState();
    const [isInsuranceExpiryDate, setIsInsuranceExpiryDate] = useState();
    const [isRegistrationCertificateImg, setIsRegistrationCertificateImg] =
        useState(null);
    const [isInsuranceImg, setIsInsuranceImg] = useState(null);

    const [vehicleRegistrationNumberError, setVehicleRegistrationNumberError] =
        useState("");
    const [purchaseDateError, setPurchaseDateError] = useState("");
    const [manufacturingDateError, setManufacturingDateError] = useState("");
    const [engineNumberError, setEngineNumberError] = useState("");
    const [chasisNumberError, setChasisNumberError] = useState("");
    const [insurerGstinError, setInsurerGstinError] = useState("");
    const [insurerAddressError, setinsurerAddressError] = useState("");
    const [policyNumberError, setPolicyNumberError] = useState("");
    const [insuranceExpiryDateError, setInsuranceExpiryDateError] =
        useState("");
    const [
        registrationCertificateImgError,
        setRegistrationCertificateImgError,
    ] = useState("");
    const [insuranceImgError, setInsuranceImgError] = useState("");

    const [selectedVehicle, setSelectedVehicle] = useState(0);
    const [selectedVehicleData, setSelectedVehicleData] = useState();
    const [vehicleList, setVehicleList] = useState([]);
    const [modelFieldToggle, setModelFieldToggle] = useState(true);

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

    const [isLoading, setIsLoading] = useState(true);

    const [
        isNewRegistrationCertificateImg,
        setIsNewRegistrationCertificateImg,
    ] = useState(null);
    const [isNewInsuranceImg, setIsNewInsuranceImg] = useState(null);
    const [isRegistrationCrtImgLoading, setIsRegistrationCrtImgLoading] =
        useState(false);
    const [isInsurancePolicyImgLoading, setIsInsurancePolicyImgLoading] =
        useState(false);

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
    const [insuranceProviderListModal, setInsuranceProviderListModal] =useState(false);
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

    const [resizeImage, setResizeImage] = useState("cover");

    const isVehicalNumRef = useRef();
    const scrollViewRef = useRef();

    const getVehicleDetails = async (option) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_vehicle_data?id=${option}`,
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
                setSelectedVehicleData(json.vehicle_details);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        }
    };

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
                setIsBrandName(json.data.name);
                setIsBrand(json.data.id);
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
            setIsNewRegistrationCertificateImg(res[0]);
            setIsRegistrationCrtImgLoading(true);
        } catch (err) {
            setIsNewRegistrationCertificateImg(null);
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

    useEffect(() => {
        if (isNewRegistrationCertificateImg != null)
            uploadRegistrationCrtImage();
    }, [isNewRegistrationCertificateImg]);

    useEffect(() => {
        if (isNewInsuranceImg != null) uploadInsurancePolicyImage();
    }, [isNewInsuranceImg]);

    const uploadRegistrationCrtImage = async () => {
        if (isNewRegistrationCertificateImg != null) {
            const fileToUpload = isNewRegistrationCertificateImg;
            const data = new FormData();
            data.append("registration_certificate_img", fileToUpload);
            let res = await fetch(
                `${API_URL}update_registration_certificate_img/${selectedVehicle}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data; ",
                        Authorization: "Bearer " + userToken,
                    },
                    body: data,
                }
            );
            let responseJson = await res.json();
            if (responseJson.message == true) {
                fetchRegistrationCrtImg();
            }
        } else {
            console.log("Please Select File first");
        }
    };

    const fetchRegistrationCrtImg = async () => {
        try {
            const res = await fetch(
                `${API_URL}fetch_vehicle_data?id=${selectedVehicle}`,
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
                setIsRegistrationCertificateImg(
                    json.vehicle_details.registration_certificate_img
                );
                setIsRegistrationCrtImgLoading(false);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        }
    };

    const selectInsurancePolicyImg = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            setIsNewInsuranceImg(res[0]);
            setIsInsurancePolicyImgLoading(true);
        } catch (err) {
            setIsNewInsuranceImg(null);
            if (DocumentPicker.isCancel(err)) {
                setInsuranceImgError("Canceled");
            } else {
                setInsuranceImgError("Unknown Error: " + JSON.stringify(err));
                throw err;
            }
        }
    };

    const uploadInsurancePolicyImage = async () => {
        if (isNewInsuranceImg != null) {
            const fileToUpload = isNewInsuranceImg;
            const data = new FormData();
            data.append("insurance_img", fileToUpload);
            let res = await fetch(
                `${API_URL}update_insurance_img/${selectedVehicle}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data; ",
                        Authorization: "Bearer " + userToken,
                    },
                    body: data,
                }
            );
            let responseJson = await res.json();
            if (responseJson.message == true) {
                fetchInsurancePolicyImage();
            } 
        } else {
            console.log("Please Select File first");
        }
    };

    const fetchInsurancePolicyImage = async () => {
        try {
            const res = await fetch(
                `${API_URL}fetch_vehicle_data?id=${selectedVehicle}`,
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
                setIsInsuranceImg(json.vehicle_details.insurance_img);
                setIsInsurancePolicyImgLoading(false);
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        }
    };

    const changePurchaseSelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || datePurchase;
            let formattedDate = moment(currentDate, "YYYY MMMM D").format(
                "DD-MM-YYYY"
            );
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            // let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsPurchaseDate(new Date(currentDate));
        } else if(event.type == 'dismissed') {
            setDisplayPurchaseCalender(false);
        }
    };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || dateManufacturing;
            let formattedDate = moment(currentDate, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
            );
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            // let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsManufacturingDate(new Date(currentDate));
        } else if(event.type == 'dismissed') {
            setDisplayManufacturingCalender(false);
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null && event.type == 'set') {
            let currentDate = selectedDate || dateInsuranceExpiry;
            let formattedDate = moment(currentDate, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
            );
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            // let formateDateForDatabase = moment(
            //     currentDate,
            //     'YYYY-MM-DD"T"hh:mm ZZ'
            // ).format("YYYY-MM-DD");
            setIsInsuranceExpiryDate(new Date(currentDate));
            // console.log(
            //     "setIsInsuranceExpiryDate",
            //     currentDate,
            //     "formateDateForDatabase",
            //     formateDateForDatabase
            // );
        } else if(event.type == 'dismissed') {
            setDisplayInsuranceExpiryCalender(false);
        }
    };

    const validate = (show = false) => {
        if (!show) {
            return !(
                !isBrand ||
                isBrand === 0 ||
                !isModel ||
                isModel === 0 ||
                !isVehicleRegistrationNumber ||
                isVehicleRegistrationNumber?.trim().length === 0
            );
        } else {
            if (!isBrand ||
                isBrand === 0) {
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
                return false;
            }
            if (!isModel ||
                isModel === 0) {
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
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
            if (!isBrand || isBrand === 0) setBrandError("Brand is required");
            if (!isModel || isModel === 0) setModelError("Model is required");
            if (
                !isVehicleRegistrationNumber ||
                isVehicleRegistrationNumber?.trim().length === 0
            )
                setVehicleRegistrationNumberError(
                    "Vehicle Registration Number is required"
                );
            return;
        }

        const data = {
            brand_id: JSON.stringify(isBrand),
            model_id: JSON.stringify(isModel),
            vehicle_registration_number: isVehicleRegistrationNumber?.toUpperCase()?.trim(),
            user_id: parseInt(route?.params?.userId),
        };

        // optional Fields
        if(isPurchaseDate) data['purchase_date'] = moment(isPurchaseDate, 'YYYY-MM-DD"T"hh:mm ZZ').format("YYYY-MM-DD")
        if(isManufacturingDate) data['manufacturing_date'] = moment(isManufacturingDate, 'YYYY-MM-DD"T"hh:mm ZZ').format("YYYY-MM-DD")
        if(isInsuranceExpiryDate) data['insurance_expiry_date'] = moment(isInsuranceExpiryDate, 'YYYY-MM-DD"T"hh:mm ZZ').format("YYYY-MM-DD")
        if(isEngineNumber) data['engine_number'] = isEngineNumber
        if(isChasisNumber) data['chasis_number'] = isChasisNumber
        if(isInsuranceProvider) data['insurance_id'] = isInsuranceProvider
        if(isInsurerGstin) data['insurer_gstin'] = isInsurerGstin
        if(isInsurerAddress) data['insurer_address'] = isInsurerAddress
        if(isPolicyNumber) data['policy_number'] = isPolicyNumber

        UpdateVehicle(data);
    };

    const UpdateVehicle = async (data) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}update_vehicle/${selectedVehicle}`,
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        // 'Accept': '*/*',
                        // 'Content-Type': 'multipart/form-data; ',
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify(data),
                }
            )
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
                    console.log(JSON.stringify(res));
                    if (res.statusCode == 200) {
                        // console.log("Vehicle Updated SuccessFully");
                        navigation.navigate("CustomerDetails", {userId: route?.params?.userId});
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
            // navigation.navigate('AllStack', { screen: 'CustomerDetails', params: { userId: route?.params?.userId } });
        }
    };

    const getVehicleList = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}fetch_customer_vehicles?user_id=${route?.params?.userId}`,
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
                setVehicleList(json.user_vehicles.vehicles);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getBrandList = async () => {
        setIsLoading(true)
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
        setIsLoading(true)
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
                    body: JSON.stringify({
                        brand_id: isBrand,
                        search: searchQueryForModels,
                    }),
                }
            );
            const json = await res.json();
            // console.log("model_json", json);
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
            if (res.status == 200 || res.status == 201){
                // console.log("setInsuranceProviderList", json.data);
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
                // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase()
                let itemData = listData.name
                    ? listData.name.toUpperCase()
                    : "".toUpperCase();
                // let itemData = arr1.concat(arr2);
                // console.log(itemData);
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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setInsuranceProviderList', json.data);
                setInsuranceProviderList(json.insurance_provider_list);
                setFilteredInsuranceProviderData(json.insurance_provider_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (selectedVehicleData != 0) {
            console.log(selectedVehicle);
            if (selectedVehicleData?.brand_id)
                setIsBrand(parseInt(selectedVehicleData.brand_id));
            if (selectedVehicleData?.model_id)
                setIsModel(parseInt(selectedVehicleData.model_id));
            if (selectedVehicleData?.brand?.name)
                setIsBrandName(selectedVehicleData.brand?.name);
            if (selectedVehicleData?.vehicle_model?.model_name)
                setIsModelName(selectedVehicleData?.vehicle_model?.model_name);

            if (selectedVehicleData?.vehicle_registration_number)
                setIsVehicleRegistrationNumber(
                    selectedVehicleData.vehicle_registration_number
                );
            if (selectedVehicleData?.purchase_date) {
                setIsPurchaseDate(new Date(selectedVehicleData?.purchase_date));
                let formattedPurchaseDate = moment(
                    selectedVehicleData?.purchase_date,
                    "YYYY-MM-DD"
                ).format("DD-MM-YYYY");
                setDisplayPurchaseCalender(false);
                setDatePurchase(formattedPurchaseDate);
            }
            if (selectedVehicleData?.manufacturing_date) {
                setIsManufacturingDate(
                    new Date(selectedVehicleData?.manufacturing_date)
                );
                let formattedManufacturingDate = moment(
                    selectedVehicleData?.manufacturing_date,
                    "YYYY-MM-DD"
                ).format("DD-MM-YYYY");
                setDisplayManufacturingCalender(false);
                setDateManufacturing(formattedManufacturingDate);
            }
            if (selectedVehicleData?.engine_number)
                setIsEngineNumber(selectedVehicleData.engine_number);
            if (selectedVehicleData?.chasis_number)
                setIsChasisNumber(selectedVehicleData.chasis_number);
            if (selectedVehicleData?.insurance_id)
                setIsInsuranceProvider(
                    parseInt(selectedVehicleData.insurance_id)
                );
            if (selectedVehicleData?.insurance_provider?.name)
                setIsInsuranceProviderName(
                    selectedVehicleData.insurance_provider.name
                );
            if (selectedVehicleData?.insurer_gstin)
                setIsInsurerGstin(selectedVehicleData.insurer_gstin);
            if (selectedVehicleData?.insurer_address)
                setIsInsurerAddress(selectedVehicleData.insurer_address);
            if (selectedVehicleData?.policy_number)
                setIsPolicyNumber(selectedVehicleData.policy_number);
            if (selectedVehicleData?.insurance_expiry_date) {
                setIsInsuranceExpiryDate(
                    new Date(selectedVehicleData?.insurance_expiry_date)
                );
                let formattedInsuranceExpiryDate = moment(
                    selectedVehicleData?.insurance_expiry_date,
                    "YYYY-MM-DD"
                ).format("DD-MM-YYYY");
                setDisplayInsuranceExpiryCalender(false);
                setDateInsuranceExpiry(formattedInsuranceExpiryDate);
            }
            if (selectedVehicleData?.registration_certificate_img != null)
                setIsRegistrationCertificateImg(
                    selectedVehicleData.registration_certificate_img
                );
            if (selectedVehicleData?.insurance_img != null)
                setIsInsuranceImg(selectedVehicleData.insurance_img);
            if (selectedVehicleData?.registration_certificate_img != null)
                console.log(
                    WEB_URL +
                        "uploads/registration_certificate_img/" +
                        isRegistrationCertificateImg
                );
        }
        setIsLoading(false);
    }, [selectedVehicleData]);

    useEffect(() => {
        getVehicleList();
        getBrandList();
        getInsuranceProviderList();
        console.log('editVehicle Screen');
    }, []);

    useEffect(() => {
        if (isBrand != undefined && selectedVehicleData != undefined) {
            setIsLoading(true);
            pullModelRefresh();
            setModelFieldToggle(true);
        }
    }, [isBrand]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.pageContainer}>
                {!isLoading && 
                    (vehicleList.length > 0 ? 
                        <InputScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: "flex-start",
                            }}
                            keyboardOffset={200}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardShouldPersistTaps={"always"}
                            showsVerticalScrollIndicator={false}
                        >
                            <View>
                                <Text style={[styles.headingStyle]}>
                                    Your Vehicle
                                </Text>
                                <View
                                    style={[
                                        styles.dropDownContainer,
                                        { marginTop: 10, marginBottom: 20 },
                                    ]}
                                >
                                    <Picker
                                        selectedValue={selectedVehicle}
                                        onValueChange={(option) => {
                                            setSelectedVehicle(option);
                                            getVehicleDetails(option);
                                        }}
                                        style={styles.dropDownField}
                                        itemStyle={{ padding: 0 }}
                                    >
                                        <Picker.Item
                                            label="Select vehicle by registration number"
                                            value="0"
                                        />
                                        {vehicleList.map((vehicleList, i) => {
                                            return (
                                                <Picker.Item
                                                    key={i}
                                                    label={
                                                        vehicleList.vehicle_registration_number
                                                    }
                                                    value={vehicleList.id}
                                                />
                                            );
                                        })}
                                    </Picker>
                                </View>

                                {selectedVehicle != 0 &&
                                    <View>
                                        <Text style={[styles.headingStyle]}>
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
                                        {vehicleRegistrationNumberError?.length >
                                            0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {vehicleRegistrationNumberError}
                                            </Text>
                                        )}

                                        <TouchableOpacity
                                            style={{ flex: 1, marginTop: 20 }}
                                            onPress={() =>
                                                setDisplayPurchaseCalender(true)
                                            }
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
                                            {displayPurchaseCalender ==
                                                true && (
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
                                        {purchaseDateError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {purchaseDateError}
                                            </Text>
                                        )}

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
                                            {displayManufacturingCalender ==
                                                true && (
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
                                        {manufacturingDateError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {manufacturingDateError}
                                            </Text>
                                        )}

                                        <TextInput
                                            mode="outlined"
                                            label="Engine Number"
                                            style={styles.input}
                                            placeholder="Engine Number"
                                            value={isEngineNumber}
                                            onChangeText={(text) =>
                                                setIsEngineNumber(text)
                                            }
                                        />
                                        {engineNumberError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {engineNumberError}
                                            </Text>
                                        )}

                                        <TextInput
                                            mode="outlined"
                                            label="Chasis Number"
                                            style={styles.input}
                                            placeholder="Chasis Number"
                                            value={isChasisNumber}
                                            onChangeText={(text) =>
                                                setIsChasisNumber(text)
                                            }
                                        />
                                        {chasisNumberError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {chasisNumberError}
                                            </Text>
                                        )}

                                        <View style={{marginTop: 20}}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setInsuranceProviderListModal(
                                                        true
                                                    );
                                                    setIsNewInsuranceProvider("");
                                                    setNewInsuranceProviderError(
                                                        ""
                                                    );
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
                                                    value={isInsuranceProviderName}
                                                    editable={false}
                                                    right={
                                                        <TextInput.Icon name="menu-down" />
                                                    }
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
                                            onChangeText={(text) =>
                                                setIsInsurerGstin(text)
                                            }
                                        />
                                        {insurerGstinError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {insurerGstinError}
                                            </Text>
                                        )}

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
                                        {insurerAddressError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {insurerAddressError}
                                            </Text>
                                        )}

                                        <TextInput
                                            mode="outlined"
                                            label="Policy Number"
                                            style={styles.input}
                                            placeholder="Policy Number"
                                            value={isPolicyNumber}
                                            onChangeText={(text) =>
                                                setIsPolicyNumber(text)
                                            }
                                        />
                                        {policyNumberError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {policyNumberError}
                                            </Text>
                                        )}

                                        <TouchableOpacity
                                            style={{ flex: 1, marginTop: 20 }}
                                            onPress={() =>
                                                setDisplayInsuranceExpiryCalender(
                                                    true
                                                )
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
                                            {displayInsuranceExpiryCalender ==
                                                true && (
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
                                        {insuranceExpiryDateError?.length > 0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {insuranceExpiryDateError}
                                            </Text>
                                        )}

                                        <Text
                                            style={[
                                                styles.headingStyle,
                                                { marginTop: 20 },
                                            ]}
                                        >
                                            Registration Certificate:
                                        </Text>
                                        {isRegistrationCrtImgLoading == true ? (
                                            <ActivityIndicator
                                                style={{
                                                    flex: 1,
                                                    jusifyContent: "center",
                                                    alignItems: "center",
                                                    marginVertical: 20,
                                                }}
                                            ></ActivityIndicator>
                                        ) : isRegistrationCertificateImg !==
                                            null ? (
                                            <View
                                                style={{
                                                    position: "relative",
                                                    flex: 1,
                                                    marginTop: 20,
                                                    width: 150,
                                                }}
                                            >
                                                <Lightbox
                                                    onOpen={() =>
                                                        setResizeImage("contain")
                                                    }
                                                    willClose={() =>
                                                        setResizeImage("cover")
                                                    }
                                                    activeProps={styles.activeImage}
                                                    navigator={navigator}
                                                    style={styles.lightBoxWrapper}
                                                >
                                                    <Image
                                                        resizeMode={resizeImage}
                                                        style={styles.verticleImage}
                                                        source={{
                                                            uri:
                                                                WEB_URL +
                                                                "uploads/registration_certificate_img/" +
                                                                isRegistrationCertificateImg,
                                                        }}
                                                    />
                                                </Lightbox>
                                                <Icon
                                                    style={styles.iconChangeImage}
                                                    onPress={
                                                        selectRegistrationCrtImg
                                                    }
                                                    name={"camera"}
                                                    size={16}
                                                    color={colors.white}
                                                />
                                            </View>
                                        ) : (
                                            <>
                                                <Text
                                                    style={styles.cardDetailsData}
                                                >
                                                    Customer has not uploaded
                                                    Registration Certificate!
                                                </Text>
                                                {isNewRegistrationCertificateImg !=
                                                null ? (
                                                    <Text style={styles.textStyle}>
                                                        File Name:{" "}
                                                        {isNewRegistrationCertificateImg?.name
                                                            ? isNewRegistrationCertificateImg?.name
                                                            : null}
                                                    </Text>
                                                ) : null}
                                                <Pressable
                                                    onPress={
                                                        selectRegistrationCrtImg
                                                    }
                                                >
                                                    <Text style={styles.uploadBtn}>
                                                        Upload
                                                    </Text>
                                                </Pressable>
                                            </>
                                        )}
                                        {registrationCertificateImgError?.length >
                                            0 && (
                                            <Text style={styles.errorTextStyle}>
                                                {registrationCertificateImgError}
                                            </Text>
                                        )}

                                        <Divider />
                                        <Text
                                            style={[
                                                styles.headingStyle,
                                                { marginTop: 20 },
                                            ]}
                                        >
                                            Insurance Policy:
                                        </Text>
                                        {isInsurancePolicyImgLoading == true ? (
                                            <ActivityIndicator
                                                style={{
                                                    flex: 1,
                                                    jusifyContent: "center",
                                                    alignItems: "center",
                                                    marginVertical: 20,
                                                }}
                                            ></ActivityIndicator>
                                        ) : isInsuranceImg !== null ? (
                                            <View
                                                style={{
                                                    position: "relative",
                                                    marginTop: 20,
                                                    width: 150,
                                                }}
                                            >
                                                <Lightbox
                                                    onOpen={() =>
                                                        setResizeImage("contain")
                                                    }
                                                    willClose={() =>
                                                        setResizeImage("cover")
                                                    }
                                                    activeProps={styles.activeImage}
                                                    navigator={navigator}
                                                    style={styles.lightBoxWrapper}
                                                >
                                                    <Image
                                                        resizeMode={resizeImage}
                                                        style={styles.verticleImage}
                                                        source={{
                                                            uri:
                                                                WEB_URL +
                                                                "uploads/insurance_img/" +
                                                                isInsuranceImg,
                                                        }}
                                                    />
                                                </Lightbox>
                                                <Icon
                                                    style={styles.iconChangeImage}
                                                    onPress={
                                                        selectInsurancePolicyImg
                                                    }
                                                    name={"camera"}
                                                    size={16}
                                                    color={colors.white}
                                                />
                                            </View>
                                        ) : (
                                            <>
                                                <Text
                                                    style={styles.cardDetailsData}
                                                >
                                                    Customer has not uploaded
                                                    Insurance Policy!
                                                </Text>
                                                {isNewInsuranceImg != null ? (
                                                    <Text style={styles.textStyle}>
                                                        File Name:{" "}
                                                        {isNewInsuranceImg?.name
                                                            ? isNewInsuranceImg?.name
                                                            : null}
                                                    </Text>
                                                ) : null}
                                                <Pressable
                                                    onPress={
                                                        selectInsurancePolicyImg
                                                    }
                                                >
                                                    <Text style={styles.uploadBtn}>
                                                        Upload
                                                    </Text>
                                                </Pressable>
                                            </>
                                        )}
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
                                }
                            </View>
                            <Portal>
                                <Modal
                                    visible={addBrandModal}
                                    onDismiss={() => {
                                        setAddBrandModal(false);
                                        setNewBrandName("");
                                        setNewBrandNameError();
                                        setBrandListModal(true);
                                    }}
                                    contentContainerStyle={
                                        styles.modalContainerStyle
                                    }
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
                                            setAddBrandModal(false);
                                            setNewBrandName("");
                                            setNewBrandNameError();
                                            setBrandListModal(true);
                                        }}
                                    />
                                    <Text
                                        style={[
                                            styles.headingStyle,
                                            { marginTop: 0, alignSelf: "center" },
                                        ]}
                                    >
                                        Add New Brand
                                    </Text>
                                    <TextInput
                                        mode="outlined"
                                        label="Brand Name"
                                        style={styles.input}
                                        placeholder="Brand Name"
                                        value={newBrandName}
                                        onChangeText={(text) =>
                                            setNewBrandName(text)
                                        }
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
                                    contentContainerStyle={
                                        styles.modalContainerStyle
                                    }
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
                                            setAddModelModal(false);
                                            setNewModelName("");
                                            setNewModelNameError();
                                            setModelListModal(true);
                                        }}
                                    />
                                    <Text
                                        style={[
                                            styles.headingStyle,
                                            { marginTop: 0, alignSelf: "center" },
                                        ]}
                                    >
                                        Add New Model
                                    </Text>
                                    <TextInput
                                        mode="outlined"
                                        label="Model Name"
                                        style={styles.input}
                                        placeholder="Model Name"
                                        value={newModelName}
                                        onChangeText={(text) =>
                                            setNewModelName(text)
                                        }
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
                                    <Text
                                        style={[
                                            styles.headingStyle,
                                            { marginTop: 0, alignSelf: "center" },
                                        ]}
                                    >
                                        Select Insurance Provider
                                    </Text>
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
                                            value={
                                                searchQueryForInsuranceProviders
                                            }
                                            elevation={0}
                                            style={{
                                                elevation: 0.8,
                                                marginBottom: 10,
                                            }}
                                        />
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                            data={
                                                filteredInsuranceProviderData
                                            }
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
                                                            No insurance company found!
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
                                                                    display:
                                                                        "flex",
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
                                                                    {
                                                                        item.name
                                                                    }
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
                                                    backgroundColor:
                                                        colors.primary,
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
                                                <Text
                                                    style={{
                                                        color: colors.white,
                                                    }}
                                                >
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
                                    contentContainerStyle={
                                        styles.modalContainerStyle
                                    }
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
                                            setAddNewInsuranceProviderModal(false);
                                            setInsuranceProviderListModal(true);
                                            setIsNewInsuranceProvider();
                                            setNewInsuranceProviderError("");
                                        }}
                                    />
                                    <Text
                                        style={[
                                            styles.headingStyle,
                                            { marginTop: 0, alignSelf: "center" },
                                        ]}
                                    >
                                        Add New Insurance Provider
                                    </Text>
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
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            marginTop: 10,
                                        }}
                                    >
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
                                                    setAddNewInsuranceProviderModal(
                                                        false
                                                    );
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
                                                setAddNewInsuranceProviderModal(
                                                    false
                                                );
                                                setInsuranceProviderListModal(true);
                                                setIsNewInsuranceProvider("");
                                                setNewInsuranceProviderError("");
                                            }}
                                        >
                                            Close
                                        </Button>
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

                            </Portal>
                        </InputScrollView>
                : 
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{ color: colors.black, textAlign: "center" }}
                        >
                            No Vehicle is associated with this Customer!
                        </Text>
                    </View>
                )}
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
    cardDetailsHeading: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: "bold",
        marginTop: 15,
    },
    cardDetailsData: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
    },
    uploadBtn: {
        color: colors.primary,
        marginBottom: 10,
    },
    iconChangeImage: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: colors.black,
        padding: 5,
        borderRadius: 500,
        zIndex: 10,
    },
    verticleImage: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    activeImage: {
        width: "100%",
        height: null,
        resizeMode: "contain",
        borderRadius: 0,
        flex: 1,
    },
    lightBoxWrapper: {
        width: 150,
        height: 150,
        marginBottom: 10,
        overflow: "hidden",
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
    footer: {
        marginVertical: 15,
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
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(EditVehicle);

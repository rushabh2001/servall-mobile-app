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

    const [isLoading, setIsLoading] = useState(false);
    const [isScreenLoading, setIsScreenLoading] = useState(true);

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
    const [isLoadingBrandList, setIsLoadingBrandList] = useState(true);
    const [filteredBrandData, setFilteredBrandData] = useState([]);
    const [searchQueryForBrands, setSearchQueryForBrands] = useState();
    const [brandError, setBrandError] = useState(""); // Error State

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

    const [resizeImage, setResizeImage] = useState("cover");

    const scroll1Ref = useRef();

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
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        }
    };

    // const addNewInsuranceCompany = async () => {
    //     let data = {'name': newInsuranceCompanyName}
    //     try {
    //         const res = await fetch(`${API_URL}add_insurance_provider`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //             body: JSON.stringify(data)
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             await getInsuranceProviderList();
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setAddInsuranceCompanyModal(false);
    //         setNewInsuranceCompanyName("");
    //         setIsInsuranceProvider(0);
    //     }
    // };

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
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        } finally {
            setIsRegistrationCrtImgLoading(false);
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
            } else {
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
            }
        } catch (e) {
            console.log(e);
            return alert(e);
        } finally {
            setIsInsurancePolicyImgLoading(false);
        }
    };

    const changePurchaseSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || datePurchase;
            let formattedDate = moment(currentDate, "YYYY MMMM D").format(
                "DD-MM-YYYY"
            );
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            // let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsPurchaseDate(new Date(currentDate));
        }
    };

    const changeManufacturingSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateManufacturing;
            let formattedDate = moment(currentDate, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
            );
            setDisplayManufacturingCalender(false);
            setDateManufacturing(formattedDate);
            // let formateDateForDatabase = moment(currentDate, 'YYYY-MM-DD"T"hh:mm ZZ').format('YYYY-MM-DD');
            setIsManufacturingDate(new Date(currentDate));
        }
    };

    const changeInsuranceExpirySelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || dateInsuranceExpiry;
            let formattedDate = moment(currentDate, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
            );
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            let formateDateForDatabase = moment(
                currentDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD");
            setIsInsuranceExpiryDate(new Date(formateDateForDatabase));
            console.log(
                "setIsInsuranceExpiryDate",
                currentDate,
                "formateDateForDatabase",
                formateDateForDatabase
            );
        }
    };

    const validate = () => {
        return !(
            !isBrand ||
            isBrand === 0 ||
            !isModel ||
            isModel === 0 ||
            !isVehicleRegistrationNumber ||
            isVehicleRegistrationNumber?.trim().length === 0
        );
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
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
            brand_id: isBrand,
            model_id: isModel,
            vehicle_registration_number: isVehicleRegistrationNumber,
            purchase_date: moment(
                isPurchaseDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD"),
            manufacturing_date: moment(
                isManufacturingDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD"),
            engine_number: isEngineNumber,
            chasis_number: isChasisNumber,
            insurance_id: isInsuranceProvider,
            insurer_gstin: isInsurerGstin,
            insurer_address: isInsurerAddress,
            policy_number: isPolicyNumber,
            insurance_expiry_date: moment(
                isInsuranceExpiryDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD"),
            user_id: parseInt(route?.params?.userId),
        };

        UpdateVehicle(data);
    };

    const UpdateVehicle = async (data) => {
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
                    console.log(JSON.stringify(res));
                    if (res.statusCode == 400) {
                        {
                            res.data.message.brand_id &&
                                setBrandError(res.data.message.brand_id);
                        }
                        {
                            res.data.message.model_id &&
                                setModelError(res.data.message.model_id);
                        }
                        {
                            res.data.message.vehicle_registration_number &&
                                setVehicleRegistrationNumberError(
                                    res.data.message.vehicle_registration_number
                                );
                        }
                        return;
                    } else if (res.statusCode == 200) {
                        console.log(res);
                        console.log("Vehicle Updated SuccessFully");
                        navigation.navigate("CustomerDetails", {userId: route?.params?.userId});
                    }
                });
        } catch (e) {
            console.log(e);
            // navigation.navigate('AllStack', { screen: 'CustomerDetails', params: { userId: route?.params?.userId } });
        } finally {
            setIsLoading(false);
        }
    };

    const getVehicleList = async () => {
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
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsScreenLoading(false);
        }
    };

    const getBrandList = async () => {
        {
            brandPage == 1 && setIsLoadingBrandList(true);
        }
        {
            brandPage != 1 && setIsBrandScrollLoading(true);
        }
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

                // setBrandList(json.brand_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            {
                brandPage == 1 && setIsLoadingBrandList(false);
            }
            {
                brandPage != 1 && setIsBrandScrollLoading(false);
            }
            setBrandPage(brandPage + 1);
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
                setBrandPage(2);
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
                setBrandPage(2);
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
                // setModelList(json.vehicle_model_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            {
                modelPage == 1 && setIsLoadingModelList(false);
            }
            {
                modelPage != 1 && setIsModelScrollLoading(false);
            }
            setModelPage(modelPage + 1);
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
                setModelPage(2);
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
                setModelPage(2);
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
            // console.log(json);
            if (json !== undefined) {
                console.log("setInsuranceProviderList", json.data);
                // setIsLoading2(true);
                getInsuranceProviderList();
                setIsInsuranceProvider(
                    parseInt(json.insurance_provider_list.id)
                );
                setIsInsuranceProviderName(json.insurance_provider_list.name);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(true);
            // setAddInsuranceProviderModal(true);
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
            // console.log(json);
            if (json !== undefined) {
                // console.log('setInsuranceProviderList', json.data);
                setInsuranceProviderList(json.insurance_provider_list);
                setFilteredInsuranceProviderData(json.insurance_provider_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            // setIsLoading2(false);
            setIsLoadingInsuranceProviderList(false);
        }
    };
    // const getInsuranceProviderList = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_insurance_provider`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             setInsuranceProviderList(json.insurance_provider_list);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

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
    }, []);

    useEffect(() => {
        if (isBrand != undefined && selectedVehicleData != undefined) {
            setIsLoadingModelList(true);
            pullModelRefresh();
            setModelFieldToggle(true);
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
                {isScreenLoading == true ? (
                    <ActivityIndicator
                        style={{
                            flex: 1,
                            jusifyContent: "center",
                            alignItems: "center",
                        }}
                    ></ActivityIndicator>
                ) : vehicleList.length > 0 ? (
                    <InputScrollView
                        ref={scroll1Ref}
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

                            {isLoading == true ? (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                    }}
                                >
                                    <ActivityIndicator></ActivityIndicator>
                                </View>
                            ) : selectedVehicle != 0 ? (
                                <View>
                                    <Text style={[styles.headingStyle]}>
                                        Vehicle Details:
                                    </Text>
                                    <>
                                        <View>
                                            <TouchableOpacity
                                                style={
                                                    styles.brandDropDownField
                                                }
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
                                                    modelFieldToggle ==
                                                        false && {
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

                                    {/*  <View style={styles.dropDownContainer}>
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
                                            } */}

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
                                    {vehicleRegistrationNumberError?.length >
                                        0 && (
                                        <Text style={styles.errorTextStyle}>
                                            {vehicleRegistrationNumberError}
                                        </Text>
                                    )}

                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={() =>
                                            setDisplayPurchaseCalender(true)
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
                                                label="Purchase Date"
                                                style={styles.datePickerField}
                                                placeholder="Purchase Date"
                                                value={datePurchase}
                                            />
                                            {displayPurchaseCalender ==
                                                true && (
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
                                    {purchaseDateError?.length > 0 && (
                                        <Text style={styles.errorTextStyle}>
                                            {purchaseDateError}
                                        </Text>
                                    )}

                                    <TouchableOpacity
                                        style={{ flex: 1 }}
                                        onPress={() =>
                                            setDisplayManufacturingCalender(
                                                true
                                            )
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
                                            {displayManufacturingCalender ==
                                                true && (
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

                                    <View>
                                        <TouchableOpacity
                                            style={
                                                styles.insuranceProviderDropDownField
                                            }
                                            onPress={() => {
                                                setInsuranceProviderListModal(
                                                    true
                                                );
                                                setIsNewInsuranceProvider("");
                                                setNewInsuranceProviderError(
                                                    ""
                                                );
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
                                            right={
                                                <TextInput.Icon name="menu-down" />
                                            }
                                        />
                                    </View>
                                    {insuranceProviderError?.length > 0 && (
                                        <Text style={styles.errorTextStyle}>
                                            {insuranceProviderError}
                                        </Text>
                                    )}

                                    {/* <View style={styles.dropDownContainer}>
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
                                            } */}

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
                                        style={{ flex: 1 }}
                                        onPress={() =>
                                            setDisplayInsuranceExpiryCalender(
                                                true
                                            )
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
                                            {displayInsuranceExpiryCalender ==
                                                true && (
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
                            ) : null}
                        </View>
                        <Portal>
                            <Modal
                                visible={addBrandModal}
                                onDismiss={() => {
                                    setAddBrandModal(false);
                                    setNewBrandName("");
                                    setIsBrand();
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
                                        setIsBrand();
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
                                    setIsModel(0);
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
                                        setIsModel(0);
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
                                <Text
                                    style={[
                                        styles.headingStyle,
                                        { marginTop: 0, alignSelf: "center" },
                                    ]}
                                >
                                    Select Insurance Provider
                                </Text>
                                {isLoadingInsuranceProviderList == true ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                        }}
                                    >
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
                                            value={
                                                searchQueryForInsuranceProviders
                                            }
                                            elevation={0}
                                            style={{
                                                elevation: 0.8,
                                                marginBottom: 10,
                                            }}
                                        />
                                        {filteredInsuranceProviderData?.length >
                                        0 ? (
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                ItemSeparatorComponent={() => (
                                                    <>
                                                        <Divider />
                                                        <Divider />
                                                    </>
                                                )}
                                                data={
                                                    filteredInsuranceProviderData
                                                }
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
                                                                // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setInsuranceProviderListModal(false);  setAddInsuranceProviderModal(true); }}>
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
                                                    No such insurance provider
                                                    is associated!
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
                                        setIsNewInsuranceProvider(0);
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
                                <Text
                                    style={[
                                        styles.headingStyle,
                                        { marginTop: 0, alignSelf: "center" },
                                    ]}
                                >
                                    Select Brand
                                </Text>
                                {isLoadingBrandList == true ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                        }}
                                    >
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
                                                        setSearchQueryForBrands(
                                                            text
                                                        )
                                                    }
                                                    value={searchQueryForBrands}
                                                    activeUnderlineColor={
                                                        colors.transparent
                                                    }
                                                    selectionColor="black"
                                                    underlineColor={
                                                        colors.transparent
                                                    }
                                                    style={{
                                                        elevation: 4,
                                                        height: 50,
                                                        backgroundColor:
                                                            colors.white,
                                                        flex: 1,
                                                        borderTopRightRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                        borderTopLeftRadius: 5,
                                                        borderBottomLeftRadius: 5,
                                                    }}
                                                    right={
                                                        searchQueryForBrands !=
                                                            null &&
                                                        searchQueryForBrands !=
                                                            "" && (
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
                                                        backgroundColor:
                                                            colors.primary,
                                                        justifyContent:
                                                            "center",
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
                                                onEndReached={
                                                    filteredBrandData?.length >
                                                        9 && getBrandList
                                                }
                                                onEndReachedThreshold={0.5}
                                                refreshControl={
                                                    <RefreshControl
                                                        refreshing={
                                                            brandRefreshing
                                                        }
                                                        onRefresh={
                                                            onBrandRefresh
                                                        }
                                                        colors={["green"]}
                                                    />
                                                }
                                                ListFooterComponent={
                                                    filteredBrandData?.length >
                                                        9 && renderBrandFooter
                                                }
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
                                                                    {item.name}
                                                                </Text>
                                                            </View>
                                                        }
                                                        onPress={() => {
                                                            setIsBrandName(
                                                                item.name
                                                            );
                                                            setIsBrand(item.id);
                                                            setBrandError("");
                                                            setBrandListModal(
                                                                false
                                                            );
                                                            setIsModel();
                                                            setIsModelName("");
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
                                                    backgroundColor:
                                                        colors.primary,
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
                                                <Text
                                                    style={{
                                                        color: colors.white,
                                                    }}
                                                >
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
                                <Text
                                    style={[
                                        styles.headingStyle,
                                        { marginTop: 0, alignSelf: "center" },
                                    ]}
                                >
                                    Select Model
                                </Text>
                                {isLoadingModelList == true ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                        }}
                                    >
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
                                                        setSearchQueryForModels(
                                                            text
                                                        )
                                                    }
                                                    value={searchQueryForModels}
                                                    activeUnderlineColor={
                                                        colors.transparent
                                                    }
                                                    selectionColor="black"
                                                    underlineColor={
                                                        colors.transparent
                                                    }
                                                    style={{
                                                        elevation: 4,
                                                        height: 50,
                                                        backgroundColor:
                                                            colors.white,
                                                        flex: 1,
                                                        borderTopRightRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                        borderTopLeftRadius: 5,
                                                        borderBottomLeftRadius: 5,
                                                    }}
                                                    right={
                                                        searchQueryForModels !=
                                                            null &&
                                                        searchQueryForModels !=
                                                            "" && (
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
                                                        backgroundColor:
                                                            colors.primary,
                                                        justifyContent:
                                                            "center",
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
                                                onEndReached={
                                                    filteredModelData?.length >
                                                        9 && getModelList
                                                }
                                                onEndReachedThreshold={0.5}
                                                refreshControl={
                                                    <RefreshControl
                                                        refreshing={
                                                            modelRefreshing
                                                        }
                                                        onRefresh={
                                                            onModelRefresh
                                                        }
                                                        colors={["green"]}
                                                    />
                                                }
                                                ListFooterComponent={
                                                    filteredModelData?.length >
                                                        9 && renderModelFooter
                                                }
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
                                                                        item.model_name
                                                                    }
                                                                </Text>
                                                            </View>
                                                        }
                                                        onPress={() => {
                                                            setIsModelName(
                                                                item.model_name
                                                            );
                                                            setIsModel(item.id);
                                                            setModelError("");
                                                            setModelListModal(
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
                                                    backgroundColor:
                                                        colors.primary,
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
                                                <Text
                                                    style={{
                                                        color: colors.white,
                                                    }}
                                                >
                                                    Add Model
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Modal>
                        </Portal>
                    </InputScrollView>
                ) : (
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

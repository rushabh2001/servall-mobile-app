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
    Alert,
    Platform,
} from "react-native";
import {
    Modal,
    TextInput,
    Portal,
    Divider,
    List,
    Button,
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
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";
import BrandComponent from "../Component/BrandComponent";
import VehicalModalComponet from "../Component/VehicalModalComponet";

const AddVehicle = ({
    navigation,
    userToken,
    route,
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
    const [
        registrationCertificateImgError,
        setRegistrationCertificateImgError,
    ] = useState("");
    const [insuranceImgError, setInsuranceImgError] = useState("");

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

    // Brand States
    const [isBrand, setIsBrand] = useState();
    const [isBrandName, setIsBrandName] = useState();
    const [brandListModal, setBrandListModal] = useState(false);
    const [brandError, setBrandError] = useState(""); // Error State

    // Vehicle Model States
    const [isModel, setIsModel] = useState();
    const [isModelName, setIsModelName] = useState();
    const [modelListModal, setModelListModal] = useState(false);
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

    const [isLoading, setIsLoading] = useState(false);

    const isVehicalNumRef = useRef();
    const scrollViewRef = useRef();

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

        const data = new FormData();
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
        data.append("user_id", parseInt(route?.params?.userId));

        addVehicle(data);
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
            let currentDate = selectedDate || isPurchaseDate;
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
            let currentDate = selectedDate || isManufacturingDate;
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
            let currentDate = selectedDate || isInsuranceExpiryDate;
            let formattedDate = moment(currentDate, "YYYY-MM-DD", true).format(
                "DD-MM-YYYY"
            );
            setDisplayInsuranceExpiryCalender(false);
            setDateInsuranceExpiry(formattedDate);
            // console.log("setDateInsuranceExpiry", setDateInsuranceExpiry);
            let formateDateForDatabase = moment(
                currentDate,
                'YYYY-MM-DD"T"hh:mm ZZ'
            ).format("YYYY-MM-DD");
            setIsInsuranceExpiryDate(new Date(formateDateForDatabase));
            // console.log("setIsInsuranceExpiryDate", currentDate);
        } else if(event.type == 'dismissed') {
            setDisplayInsuranceExpiryCalender(false);
        }
    };

    const addVehicle = async (data) => {
        setIsLoading(true);
        try {
            await fetch(`${API_URL}add_new_vehicle`, {
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
                    setIsLoading(false);
                    if (
                        res.statusCode == 201 ||
                        res.statusCode == 200 ||
                        res.message == true
                    ) {
                        navigation.navigate("CustomerDetails", {
                            userId: route.params.userId,
                        });
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

    useEffect(() => {
        getInsuranceProviderList();
    }, []);

    useEffect(() => {
        if (isBrand != undefined) {
            // setIsLoading(true);
            setIsModel();
            setIsModelName("");
            setModelFieldToggle(true);
            // getModelList();
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
                        ) : (vehicleRegistrationNumberError?.length > 0 ? (
                            <Text style={styles.errorTextStyle}>
                                {vehicleRegistrationNumberError}
                            </Text>
                        ) : null)}
                        

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
                            Add
                        </Button>
                    </View>
                </InputScrollView>
                <Portal>
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
                                value={searchQueryForInsuranceProviders}
                                elevation={0}
                                style={{ elevation: 0.8, marginBottom: 10 }}
                            />
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredInsuranceProviderData}
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
            </View>
            {isLoading &&
                <Spinner
                    visible={isLoading}
                    color="#377520"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
                />
            }
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
    userRole: state.user.user_role,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(AddVehicle);

import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import {
    Button,
    Modal,
    Portal,
    Divider,
    TextInput,
    List,
    Searchbar,
} from "react-native-paper";
import InputScrollView from "react-native-input-scroll-view";
import { Picker } from "@react-native-picker/picker";
import IconX from "react-native-vector-icons/FontAwesome5";

const CustomerInfo = ({
    navigation,
    userToken,
    route,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    // User / Customer Fields
    const [isName, setIsName] = useState("");
    const [isEmail, setIsEmail] = useState("");
    const [isPhoneNumber, setIsPhoneNumber] = useState("");
    const [isAddress, setIsAddress] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

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

    const [cityFieldToggle, setCityFieldToggle] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const scroll1Ref = useRef();

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
            isState === 0
        );
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
            if (!isName) setNameError("Customer Name is required");
            if (!isPhoneNumber) setPhoneNumberError("Phone Number is required");
            if (!isEmail) setEmailError("Email is required");
            else if (isEmail.length < 6)
                setEmailError("Email should be minimum 6 characters");
            else if (isEmail?.indexOf(" ") >= 0)
                setEmailError("Email cannot contain spaces");
            else if (isEmail?.indexOf("@") < 0)
                setEmailError("Invalid Email Format");
            return;
        }

        const data = {
            name: isName,
            email: isEmail,
            phone_number: isPhoneNumber,
            city: isCity,
            state: isState,
            address: isAddress,
            vehicle_option: "no_vehicle",
        };

        updateUser(data);
    };

    const updateUser = async (data) => {
        try {
            await fetch(`${API_URL}update_customer/${route?.params?.userId}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify(data),
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
                    console.log(res);
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
                        return;
                    } else if (res.statusCode == 201) {
                        console.log("Customer Updated SuccessFully");
                        navigation.navigate("CustomerDetails",{ userId: route?.params?.userId });
                    }
                });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
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
            if (json !== undefined) {
                setStateList(json.states);
                setFilteredStateData(json.states);
            }
        } catch (e) {
            console.log(e);
        } finally {
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

    const getUserDetails = async () => {
        try {
            const res = await fetch(
                `${API_URL}fetch_customer_details?id=${route?.params?.userId}`,
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
                setIsName(json?.user_details?.name);
                setIsEmail(json?.user_details?.email);
                setIsPhoneNumber(json?.user_details?.phone_number);
                setIsAddress(json?.user_details?.address);
                setIsState(parseInt(json?.user_details?.state));
                setIsStateName(json?.user_details?.states.name);
                setTimeout(function () {
                    setIsCity(parseInt(json?.user_details?.city));
                    setIsCityName(json?.user_details?.cities.name);
                }, 200);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getStateList();
    }, []);

    useEffect(() => {
        getUserDetails();
    }, [stateList]);

    useEffect(() => {
        if (isState != undefined) {
            getCityList();
            setIsCity(0);
            setIsCityName("");
        }
    }, [isState]);

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
                            {nameError?.length > 0 && (
                                <Text style={{ color: colors.danger }}>
                                    {nameError}
                                </Text>
                            )}

                            <TextInput
                                mode="outlined"
                                label="Email Address"
                                style={styles.input}
                                placeholder="Email Address"
                                value={isEmail}
                                onChangeText={(text) => setIsEmail(text)}
                            />
                            {emailError?.length > 0 && (
                                <Text style={{ color: colors.danger }}>
                                    {emailError}
                                </Text>
                            )}

                            <TextInput
                                mode="outlined"
                                label="Phone Number"
                                style={styles.input}
                                placeholder="Phone Number"
                                value={isPhoneNumber}
                                onChangeText={(text) => setIsPhoneNumber(text)}
                                keyboardType={"phone-pad"}
                            />
                            {phoneNumberError?.length > 0 && (
                                <Text style={{ color: colors.danger }}>
                                    {phoneNumberError}
                                </Text>
                            )}

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
            </View>
            <Portal>
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
                            setStateListModal(false);
                            setIsState();
                            setIsStateName("");
                            setStateError("");
                            setSearchQueryForStates("");
                            searchFilterForStates();
                            setCityFieldToggle(false);
                        }}
                    />
                    <Text
                        style={[
                            styles.headingStyle,
                            { marginTop: 0, alignSelf: "center" },
                        ]}
                    >
                        Select State
                    </Text>
                    {isLoadingStateList == true ? (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator></ActivityIndicator>
                        </View>
                    ) : (
                        <View
                            style={{ marginTop: 20, marginBottom: 10, flex: 1 }}
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
                                                        flexDirection: "row",
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
                    <Text
                        style={[
                            styles.headingStyle,
                            { marginTop: 0, alignSelf: "center" },
                        ]}
                    >
                        Select City
                    </Text>
                    {isLoadingCityList == true ? (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator></ActivityIndicator>
                        </View>
                    ) : (
                        <View
                            style={{ marginTop: 20, marginBottom: 10, flex: 1 }}
                        >
                            <Searchbar
                                placeholder="Search here..."
                                onChangeText={(text) => {
                                    if (text != null) searchFilterForCity(text);
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
                                                    setIsCityName(item.name);
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
    modalContainerStyle: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 30,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(CustomerInfo);

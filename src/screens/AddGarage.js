import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    RefreshControl,
} from "react-native";
import {
    Modal,
    Portal,
    Button,
    TextInput,
    Searchbar,
    Divider,
    List,
} from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
// import { IconX, ICON_TYPE } from '../icons';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import InputScrollView from "react-native-input-scroll-view";
import DocumentPicker from "react-native-document-picker";
import { Picker } from "@react-native-picker/picker";
import RadioForm from "react-native-simple-radio-button";

const AddGarage = ({
    navigation,
    userToken,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    // Garage Fields
    const [isGarageName, setIsGarageName] = useState("");
    const [isGarageContactNumber, setIsGarageContactNumber] = useState("");
    const [isLocation, setIsLocation] = useState("");

    // Error States
    const [garageNameError, setGarageNameError] = useState("");
    const [garageContactNumberError, setGarageContactNumberError] =
        useState("");
    const [locationError, setLocationError] = useState("");
    const [ownerOption, setOwnerOption] = useState("new_user");
    const [ownerId, setOwnerId] = useState(0);

    // User / Owner Fields
    const [isName, setIsName] = useState("");
    const [isEmail, setIsEmail] = useState("");
    const [isPhoneNumber, setIsPhoneNumber] = useState("");
    const [isAddress, setIsAddress] = useState("");
    const [isProfileImage, setIsProfileImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Error States
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

    const [adminList, setAdminList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [cityFieldToggle, setCityFieldToggle] = useState(false);

    // States for Dropdown
    // const [isUser, setIsUser] = useState('');
    // const [isName, setIsName] = useState("");
    // const [userList, setAdminList] = useState([]);
    const [userListModal, setUserListModal] = useState(false);
    const [isLoadingUserList, setIsLoadingUserList] = useState(false);
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [searchQueryForUsers, setSearchQueryForUsers] = useState();
    const [userError, setUserError] = useState("");
    const [loadMoreUsers, setLoadMoreUsers] = useState(true);

    const [userPage, setUserPage] = useState(1);
    const [isUserScrollLoading, setIsUserScrollLoading] = useState(false);
    const [userRefreshing, setUserRefreshing] = useState(false);

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

    var radio_props = [
        { label: "New User", value: "new_user" },
        { label: "Existing User", value: "existing_user" },
    ];

    const scroll1Ref = useRef();

    const submit = () => {
        setIsLoading(true);
        Keyboard.dismiss();
        if (isGarageName.length == 0) {
            setGarageNameError("Garage Name is required");
        }
        if (isGarageContactNumber.length == 0) {
            setGarageContactNumberError("Garage Contact Number is required");
        }
        if (isCity == 0 || isCity == undefined) {
            setCityError("City is required");
        }
        if (isState == 0 || isState == undefined) {
            setStateError("State is required");
        }
        if (isLocation.length == 0) {
            setLocationError("Location is required");
        }
        if (ownerOption == "new_user") {
           
            if (isName.length == 0) {
                setNameError("Owner Name is required");
            }
            if (isPhoneNumber.length == 0) {
                setPhoneNumberError("Phone Number is required");
            } else if (isPhoneNumber.length < 9) {
                setPhoneNumberError(
                    "Phone Number should be minimum 10 characters"
                );
            }
            if (isEmail.length == 0) {
                setEmailError("Email is required");
            } else if (isEmail.length < 6) {
                setEmailError("Email should be minimum 6 characters");
            } else if (isEmail?.indexOf(" ") >= 0) {
                setEmailError("Email cannot contain spaces");
            } else if (isEmail?.indexOf("@") < 0) {
                setEmailError("Invalid Email Format");
            } else {
                setEmailError("");
                setPhoneNumberError("");
            }
        } else if (ownerOption == "existing_user") {
            if (ownerId == 0) {
                setUserError("User is required");
            } else {
                setUserError("");
            }
        }

        const data = new FormData();
        data.append("garage_name", isGarageName);
        data.append("garage_contact_number", isGarageContactNumber);
        data.append("city", isCity);
        data.append("state", isState);
        data.append("location", isLocation);
        data.append("owner_option", ownerOption);
        if (ownerOption == "new_user") {
            data.append("name", isName);
            data.append("email", isEmail);
            data.append("phone_number", isPhoneNumber);
            data.append("address", isAddress);
            if (imageFile != null) {
                const fileToUpload = imageFile;
                data.append("profile_image", fileToUpload);
            }
        } else if (ownerOption == "existing_user") {
            data.append("user_owner_id", ownerId);
        } else {
            console.log("owner options is not working");
        }

        addGarage(data);
    };

    const addGarage = async (data) => {
        try {
            const res = await fetch(`${API_URL}add_garage`, {
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
                    console.log('res', res.data.message.garage_name);
                    if (res.statusCode == 400 || res.statusCode == 401) {
                        {
                            res?.data?.message?.email &&
                                setEmailError(res.data.message.email);
                        }
                        {
                            res?.data?.message?.phone_number &&
                                setPhoneNumberError(
                                    res.data.message.phone_number
                                );
                        }
                        {
                            res?.data?.message?.garage_name &&
                                setGarageNameError(
                                    res.data.message.garage_name
                                );
                        }
                        return;
                    } else if (res.statusCode == 201) {
                        navigation.navigate("ChooseGarage");
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

    const getAdminList = async () => {
        {
            userPage == 1 && setIsLoadingUserList(true);
        }
        {
            userPage != 1 && setIsUserScrollLoading(true);
        }
        try {
            const res = await fetch(
                `${API_URL}fetch_admin_list?page=${userPage}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: searchQueryForUsers,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setAdminList([...adminList, ...json.admin_user_list.data]);
                setFilteredUserData([
                    ...filteredUserData,
                    ...json.admin_user_list.data,
                ]);
                setIsLoadingUserList(false);
                {
                    userPage != 1 && setIsUserScrollLoading(false);
                }
                {json.admin_user_list.current_page != json.admin_user_list.last_page ? setLoadMoreUsers(true) : setLoadMoreUsers(false)}
                {json.admin_user_list.current_page != json.admin_user_list.last_page ? setUserPage(userPage + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForUsers = async () => {
        try {
            const response = await fetch(`${API_URL}fetch_admin_list`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: searchQueryForUsers,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setAdminList(json.admin_user_list.data);
                setFilteredUserData(json.admin_user_list.data);
                {json.admin_user_list.current_page != json.admin_user_list.last_page ? setLoadMoreUsers(true) : setLoadMoreUsers(false)}
                {json.admin_user_list.current_page != json.admin_user_list.last_page ? setUserPage(2) : null}
                setUserRefreshing(false);
            } else {
                setUserRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullUserRefresh = async () => {
        try {
            const response = await fetch(`${API_URL}fetch_admin_list`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: "",
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setSearchQueryForUsers("");
                setAdminList(json.admin_user_list.data);
                setFilteredUserData(json.admin_user_list.data);
                {json.admin_user_list.current_page != json.admin_user_list.last_page ? setLoadMoreUsers(true) : setLoadMoreUsers(false)}
                {json.admin_user_list.current_page != json.admin_user_list.last_page ? setUserPage(2) : null}
                setIsLoadingUserList(false);
                setUserRefreshing(false);
            } else {
                setIsLoadingUserList(false);
                setUserRefreshing(false);
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

    const selectFile = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            // console.log(res);
            setImageFile(res[0]);
        } catch (err) {
            setImageFile(null);
            if (DocumentPicker.isCancel(err)) {
                alert("Canceled");
            } else {
                // For Unknown Error
                throw err;
            }
        }
    };

    useEffect(() => {
        if (isState != undefined) {
            getCityList();
            setIsCity();
            setIsCityName("");
        }
    }, [isState]);

    useEffect(() => {
        getStateList();
        getAdminList();
    }, []);

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
                {
                    isLoading == true ? (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator></ActivityIndicator>
                        </View>
                    ) : (
                        <InputScrollView
                            ref={scroll1Ref}
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: "center",
                            }}
                            keyboardOffset={200}
                            behavior={
                                Platform.OS === "ios" ? "padding" : "height"
                            }
                            keyboardShouldPersistTaps={"always"}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.headingStyle}>
                                    Garage Details:
                                </Text>
                                <TextInput
                                    mode="outlined"
                                    label="Garage Name"
                                    style={styles.input}
                                    placeholder="Garage Name"
                                    value={isGarageName}
                                    onChangeText={(text) =>
                                        setIsGarageName(text)
                                    }
                                />
                                {garageNameError?.length > 0 && (
                                    <Text style={{ color: colors.danger }}>
                                        {garageNameError}
                                    </Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Garage Contact Number"
                                    style={styles.input}
                                    placeholder="Garage Contact Number"
                                    value={isGarageContactNumber}
                                    onChangeText={(text) =>
                                        setIsGarageContactNumber(text)
                                    }
                                    keyboardType={"phone-pad"}
                                />
                                {garageContactNumberError?.length > 0 && (
                                    <Text style={{ color: colors.danger }}>
                                        {garageContactNumberError}
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
                                        right={
                                            <TextInput.Icon name="menu-down" />
                                        }
                                    />
                                </View>
                                {stateError?.length > 0 && (
                                    <Text style={{ color: colors.danger }}>
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
                                                    backgroundColor:
                                                        colors.white,
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
                                        right={
                                            <TextInput.Icon name="menu-down" />
                                        }
                                    />
                                </View>
                                {cityError?.length > 0 && (
                                    <Text style={{ color: colors.danger }}>
                                        {cityError}
                                    </Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Location"
                                    style={styles.input}
                                    placeholder="Location"
                                    value={isLocation}
                                    onChangeText={(text) => setIsLocation(text)}
                                />
                                {locationError?.length > 0 && (
                                    <Text style={{ color: colors.danger }}>
                                        {locationError}
                                    </Text>
                                )}

                                <Divider style={{ marginTop: 20 }} />

                                <View style={{ marginTop: 15 }}>
                                    <RadioForm
                                        radio_props={radio_props}
                                        initial={0}
                                        onPress={(value) =>
                                            setOwnerOption(value)
                                        }
                                        animation={false}
                                        formHorizontal={true}
                                        labelHorizontal={true}
                                        buttonWrapStyle={{ marginLeft: 10 }}
                                        labelStyle={{ marginRight: 40 }}
                                    />
                                </View>
                                {/* <View style={{borderWidth:1, borderColor: colors.light_gray, borderRadius: 5, marginTop: 10}}>
                                    <Picker
                                        selectedValue={ownerId}
                                        onValueChange={(value) => setOwnerId(value)}
                                        style={{padding: 0}}
                                        itemStyle={{padding: 0}}
                                    >
                                        <Picker.Item label="Select Admin User" value="0" />
                                        {adminList.map((List, i) => {
                                            return (
                                                <Picker.Item
                                                    key={i}
                                                    label={List.name}
                                                    value={List.id}
                                                />
                                            );
                                        })} 
                                    </Picker>
                                </View> */}

                                {ownerOption == "existing_user" ? (
                                    <>
                                        <View>
                                            <TouchableOpacity
                                                style={styles.userDropDownField}
                                                onPress={() => {
                                                    setUserListModal(true);
                                                }}
                                            ></TouchableOpacity>
                                            <TextInput
                                                mode="outlined"
                                                label="Owner Name"
                                                style={{
                                                    marginTop: 10,
                                                    backgroundColor: "#f1f1f1",
                                                    width: "100%",
                                                }}
                                                placeholder="Select User"
                                                value={isName}
                                                right={
                                                    <TextInput.Icon name="menu-down" />
                                                }
                                            />
                                        </View>
                                        {userError?.length > 0 && (
                                            <Text style={{ color: colors.danger }}>
                                                {userError}
                                            </Text>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            style={[
                                                styles.headingStyle,
                                                { marginTop: 20 },
                                            ]}
                                        >
                                            Owner Details:
                                        </Text>
                                        <TextInput
                                            mode="outlined"
                                            label="Owner Name"
                                            style={styles.input}
                                            placeholder="Owner Name"
                                            value={isName}
                                            onChangeText={(text) =>
                                                setIsName(text)
                                            }
                                        />
                                        {nameError?.length > 0 && (
                                            <Text
                                                style={{ color: colors.danger }}
                                            >
                                                {nameError}
                                            </Text>
                                        )}

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
                                        {emailError?.length > 0 && (
                                            <Text
                                                style={{ color: colors.danger }}
                                            >
                                                {emailError}
                                            </Text>
                                        )}

                                        <TextInput
                                            mode="outlined"
                                            label="Phone Number"
                                            style={styles.input}
                                            placeholder="Phone Number"
                                            value={isPhoneNumber}
                                            onChangeText={(text) =>
                                                setIsPhoneNumber(text)
                                            }
                                            keyboardType={"phone-pad"}
                                        />
                                        {phoneNumberError?.length > 0 && (
                                            <Text
                                                style={{ color: colors.danger }}
                                            >
                                                {phoneNumberError}
                                            </Text>
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

                                        <View>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={styles.uploadButtonStyle}
                                                onPress={selectFile}
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
                                                    Upload Profile Image
                                                </Text>
                                                {imageFile != null ? (
                                                    <Text
                                                        style={styles.textStyle}
                                                    >
                                                        File Name:{" "}
                                                        {imageFile.name
                                                            ? imageFile.name
                                                            : ""}
                                                    </Text>
                                                ) : null}
                                            </TouchableOpacity>
                                        </View>
                                    </>
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
                    )
                    // Modal Popup Code
                }
            </View>
            <Portal>
                {/* Users List Modal */}
                <Modal
                    visible={userListModal}
                    onDismiss={() => {
                        setUserListModal(false);
                        setOwnerId(0);
                        setIsName("");
                        setUserError("");
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
                            setOwnerId(0);
                            setIsName("");
                            setUserError("");
                            setSearchQueryForUsers("");
                            searchFilterForUsers();
                        }}
                    />
                    {isLoadingUserList == true ? (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ActivityIndicator></ActivityIndicator>
                        </View>
                    ) : (
                        <View
                            style={{ marginTop: 20, marginBottom: 10, flex: 1 }}
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
                                                    color={colors.light_gray}
                                                    onPress={() =>
                                                        onUserRefresh()
                                                    }
                                                />
                                            )
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() => searchFilterForUsers()}
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
                            {filteredUserData?.length > 0 ? (
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={() => (
                                        <>
                                            <Divider />
                                            <Divider />
                                        </>
                                    )}
                                    data={filteredUserData}
                                    onEndReached={loadMoreUsers ? getAdminList : null}
                                    onEndReachedThreshold={0.5}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={userRefreshing}
                                            onRefresh={onUserRefresh}
                                            colors={["green"]}
                                        />
                                    }
                                    ListFooterComponent={loadMoreUsers ? renderUserFooter : null}
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
                                                    // <TouchableOpacity style={{flexDirection:"column"}} onPress={() => {setUserListModal(false);  setAddUserModal(true); }}>
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
                                                    setIsName(item.name);
                                                    setOwnerId(item.id);
                                                    setUserError("");
                                                    setUserListModal(false);
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
                                        No such user is associated!
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
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
    dropDownContainer: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 5,
        marginTop: 20,
    },
    dropDownField: {
        padding: 0,
    },
    userDropDownField: {
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
    footer: {
        marginVertical: 15,
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
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

export default connect(mapStateToProps)(AddGarage);

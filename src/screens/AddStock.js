import React, { useEffect, useRef, useState } from "react";
import {
    RefreshControl,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Keyboard,
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
import InputScrollView from "react-native-input-scroll-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";

const AddStock = ({
    navigation,
    selectedGarageId,
    userRole,
    userId,
    userToken,
    garageId,
    selectedGarage,
    user,
}) => {
    // User / Customer Fields
    const [isPrice, setIsPrice] = useState();
    const [isMRP, setIsMRP] = useState();
    const [isCurrentStock, setIsCurrentStock] = useState();
    const [isMinStock, setIsMinStock] = useState();
    const [isMaxStock, setIsMaxStock] = useState();
    const [isRackId, setIsRackId] = useState();
    const [isComment, setIsComment] = useState("");

    // Error States
    const [priceError, setPriceError] = useState("");
    const [mrpError, setMrpError] = useState("");
    const [currentStockError, setCurrentStockError] = useState("");
    const [minStockError, setMinStockError] = useState("");
    const [maxStockError, setMaxStockError] = useState("");
    const [rackIdError, setRackIdError] = useState("");
    const [commentError, setCommentError] = useState("");

    // Vehicle Fields
    const [isPart, setIsPart] = useState("");
    const [isPartName, setIsPartName] = useState("");
    const [partList, setPartList] = useState([]);
    const [partListModal, setPartListModal] = useState(false);
    const [isLoadingPartList, setIsLoadingPartList] = useState(true);
    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState();
    const [partError, setPartError] = useState("");

    const [isNewPart, setIsNewPart] = useState("");
    const [newPartError, setNewPartError] = useState();
    const [addNewPartModal, setAddNewPartModal] = useState(false);

    const [partPage, setPartPage] = useState(1);
    const [isPartScrollLoading, setIsPartScrollLoading] = useState(false);
    const [partRefreshing, setPartRefreshing] = useState(false);

    // Property Vendor Dropdown
    // const [isVendor, setIsVendor] = useState();
    // const [isVendorName, setIsVendorName] = useState('');
    // const [vendorList, setVendorList] = useState([]);
    // const [vendorListModal, setVendorListModal] = useState(false);
    // const [isLoadingVendorList, setIsLoadingVendorList] = useState(true);
    // const [filteredVendorData, setFilteredVendorData] = useState([]);
    // const [searchQueryForVendors, setSearchQueryForVendors] = useState();
    // const [vendorError, setVendorError] = useState('');   // Error State

    // const [isNewVendor, setIsNewVendor] = useState('');
    // const [newVendorError, setNewVendorError] = useState();
    // const [addNewVendorModal, setAddNewVendorModal] = useState(false);

    // Property Garage Dropdown
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

    const [isLoading, setIsLoading] = useState(false);
    const scroll1Ref = useRef();

    const [garagePage, setGaragePage] = useState(1);
    const [isGarageScrollLoading, setIsGarageScrollLoading] = useState(false);
    const [garageRefreshing, setGarageRefreshing] = useState(false);

    const validate = () => {
        return !(
            !isPart ||
            isPart === 0 ||
            !isPrice ||
            isPrice?.trim().length === 0 ||
            !isCurrentStock ||
            isCurrentStock?.trim().length === 0 ||
            !isMRP ||
            isMRP?.trim().length === 0 ||
            !isRackId ||
            isRackId?.trim().length === 0 ||
            !isMinStock ||
            isMinStock?.trim().length === 0 ||
            !isMaxStock ||
            isMaxStock?.trim().length === 0 ||
            // !isVendor || isVendor === 0 ||
            !isGarageId ||
            isGarageId === 0
        );
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
            if (!isPart) setPartError("Part is required");
            else setPartError("");
            if (!isPrice) setIsPrice("");
            if (!isMRP) setIsMRP("");
            if (!isRackId) setIsRackId("");
            if (!isCurrentStock) setIsCurrentStock("");
            if (!isMinStock) setIsMinStock("");
            if (!isMaxStock) setIsMaxStock("");
            // if (!isPrice) setPriceError("Price is required");
            // else setPriceError("");
            // if (!isMRP) setMrpError("MRP is required");
            // else setMrpError("");
            // if (!isRackId) setRackIdError("Rack ID is required");
            // else setRackIdError("");
            // if (!isCurrentStock)
            //     setCurrentStockError("Current Stock is required");
            // else setCurrentStockError("");
            // if (!isMinStock) setMinStockError("Minimum Stock is required");
            // else setMinStockError("");
            // if (!isMaxStock) setMaxStockError("Maximum Stock is required");
            // else setMaxStockError("");
            // if (!isVendor || isVendor === 0) setVendorError('Brand is required'); else setVendorError('');
            if (!isGarageId || isGarageId == 0)
                setGarageError("Customer Belongs to Garage Field is required");
            else setGarageError("");
            return;
        }

        const data = {
            parts_id: isPart,
            garage_id: isGarageId,
            // 'vendor_id': isVendor,
            purchase_price: isPrice?.trim(),
            mrp: isMRP?.trim(),
            rack_id: isRackId?.trim(),
            current_stock: isCurrentStock?.trim(),
            min_stock: isMinStock?.trim(),
            max_stock: isMaxStock?.trim(),
            comment: isComment?.trim(),
        };

        addStock(data);
    };

    const addStock = async (data) => {
        try {
            const res = await fetch(`${API_URL}add_inventory`, {
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
                navigation.navigate("Parts");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const addNewPart = async () => {
        let data = { name: isNewPart };
        try {
            const res = await fetch(`${API_URL}add_parts`, {
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
                getPartList();
                setIsPart(parseInt(json.data.id));
                setIsPartName(json.data.name);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForParts = async () => {
        try {
            const response = await fetch(`${API_URL}fetch_parts`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: searchQueryForParts,
                }),
            });
            const json = await response.json();
            if (response.status == "200") {
                setPartList(json.data.data);
                setFilteredPartData(json.data.data);
                setPartPage(2);
                setPartRefreshing(false);
            } else {
                setPartRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getPartList = async () => {
        {
            partPage == 1 && setIsLoadingPartList(true);
        }
        {
            partPage != 1 && setIsPartScrollLoading(true);
        }
        try {
            const res = await fetch(`${API_URL}fetch_parts?page=${partPage}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                    search: searchQueryForParts,
                }),
            });
            const json = await res.json();
            if (json !== undefined) {
                setPartList([...partList, ...json.data.data]);
                setFilteredPartData([...filteredPartData, ...json.data.data]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            {
                partPage == 1 && setIsLoadingPartList(false);
            }
            {
                partPage != 1 && setIsPartScrollLoading(false);
            }
            setPartPage(partPage + 1);
        }
    };

    const pullPartRefresh = async () => {
        setSearchQueryForParts(null);
        try {
            const response = await fetch(`${API_URL}fetch_parts`, {
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
                setPartList(json.data.data);
                setFilteredPartData(json.data.data);
                setPartPage(2);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPartRefreshing(false);
        }
    };

    const renderPartFooter = () => {
        return (
            <>
                {isPartScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onPartRefresh = () => {
        setPartRefreshing(true);
        pullPartRefresh();
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
            console.log(json);
            if (json !== undefined) {
                setGarageList([...garageList, ...json.garage_list.data]);
                setFilteredGarageData([
                    ...filteredGarageData,
                    ...json.garage_list.data,
                ]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            {
                garagePage == 1 && setIsLoadingGarageList(false);
            }
            {
                garagePage != 1 && setIsGarageScrollLoading(false);
            }
            setGaragePage(garagePage + 1);
        }
    };

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
                setGaragePage(2);
                setGarageRefreshing(false);
            } else {
                setGarageRefreshing(false);
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
                setGaragePage(2);
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

    const getInvetoryData = async () => {
        setIsLoading(true);
        try {
            await fetch(
                `${API_URL}fetch_parts_inventory?parts_id=${isPart}&garage_id=${isGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
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
                    if (res.statusCode == 404) {
                        // console.log('getInvetoryData', res.data);
                        setIsCurrentStock("");
                        setIsMaxStock("");
                        setIsMinStock("");
                        setIsMRP("");
                        setIsRackId("");
                        setIsPrice("");
                        setIsComment("");
                    } else if (res.statusCode == 201 || res.statusCode == 200) {
                        setIsCurrentStock(res.data.data.current_stock);
                        setIsMaxStock(res.data.data.max_stock);
                        setIsMinStock(res.data.data.min_stock);
                        setIsMRP(res.data.data.mrp);
                        setIsRackId(res.data.data.rack_id);
                        setIsPrice(res.data.data.purchase_price);
                        setIsComment(res.data.data.comment);
                    } else {
                        setIsCurrentStock("");
                        setIsMaxStock("");
                        setIsMinStock("");
                        setIsMRP("");
                        setIsRackId("");
                        setIsPrice("");
                        setIsComment("");
                    }
                });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getGarageList();
        getPartList();
    }, []);

    useEffect(() => {
        if (isPart != 0 && isGarageId != 0) getInvetoryData();
    }, [isPart, isGarageId]);

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
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>
                            New Stock Details:
                        </Text>

                        {(userRole == "Super Admin" ||
                            garageId?.length > 1) && (
                            <>
                                <View>
                                    <TouchableOpacity
                                        style={styles.partDropDownField}
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
                                {garageError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {garageError}
                                    </Text>
                                )}
                            </>
                        )}

                        <View>
                            <TouchableOpacity
                                style={styles.partDropDownField}
                                onPress={() => {
                                    setPartListModal(true);
                                }}
                            ></TouchableOpacity>
                            <TextInput
                                mode="outlined"
                                label="Part"
                                style={{
                                    marginTop: 18,
                                    backgroundColor: "#f1f1f1",
                                    width: "100%",
                                }}
                                placeholder="Select Part"
                                value={isPartName}
                                right={<TextInput.Icon name="menu-down" />}
                            />
                        </View>
                        {partError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {partError}
                            </Text>
                        )}

                        {isLoading == true ? (
                            <View
                                style={{
                                    marginVertical: 170,
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
                            <>
                                <TextInput
                                    mode="outlined"
                                    label="Purchase Price (Without GST)"
                                    style={styles.input}
                                    placeholder="Purchase Price (Without GST)"
                                    value={isPrice}
                                    onChangeText={(text) => setIsPrice(text)}
                                    keyboardType={"phone-pad"}
                                />
                                {isPrice?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Purchase Price is required.
                                    </Text>
                                ) : null}

                                <TextInput
                                    mode="outlined"
                                    label="MRP"
                                    style={styles.input}
                                    placeholder="MRP"
                                    value={isMRP}
                                    onChangeText={(text) => setIsMRP(text)}
                                    keyboardType={"phone-pad"}
                                />
                                {isMRP?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        MRP is required.
                                    </Text>
                                ) : null}

                                <TextInput
                                    mode="outlined"
                                    label="Rack ID"
                                    style={styles.input}
                                    placeholder="Rack ID"
                                    value={isRackId}
                                    onChangeText={(text) => setIsRackId(text)}
                                />

                                {isRackId?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Rack ID is required.
                                    </Text>
                                ) : null}

                                <TextInput
                                    mode="outlined"
                                    label="Current Stock"
                                    style={styles.input}
                                    placeholder="Current Stock"
                                    value={isCurrentStock}
                                    onChangeText={(text) =>
                                        setIsCurrentStock(text)
                                    }
                                    keyboardType={"phone-pad"}
                                />

                                {isCurrentStock?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Current Stock is required.
                                    </Text>
                                ) : null}

                                <TextInput
                                    mode="outlined"
                                    label="Minimum Stock"
                                    style={styles.input}
                                    placeholder="Minimum Stock"
                                    value={isMinStock}
                                    onChangeText={(text) => setIsMinStock(text)}
                                    keyboardType={"phone-pad"}
                                />
                                {isMinStock?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Minimum Stock is required.
                                    </Text>
                                ) : null}

                                <TextInput
                                    mode="outlined"
                                    label="Maximum Stock"
                                    style={styles.input}
                                    placeholder="Maximum Stock"
                                    value={isMaxStock}
                                    onChangeText={(text) => setIsMaxStock(text)}
                                    keyboardType={"phone-pad"}
                                />
                                {isMaxStock?.trim()?.length === 0 ? (
                                    <Text style={styles.errorTextStyle}>
                                        Maximum Stock is required.
                                    </Text>
                                ) : null}

                                <TextInput
                                    mode="outlined"
                                    label="Comment"
                                    style={styles.input}
                                    placeholder="Comment"
                                    value={isComment}
                                    onChangeText={(text) => setIsComment(text)}
                                    numberOfLines={3}
                                    multiline={true}
                                />
                                {commentError?.length > 0 && (
                                    <Text style={styles.errorTextStyle}>
                                        {commentError}
                                    </Text>
                                )}
                            </>
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
                    {/* Parts List Modal */}
                    <Modal
                        visible={partListModal}
                        onDismiss={() => {
                            setPartListModal(false);
                            setIsPart(0);
                            setIsPartName("");
                            setPartError("");
                            setSearchQueryForParts("");
                            searchFilterForParts();
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
                            Select Part
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
                                setPartListModal(false);
                                setIsPart(0);
                                setIsPartName("");
                                setPartError("");
                                setSearchQueryForParts("");
                                searchFilterForParts();
                            }}
                        />
                        {isLoadingPartList == true ? (
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <ActivityIndicator></ActivityIndicator>
                            </View>
                        ) : (
                            <View style={{ marginTop: 20, flex: 1 }}>
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
                                                setSearchQueryForParts(text)
                                            }
                                            value={searchQueryForParts}
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
                                                searchQueryForParts != null &&
                                                searchQueryForParts != "" && (
                                                    <TextInput.Icon
                                                        icon="close"
                                                        color={
                                                            colors.light_gray
                                                        }
                                                        onPress={() =>
                                                            onPartRefresh()
                                                        }
                                                    />
                                                )
                                            }
                                        />
                                        <TouchableOpacity
                                            onPress={() =>
                                                searchFilterForParts()
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
                                {filteredPartData?.length > 0 ? (
                                    <FlatList
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredPartData}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        onEndReached={
                                            filteredPartData?.length > 9 &&
                                            getPartList
                                        }
                                        onEndReachedThreshold={0.5}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={partRefreshing}
                                                onRefresh={onPartRefresh}
                                                colors={["green"]}
                                            />
                                        }
                                        ListFooterComponent={
                                            filteredPartData?.length > 9 &&
                                            renderPartFooter
                                        }
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
                                                        setIsPartName(
                                                            item.name
                                                        );
                                                        setIsPart(item.id);
                                                        setPartError("");
                                                        setPartListModal(false);
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
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.black,
                                                textAlign: "center",
                                            }}
                                        >
                                            No such part is associated!
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
                                            setAddNewPartModal(true);
                                            setPartListModal(false);
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
                                            Add Part
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Modal>

                    {/* Add New Part Model */}
                    <Modal
                        visible={addNewPartModal}
                        onDismiss={() => {
                            setAddNewPartModal(false);
                            setPartListModal(true);
                            setIsNewPart("");
                            setNewPartError("");
                        }}
                        contentContainerStyle={styles.modalContainerStyle}
                    >
                        <Text
                            style={[
                                styles.headingStyle,
                                { marginTop: 0, alignSelf: "center" },
                            ]}
                        >
                            Add New Part
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
                                setAddNewPartModal(false);
                                setPartListModal(true);
                                setIsNewPart("");
                                setNewPartError("");
                            }}
                        />
                        <View>
                            <TextInput
                                mode="outlined"
                                label="Part Name"
                                style={styles.input}
                                placeholder="Part Name"
                                value={isNewPart}
                                onChangeText={(text) => setIsNewPart(text)}
                            />
                        </View>
                        {newPartError?.length > 0 && (
                            <Text style={styles.errorTextStyle}>
                                {newPartError}
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
                                    if (isNewPart == "") {
                                        setNewPartError(
                                            "Please Enter Part Name"
                                        );
                                    } else {
                                        setAddNewPartModal(false);
                                        addNewPart();
                                    }
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                style={{ marginTop: 15, flex: 1 }}
                                mode={"contained"}
                                onPress={() => {
                                    setAddNewPartModal(false);
                                    setPartListModal(true);
                                    setIsNewPart("");
                                    setNewPartError("");
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
                            <View style={{ marginTop: 20, flex: 1 }}>
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
                                        ItemSeparatorComponent={() => (
                                            <>
                                                <Divider />
                                                <Divider />
                                            </>
                                        )}
                                        data={filteredGarageData}
                                        style={{
                                            borderColor: "#0000000a",
                                            borderWidth: 1,
                                            flex: 1,
                                        }}
                                        onEndReached={
                                            filteredGarageData?.length > 9 &&
                                            getGarageList
                                        }
                                        onEndReachedThreshold={0.5}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={garageRefreshing}
                                                onRefresh={onGarageRefresh}
                                                colors={["green"]}
                                            />
                                        }
                                        ListFooterComponent={
                                            filteredGarageData?.length > 9 &&
                                            renderGarageFooter
                                        }
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
                                                                {
                                                                    item.garage_name
                                                                }
                                                            </Text>
                                                        </View>
                                                    }
                                                    onPress={() => {
                                                        setIsGarageName(
                                                            item.garage_name
                                                        );
                                                        setIsGarageId(item.id);
                                                        setGarageError("");
                                                        setGarageListModal(
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
                                            No such garage found!
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
    partDropDownField: {
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
    pageContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        // justifyContent: 'center',
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
    dropDownContainer: {
        borderWidth: 1,
        borderColor: colors.light_gray,
        borderRadius: 5,
        marginTop: 20,
    },
    dropDownField: {
        padding: 0,
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
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
});

export default connect(mapStateToProps)(AddStock);

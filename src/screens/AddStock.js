import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Alert,
    Platform,
} from "react-native";
import {
    Modal,
    Portal,
    Button,
    TextInput,
    Divider,
    List,
} from "react-native-paper";
import { connect } from "react-redux";
import { colors } from "../constants";
import { API_URL } from "../constants/config";
import InputScrollView from "react-native-input-scroll-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconX from "react-native-vector-icons/FontAwesome5";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";

const AddStock = ({
    navigation,
    selectedGarageId,
    userToken,
}) => {
    // User / Customer Fields
    const [isPrice, setIsPrice] = useState();
    const [isMRP, setIsMRP] = useState();
    const [isCurrentStock, setIsCurrentStock] = useState();
    const [isMinStock, setIsMinStock] = useState();
    const [isMaxStock, setIsMaxStock] = useState();
    const [isRackId, setIsRackId] = useState();
    const [isComment, setIsComment] = useState("");

    // Vehicle Fields
    const [isPart, setIsPart] = useState("");
    const [isPartName, setIsPartName] = useState("");
    const [partList, setPartList] = useState([]);
    const [partListModal, setPartListModal] = useState(false);
    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState();
    const [partError, setPartError] = useState("");

    const [isNewPart, setIsNewPart] = useState("");
    const [newPartError, setNewPartError] = useState();
    const [addNewPartModal, setAddNewPartModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef();

    const validate = (show = false) => {
        if (!show) {
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
                !selectedGarageId ||
                selectedGarageId === 0
            );
        } else {
            if (!isPart ||
                isPart === 0) {
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
                return false;
            }
            if (!selectedGarageId ||
                selectedGarageId === 0) {
                    alert('Please select any specific garage');
                // scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
                return false;
            }
            return true;
        }
    };

    const submit = () => {
        Keyboard.dismiss();
        if (!validate(true)) {
            if (!isPart) setPartError("Part is required");
            else setPartError("");
            if (!isPrice) setIsPrice("");
            if (!isMRP) setIsMRP("");
            if (!isRackId) setIsRackId("");
            if (!isCurrentStock) setIsCurrentStock("");
            if (!isMinStock) setIsMinStock("");
            if (!isMaxStock) setIsMaxStock("");
            if (!selectedGarageId || selectedGarageId == 0)
                alert("Please choose any specific garage!");
            return;
        }

        const data = {
            parts_id: isPart,
            garage_id: selectedGarageId,
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
        setIsLoading(true);
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
            // console.log('add_inventory', json);
            if (res.status == 200 || res.status == 201) {
                setIsLoading(false);
                navigation.navigate("Parts");
            } else if (res.status == 400) {
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
                setIsLoading(true);
                getPartList();
                setIsPart(parseInt(json.data.id));
                setIsPartName(json.data.name);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForParts = async () => {
        if (searchQueryForParts) {
            const newData = filteredPartData.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase()

                    const textData = searchQueryForParts.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            console.log('data', newData)
            setFilteredPartData(newData);
        } else {
            setFilteredPartData(partList);
        }
    };

    const getPartList = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${API_URL}fetch_parts`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setPartList(json.data);
                setFilteredPartData(json.data);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const getInvetoryData = async () => {
        setIsLoading(true);
        try {
            await fetch(
                `${API_URL}fetch_parts_inventory?parts_id=${isPart}&garage_id=${selectedGarageId}`,
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
                    setIsLoading(false);
                });
        } catch (e) {
            console.log(e);
        } 
    };

    useEffect(() => {
        // getGarageList();
        getPartList();
    }, []);

    useEffect(() => {
        if (isPart != 0 && selectedGarageId != 0) getInvetoryData();
    }, [isPart, selectedGarageId]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.pageContainer}>
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
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>
                            New Stock Details:
                        </Text>

                        <View style={{marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => {
                                    setPartListModal(true);
                                }}
                            >
                                <TextInput
                                    mode="outlined"
                                    label="Part"
                                    style={{
                                        backgroundColor: "#f1f1f1",
                                        width: "100%",
                                    }}
                                    placeholder="Select Part"
                                    value={isPartName}
                                    editable={false}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </TouchableOpacity>
                            {partError?.length > 0 && (
                                <Text style={styles.errorTextStyle}>
                                    {partError}
                                </Text>
                            )}
                        </View>
                            
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
                            setSearchQueryForParts("");
                            setFilteredPartData(partList);
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
                                setSearchQueryForParts("");
                                setFilteredPartData(partList);
                            }}
                        />
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
                                                    onPress={() => {
                                                        setSearchQueryForParts("");
                                                        setFilteredPartData(partList);
                                                    }}
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
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={() => (!isLoading && <Divider />)}
                                data={filteredPartData}
                                style={{
                                    borderColor: "#0000000a",
                                    borderWidth: 1,
                                    flex: 1,
                                }}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No part found!
                                            </Text>
                                        </View>
                                ))}
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
                                                setSearchQueryForParts("");
                                                getPartList();
                                            }}
                                        />
                                    )
                                }
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

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    FlatList,
} from "react-native";
import { TextInput, Divider, List, Modal, Portal } from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconX from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import { API_URL } from "../constants/config";
import { useIsFocused } from "@react-navigation/native";
import { Table, Row, Cell } from "react-native-table-component";
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";

const Parts = ({
    navigation,
    userToken,
    selectedGarageId,
    userRole,
    user,
    selectedGarage,
    garageId,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [partList, setPartList] = useState([]);
    const isFocused = useIsFocused();
    const tableHead = ["(P No.) Name", "Stock", "MRP", "Rack No", "Action"];

    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadMoreParts, setLoadMoreParts] = useState(true);

    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState();

    const [isGarageId, setIsGarageId] = useState();
    const [isGarageName, setIsGarageName] = useState(!selectedGarage ? "" : selectedGarage.garage_name);
    const [garageList, setGarageList] = useState([]);
    const [garageListModal, setGarageListModal] = useState(false);
    const [isLoadingGarageList, setIsLoadingGarageList] = useState(true);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState(); 
    const [garageError, setGarageError] = useState('');   // Error State

    
    const getGarageList = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_owner_garages?user_id=${user.id}&user_role=${userRole}`,
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
            console.log(json);
            if (json !== undefined) {
                setGarageList(json.garage_list);
                setFilteredGarageData(json.garage_list);
                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForGarages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}fetch_owner_garages?user_id=${user.id}&user_role=${userRole}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userToken,
                },
            });
            const json = await response.json();
            if (response.status == "200") {
                setGarageList(json.garage_list);
                setFilteredGarageData(json.garage_list);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const getPartList = async () => {
        if(page == 1) setIsLoading(true)
        if(page != 1) setIsScrollLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_garage_inventory/${isGarageId}?page=${page}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: searchQueryForParts,
                    }),
                }
            );
            const json = await res.json();
            if (json !== undefined) {
                setPartList([...partList, ...json.data.data]);
                // setTableData(json.data);
                setFilteredPartData([...filteredPartData, ...json.data.data]);
                if(page == 1) setIsLoading(false)
                if(page != 1) setIsScrollLoading(false)
                {json.data.current_page != json.data.last_page ? setLoadMoreParts(true) : setLoadMoreParts(false)}
                {json.data.current_page != json.data.last_page ? setPage(page + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const searchFilterForParts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}fetch_garage_inventory/${isGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: searchQueryForParts,
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setPartList(json.data.data);
                setFilteredPartData(json.data.data);
                {json.data.current_page != json.data.last_page ? setLoadMoreParts(true) : setLoadMoreParts(false)}
                {json.data.current_page != json.data.last_page ? setPage(2) : setPage(1)}
                setIsLoading(false);
                setRefreshing(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pullRefresh = async () => {
        setSearchQueryForParts(null);
        try {
            const response = await fetch(
                `${API_URL}fetch_garage_inventory/${isGarageId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + userToken,
                    },
                    body: JSON.stringify({
                        search: "",
                    }),
                }
            );
            const json = await response.json();
            if (response.status == "200") {
                setPartList(json.data.data);
                setFilteredPartData(json.data.data);
                {json.data.current_page != json.data.last_page ? setLoadMoreParts(true) : setLoadMoreParts(false)}
                {json.data.current_page != json.data.last_page ? setPage(2) : setPage(1)}
                // console.log('setPartList', json.data.data);
                setRefreshing(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderFooter = () => {
        return (
            <>
                {isScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
            </>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        pullRefresh();
    };

    useEffect(() => {
        setIsLoading(true);
        getGarageList();
        if(isGarageId) {
            pullRefresh();
        }
        // console.log('1');
    }, [isFocused]);

    useEffect(() => {
        if(!isGarageId && selectedGarageId == 0 && garageList) {
            setIsGarageId(garageList[0]?.id); 
            setIsGarageName(garageList[0]?.garage_name);
        } 
    }, [garageList]);

    useEffect(() => {
            // console.log('4', isGarageId);
        if(isGarageId) {
            setIsLoading(true);
            pullRefresh();
            console.log('2');
        }
    }, [isGarageId]);

    const element = (data, index) => (
        <Icon
            name="chevron-circle-right"
            size={18}
            style={styles.actionArrow}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.customSurface}>
                {(userRole == "Super Admin" ||
                    garageId?.length > 1) && (
                        <View>
                            <TouchableOpacity 
                                onPress={() => {
                                    setGarageListModal(true);
                                }}
                            >
                                <TextInput
                                    mode="outlined"
                                    label='Garage'
                                    style={{marginTop: 10, marginBottom: 20,  backgroundColor: colors.white, width:'100%' }}
                                    placeholder="Select Garage"
                                    editable={false}
                                    value={isGarageName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                            </TouchableOpacity>
                            {garageError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{garageError}</Text>
                            }
                        </View>
                    )}

                {/* Search Bar */}
                <View>
                    <View style={{ marginBottom: 15, flexDirection: "row" }}>
                        <TextInput
                            mode={"flat"}
                            placeholder="Search here..."
                            onChangeText={(text) =>
                                setSearchQueryForParts(text)
                            }
                            value={searchQueryForParts}
                            activeUnderlineColor={colors.transparent}
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
                                        color={colors.light_gray}
                                        onPress={() => onRefresh()}
                                    />
                                )
                            }
                        />
                        <TouchableOpacity
                            onPress={() => searchFilterForParts()}
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
                            <Icon
                                name={"search"}
                                size={17}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    {!isLoading &&
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.container}>
                                <Table>
                                    <Row
                                        data={tableHead}
                                        style={styles.head}
                                        textStyle={styles.textHeading}
                                        flexArr={[2, 1, 1, 1, 1]}
                                    />
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        ItemSeparatorComponent={() => (<Divider />)}
                                        data={filteredPartData}
                                        onEndReached={loadMoreParts ? getPartList : null}
                                        onEndReachedThreshold={0.5}
                                        refreshControl={
                                            <RefreshControl
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                                colors={["green"]}
                                            />
                                        }
                                        ListFooterComponent={loadMoreParts ? renderFooter : null}
                                        ListEmptyComponent={() => (
                                            !isLoading && (
                                                <View style={{ marginVertical: 40, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                                    <Text style={{ color: colors.black }}>
                                                        No part exist!
                                                    </Text>
                                                </View>
                                        ))}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => (
                                            <View style={{ margin: 5 }}>
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection:
                                                            "row",
                                                    }}
                                                    onPress={() => {
                                                        navigation.navigate(
                                                            "EditStock",
                                                            { data: item }
                                                        );
                                                    }}
                                                >
                                                    <Cell
                                                        data={
                                                            item.parts.name
                                                        }
                                                        style={{ flex: 2 }}
                                                        textStyle={
                                                            styles.text
                                                        }
                                                    />
                                                    <Cell
                                                        data={
                                                            item.current_stock
                                                        }
                                                        style={{ flex: 1 }}
                                                        textStyle={
                                                            styles.text
                                                        }
                                                    />
                                                    <Cell
                                                        data={item.mrp}
                                                        style={{ flex: 1 }}
                                                        textStyle={
                                                            styles.text
                                                        }
                                                    />
                                                    <Cell
                                                        data={item.rack_id}
                                                        style={{ flex: 1 }}
                                                        textStyle={
                                                            styles.text
                                                        }
                                                    />
                                                    <Cell
                                                        data={element(
                                                            item,
                                                            index
                                                        )}
                                                        style={{ flex: 1 }}
                                                        textStyle={
                                                            styles.text
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </Table>
                            </View>
                        </ScrollView>
                    }
                </View>
            </View>
            <Portal>
                 {/* Garage List Modal */}
                 <Modal
                        visible={garageListModal}
                        onDismiss={() => {
                            setGarageListModal(false);
                            setSearchQueryForGarages("");
                            getGarageList();
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
                                getGarageList();
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
                                                No garage found!
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
                                                setSearchQueryForGarages("");
                                                getGarageList();
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
    container: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    head: {
        height: 60,
        backgroundColor: colors.secondary,
        padding: 7,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    text: {
        margin: 6,
        color: colors.black,
    },
    textHeading: {
        margin: 6,
        color: colors.white,
    },
    row: {
        flexDirection: "row",
        padding: 7,
    },
    btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
    btnText: { textAlign: "center", color: "#fff" },
    customSurface: {
        padding: 15,
        flexDirection: "column",
        flex: 1,
    },
    buttonBlue: {
        marginBottom: 15,
        fontSize: 14,
        textTransform: "capitalize",
    },
    buttonStyle: {
        alignItems: "center",
        flexDirection: "row",
        padding: 5,
    },
    downloadIcon: {
        marginRight: 10,
        fontSize: 22,
    },
    tableHeaderText: {
        color: colors.black,
        fontSize: 16,
    },
    actionArrow: {
        fontSize: 16,
        color: colors.black,
        marginLeft: 15,
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 30
    },
    footer: {
        marginVertical: 15,
    },
    garageDropDownField: {
        fontSize: 16,
        color: colors.black,
        position: 'absolute',
        marginTop: 15,
        left: 0,
        top: 0,
        width: '100%',
        height: '80%',
        zIndex: 2,
    },
    headingStyle: {
        color: colors.black,
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
});

const mapStateToProps = (state) => ({
    userRole: state.role.user_role,
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    user: state.user.user,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
});

export default connect(mapStateToProps)(Parts);

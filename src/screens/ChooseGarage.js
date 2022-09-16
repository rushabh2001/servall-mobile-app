import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    RefreshControl,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { Divider, List } from "react-native-paper";
import { colors } from "../constants";
import Icon from "react-native-vector-icons/FontAwesome5";
import { API_URL } from "../constants/config";
import { setSelectedGarage } from "../actions/garage";

const ChooseGarage = ({
    navigation,
    userToken,
    userRole,
    setSelectedGarage,
    userId,
    selectedGarageId,
    selectedGarage,
    user,
}) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadMoreGarages, setLoadMoreGarages] = useState(true);

    const getGarageList = async () => {
        {
            page == 1 && setIsLoading(true);
        }
        {
            page != 1 && setIsScrollLoading(true);
        }
        try {
            const res = await fetch(
                `${API_URL}fetch_owner_garages?page=${page}`,
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
                        search: "",
                    }),
                }
            );
            const json = await res.json();
            console.log("fetch_owner_garages", json);
            if (json !== undefined) {
                setData([...data, ...json.garage_list.data]);
                {
                    page == 1 ? setIsLoading(false) : null
                }
                {
                    page != 1 ? setIsScrollLoading(false) : null
                }
                {json.garage_list.current_page != json.garage_list.last_page ? setLoadMoreGarages(true) : setLoadMoreGarages(false)}
                {json.garage_list.current_page != json.garage_list.last_page ? setPage(page + 1) : null}
            }
        } catch (e) {
            console.log(e);
        }
    };

    const pullRefresh = async () => {
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
                    search: "",
                }),
            });
            const json = await response.json();
            console.log("1", json);
            if (response.status == "200") {
                setData(json.garage_list.data);
                {json.garage_list.current_page != json.garage_list.last_page ? setLoadMoreGarages(true) : setLoadMoreGarages(false)}
                {json.garage_list.current_page != json.garage_list.last_page ? setPage(2) : null}
                setRefreshing(false);
            } else {
                // console.log('2', response.status);
                setRefreshing(false);
            }
        } catch (error) {
            // if (error?.message == 'Unauthenticated.') signOut();
            console.error(error);
        } finally {
            setIsLoading(false);
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
        if (isFocused) {
            setData([]);
            pullRefresh();
        } else {
            setData([]);
        }
    }, [isFocused]);

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
            <View style={styles.surfaceContainer}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <ActivityIndicator></ActivityIndicator>
                    </View>
                ) : (
                    <View
                        style={[
                            styles.mainContainer,
                            userRole == "Super Admin" && { marginBottom: 70 },
                        ]}
                    >
                        {userRole == "Super Admin" && (
                            <List.Item
                                title="Global Values"
                                description="For Super Admin Only"
                                right={() =>
                                    selectedGarageId == 0 ? (
                                        <Icon
                                            name={"check"}
                                            size={14}
                                            style={{
                                                alignSelf: "center",
                                                marginRight: 8,
                                            }}
                                            color={colors.white}
                                        />
                                    ) : (
                                        <Icon
                                            name={"chevron-right"}
                                            size={14}
                                            style={{ alignSelf: "center" }}
                                            color={colors.gray}
                                        />
                                    )
                                }
                                onPress={() => {
                                    setSelectedGarage({
                                        selected_garage: 0,
                                        selected_garage_id: 0,
                                    });
                                    navigation.goBack(null);
                                }}
                                style={
                                    selectedGarageId == 0 && {
                                        backgroundColor: colors.primary,
                                        borderRadius: 5,
                                    }
                                }
                                titleStyle={
                                    selectedGarageId == 0 && {
                                        color: colors.white,
                                    }
                                }
                                descriptionStyle={
                                    selectedGarageId == 0 && {
                                        color: colors.white,
                                    }
                                }
                            />
                        )}
                        <FlatList
                                showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                                <>
                                    <Divider />
                                    <Divider />
                                </>
                            )}
                            data={data}
                            onEndReached={loadMoreGarages ? getGarageList : null}
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={["green"]}
                                />
                            }
                            ListFooterComponent={loadMoreGarages ? renderFooter : null}
                            ListEmptyComponent={() => (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: "#0B2E40",
                                        }}
                                    >
                                        No Garage found.
                                    </Text>
                                </View>
                            )}
                            keyExtractor={(item) => `garage-${item.id}`}
                            renderItem={({ item }) => {
                                if (item != 0) {
                                    return (
                                        <List.Item
                                            title={item.garage_name}
                                            description={item.owner_garage.name}
                                            right={() =>
                                                selectedGarageId == item.id ? (
                                                    <Icon
                                                        name={"check"}
                                                        size={14}
                                                        style={{
                                                            alignSelf: "center",
                                                            marginRight: 8,
                                                        }}
                                                        color={colors.white}
                                                    />
                                                ) : (
                                                    <Icon
                                                        name={"chevron-right"}
                                                        size={14}
                                                        style={{
                                                            alignSelf: "center",
                                                        }}
                                                        color={colors.gray}
                                                    />
                                                )
                                            }
                                            onPress={() => {
                                                setSelectedGarage({
                                                    selected_garage: item,
                                                    selected_garage_id: item.id,
                                                });
                                                navigation.goBack(null);
                                            }}
                                            style={
                                                selectedGarageId == item.id && {
                                                    backgroundColor:
                                                        colors.primary,
                                                    borderRadius: 5,
                                                }
                                            }
                                            titleStyle={
                                                selectedGarageId == item.id && {
                                                    color: colors.white,
                                                }
                                            }
                                            descriptionStyle={
                                                selectedGarageId == item.id && {
                                                    color: colors.white,
                                                }
                                            }
                                        />
                                    );
                                } else {
                                    return (
                                        <Text style={{ textAlign: "center" }}>
                                            No Garage Found
                                        </Text>
                                    );
                                }
                            }}
                        />
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
    surfaceContainer: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
    },
    mainContainer: {
        backgroundColor: colors.white,
        padding: 10,
        elevation: 4,
    },
});

const mapStateToProps = (state) => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
});

const mapDispatchToProps = (dispatch) => ({
    setSelectedGarage: (data) => dispatch(setSelectedGarage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseGarage);

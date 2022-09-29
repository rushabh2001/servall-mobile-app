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
import Spinner from "react-native-loading-spinner-overlay";
import CommonHeader from "../Component/CommonHeaderComponent";

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
        setIsLoading(true)
        try {
            const res = await fetch(
                `${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`,
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
            console.log("fetch_owner_garages", json);
            if (json !== undefined) {
                setData(json.garage_list);
                setIsLoading(false)
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getGarageList();

        // if (isFocused) {
        //     setData([]);
        // pullRefresh();
        // } else {
        //     setData([]);
        // }
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            {!isLoading && 
                <>
                  
                    <View style={styles.surfaceContainer}>
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
                                ItemSeparatorComponent={() => <Divider />}
                                data={data}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={() => (
                                    !isLoading && (
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white }}>
                                            <Text style={{ color: colors.black }}>
                                                No garage found.
                                            </Text>
                                        </View>
                                ))}
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
                    </View>
                </>
            }
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

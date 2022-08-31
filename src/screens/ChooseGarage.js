import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { useIsFocused  } from '@react-navigation/native';
import { connect } from "react-redux";
import { Divider, List } from "react-native-paper";
import { colors } from "../constants";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API_URL } from "../constants/config";
import { setSelectedGarage } from '../actions/garage';

const ChooseGarage = ({ navigation, userToken, userRole, setSelectedGarage, userId, selectedGarageId }) => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    const [page, setPage] = useState(1);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const getGarageList = async () => {
        { page == 1 && setIsLoading(true) }
        { page != 1 && setIsScrollLoading(true) }
        try {
            const res = await fetch(`${API_URL}fetch_owner_garages?page=${page}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    user_id: userId,
                    user_role: userRole,
                }),
            });
            const json = await res.json();
            console.log('fetch_owner_garages', json);
            if (json !== undefined) {
                setData([
                    ...data,
                    ...json.garage_list.data
                  ]);
                // setData(json.garage_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            { page == 1 && setIsLoading(false) }
            { page != 1 && setIsScrollLoading(false) }
            setPage(page + 1);
        }
    };

    const pullRefresh = async () => {
        try {
            const response  = await fetch(`${API_URL}fetch_owner_garages`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify({
                    user_id: userId,
                    user_role: userRole,
                }),
            });
            const json = await response.json();
            console.log('1', json);
            if (response.status == '200') {
                setData(json.garage_list.data);
                setPage(2);
                setRefreshing(false);
            } else {
                // console.log('2', response.status);
                setRefreshing(false);
            }
        } catch (error) {
            // if (error?.message == 'Unauthenticated.') signOut();
            console.error(error);
        }
    };

    const renderFooter = () => {
        return (
            <>
                {isScrollLoading && (
                    <View style={styles.footer}>
                        <ActivityIndicator
                            size="large"
                        />
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
        if(isFocused) {
            setData([]);
            getGarageList();
        } else {
            setData([]);
        }
    }, [isFocused]);

    return (
        <View style={styles.surfaceContainer}>
            {isLoading ? <ActivityIndicator style={{paddingVertical: 20}}></ActivityIndicator> : 
                <View style={[styles.mainContainer, userRole == "Super Admin" && {marginBottom: 70}]}>
                    {userRole == "Super Admin" &&
                        <List.Item
                            title="Global Values"
                            description="For Super Admin Only"
                            right={()=> (selectedGarageId == 0 ? <Icon name={'check'} size={14} style={{alignSelf:'center', marginRight: 8}} color={colors.white} /> : <Icon name={'chevron-right'} size={14} style={{alignSelf:'center'}} color={colors.gray} />)}
                            onPress={() => { setSelectedGarage({ selected_garage: 0, selected_garage_id: 0 }); navigation.goBack(null); }}
                            style={selectedGarageId == 0 && {backgroundColor:colors.primary, borderRadius: 5} }
                            titleStyle={selectedGarageId == 0 && {color:colors.white} }
                            descriptionStyle={selectedGarageId == 0 && {color:colors.white} }
                        />
                    }
                    <FlatList
                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                        data={data}
                        onEndReached={getGarageList}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['green']}
                            />
                        }
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={() => (
                            <View style={styles.nodata}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#0B2E40',
                                    }}>
                                    No Garage found.
                                </Text>
                            </View>
                        )}
                        keyExtractor={item => `garage-${item.id}`}
                        renderItem={({item}) => {
                            if (item != 0) {
                                return (
                                    <List.Item
                                        title={item.garage_name}
                                        description={item.owner_garage.name}
                                        right={()=> (selectedGarageId == item.id ? <Icon name={'check'} size={14} style={{alignSelf:'center', marginRight: 8}} color={colors.white} /> : <Icon name={'chevron-right'} size={14} style={{alignSelf:'center'}} color={colors.gray} />)}
                                        onPress={() => { setSelectedGarage({ selected_garage: item, selected_garage_id: item.id }); navigation.goBack(null); }}
                                        style={selectedGarageId == item.id && {backgroundColor:colors.primary, borderRadius: 5} }
                                        titleStyle={selectedGarageId == item.id && {color:colors.white} }
                                        descriptionStyle={selectedGarageId == item.id && {color:colors.white} }
                                    />
                                )
                            } else {
                                return (
                                    <Text style={{textAlign: "center"}}>No Garage Found</Text>
                                )
                            }
                        }}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        flexDirection: 'column',
        padding:10
    },
    mainContainer: {
        backgroundColor: colors.white,
        padding: 10,
        elevation: 4,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    selectedGarageId: state.garage.selected_garage_id,
})

const mapDispatchToProps = (dispatch) => ({
    setSelectedGarage: (data) => dispatch(setSelectedGarage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseGarage);

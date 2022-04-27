// Libraries which uses to build our component
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { useIsFocused  } from '@react-navigation/native';
import { connect } from "react-redux";
import { Divider, List, useTheme } from "react-native-paper";
import { colors } from "../constants";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API_URL } from "../constants/config";
import { setSelectedGarage } from '../actions/garage';

// What we have display

const ChooseGarage = ({ navigation, userToken, userRole, setSelectedGarage, userId }) => {

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    const getGarageList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_owner_garages?user_id=${userId}&user_role=${userRole}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setData(json.garage_list);
                // console.log(json);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log(userRole);
        // console.log(userId);
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
                // <View style={{flexDirection: "column", backgroundColor:colors.white, marginVertical:15 }}>
                <View style={[styles.mainContainer, userRole == "Super Admin" && {marginBottom: 70}]}>
                        {userRole == "Super Admin" &&
                        <List.Item
                            title="Global Values"
                            description="For Super Admin Only"
                            right={()=> (<Icon name={'chevron-right'} size={14} style={{alignSelf:'center'}} color={colors.gray} />)}
                            onPress={() => { setSelectedGarage({ selected_garage: 0 }); navigation.navigate('inside', {screen: "Services"} ); }}
                        />
                        }
                        <FlatList
                            ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                            // style={userRole == "Super Admin" && {marginBottom: 100}}
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => {
                                if (item != 0) {
                                    return (
                                        <List.Item
                                            title={item.garage_name}
                                            description={item.owner_garage.name}
                                            right={()=> (<Icon name={'chevron-right'} size={14} style={{alignSelf:'center'}} color={colors.gray} />)}
                                            onPress={() => { setSelectedGarage({ selected_garage: item, selected_garage_id: item.id }); navigation.navigate('inside', {screen: "Services"}); }}
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
                {/* <Divider />
                <Divider />
                <List.Item
                    title='Add Garage'
                    // description='hello'
                    right={()=> (<Icon name={'plus'} size={14} style={{alignSelf:'center'}} color={colors.gray} />)}
                    onPress={() => navigation.navigate('AllStack', {screen: "AddGarage"} )}
                /> */}
            
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
    userId: state.user?.user?.user_data?.id,
})

const mapDispatchToProps = (dispatch) => ({
    setSelectedGarage: (data) => dispatch(setSelectedGarage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseGarage);

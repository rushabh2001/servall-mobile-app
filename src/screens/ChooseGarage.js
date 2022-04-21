// Libraries which uses to build our component
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from "react-native";
import { useIsFocused  } from '@react-navigation/native';
import { connect } from "react-redux";
import { Divider, List, useTheme } from "react-native-paper";
import { colors } from "../constants";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API_URL } from "../constants/config"

// What we have display

const ChooseGarage = ({ navigation, userToken }) => {

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    const getGarageList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_garages`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
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
            <View style={styles.mainContainer}>
                {isLoading ? <ActivityIndicator style={{paddingVertical: 20}}></ActivityIndicator> : 
                // <View style={{flexDirection: "column", backgroundColor:colors.white, marginVertical:15 }}>
                    <FlatList
                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => {
                            if (item != 0) {
                                return (
                                    <List.Item
                                        title={item.garage_name}
                                        description={item.owner_garage.name}
                                        right={()=> (<Icon name={'chevron-right'} size={14} style={{alignSelf:'center'}} color={colors.gray} />)}
                                        onPress={() => navigation.navigate('inside', {screen: "Services"} )}
                                    />
                                )
                            } else {
                                return (
                                    <Text style={{textAlign: "center"}}>No Garage Found</Text>
                                )
                            }
                        }}
                    /> 
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
})

export default connect(mapStateToProps)(ChooseGarage);

import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Linking, ActivityIndicator, FlatList } from "react-native";
import { connect } from 'react-redux';
import { List, Button, Divider, Searchbar } from "react-native-paper";
import { colors } from  "../constants";
import  { API_URL } from "../constants/config"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
 
const VehicleSearch = ({navigation, userToken, garageId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const refRBSheet = useRef();
    const [isGarageId, setGarageId] = useState(garageId);
    const [data, setData] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        getCustomerList();
    }, []);

    const getCustomerList = async () => {
        try {
            const res = await fetch(`${API_URL}fetch_my_garage_customers?garage_id=${isGarageId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                // console.log(json);
                setData(json.user_list);
                setFilteredData(json.user_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const searchFilter = (text) => {
        if (text) {
            const newData = data.filter(
                function (listData) {
                let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
                let arr1 = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                let itemData = arr1.concat(arr2);
                // console.log(itemData);
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredData(newData);
            setSearchQuery(text);
        } else {
            setFilteredData(data);
            setSearchQuery(text);
        }
    };

    //  useEffect(() => {
    //    console.log(customerId);
    // }, [customerId]);

    useEffect(() => {
       console.log(isGarageId);
    }, [isGarageId]);

    return (
        <View style={styles.surfaceContainer}>
            <Searchbar
                placeholder="Search here..."
                onChangeText={(text) => searchFilter(text)}
                value={searchQuery}
            />
            <View style={{flexDirection: "column", backgroundColor:colors.white, marginVertical:15, elevation: 2 }}>
                {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
                    <FlatList
                        ItemSeparatorComponent= {() => (<Divider />)}
                        data={filteredData}
                        // onEndReachedThreshold={1}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <List.Item
                                title={
                                    <View style={{flexDirection:"column"}} >
                                        <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                            <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                            <Text>   ({item.phone_number})</Text>
                                        </View>
                                        <View style={{flexDirection:"row", alignItems:"center", marginVertical:15, flex:1}}>
                                            <View style={{width:130}}>
                                                <Button
                                                    onPress={() => Linking.openURL(`https://wa.me/${item.phone_number}`) }
                                                    style={styles.buttonStyle}
                                                    color={colors.secondary}
                                                    icon={ (color) => <Icon name={'whatsapp'} size={24} color={colors.secondary}  /> }
                                                    uppercase={false} 
                                                ><Text style={{fontSize:12}}>Whatsapp</Text></Button>
                                            </View>
                                            <View style={{width:15}}></View>
                                            <View style={{width:100}}>
                                                <Button
                                                    onPress={() => Linking.openURL(`tel:${item.phone_number}`) }
                                                    style={styles.buttonStyle}
                                                    color={colors.secondary}
                                                    icon={ (color) => <Icon name={'phone'} size={24} color={colors.secondary}  /> }
                                                    uppercase={false} 
                                                ><Text style={{fontSize:12}}>Call</Text></Button>
                                            </View>
                                        </View>
                                    </View> 
                                }
                                right={() => <Icon onPress={() => { refRBSheet.current.open(); setCustomerId(item.id); }}  type={"MaterialCommunityIcons"} style={{right: 5, top: 8,position: 'absolute',}} name={'dots-vertical'} size={22}  color={colors.gray} />}
                            />
                        )}
                        // keyExtractor={(item, index) => index.toString()}
                    />   
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        padding:15,
        marginBottom: 35
    },
    buttonStyle: {
        letterSpacing: 0,
        lineHeight:0,
        fontSize: 10,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(VehicleSearch);

import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Linking, ActivityIndicator, FlatList } from "react-native";
import { connect } from 'react-redux';
import { List, Button, Divider, Searchbar } from "react-native-paper";
import { colors } from  "../constants";
import  { API_URL } from "../constants/config"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import { useIsFocused  } from '@react-navigation/native';
 
const MyCustomer = ({ navigation, userToken, selectedGarageId, selectedGarage }) => {
    const [isLoading, setIsLoading] = useState(true);
    const refRBSheet = useRef();
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);
    const isFocused = useIsFocused();

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

    useEffect(() => {
        getCustomerList();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getCustomerList();
    }, [isFocused]);

    return (
        <View style={styles.surfaceContainer}>
            {selectedGarageId == 0 ? <Text style={styles.garageNameTitle}>All Garages</Text> : <Text style={styles.garageNameTitle}>{selectedGarage.garage_name}</Text> }
            <Searchbar
                placeholder="Search here..."
                onChangeText={(text) => { if(text != null) searchFilter(text)}}
                value={searchQuery}
            />
            <View style={{flexDirection: "column", backgroundColor:colors.white, elevation: 2, marginTop:15, marginBottom: 65 }}>
                {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
                    (data?.length > 0 ?  
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
                                    right={() => <Icon onPress={() => { setCustomerId(item.id); refRBSheet.current.open();}}  type={"MaterialCommunityIcons"} style={{right: 5, top: 8,position: 'absolute',}} name={'dots-vertical'} size={22}  color={colors.gray} />}
                                />
                            )}
                            // keyExtractor={(item, index) => index.toString()}
                        />
                    :
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                            <Text style={{ color: colors.black, textAlign: 'center'}}>No Customers are associated with this Garage!</Text>
                        </View>
                    )
                }
            </View>
            <RBSheet
                ref={refRBSheet}
                height={63}
                openDuration={250}
                >
                <View style={{flexDirection:"column", flex:1}}>
                    <List.Item
                        title="View Customer Details"
                        style={{paddingVertical:15}}
                        onPress={() => { navigation.navigate("CustomerDetails", { userId: customerId });  refRBSheet.current.close(); }}
                        left={() => (<Icon type={"MaterialCommunityIcons"} name="eye" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                    />
                    {/* <Divider /> */}
                    {/* <List.Item
                        title="Activity Log"
                        style={{paddingVertical:15}}
                        onPress={() =>  { navigation.navigate("MyCustomers");  refRBSheet.current.close(); }}
                        left={() => (<Icon type={"MaterialCommunityIcons"} name="clipboard-list-outline" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                    />
                    <Divider />
                    <List.Item
                        title="Add Note"
                        style={{paddingVertical:15}}
                        onPress={() => { navigation.navigate("MyCustomers");  refRBSheet.current.close(); }}
                        left={() => (<Icon type={"MaterialCommunityIcons"} name="notebook-plus-outline" style={{marginHorizontal:10, alignSelf:"center"}} color={colors.black} size={26} />)}
                    /> */}
                </View>
            </RBSheet>
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
    },
    garageNameTitle: {
        borderRadius: 6, 
        marginBottom: 15, 
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: '600', 
        color: colors.white, 
        paddingVertical: 7, 
        backgroundColor: colors.secondary
    }
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    // garage: state.garage.garage,
    // userId: state.user.user.user_data.id,
})

export default connect(mapStateToProps)(MyCustomer);

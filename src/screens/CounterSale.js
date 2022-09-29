import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';

const CounterSale = ({navigation, userToken, selectedGarageId, selectedGarage, user }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGarageId, setGarageId] = useState(selectedGarageId);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(); 
    const [filteredData, setFilteredData] = useState([]);

    const getUserList = async () => {
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

    const sendUserData = (index) => {
        const userData = {
            'user_id': filteredData[index]?.id,
            'garage_id': isGarageId,
            'name': filteredData[index]?.name,
            'email': filteredData[index]?.email,
            'phone_number': filteredData[index]?.phone_number,
            'city': filteredData[index]?.city,
            'state': filteredData[index]?.state,
            'address': filteredData[index]?.address,
        }
        navigation.navigate('CounterSaleStep2', { 'data': userData } );
    }

    useEffect(() => {
        getUserList();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CommonHeader />
            <View style={styles.surfaceContainer}>
                <Searchbar
                    placeholder="Search here..."
                    onChangeText={(text) => searchFilter(text)}
                    value={searchQuery}
                />
                <View style={{flexDirection: "column", marginVertical:15 }}>
                    {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
                        (filteredData.length != 0 ? 
                            <View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent= {() => (<Divider />)}
                                    data={filteredData}
                                    keyExtractor={item => item.id}
                                    renderItem={({item, index}) => (
                                        <View style={styles.cards}>
                                            <View>
                                                <Text style={styles.cardCustomerName}>Customer Name: {item ? item?.name : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardCustomerName}>Phone Number: {item ? item?.phone_number : null}</Text>
                                                <Divider />
                                                <Text style={styles.cardCustomerName}>Email Address: {item.email}</Text>
                                            </View>
                                            <View style={styles.cardActions}>
                                                <TouchableOpacity onPress={()=> sendUserData(index)} style={[styles.smallButton, {width: 150, marginTop:8}]}><Text style={{color:colors.primary}}>Select User</Text></TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />     
                            </View>
                        :
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 ,  backgroundColor:colors.white,}}>
                                <Text style={{ color: colors.black, textAlign: 'center'}}>No Users are associated with this Garage!</Text>
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    garageNameTitle: {
        textAlign: 'center', 
        fontSize: 17, 
        fontWeight: '500', 
        color: colors.white, 
        paddingVertical: 7, 
        backgroundColor: colors.secondary,
        position: 'absolute',
        top: 0,
        zIndex: 5,
        width: '100%',
        flex: 1,
        left: 0, 
        right: 0
    },
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
    cards: {
        padding: 25,
        elevation: 3,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    cardTags: {
        flexDirection: "row",
    },
    tags: {
        fontSize: 12,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: colors.black,
        color: colors.black,
        marginRight: 3,
    },
    cardOrderDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 7,
    },
    orderStatus: {
        fontSize: 16,
        backgroundColor: colors.secondary,
        paddingVertical: 3,
        paddingHorizontal: 7,
        color: colors.white,
        marginHorizontal: 10,
    },
    orderID: {
        color: colors.black,
        borderColor: colors.black,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 7,
    },
    orderAmount: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4        
    },
    cardCustomerName: {
        color: colors.black,
        fontSize: 16,
        paddingVertical: 4      
    },
    orderDate: {
        color: colors.black,
        paddingVertical: 4,
        fontSize: 16,
    },
    kmNoted: {
        color: colors.black,
        paddingVertical: 4,
        fontSize: 16,   
    },
    modalContainerStyle: {
        backgroundColor: 'white', 
        padding: 20,
        marginHorizontal: 30,
        marginTop: 40,
        marginBottom: 70
    },
    cardDetailsHeading: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: 'bold' 
    }, 
    cardDetailsData: {
        color: colors.black,
        fontSize: 16,
        paddingTop: 4,
        paddingBottom: 4
    },
    headingStyle: {
        color: colors.black,
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    smallButton: {
        fontSize: 16,
        color: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 3,
        marginHorizontal: 4,
        marginTop: 3,
    },
    verticleImage: {
        height: 150,
        resizeMode: 'contain',  
        flex: 1, 
    }, 
    lightBoxWrapper: {
        width: 150,
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    user: state.user.user,
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
})

export default connect(mapStateToProps)(CounterSale);
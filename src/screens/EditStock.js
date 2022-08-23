import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { Modal, Portal, Button, TextInput, Searchbar, Divider, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import InputScrollView from 'react-native-input-scroll-view';
import { Picker } from '@react-native-picker/picker';

const EditStock = ({ navigation, userRole, userId, userToken, route, garageId }) => {

    // User / Customer Fields
    const [isPart, setIsPart] = useState(route?.params?.data?.parts?.id);
    const [isPartName, setIsPartName] = useState(route?.params?.data?.parts?.name);
    const [isStockId, setIsStockId] = useState(route?.params?.data?.id);
    const [isPrice, setIsPrice] = useState(route?.params?.data?.purchase_price);
    const [isMRP, setIsMRP] = useState(route?.params?.data?.mrp);
    const [isCurrentStock, setIsCurrentStock] = useState(route?.params?.data?.current_stock);
    const [isMinStock, setIsMinStock] = useState(route?.params?.data?.min_stock);
    const [isMaxStock, setIsMaxStock] = useState(route?.params?.data?.max_stock);
    const [isRackId, setIsRackId] = useState(route?.params?.data?.rack_id);
    const [isComment, setIsComment] = useState(route?.params?.data?.comment);
    
    // Error States
    const [priceError, setPriceError] = useState('');    
    const [mrpError, setMrpError] = useState('');
    const [currentStockError, setCurrentStockError] = useState('');
    const [minStockError, setMinStockError] = useState('');
    const [maxStockError, setMaxStockError] = useState('');
    const [rackIdError, setAddressError] = useState('');
    const [commentError, setCommentError] = useState('');

    // Vendor Fields
    // const [isVendor, setIsVendor] = useState();
    // const [isVendorName, setIsVendorName] = useState();
    // const [vendorError, setVendorError] = useState('');
    // const [vendorList, setVendorList] = useState([]);
    // const [addVendorModal, setAddVendorModal] = useState(false);
    // const [newVendor, setNewVendor] = useState();
    // const [newVendorError, setNewVendorError] = useState();

    // States for Garage Dropdown
    const [isGarage, setIsGarage] = useState(route?.params?.data?.garage?.id);
    const [isGarageName, setIsGarageName] = useState(!route?.params?.data?.garage?.garage_name ? "" : route?.params?.data?.garage?.garage_name);
    const [garageList, setGarageList] = useState([]);
    const [garageListModal, setGarageListModal] = useState(false);
    const [isLoadingGarageList, setIsLoadingGarageList] = useState(false);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState(); 
    const [garageError, setGarageError] = useState();
  
    const [isLoading, setIsLoading] = useState(false);
    const scroll1Ref = useRef();

    // Functions Dropdown
    const searchFilterForGarages = (text) => {
        if (text) {
            let newData = garageList.filter(
                function (listData) {
                let itemData = listData.garage_name ? listData.garage_name.toUpperCase() : ''.toUpperCase()
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredGarageData(newData);
            setSearchQueryForGarages(text);
        } else {
            setFilteredGarageData(garageList);
            setSearchQueryForGarages(text);
        }
    };

    const getGarageList = async () => {
        setIsLoadingGarageList(true);
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
                setGarageList(json.garage_list);
                setFilteredGarageData(json.garage_list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingGarageList(false)

        }
    };

    const validate = () => {
        return !(
            !isPart || isPart === 0 ||
            !isPrice || isPrice?.trim().length === 0 ||
            !isCurrentStock || isCurrentStock?.trim().length === 0 ||
            !isMRP || isMRP?.trim().length === 0 ||
            !isRackId || isRackId?.trim().length === 0 ||
            !isMinStock || isMinStock?.trim().length === 0 ||
            !isMaxStock || isMaxStock?.trim().length === 0 ||
            // !isVendor || isVendor === 0 ||
            !isGarage || isGarage === 0 
        )
    }

    const submit = () => {
        Keyboard.dismiss();
        if (!validate()) {
            if (!isPart) setPartError("Part is required"); else setPartError('');
            if (!isPrice) setPriceError("Price is required"); else setPriceError('');
            if (!isMRP) setMrpError("MRP is required"); else setMrpError('');
            if (!isRackId) setRackIdError("Rack ID is required"); else setRackIdError('');
            if (!isCurrentStock) setCurrentStockError("Current Stock is required"); else setCurrentStockError('');
            if (!isMinStock) setMinStockError("Minimum Stock is required"); else setMinStockError('');
            if (!isMaxStock) setMaxStockError("Maximum Stock is required"); else setMaxStockError('');
            // if (!isVendor || isVendor === 0) setVendorError('Brand is required'); else setVendorError('');
            if (!isGarage || isGarage == 0) setGarageError("Customer Belongs to Garage Field is required"); else setGarageError('');
            return;
        }

        const data = {
            'parts_id': isPart,
            'garage_id': isGarage,
            // 'vendor_id': isVendor,
            'purchase_price': isPrice?.trim(),
            'mrp': isMRP?.trim(),
            'rack_id': isRackId?.trim(),
            'current_stock': isCurrentStock?.trim(),
            'min_stock': isMinStock?.trim(),
            'max_stock': isMaxStock?.trim(),
            'comment': isComment?.trim(),
        }

        addStock(data); 
    }

    const addStock = async (data) => {
        try {
            const res = await fetch(`${API_URL}add_inventory`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (json !== undefined) {
                console.log(json);
                navigation.navigate('Parts');
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // getBrandList();
        getGarageList();
    }, []);

    return (
        <View style={styles.pageContainer}>
            {isLoading == true ? <ActivityIndicator></ActivityIndicator> :
                <InputScrollView
                    ref={scroll1Ref}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={8}
                    behavior="padding"
                >
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headingStyle, { marginTop: 20 }]}>Stock Details:</Text>
                        <TextInput
                            mode="outlined"
                            label='Part'
                            style={{marginTop: 10, backgroundColor: '#f1f1f1', width:'100%' }}
                            placeholder="Select Part"
                            value={isPartName}
                            right={<TextInput.Icon name="menu-down" />}
                            disabled={true}
                        />

                        {/* <View style={styles.dropDownContainer}>
                            <Picker
                                selectedValue={isVendor}
                                onValueChange={(optionId) => { setIsVendor(optionId); if (optionId == "new_vendor") setAddVendorModal(true) }}
                                style={styles.dropDownField}
                                itemStyle={{ padding: 0 }}
                            >
                                <Picker.Item label="Select Vendor" value="0" />
                                {vendorList.map((vendorList, i) => {
                                    return (
                                        <Picker.Item
                                            key={'vendor'+i}
                                            label={vendorList.name}
                                            value={vendorList.id}
                                        />
                                    );
                                })}
                                <Picker.Item label="Add New Vendor" value="new_vendor" />
                            </Picker>
                        </View>
                        {vendorError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{vendorError}</Text>
                        } */}

                        <TextInput
                            mode="outlined"
                            label='Purchase Price (Without GST)'
                            style={styles.input}
                            placeholder="Purchase Price (Without GST)"
                            value={isPrice}
                            onChangeText={(text) => setIsName(text)}
                            keyboardType={"phone-pad"}
                        />
                        {priceError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{priceError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='MRP'
                            style={styles.input}
                            placeholder="MRP"
                            value={isMRP}
                            onChangeText={(text) => setIsMRP(text)}
                            keyboardType={"phone-pad"}
                        />
                        {mrpError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{mrpError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Rack ID'
                            style={styles.input}
                            placeholder="Rack ID"
                            value={isRackId}
                            onChangeText={(text) => setIsRackId(text)}
                            keyboardType={"phone-pad"}
                        />
                        {rackIdError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{rackIdError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Current Stock'
                            style={styles.input}
                            placeholder="Current Stock"
                            value={isCurrentStock}
                            onChangeText={(text) => setIsCurrentStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {currentStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{currentStockError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Minimum Stock'
                            style={styles.input}
                            placeholder="Minimum Stock"
                            value={isMinStock}
                            onChangeText={(text) => setIsMinStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {minStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{minStockError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Maximum Stock'
                            style={styles.input}
                            placeholder="Maximum Stock"
                            value={isMaxStock}
                            onChangeText={(text) => setIsMaxStock(text)}
                            keyboardType={"phone-pad"}
                        />
                        {maxStockError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{maxStockError}</Text>
                        }

                        <TextInput
                            mode="outlined"
                            label='Comment'
                            style={styles.input}
                            placeholder="Comment"
                            value={isComment}
                            onChangeText={(text) => setIsComment(text)}
                            numberOfLines={3}
                            multiline={true}
                        />
                        {commentError?.length > 0 &&
                            <Text style={styles.errorTextStyle}>{commentError}</Text>
                        }

                        {(userRole == "Super Admin" || garageId?.length > 1) &&
                            <View>
                                <TouchableOpacity 
                                    style={styles.garageDropDownField} 
                                    onPress={() => {
                                        setGarageListModal(true);
                                    }}
                                >
                                </TouchableOpacity>
                                <TextInput
                                    mode="outlined"
                                    label='Garage'
                                    style={{marginTop: 10, backgroundColor: '#f1f1f1', width:'100%' }}
                                    placeholder="Select Garage"
                                    value={isGarageName}
                                    right={<TextInput.Icon name="menu-down" />}
                                />
                                {garageError?.length > 0 &&
                                    <Text style={styles.errorTextStyle}>{garageError}</Text>
                                }
                            </View>
                        }
              
                        <Button
                            style={{ marginTop: 15 }}
                            mode={'contained'}
                            onPress={submit}
                        >
                            Update
                        </Button>
                     
                    </View>
                </InputScrollView>
            }
            <Portal>
                {/* <Modal visible={addVendorModal} onDismiss={() => { setAddVendorModal(false); setNewVendor(""); setIsVendor(0); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Vendor</Text>
                    <TextInput
                        mode="outlined"
                        label='Vendor Name'
                        style={styles.input}
                        placeholder="Vendor Name"
                        value={newVendor}
                        onChangeText={(text) => setNewVendor(text)}
                    />
                    {newVendorError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newVendorError}</Text>
                    }
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            // onPress={addNewBrand}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
                            mode={'contained'}
                            onPress={() => setAddVendorModal(false)}
                        >
                            Close
                        </Button>
                    </View>
                </Modal> */}

                {/* Garages List Modal */}
                <Modal visible={garageListModal} onDismiss={() => { setGarageListModal(false); setIsGarage(0); setIsGarageName(''); setGarageError(''); setSearchQueryForGarages('');  searchFilterForGarages();}} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Garage</Text>
                    {(isLoadingGarageList == true) ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator>
                    :
                        <>
                            <View style={{marginTop: 20, marginBottom: 10}}>
                                <Searchbar
                                    placeholder="Search here..."
                                    onChangeText={(text) => { if(text != null) searchFilterForGarages(text)}}
                                    value={searchQueryForGarages}
                                    elevation={0}
                                    style={{ elevation: 0.8, marginBottom: 10}}
                                />
                                {filteredGarageData?.length > 0 ?  
                                    <FlatList
                                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                        data={filteredGarageData}
                                        style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                        keyExtractor={item => item.id}
                                        renderItem={({item}) => (
                                            <>
                                                <List.Item
                                                    title={
                                                        <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                            <Text style={{fontSize:16, color: colors.black}}>{item.garage_name}</Text>
                                                        </View>
                                                    }
                                                    onPress={() => {
                                                            setIsGarageName(item.garage_name); 
                                                            setIsGarage(item.id); 
                                                            setGarageError('');
                                                            setGarageListModal(false);  
                                                        }
                                                    }
                                                />
                                            </>
                                        )} 
                                    />
                                :
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                        <Text style={{ color: colors.black, textAlign: 'center'}}>No such garage is associated!</Text>
                                    </View>
                                }
                            </View>
                        </>
                    }
                </Modal>
            </Portal>
        </View>
    )
}



const styles = StyleSheet.create({
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
    pageContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    input: {
        marginTop: 20,
        fontSize: 16,
    },
    headingStyle: {
        fontSize: 20,
        color: colors.black,
        fontWeight: '500',
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
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 30
    },
})

const mapStateToProps = state => ({
    userToken: state.user.userToken,
    userRole: state.role.user_role,
    userId: state.user?.user?.id,
    garageId: state.garage.garage_id
})

export default connect(mapStateToProps)(EditStock);
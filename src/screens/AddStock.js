import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { Modal, Portal, Button, TextInput, Searchbar, Divider, List } from 'react-native-paper';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import InputScrollView from 'react-native-input-scroll-view';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AddStock = ({ navigation, selectedGarageId, userRole, userId, userToken, garageId, selectedGarage }) => {

    // User / Customer Fields
    const [isPrice, setIsPrice] = useState('');
    const [isMRP, setIsMRP] = useState('');
    const [isCurrentStock, setIsCurrentStock] = useState('');
    const [isMinStock, setIsMinStock] = useState('');
    const [isMaxStock, setIsMaxStock] = useState('');
    const [isRackId, setIsRackId] = useState('');
    const [isComment, setIsComment] = useState('');

    // Error States
    const [priceError, setPriceError] = useState('');     
    const [mrpError, setMrpError] = useState('');
    const [currentStockError, setCurrentStockError] = useState('');
    const [minStockError, setMinStockError] = useState('');
    const [maxStockError, setMaxStockError] = useState('');
    const [rackIdError, setRackIdError] = useState('');
    const [commentError, setCommentError] = useState('');

    // Vehicle Fields
    const [garageIdError, setGarageIdError] = useState();

    const [isPart, setIsPart] = useState('');
    const [isPartName, setIsPartName] = useState('');
    const [partList, setPartList] = useState([]);
    const [partListModal, setPartListModal] = useState(false);
    const [isLoadingPartList, setIsLoadingPartList] = useState(true);
    const [filteredPartData, setFilteredPartData] = useState([]);
    const [searchQueryForParts, setSearchQueryForParts] = useState(); 
    const [partError, setPartError] = useState('');
    
    const [isNewPart, setIsNewPart] = useState('');
    const [newPartError, setNewPartError] = useState();
    const [addNewPartModal, setAddNewPartModal] = useState(false);

    // Property Vendor Dropdown
    // const [isVendor, setIsVendor] = useState();
    // const [isVendorName, setIsVendorName] = useState('');
    // const [vendorList, setVendorList] = useState([]);
    // const [vendorListModal, setVendorListModal] = useState(false);
    // const [isLoadingVendorList, setIsLoadingVendorList] = useState(true);
    // const [filteredVendorData, setFilteredVendorData] = useState([]);
    // const [searchQueryForVendors, setSearchQueryForVendors] = useState(); 
    // const [vendorError, setVendorError] = useState('');   // Error State
    
    // const [isNewVendor, setIsNewVendor] = useState('');
    // const [newVendorError, setNewVendorError] = useState();
    // const [addNewVendorModal, setAddNewVendorModal] = useState(false);

    // Property Garage Dropdown
    const [isGarageId, setIsGarageId] = useState(selectedGarageId);
    const [isGarageName, setIsGarageName] = useState(!selectedGarage ? "" : selectedGarage.garage_name);
    const [garageList, setGarageList] = useState([]);
    const [garageListModal, setGarageListModal] = useState(false);
    const [isLoadingGarageList, setIsLoadingGarageList] = useState(false);
    const [filteredGarageData, setFilteredGarageData] = useState([]);
    const [searchQueryForGarages, setSearchQueryForGarages] = useState(); 
    const [garageError, setGarageError] = useState('');   // Error State
    
    const [isLoading, setIsLoading] = useState(false);
    const scroll1Ref = useRef();

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
            !isGarageId || isGarageId === 0 
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
            if (!isGarageId || isGarageId == 0) setGarageIdError("Customer Belongs to Garage Field is required"); else setGarageIdError('');
            return;
        }

        const data = {
            'parts_id': isPart,
            'garage_id': isGarageId,
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
                navigation.navigate('Parts');
            }
        } catch (e) {
            console.log(e);
        }
    }

    const addNewPart = async () => {
        let data = { 'name': isNewPart }
        try {
            const res = await fetch(`${API_URL}add_parts`, {
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
                getPartList();
                setIsPart(parseInt(json.data.id));
                setIsPartName(json.data.name);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const searchFilterForParts = (text) => {
        if (text) {
            let newData = partList.filter(
                function (listData) {
                let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                }
            );
            setFilteredPartData(newData);
            setSearchQueryForParts(text);
        } else {
            setFilteredPartData(partList);
            setSearchQueryForParts(text);
        }
    };

    const getPartList = async () => {
        setIsLoadingPartList(true);
        try {
            const res = await fetch(`${API_URL}fetch_parts`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            const json = await res.json();
            if (json !== undefined) {
                setPartList(json.data);
                setFilteredPartData(json.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoadingPartList(false)
        }
    };

    // const searchFilterForVendors = (text) => {
    //     if (text) {
    //         let newData = vendorList.filter(
    //             function (listData) {
    //             let itemData = listData.name ? listData.name.toUpperCase() : ''.toUpperCase()
    //             let textData = text.toUpperCase();
    //             return itemData.indexOf(textData) > -1;
    //             }
    //         );
    //         setFilteredVendorData(newData);
    //         setSearchQueryForVendors(text);
    //     } else {
    //         setFilteredVendorData(vendorList);
    //         setSearchQueryForVendors(text);
    //     }
    // };

    // const getVendorList = async () => {
    //     setIsLoadingVendorList(true);
    //     try {
    //         const res = await fetch(`${API_URL}fetch_vendors`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             setVendorList(json.data);
    //             setFilteredVendorData(json.data);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setIsLoadingVendorList(false)
    //     }
    // };

    // const addNewVendor = async () => {
    //     let data = { 'name': isNewVendor }
    //     try {
    //         const res = await fetch(`${API_URL}add_vendor`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //             body: JSON.stringify(data)
    //         });
    //         const json = await res.json();
    //         if (json !== undefined) {
    //             // console.log('setVendorList', json.data);
    //             getVendorList();
    //             setIsVendor(parseInt(json.data.id));
    //             setIsVendorName(json.data.name);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

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

    const getInvetoryData = async () => {
        setIsLoading(true);
        try {
            await fetch(`${API_URL}fetch_parts_inventory?parts_id=${isPart}&garage_id=${isGarageId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                }
            })
            .then(res => {
                const statusCode = res.status;
                let data;
                return res.json().then(obj => {
                    data = obj;
                    return { statusCode, data };
                });
            })
            .then((res) => {
                if(res.statusCode == 404) {
                    console.log('getInvetoryData', res.data);
                    // setIsVendor(parseInt(res.data.id));
                    // setIsVendorName(res.data.name);
                    setIsCurrentStock('');
                    setIsMaxStock('');
                    setIsMinStock('');
                    setIsMRP('');
                    setIsRackId('');
                    setIsPrice('');
                    setIsComment('');
            
                } else if(res.statusCode == 201 || res.statusCode == 200) {
                    setIsCurrentStock(res.data.data.current_stock);
                    setIsMaxStock(res.data.data.max_stock);
                    setIsMinStock(res.data.data.min_stock);
                    setIsMRP(res.data.data.mrp);
                    setIsRackId(res.data.data.rack_id);
                    setIsPrice(res.data.data.purchase_price);
                    setIsComment(res.data.data.comment);
                } else {
                    setIsCurrentStock('');
                    setIsMaxStock('');
                    setIsMinStock('');
                    setIsMRP('');
                    setIsRackId('');
                    setIsPrice('');
                    setIsComment('');
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // getVendorList();
        getGarageList();
        getPartList();
    }, []);

    useEffect(() => {
        if(isPart != 0 && isGarageId != 0) getInvetoryData()
    }, [isPart, isGarageId]);

    return (
        <View style={styles.pageContainer}>
            <InputScrollView
                ref={scroll1Ref}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={8}
                behavior="padding"
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headingStyle, { marginTop: 20 }]}>New Stock Details:</Text>

                    {(userRole == "Super Admin" || garageId?.length > 1) &&
                        <View>
                            <TouchableOpacity 
                                style={styles.partDropDownField} 
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
                        </View>
                    }

                    <View>
                        <TouchableOpacity 
                            style={styles.partDropDownField} 
                            onPress={() => {
                                setPartListModal(true);
                            }}
                        >
                        </TouchableOpacity>
                        <TextInput
                            mode="outlined"
                            label='Part'
                            style={{marginTop: 18, backgroundColor: '#f1f1f1', width:'100%' }}
                            placeholder="Select Part"
                            value={isPartName}
                            // onChangeText={() => getInvetoryData()}
                            right={<TextInput.Icon name="menu-down" />}
                        />
                    </View>

                    {/* <View>
                        <TouchableOpacity 
                            style={styles.partDropDownField} 
                            onPress={() => {
                                setVendorListModal(true);
                            }}
                        >
                        </TouchableOpacity>
                        <TextInput
                            mode="outlined"
                            label='Vendor'
                            style={{marginTop: 18, backgroundColor: '#f1f1f1', width:'100%' }}
                            placeholder="Select Vendor"
                            value={isVendorName}
                            right={<TextInput.Icon name="menu-down" />}
                        />
                    </View> */}

                    {isLoading == true ? <ActivityIndicator></ActivityIndicator> :
                        <>
                            <TextInput
                                mode="outlined"
                                label='Purchase Price (Without GST)'
                                style={styles.input}
                                placeholder="Purchase Price (Without GST)"
                                value={isPrice}
                                onChangeText={(text) => setIsPrice(text)}
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
                        </>
                    }

                    <Button
                        style={{ marginTop: 15 }}
                        mode={'contained'}
                        onPress={submit}
                    >
                        Add
                    </Button>
                    
                </View>
            </InputScrollView>

        <Portal>
            {/* Parts List Modal */}
            <Modal visible={partListModal} onDismiss={() => { setPartListModal(false); setIsPart(0); setIsPartName(''); setPartError(''); setSearchQueryForParts('');  searchFilterForParts();}} contentContainerStyle={styles.modalContainerStyle}>
                <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Part</Text>
                {(isLoadingPartList == true) ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator>
                    :
                    <>
                        <View style={{marginTop: 20, marginBottom: 10}}>
                            <Searchbar
                                placeholder="Search here..."
                                onChangeText={(text) => { if(text != null) searchFilterForParts(text)}}
                                value={searchQueryForParts}
                                elevation={0}
                                style={{ elevation: 0.8, marginBottom: 10}}
                            />
                            {filteredPartData?.length > 0 ?  
                                <FlatList
                                    ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                    data={filteredPartData}
                                    style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                    keyExtractor={item => item.id}
                                    renderItem={({item}) => (
                                        <>
                                            <List.Item
                                                title={
                                                    <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                        <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                    </View>
                                                }
                                                onPress={() => {
                                                        setIsPartName(item.name); 
                                                        setIsPart(item.id); 
                                                        setPartError('');
                                                        setPartListModal(false);  
                                                    }
                                                }
                                            />
                                        </>
                                    )} 
                                />
                            :
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                    <Text style={{ color: colors.black, textAlign: 'center'}}>No such part is associated!</Text>
                                </View>
                            }
                            <View style={{justifyContent:"flex-end", flexDirection: 'row'}}>
                                <TouchableOpacity  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginTop: 7, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4}} onPress={() => { setAddNewPartModal(true); setPartListModal(false); }}>
                                    <Icon style={{color: colors.white, marginRight: 4}} name="plus" size={16} />
                                    <Text style={{color: colors.white}}>Add Part</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
            </Modal>

            {/* Add New Part Model */}
            <Modal visible={addNewPartModal} onDismiss={() => { setAddNewPartModal(false); setPartListModal(true);  setIsNewPart(0); setNewPartError(''); }} contentContainerStyle={styles.modalContainerStyle}>
                <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Part</Text>
                <View>
                    <TextInput
                        mode="outlined"
                        label='Part Name'
                        style={styles.input}
                        placeholder="Part Name"
                        value={isNewPart}
                        onChangeText={(text) => setIsNewPart(text)}
                    />
                </View>
                {newPartError?.length > 0 &&
                    <Text style={styles.errorTextStyle}>{newPartError}</Text>
                }
                <View style={{ flexDirection: "row", marginTop: 10}}>
                    <Button
                        style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                        mode={'contained'}
                        onPress={() => {
                            if(isNewPart == "") {
                                setNewPartError("Please Enter Part Name");
                            } else {
                                setAddNewPartModal(false);
                                addNewPart();
                            }
                        }}
                    >
                        Add
                    </Button>
                    <Button
                        style={{ marginTop: 15, flex: 1 }}
                        mode={'contained'}
                        onPress={() => {
                            setAddNewPartModal(false);
                            setPartListModal(true);
                            setIsNewPart('');
                            setNewPartError('');
                        }}
                    >
                        Close
                    </Button>
                </View>
            </Modal>

                {/* Vendors List Modal */}
                {/* <Modal visible={vendorListModal} onDismiss={() => { setVendorListModal(false); setIsVendor(0); setIsVendorName(''); setVendorError(''); setSearchQueryForVendors('');  searchFilterForVendors();}} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Select Vendor</Text>
                    {(isLoadingVendorList == true) ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator>
                    :
                        <>
                            <View style={{marginTop: 20, marginBottom: 10}}>
                                <Searchbar
                                    placeholder="Search here..."
                                    onChangeText={(text) => { if(text != null) searchFilterForVendors(text)}}
                                    value={searchQueryForVendors}
                                    elevation={0}
                                    style={{ elevation: 0.8, marginBottom: 10}}
                                />
                                {filteredVendorData?.length > 0 ?  
                                    <FlatList
                                        ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                                        data={filteredVendorData}
                                        style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                                        keyExtractor={item => item.id}
                                        renderItem={({item}) => (
                                            <>
                                                <List.Item
                                                    title={
                                                        <View style={{flexDirection:"row", display:'flex', flexWrap: "wrap"}}>
                                                            <Text style={{fontSize:16, color: colors.black}}>{item.name}</Text>
                                                        </View>
                                                    }
                                                    onPress={() => {
                                                            setIsVendorName(item.name); 
                                                            setIsVendor(item.id); 
                                                            setVendorError('');
                                                            setVendorListModal(false);  
                                                            setSearchQueryForVendors(''); 
                                                            searchFilterForVendors();
                                                        }
                                                    }
                                                />
                                            </>
                                        )} 
                                    />
                                :
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                                        <Text style={{ color: colors.black, textAlign: 'center'}}>No such vendor is associated!</Text>
                                    </View>
                                }
                                <View style={{justifyContent:"flex-end", flexDirection: 'row'}}>
                                    <TouchableOpacity  style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, marginTop: 7, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4}} onPress={() => { setAddNewVendorModal(true); setVendorListModal(false); }}>
                                        <Icon style={{color: colors.white, marginRight: 4}} name="plus" size={16} />
                                        <Text style={{color: colors.white}}>Add Vendor</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    }
                </Modal> */}

                {/* Add New Vendor Modal */}
                {/* <Modal visible={addNewVendorModal} onDismiss={() => { setAddNewVendorModal(false); setVendorListModal(true);  setIsNewVendor(0); setNewVendorError(''); }} contentContainerStyle={styles.modalContainerStyle}>
                    <Text style={[styles.headingStyle, { marginTop: 0, alignSelf: "center", }]}>Add New Vendor</Text>
                    <View>
                        <TextInput
                            mode="outlined"
                            label='Vendor Name'
                            style={styles.input}
                            placeholder="Vendor Name"
                            value={isNewVendor}
                            onChangeText={(text) => setIsNewVendor(text)}
                        />
                    </View>
                    {newVendorError?.length > 0 &&
                        <Text style={styles.errorTextStyle}>{newVendorError}</Text>
                    }

                    <View style={{ flexDirection: "row", marginTop: 10}}>
                        <Button
                            style={{ marginTop: 15, flex: 1, marginRight: 10 }}
                            mode={'contained'}
                            onPress={() => {
                                if(isNewVendor == "") {
                                    setNewVendorError("Please Enter Vendor Name");
                                } else {
                                    setAddNewVendorModal(false);
                                    setIsNewVendor('');
                                    setNewVendorError('');
                                    addNewVendor();
                                }
                            }}
                        >
                            Add
                        </Button>
                        <Button
                            style={{ marginTop: 15, flex: 1 }}
                            mode={'contained'}
                            onPress={() => {
                                setAddNewVendorModal(false);
                                setVendorListModal(true);
                                setIsNewVendor('');
                                setNewVendorError('');
                            }}
                        >
                            Close
                        </Button>
                    </View>
                </Modal> */}

                {/* Garage List Modal */}
                <Modal visible={garageListModal} onDismiss={() => { setGarageListModal(false); setIsGarageId(0); setIsGarageName(''); setGarageError(''); setSearchQueryForGarages('');  searchFilterForGarages();}} contentContainerStyle={styles.modalContainerStyle}>
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
                                                            setIsGarageId(item.id); 
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
                                        <Text style={{ color: colors.black, textAlign: 'center'}}>No such garage found!</Text>
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
    partDropDownField: {
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
        // justifyContent: 'center',
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
    selectedGarageId: state.garage.selected_garage_id,
    selectedGarage: state.garage.selected_garage,
    garageId: state.garage.garage_id,
})

export default connect(mapStateToProps)(AddStock);
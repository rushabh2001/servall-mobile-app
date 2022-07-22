import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../constants";
import { connect } from 'react-redux';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import InputScrollView from 'react-native-input-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';

const AddPayment = ({ navigation, userRole }) => {

    // const isFocused = useIsFocused();

    const scroll1Ref = useRef();

    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isState, setIsState] = useState();
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [stateError, setStateError] = useState('');

    const [isPurchaseDate, setIsPurchaseDate] = useState(new Date());
    const [purchaseDateError, setPurchaseDateError] = useState('');
    const [datePurchase, setDatePurchase] = useState();
    const [displayPurchaseCalender, setDisplayPurchaseCalender] = useState(false);

    const [StateList, setStateList] =  useState([]);

    
    const changePurchaseSelectedDate = (event, selectedDate) => {
        if (selectedDate != null) {
            let currentDate = selectedDate || datePurchase;
            let formattedDate = moment(currentDate, 'YYYY MMMM D').format('DD-MM-YYYY');
            setDisplayPurchaseCalender(false);
            setDatePurchase(formattedDate);
            let formateDateForDatabase = moment(currentDate, 'YYYY MMMM D').format('YYYY-MM-DD');
            setIsPurchaseDate(formateDateForDatabase);
        }
     };


    // const getCustomerDetails = async () => {
    //     try {
    //         const res = await fetch(`${API_URL}fetch_customer_details?id=${route?.params?.userId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //         });
    //         const json = await res.json();
    //         // console.log(res);
    //         if (json !== undefined) {
    //             // console.log(json);
    //             setIsCustomerData(json?.user_details);
    //             if(json.user_details.profile_image != null) {
    //                 setImageUri( WEB_URL + 'uploads/profile_image/' + json?.user_details.profile_image);
    //             } else {
    //                 setImageUri( WEB_URL + 'img/placeolder_servall.jpg');
    //             }
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const changeProfileImage = async () => {
    //     try {
    //         const res = await DocumentPicker.pick({
    //         type: [DocumentPicker.types.images],
    //         });
    //         // console.log('res : ' + JSON.stringify(res));
    //         setSingleFile(res[0]);
    //     } catch (err) {
    //         setSingleFile(null);
    //         if (DocumentPicker.isCancel(err)) {
    //         alert('Canceled');
    //         } else {
    //         alert('Unknown Error: ' + JSON.stringify(err));
    //         throw err;
    //         }
    //     } 
    // };

    // useEffect(() => {
    //     if (singleFile != null) {
    //         uploadImage();
    //     }
    // }, [singleFile]);

    // const uploadImage = async () => {
    //     if (singleFile != null) {
    //         const fileToUpload = singleFile;
    //         const data = new FormData();
    //         data.append('profile_image', fileToUpload);
    //         let res = await fetch(`${API_URL}update_profile_image/${route?.params?.userId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data; ',
    //                 'Authorization': 'Bearer ' + userToken
    //             },
    //             body: data
    //         });
    //         let responseJson = await res.json();
    //         // console.log(responseJson);
    //         if (responseJson.message == true) {
    //             getCustomerDetails();
    //         }
    //     } else {
    //         console.log('Please Select File first');
    //     }
    // };
    
    // useEffect(() => {
    //     // setImageUri('http://demo2.webstertech.in/servall_garage_api/public/img/placeolder_servall.jpg');
    //     getCustomerDetails();
    //     console.log(userRole);
    // }, [isFocused]);
    
    return (
        <View style={styles.surfaceContainer}>
            <ScrollView>
                {/* <View style={styles.upperContainer}>
                    <View> */}
                        <View style={styles.cardContainer}>
                            <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                                <Text style={{color: colors.black, fontSize: 16}}>Total</Text>
                                <Text style={{color: colors.black, fontSize: 16}}>₹ 8,900</Text>
                            </View>
                            <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center", marginRight: 10}}>
                                <Text style={{color: colors.green, fontSize: 16}}>Received</Text>
                                <Text style={{color: colors.green, fontSize: 16}}>₹ 0</Text>
                            </View>
                            <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                                <Text style={{color: colors.danger2, fontSize: 16}}>Due</Text>
                                <Text style={{color: colors.danger2, fontSize: 16}}>₹ 8,818</Text>
                            </View>
                            <View style={{flexDirection: "column", alignItems:"center",justifyContent:"center"}}>
                                <Text style={{color: colors.danger2, fontSize: 16}}>Discount</Text>
                                <Text style={{color: colors.danger2, fontSize: 16}}>₹ 82</Text>
                            </View>
                        </View>
                        {/* <View style={{flexDirection:"row", marginTop: 15, alignSelf:"center", justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=> Linking.openURL(`tel:Text`) } style={{marginRight: 10}}><IconX name={"file-pdf"} size={28} color={colors.primary} /></TouchableOpacity>
                            <TouchableOpacity onPress={()=> Linking.openURL(`sms:Text?&body=Hello%20ServAll`) } style={{}}><IconX name={"share-alt-square"} size={28} color={colors.primary} /></TouchableOpacity>

                            <TouchableOpacity onPress={()=> Linking.openURL(`https://wa.me/Text`) } style={styles.smallButton}><Icon name={"whatsapp"} size={20} color={colors.primary} /></TouchableOpacity>
                            <TouchableOpacity onPress={()=>{console.log("Pressed Me!")}} style={styles.smallButton}><Icon name={"bell"} size={20} color={colors.primary} /><Text style={{marginLeft:4, color:colors.primary}}>Reminders</Text></TouchableOpacity>
                        </View> */}
                       
                    {/* </View> */}
                    {/* <View style={{flexDirection: 'column', marginTop: 20}}> */}
                    <InputScrollView
                        ref={scroll1Ref}
                        contentContainerStyle={{ justifyContent: 'center' }}
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={8}
                        // keyboardOffset={160}
                        behavior="padding"
                    >
                        <View style={{backgroundColor: colors.white, paddingVertical: 20, paddingHorizontal: 15, marginTop: 25, marginBottom: 15,}}>
                            <View style={{ alignSelf:"center", justifyContent:'center'}}>
                                <Text style={{color: colors.black, fontSize: 20, fontWeight: '600'}}>Payment For</Text>
                            </View>
                            {/* <Text style={[styles.headingStyle, { marginTop:20 }]}>Customer Details:</Text> */}
                            <View style={{borderBottomWidth:1, borderColor: colors.light_gray, borderRadius: 4, marginTop: 20, backgroundColor: '#F0F2F5'}}>
                                <Picker
                                    selectedValue={isState}
                                    onValueChange={(v) => {setIsState(v)}}
                                    style={{padding: 0}}
                                    itemStyle={{padding: 0}}
                                >
                                    <Picker.Item label="Select Payment Method" value="0" />
                                    {StateList.map((StateList, i) => {
                                        return (
                                            <Picker.Item
                                                key={i}
                                                label={StateList.name}
                                                value={StateList.id}
                                            />
                                        );
                                    })}
                                </Picker>
                            </View>
                            {stateError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{stateError}</Text>
                            }

                            <TextInput
                                label='Amount'
                                style={[styles.input, {backgroundColor: '#F0F2F5'}]}
                                placeholder="Amount"
                                value={isName}
                                onChangeText={(text) => setIsName(text)}
                            />
                            {nameError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{nameError}</Text>
                            }
                            <TextInput
                                label='Payment Reference Number'
                                style={[styles.input, { backgroundColor: '#F0F2F5'}]}
                                placeholder="Payment Reference Number"
                                value={isEmail}
                                onChangeText={(text) => setIsEmail(text)}
                            />
                            {emailError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{emailError}</Text>
                            }
                            {/* <TextInput
                                label='Payment Date'
                                style={styles.input}
                                placeholder="Payment Date"
                                value={isPhoneNumber}
                                onChangeText={(text) => setIsPhoneNumber(text)}
                                keyboardType={"phone-pad"}
                            />
                            {phoneNumberError?.length > 0 &&
                                <Text style={{color: colors.danger}}>{phoneNumberError}</Text>
                            }  */}
                        
                            <TouchableOpacity style={{flex:1}} onPress={() => setDisplayPurchaseCalender(true)} activeOpacity={1}>
                                <View style={styles.datePickerContainer} pointerEvents='none'>
                                    <Icon style={styles.datePickerIcon} name="calendar-month" size={24} color="#000" />
                                    <TextInput
                                        label='Payment Date'
                                        style={styles.datePickerField}
                                        placeholder="Payment Date"
                                        value={datePurchase}
                                    />
                                    {(displayPurchaseCalender == true) && 
                                    <DateTimePicker
                                        value={(isPurchaseDate) ? isPurchaseDate : null}
                                        mode='date'
                                        onChange={changePurchaseSelectedDate}
                                        display="spinner"
                                    /> }
                                </View>
                            </TouchableOpacity>
                            {purchaseDateError?.length > 0 &&
                                <Text style={styles.errorTextStyle}>{purchaseDateError}</Text>
                            }
                            
                            <Button
                                style={{marginTop:25,}}
                                mode={'contained'}
                                // onPress={}
                            >
                                Submit
                            </Button>
                        </View>
                    </InputScrollView>
                    {/* </View>
                </View> */}

                {/* <View style={styles.lowerContainer}>
                </View> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        padding:15,
        // marginBottom: 35
    },
    cardContainer: {
        flexDirection: "row", 
        alignItems:"center", 
        elevation: 3, 
        backgroundColor: colors.white,
        padding: 12,
        // marginHorizontal: 10,
        justifyContent:"space-around",
        width: "100%",
    },
    input: {
        marginTop: 20,
        backgroundColor: colors.white,
        fontSize: 16,
    },
    datePickerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 20,
     
    },
    datePickerField: {
        flex: 1,
        borderColor: colors.light_gray, // 7a42f4
        borderBottomWidth: 1,
        borderRadius: 5,
        // backgroundColor: '#fff',
        backgroundColor: '#F0F2F5',
        color: '#424242',
        paddingHorizontal: 15,
        height: 55,
        fontSize: 16,
    },
    datePickerIcon: {
        padding: 10,
        position: 'absolute',
        right: 7,
        top: 6,
        zIndex: 2,
    },
})

const mapStateToProps = state => ({
    userRole: state.role.user_role,
})

export default connect(mapStateToProps)(AddPayment);
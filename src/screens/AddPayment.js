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

    const scroll1Ref = useRef();

    const [isName, setIsName] = useState('');
    const [isEmail, setIsEmail] = useState('');
    const [isPhoneNumber, setIsPhoneNumber] = useState('');
    const [isState, setIsState] = useState();
    
    // Error States
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
    
    return (
        <View style={styles.surfaceContainer}>
            <ScrollView>
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
                <InputScrollView
                    ref={scroll1Ref}
                    contentContainerStyle={{ justifyContent: 'center' }}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={8}
                    behavior="padding"
                >
                    <View style={{backgroundColor: colors.white, paddingVertical: 20, paddingHorizontal: 15, marginTop: 25, marginBottom: 15,}}>
                        <View style={{ alignSelf:"center", justifyContent:'center'}}>
                            <Text style={{color: colors.black, fontSize: 20, fontWeight: '600'}}>Payment For</Text>
                        </View>
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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    surfaceContainer: {
        flex:1,
        padding:15,
    },
    cardContainer: {
        flexDirection: "row", 
        alignItems:"center", 
        elevation: 3, 
        backgroundColor: colors.white,
        padding: 12,
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
        borderColor: colors.light_gray,
        borderBottomWidth: 1,
        borderRadius: 5,
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
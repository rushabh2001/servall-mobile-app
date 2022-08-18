import React, { useState, useEffect } from 'react';
import { View , Text, StyleSheet, Image, TextInput, KeyboardAvoidingView, } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../constants';
import { API_URL } from '../constants/config';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { loginRequest, resetLogin } from '../actions/login';

const Login = ({loginRequest, error }) => {
    
    const [otpField, setField] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [emailError, setEmailError] = useState();
    const [OtpError, setOtpError] = useState();
    
    const submit = () => {
         if(email.length == 0){
            setEmailError("Email is required");
            return;
        }        
        else if(email.length < 6){
            setEmailError("Email should be minimum 6 characters");
            return;
        }      
        else if(email?.indexOf(' ') >= 0){        
            setEmailError('Email cannot contain spaces');        
            return;
        }    
        else if(email?.indexOf('@') < 0){        
            setEmailError('Invalid Email Format');        
            return;
        }
        else{
            setEmailError("");
            let formOTP = ({'email': email});
            sendOTP(formOTP);
        }
    }

    const verifyOTP = () => {
        setOtpError("");
        if (otp.length != 4) {
            return setOtpError('OTP Should be 4 digit');
        };
        loginRequest({'email': email, 'otp': otp});
    }


    const sendOTP = (data) => { 
        fetch(`${API_URL}send_otp`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            const statusCode = response.status;
            let data;
            return response.json().then(obj => {
                data = obj;
                return { statusCode, data };
            });
        })
        .then((res) => {
            console.log(res.statusCode);
            if(res.statusCode == 200 && res.data.user_found == 1) {
                Toast.show({
                    type: 'success',
                    text1: `Greetings from Servall 👋! Your OTP is ${res.data.otp}`,
                });
                return setField(true);
            } else if(res.statusCode == 200 && res.data.user_found == 0) {
                setEmailError("Email is not registered");
                return;
            } else if(res.statusCode == 401) {
                return setEmailError("Email request fail");
            }
            else {
                setEmailError('Another Error!');
                return;
            }
        });
    }

    useEffect(() => {
        if(error) setOtpError(error)
    }, [error]);
    
    return (

    <View style={styles.PageContainer}>
        <View style={{ backgroundColor: colors.white, paddingHorizontal: 20,  alignItems: 'center' }}>
            <Image resizeMode={'cover'} style={{width:'80%', height: 150,  resizeMode: 'contain'}} source={require('../assets/images/logo/logo.png')} />
            <Text style={styles.headingStyle}>Welcome to ServAll!</Text>
            <Text style={styles.headingStyle2}>Please Login</Text>
        </View>
        <View style={{marginTop: 30}}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                {(otpField == false) ?  
                    <View>
                        <TextInput
                            label='Email'
                            style={styles.input}
                            // innerRef={emailRef}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            error="Email is required"
                        />
                        {emailError?.length > 0 &&
                            <Text style={{color: colors.danger}}>{emailError}</Text>
                        }

                        <Button
                            style={{marginTop:15}}
                            mode={'contained'}
                            onPress={submit}
                        >
                            Send OTP
                        </Button>
                    </View>
                : 
                    <View>
                        <TextInput
                            label='OTP'
                            placeholder="Your OTP"
                            style={styles.input}
                            keyboardType="numeric"
                            textContentType="oneTimeCode"
                            value={otp}
                            onChangeText={(text) => setOtp(text)}
                            error={(otp?.trim()?.length === 0) ? "OTP is required" : (otp?.trim()?.length !== 4) ? "OTP Should be of 4 digit" : undefined}
                        />
                        {OtpError?.length > 0 ?
                            <Text style={{color: colors.danger}}>{OtpError}</Text>
                        :
                            null
                        }
                        <Button
                            mode={'contained'}
                            style={{marginTop:15}}
                            onPress={verifyOTP}
                        >
                            Verify OTP
                        </Button>
                        <Text
                            style={styles.smallBtn}
                            onPress={() => {
                                submit();
                                setOtpError("");
                            }}
                        >
                            Resend OTP
                        </Text>
                        <Text
                            style={styles.smallBtn}
                            onPress={() => {
                                setField(false);
                                setEmailError("");
                            }}
                        >
                            Change Email
                        </Text>
                    </View>
                }
            </KeyboardAvoidingView>
        </View>
        <Toast />
    </View>
    )
}

const styles = StyleSheet.create({
    PageContainer: {
        padding:20,
        flex: 1,
        backgroundColor: colors.white, 
        justifyContent:'center',
    },
    headingStyle: {
        fontSize: 22,
        color: colors.black,
        fontWeight: "300",
        // alignItems: 'center',
        marginTop: 10,
        marginBottom: 2,
    },
    headingStyle2: {
        fontSize: 22,
        color: colors.black,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tinyLogo: {
        flex:1
    },
    formContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginTop: 15,
        marginBottom: 5,
        padding: 10,
        height: 40,
        borderColor: colors.light_gray,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
        color: colors.black
     },
     headingStyle: {
         fontSize: 20,
         color: colors.black,
         fontWeight: '500',
     },
     headingStyle2: {
         color: colors.dark_gray,
     },
     smallBtn: {
         color: colors.primary,
         alignSelf: 'center',
         paddingTop: 20,
         textDecorationLine: 'underline',
     }
})

const mapStateToProps = state => ({
    error: state.login.error,
    loginError: state.login.loginError,
    authenticating: state.login.authenticating,
})

const mapDispatchToProps = dispatch => ({
    loginRequest: (data) => dispatch(loginRequest(data)),
    resetLogin: () => dispatch(resetLogin())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
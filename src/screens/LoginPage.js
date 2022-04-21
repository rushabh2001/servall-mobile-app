import React, { useRef, useState } from 'react';
import { View , Text, StyleSheet, Image, TextInput, Keyboard, KeyboardAvoidingView  } from 'react-native';
import { connect } from 'react-redux';
import { colors, gStyle } from '../constants';
import { API_URL } from '../constants/config';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';
// import { IconX, ICON_TYPE } from '../icons';
// import InputScrollView from 'react-native-input-scroll-view';
import { loginRequest, resetLogin } from '../actions/login';
// import { getValue } from '../../lib/storage';

const Login = ({navigation, loginRequest, loginError, error, authenticating, resetLogin}) => {
    
    const [otpField, setField] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [emailError, setEmailError] = useState();
    const [OtpError, setOtpError] = useState();
    // const [isPassword, setIsPassword] = useState("12345678");
    
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
        // resetLogin();
        // navigation.navigate('inside');
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

    // useEffect(() => {
    //    
    // }, []);
    // const loginWithOtp = (formOTP) => { 
    //     fetch(`${API_URL}loginWithOtp`, 
    //     {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(formOTP)
    //     }).then((res) => res.json())
    //       .then((res)  => {
    //         console.log(res);
    //         console.log("321");
    //         if(res[1]?.message == true) {
    //             if (authenticating) return;
    //             console.log("321");
               
    //             navigation.navigate('DashboardStack');
    //             console.log("321")
    //         } else if(res[0]?.message == false) {
    //             setOtpError('Invalid OTP Code');
    //             return; 
    //         } else {
    //             setOtpError('Invalid OTP Code');
    //             return; 
    //         }
    //         // setData(data);
    //         // setLoading(false);
    //         // this.setData({users: result, setLoading: false})
    //       }).catch((error) => {
    //         setOtpError(error)
    //     });
    // }

  
    
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
                            // innerRef={otpRef}
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
                        <Button
                            mode={'contained'}
                            style={{marginTop:10}}
                            onPress={() => {
                                submit();
                                setOtpError("");
                            }}
                        >
                            Resend OTP
                        </Button>
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
        borderColor: colors.light_gray, // 7a42f4
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
     },
     headingStyle: {
         fontSize: 20,
         color: colors.black,
         fontWeight: '500',
     },
     headingStyle2: {
         color: colors.dark_gray,
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

// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);
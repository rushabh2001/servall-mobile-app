import { StyleSheet } from 'react-native';
import colors from './colors';


export default styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        // backgroundColor: '#eee'

    },
    containerWhite: {
        flex: 1,
        backgroundColor: colors.white
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginVertical: 5,
        paddingLeft: 13
    },
    header: {
        color: colors.dark_black,
        fontSize: 30,
        alignSelf: 'center',
        marginTop: 40,
    },
    desc: {
        color: colors.dark_gray,
        alignSelf: 'center',
        marginTop: 6,
        fontSize: 18
    },
    inputBox: {
        flexDirection: 'row',
        borderColor: colors.dark_gray,
        borderWidth: 2,
        borderRadius: 10,
        marginTop: 10,
    },
    input: {
        paddingHorizontal: 10,
        color: colors.dark_black,
        flex: 1,
        fontSize: 18
    },
    buttonContainer: {
        backgroundColor: colors.blue,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 14,
        borderRadius: 6,
        marginTop: 20,
        alignItems: 'center',
        borderColor: colors.blue,
        borderWidth: 2,
    },
    inLineButtonContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        borderColor: colors.blue,
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 14,
        borderRadius: 6,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize : 18
    },
    buttonBoldText: {
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1
    },
    underlineInput: {
        fontSize: 16,
        color: colors.darkgunmetal,
        height: 50,
        paddingHorizontal: 10,
        flex: 1
    },
    bottomBorder: {
        borderBottomColor: colors.light_black,
        borderBottomWidth: 1,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    termsText: {
        color: colors.default_text,
        fontSize: 16,
    },
    headerText: {
        color: colors.white,
        fontSize: 20,
        padding: 20,
        fontWeight: 'bold', 
        letterSpacing: 1,
    },
    h1Text: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center',
        letterSpacing: 1.5,
        marginVertical: 10
    },
    h3Text: {
        color: colors.white,
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 1,
    }
})

export const fontConfig = {
    web: {
      regular: {
        fontFamily: 'lato',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'lato-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'lato-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'lato-thin',
        fontWeight: 'normal',
      },
    },
    ios: {
      regular: {
        fontFamily: 'lato',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'lato-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'lato-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'lato-thin',
        fontWeight: 'normal',
      },
    },
    android: {
      regular: {
        fontFamily: 'lato',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'lato-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'lato-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'lato-thin',
        fontWeight: 'normal',
      },
    }
  };
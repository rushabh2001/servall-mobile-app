import React from 'react';
import { View, Image } from 'react-native';
import { colors } from '../../constants';
import ServAllLogo from '../../assets/images/logo/logo.png'

const ImageUri=Image.resolveAssetSource(ServAllLogo).uri;

export default function Splash() {

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white}}>
            <View />
            <Image source={{uri: ImageUri}} style={{height: 130, width: '80%'}} />
        </View>
    )
}
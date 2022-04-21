import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme, Searchbar } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Services = ({ navigation }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const { colors } = useTheme();

    return (
        
        <View style= {styles.customSurface}>
          <ScrollView>
           <Searchbar
            placeholder="Search here..."
            onChangeText={onChangeSearch}
            value={searchQuery}
          />

          {/* Create Repair Order Card */}

          <View style={styles.mainCards}>
            <TouchableOpacity style={[styles.cardContainer, {  marginTop:10, elevation: 3, flex:1 }]} onPress={() => navigation.navigate('Parts')}>
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/addorder.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle}>
                  Create Repair Order
                </Text>
                <Text>
                  Click to open new job card
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity>

          {/* Create Invoice Card */}

            <TouchableOpacity style={[styles.cardContainer, { marginTop:10, elevation: 3, flex:1 }]} onPress={ () => navigation.navigate("AllStack" , {screen:"ChooseGarage"}) } >
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/add-file.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle}>
                  Create Invoice
                </Text>
                <Text>
                  Create direct parts/service invoice
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity>

            <View style={[styles.mainVerticleCard, { marginTop:10 }]}>
              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]}>
                <View style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/logistic.png')} />
                </View>
                <View>
                  <Text style={styles.verticleCardTitle}>
                    Open Order
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Repair order created
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{flex:0.08}}/>

              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]}>
                <View  style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/in-progress.png')} />
                </View>
                <View>
                  <Text style={styles.verticleCardTitle}>
                    WIP Orders
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Work in progress
                  </Text>
                </View>
              </TouchableOpacity>

              </View>
              <View style={[styles.mainVerticleCard, { marginTop:10 }]}>

              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]}>
                <View style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/delivery.png')} />
                </View>
                <View>
                  <Text style={styles.verticleCardTitle}>
                    Ready Orders
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Vehicle is ready
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{flex:0.08}}/>

              <TouchableOpacity style={[styles.verticleCardContainer, {flex:1, elevation: 2}]}>
                <View style={{alignItems:'center'}}>
                  <Image resizeMode={'cover'} style={styles.verticleImage} source={require('../assets/images/icons/payment.png')} />
                </View>
                <View>
                  <Text style={styles.verticleCardTitle}>
                    Payment Due
                  </Text>
                  <Text style={styles.duePaymentText}>
                    Due: ₹ 8,818
                  </Text>
                  <Text style={{textAlign:'center'}}>
                    Invoice prepared
                  </Text>
                </View>
              </TouchableOpacity>
                
            </View>

            <TouchableOpacity style={[styles.cardContainer, { marginTop:10, elevation: 2 }]}>
              <View style={{flex:1, alignItems: 'center'}}>
                <Image resizeMode={'cover'} style={styles.cardImage} source={require('../assets/images/icons/packageready.png')} />
              </View>
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle}>
                  Completed Orders
                </Text>
                <Text>
                  Click to view order history
                </Text>
              </View>
              <View style={styles.cardArrow}>
                  <Icon name={'caret-right'} size={18}  color={colors.gray} />
              </View>
            </TouchableOpacity>

          </View>
          </ScrollView>
        </View>
    )
}

  const styles = StyleSheet.create({
    customSurface: {
      padding: 15,
      flexDirection: "column",
      flex: 1,
    },
    mainCards: {
      marginVertical: 15,
    },
    mainVerticleCard: {
      flexDirection: "row",
      justifyContent: 'space-between',

    },
    cardContainer: {
      flexDirection: "row",
      padding: 15,
      backgroundColor: colors.white,
      elevation: 3,
      shadowColor: '#000',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    verticleCardContainer: {
      padding: 15,
      backgroundColor: colors.white,
      elevation: 3,
      shadowColor: '#000',
      borderRadius: 5,
    },
    verticleCardTitle:{
      fontSize: 16,
      color: colors.black,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 3,
    },
    cardImage: {
        flex:1,
        width:50,
        height:50,
        resizeMode: 'cover',
    },
    verticleImage: {
      width: 50,
      height: 50,
      marginBottom:10,
      marginTop:5,
    },
    cardRightContent: {
      flex:2.4,
      justifyContent: 'center',
    },
    duePaymentText: {
      textAlign:'center', 
      color:"#ff0000",
      fontSize:16,
      fontWeight: "500",
    },
    cardTitle: {
      fontSize: 18,
      color: colors.black,
      fontWeight: "500",
    },
    cardArrow: {
      flex: 0.2,
      justifyContent: 'center',
    },
    breakRow: {
      flexBasis: "100%",
      height: 0,
    },
  });

  export default Services;
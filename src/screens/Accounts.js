import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, Button, DataTable  } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TopTab = createMaterialTopTabNavigator();

const Accounts = ({ navigation }) =>  {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Expense" component={Expense} options={{ title: "Expense"}} />
      <TopTab.Screen name="PartPurchase" component={PartPurchase} options={{ title: "Part Purchase"}} />
      <TopTab.Screen name="Income" component={Income} options={{ title: "Income"}} />
    </TopTab.Navigator>
  );
}

const PartPurchase = ({ navigation }) => {
  const { colors } = useTheme();
  
    return (
        <View style= {styles.customSurface}>
         
            <View style={{ alignItems:'center', justifyContent:'center',  marginTop: 15}}>
              <Button
                  style={styles.buttonBlue}
                  color="#123038"
                  icon={({color}) => (<Icon name="plus" color={color} size={18} />) }
                  mode="contained"
                  onPress={() => navigation.navigate('Login')}
                  uppercase={false} 
                > Add Expense
              </Button>
            </View>
    
            <View style={{flex:1}}>
              <ScrollView>
              <DataTable style={{padding:0,margin:0}}>
                <DataTable.Header background="#000" style={{padding:0,margin:0}}>
                  <DataTable.Title  background="#000" style={[styles.tableHeader, {flex:1}]}><Text style={styles.tableHeaderText}>(P No.) Name</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>Stocks</Text></DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                
                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>
                {/* <DataTable.Pagination
                  page={page}
                  numberOfPages={3}
                  onPageChange={(page) => setPage(page)}
                  label="1-2 of 6"
                  optionsPerPage={optionsPerPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  showFastPagination
                  optionsLabel={'Rows per page'}
                /> */}
              </DataTable>
              </ScrollView>
            </View>

         


        </View>
      );
}

const Income = ({ navigation }) => {
  const { colors } = useTheme();
  
    return (
        <View style= {styles.customSurface}>
         
            <View style={{ alignItems:'center', justifyContent:'center',  marginTop: 15}}>
              <Button
                  style={styles.buttonBlue}
                  color="#123038"
                  icon={({color}) => (<Icon name="plus" color={color} size={18} />) }
                  mode="contained"
                  onPress={() => navigation.navigate('Login')}
                  uppercase={false} 
                > Add Expense
              </Button>
            </View>
    
            <View style={{flex:1}}>
              <ScrollView>
              <DataTable style={{padding:0,margin:0}}>
                <DataTable.Header background="#000" style={{padding:0,margin:0}}>
                  <DataTable.Title  background="#000" style={[styles.tableHeader, {flex:1}]}><Text style={styles.tableHeaderText}>(P No.) Name</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>Stocks</Text></DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                
                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>
                {/* <DataTable.Pagination
                  page={page}
                  numberOfPages={3}
                  onPageChange={(page) => setPage(page)}
                  label="1-2 of 6"
                  optionsPerPage={optionsPerPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  showFastPagination
                  optionsLabel={'Rows per page'}
                /> */}
              </DataTable>
              </ScrollView>
            </View>

         


        </View>
      );
}

const Expense = ({ navigation }) => {
  const { colors } = useTheme();
  
    return (
        <View style= {styles.customSurface}>
         
            <View style={{ alignItems:'center', justifyContent:'center',  marginTop: 15}}>
              <Button
                  style={styles.buttonBlue}
                  color="#123038"
                  icon={({color}) => (<Icon name="plus" color={color} size={18} />) }
                  mode="contained"
                  onPress={() => navigation.navigate('Login')}
                  uppercase={false} 
                > Add Expense
              </Button>
            </View>
    
            <View style={{flex:1}}>
              <ScrollView>
              <DataTable style={{padding:0,margin:0}}>
                <DataTable.Header background="#000" style={{padding:0,margin:0}}>
                  <DataTable.Title  background="#000" style={[styles.tableHeader, {flex:1}]}><Text style={styles.tableHeaderText}>(P No.) Name</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>Stocks</Text></DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                
                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={{flex:1.5}}><View style={{paddingVertical:12}}><Text style={{color:"#000", fontSize: 16}}>SD 521-SIDE STEND SPL</Text><Text>Feb 26, 2022</Text></View></DataTable.Cell>
                  <DataTable.Cell style={{flex:0.5}} numeric><Text style={{color:"#008000", fontSize: 18}}>₹ 350</Text></DataTable.Cell>
                </DataTable.Row>
                {/* <DataTable.Pagination
                  page={page}
                  numberOfPages={3}
                  onPageChange={(page) => setPage(page)}
                  label="1-2 of 6"
                  optionsPerPage={optionsPerPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  showFastPagination
                  optionsLabel={'Rows per page'}
                /> */}
              </DataTable>
              </ScrollView>
            </View>

         


        </View>
      );
}

const styles = StyleSheet.create({
  customSurface: {
    padding: 15,
    flexDirection: "column",
    flex: 1,
  },
  buttonBlue: {
    marginBottom: 15,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  downloadIcon: {
    marginRight: 10,
    fontSize: 22,
  },
  tableHeaderText: {
    color: colors.black,
    fontSize: 16,
    // padding:0,
    // margin:0,
  },
  actionArrow: {
    fontSize:16,
  }
})

export default Accounts;
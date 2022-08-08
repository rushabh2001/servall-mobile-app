import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Searchbar, Button, DataTable  } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux';
import { API_URL } from "../constants/config";
import { useIsFocused  } from '@react-navigation/native';

const Parts = ({ navigation, userToken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [singleFile, setSingleFile] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [partList, setPartList] = useState([]);
  const { colors } = useTheme();
  // const optionsPerPage = [2, 3, 4];
  const isFocused = useIsFocused();


  // useEffect(() => { setPage(0); }, [itemsPerPage]);

  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      setSingleFile(res);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  
    // Parts Functions ----- End Here

    const getPartList = async () => {
      try {
        const res = await fetch(`${API_URL}fetch_inventory`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          },
        });
        const json = await res.json();
        // console.log(json);
        if (json !== undefined) {
          console.log('setPartList', json.data);
          setPartList(json.data);
          // handleServiceAdd();
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    // useEffect(() => {
    //     getPartList();
    //     // console.log(route?.params?.data);
    // }, []);

    useEffect(() => {
      setIsLoading(true);
      getPartList();
      // console.log(userRole);
    }, [isFocused]);


    return (
        <View style= {styles.customSurface}>
           
          {/* First Button Row */}

          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Button
                    style={styles.buttonBlue}
                    color="#123038"
                    icon={({color}) => (<Icon name="credit-card" color={color} size={18} />) }
                    mode="contained"
                    onPress={() => navigation.navigate('PurchaseOrder')}
                    uppercase={false} 
                > Purchase Order
              </Button>
            </View>
            <View style={{flex:0.08}}></View>
            <View style={{flex:1}}>
              <Button
                    style={styles.buttonBlue}
                    color={colors.primary}
                    icon={ ({color}) => (<Icon name="exclamation-triangle" size={18} color={color} />) }
                    mode="contained"
                    uppercase={false} 
                    onPress={() => navigation.navigate('Login')}
                > View Alerts
              </Button>
            </View>
          </View>

            {/* Second Button Row */}

          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Button
                style={styles.buttonBlue}
                color={colors.secondary}
                icon={ ({color}) => (<Icon name="chart-line" size={18} color={color} /> )}
                mode="contained"
                uppercase={false} 
                onPress={() => navigation.navigate('CounterSale')}
              > Counter Sale
              </Button>
            </View>
            <View style={{flex:0.08}}></View>
            <View style={{flex:1}}>
              <Button
                style={styles.buttonBlue}
                color="#123038"
                icon={ ({color}) => ( <Icon name={'cubes'} size={20}  color={color} /> ) }
                mode="contained"
                uppercase={false} 
                onPress={() => navigation.navigate('Login')}
                > Stock In
              </Button>
            </View>
          </View>

          {/* Search Bar */}

          <Searchbar
            placeholder="Search here..."
            onChangeText={onChangeSearch}
            value={searchQuery}
          />

          <View style={{flexDirection:'row',  marginTop: 15}}>
            <View style={{flex:1}}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={selectOneFile}>
                {/*Single file selection button*/}
                
                <Icon name="upload" size={18} color={colors.primary} style={styles.downloadIcon} />
                <Text style={{marginRight: 10, fontSize: 18, color: "#000"}}>
                  Upload CSV
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:0.7}}>
              <Button
                  style={styles.buttonBlue}
                  color="#123038"
                  icon={({color}) => (<Icon name="plus" color={color} size={18} />) }
                  mode="contained"
                  onPress={() => navigation.navigate('PartsStack', {screen: 'AddStock'})}
                  uppercase={false} 
                > Add Stock
              </Button>
            </View>

          </View>

            <View style={{flex:1}}>
              <ScrollView>
              {isLoading ? <ActivityIndicator style={{marginVertical: 30}}></ActivityIndicator> :
                <DataTable style={{padding:0,margin:0}}>
                  <DataTable.Header background="#000" style={{padding:0,margin:0}}>
                    <DataTable.Title  background="#000" style={[styles.tableHeader, {flex:1}]}><Text style={styles.tableHeaderText}>(P No.) Name</Text></DataTable.Title>
                    <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>Stocks</Text></DataTable.Title>
                    <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>MRP</Text></DataTable.Title>
                    <DataTable.Title style={[styles.tableHeader, {flex:0.5}]}><Text style={styles.tableHeaderText}>Rack No</Text></DataTable.Title>
                    <DataTable.Title style={[styles.tableHeader, {flex:0.5}]}><Text style={styles.tableHeaderText}>Action</Text></DataTable.Title>
                  </DataTable.Header>

                  {partList?.map((item, i) => {
                    <DataTable.Row>
                      <DataTable.Cell style={{flex:1}}>{item.parts.name}</DataTable.Cell>
                      <DataTable.Cell style={{flex:0.5}} numeric>{item.current_stock}</DataTable.Cell>
                      <DataTable.Cell style={{flex:0.5}} numeric>{item.mrp}</DataTable.Cell>
                      <DataTable.Cell style={{flex:0.5}}>{item.rack_id}</DataTable.Cell>
                      <DataTable.Cell style={{flex:0.5}}><TouchableOpacity onPress={() => {navigation.navigate('EditStock')}}><Icon name="chevron-circle-right" size={18} style={styles.actionArrow} /></TouchableOpacity></DataTable.Cell>
                    </DataTable.Row>
                  })}

                  {/*<DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>70507-METER MACHINE PLEASURE</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>SD 521-SIDE STEND SPL</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>3</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>70507-METER MACHINE PLEASURE</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>3</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                   <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>SD 521-SIDE STEND SPL</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>70507-METER MACHINE PLEASURE</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>SD 521-SIDE STEND SPL</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>70507-METER MACHINE PLEASURE</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  
                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>SD 521-SIDE STEND SPL</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    <DataTable.Cell style={{flex:1}}>70507-METER MACHINE PLEASURE</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>0</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>420</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}> </DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><Icon name="chevron-circle-right" size={18} color={colors.black} style={styles.actionArrow} /></DataTable.Cell>
                  </DataTable.Row> */}
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
              }
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
  tableHeader: {
    // color: colors.primary,
    // backgroundColor: colors.black,
    // padding: 5,
    // margin:0,
    // padding:0,
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

const mapStateToProps = state => ({
  userRole: state.role.user_role,
  userToken: state.user.userToken,
})

export default connect(mapStateToProps)(Parts);
// export default Parts;
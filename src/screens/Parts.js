import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Searchbar, Button, DataTable, Divider } from 'react-native-paper';
import { colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux';
import { API_URL } from "../constants/config";
import { useIsFocused  } from '@react-navigation/native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { FlatList } from 'react-native-gesture-handler';

const Parts = ({ navigation, userToken }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [singleFile, setSingleFile] = useState('');
  const [partList, setPartList] = useState([]);
  const { colors } = useTheme();
  // const optionsPerPage = [2, 3, 4];
  const isFocused = useIsFocused();
  const tableHead = ['(P No.) Name', 'Stock', 'MRP','Rack No', 'Action'];
  const [tableData, setTableData] = useState([]);

  const [filteredPartData, setFilteredPartData] = useState([]);
  const [searchQueryForParts, setSearchQueryForParts] = useState(); 

  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
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
      setIsLoading(true);
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
          // console.log('setPartList', json.data[1].parts.name);
          setPartList(json.data);
          // let values = [];
          // json.data.forEach(item => {
          //   values.push({ 
          //     part_name: item.parts.name, 
          //     current_stock:item.current_stock, 
          //     mrp: item.mrp,
          //     rack_id: item.rack_id,
          //   });
          // });
          setTableData(json.data);
          setFilteredPartData(json.data);
 
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

  const searchFilterForParts = (text) => {
    if (text) {
        let newData = partList.filter(
            function (listData) {
            // let arr2 = listData.phone_number ? listData.phone_number : ''.toUpperCase() 
            let itemData = listData.parts.name ? listData.parts.name.toUpperCase() : ''.toUpperCase()
            // let itemData = arr1.concat(arr2);
            // console.log(itemData);
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

    // useEffect(() => {
    //     getPartList();
    //     // console.log(route?.params?.data);
    // }, []);

    useEffect(() => {
      getPartList();
      // console.log(userRole);
    }, [isFocused]);

    const element = (data, index) => (
      <TouchableOpacity onPress={() => {navigation.navigate('EditStock', {'data': data})}} style={{marginLeft: 20}}>
        <Icon name="chevron-circle-right" size={18} style={styles.actionArrow} />
      </TouchableOpacity>
    );
      {/* <TouchableOpacity onPress={() => console.log(data, index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity> */}
  

    return (
        <View style= {styles.customSurface}>
           
          {/* First Button Row */}

          {/* <View style={{flexDirection:'row'}}>
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
          </View> */}

            {/* Second Button Row */}

          {/* <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Button
                style={styles.buttonBlue}
                color={colors.secondary}
                icon={ ({color}) => (<Icon name="chart-line" size={18} color={color} /> )}
                mode="contained"
                uppercase={false} 
                onPress={() => navigation.navigate('CounterSale')}
              > 
                Counter Sale
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
          </View> */}

          {/* Search Bar */}

          <Searchbar
            placeholder="Search here..."
            onChangeText={(text) => { if(text != null) searchFilterForParts(text)}}
            value={searchQueryForParts}
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
              <View style={styles.container}>
                <Table>
                  <Row 
                    data={tableHead} 
                    style={
                      styles.head 
                      // (tableHead == '(P No.) Name') && {width: 100}
                      } 
                    textStyle={styles.textHeading}
                    flexArr= {[2, 1, 1, 1, 1]}
                  />
             
                    {filteredPartData?.length > 0 ?  
                      <FlatList
                          ItemSeparatorComponent= {() => (<><Divider /><Divider /></>)}
                          data={filteredPartData}
                          // onEndReachedThreshold={1}
                          // style={{borderColor: '#0000000a', borderWidth: 1, maxHeight: 400 }}
                          keyExtractor={item => item.id}
                          renderItem={({item, index}) => (
                            <View style={{flexDirection: 'row', margin: 5}}>
                              <Cell data={item.parts.name} style={{flex: 2}} textStyle={styles.text} />
                              <Cell data={item.current_stock} style={{flex: 1}} textStyle={styles.text} />
                              <Cell data={item.mrp} style={{flex: 1}} textStyle={styles.text} />
                              <Cell data={item.rack_id} style={{flex: 1}} textStyle={styles.text} />
                              <Cell data={element(item, index)} style={{flex: 1}} textStyle={styles.text} />
                            </View>
                          )} 
                      />
                      :
                      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 50,}}>
                          <Text style={{ color: colors.black, textAlign: 'center'}}>No such part is associated!</Text>
                      </View>
                    }
             
                </Table>
              </View>
            }
              {/* <DataTable style={{padding:0,margin:0}}>
                <DataTable.Header background="#000" style={{padding:0,margin:0}}>
                  <DataTable.Title  background="#000" style={[styles.tableHeader, {flex:1}]}><Text style={styles.tableHeaderText}>(P No.) Name</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>Stocks</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]} numeric><Text style={styles.tableHeaderText}>MRP</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]}><Text style={styles.tableHeaderText}>Rack No</Text></DataTable.Title>
                  <DataTable.Title style={[styles.tableHeader, {flex:0.5}]}><Text style={styles.tableHeaderText}>Action</Text></DataTable.Title>
                </DataTable.Header>

                {partList?.map((item, i) => {
                  <DataTable.Row key={i}>
                    <DataTable.Cell style={{flex:1}}>{item.parts.name}</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>{item.current_stock}</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}} numeric>{item.mrp}</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}>{item.rack_id}</DataTable.Cell>
                    <DataTable.Cell style={{flex:0.5}}><TouchableOpacity onPress={() => {navigation.navigate('EditStock')}}><Icon name="chevron-circle-right" size={18} style={styles.actionArrow} /></TouchableOpacity></DataTable.Cell>
                  </DataTable.Row>
                })} 
                  </DataTable> */}
          
            </ScrollView>
          </View>

         


        </View>
      );
   }

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    borderRadius: 5,
    // paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  head: { 
    height: 60,
    backgroundColor: colors.secondary,
    padding: 7, 
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  text: { 
    margin: 6,
    color: colors.black,
    // textAlign: 'center'
  },
  textHeading: { 
    margin: 6,
    color: colors.white 
  },
  row: { 
    flexDirection: 'row',
    padding: 7,  
    // backgroundColor: '#FFF1C1' 
  },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
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
    color: colors.black,
  }
})

const mapStateToProps = state => ({
  userRole: state.role.user_role,
  userToken: state.user.userToken,
})

export default connect(mapStateToProps)(Parts);
// export default Parts;
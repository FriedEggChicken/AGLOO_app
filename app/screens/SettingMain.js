import React, { useState, Component } from "react";
import { FlatList, SafeAreaView, Image,StatusBar, StyleSheet, Text, TouchableOpacity , View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
export default class CommonTable extends Component{
  UNSAFE_componentWillMount(){
    this.starHeaderHeight = 80
    if(Platform.OS == 'android')
    {
      this.starHeaderHeight = 100 + StatusBar.currentHeight
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      st_id: '',
      major: ''
    };  
}
componentDidMount() {
  const userID = this.props.userID
  fetch('http://115.85.183.157:3000/user/'+userID,{method: 'GET' })
          .then((response) => response.json())
          .then((response) => {
            this.setState({
              name: response.name,
              st_id: response.st_id,
              major: response.major
            })
          })
          .catch((error) => {
            console.log(error)
          })
}
LogOut() {
  AsyncStorage.clear()
  // const resetAction = StackActions.reset({
  //   index: 0,
  //   actions: [NavigationActions.navigate({
  //     routeName:'Loginn'
  //   })],
  // })
  // this.props.navigation.dispatch(resetAction)
  
  this.props.navigation.replace("Loginn");
  // AsyncStorage.clear()
}
  render(){
    const userID = this.props.userID
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#aaced7" }}>
      <View style={{backgroundColor: "#aaced7" }}>
          <View
            style={{backgroundColor: "#7dacb7e", paddingTop: 30, }}
          >
            <Text style={{
                  fontSize: 24,
                  paddingTop: 10,
                  fontWeight: "700",
                  textAlign:'center',
                  color : '#fff',
                  borderTopWidth: 1,
              borderTopColor: "#dddddd",
                }}>{userID} 님의 정보</Text>
            <View style={{alignItems:'center',justifyContent:'center',marginTop:30,}}>
            <Image source={require('../../assets/abc.jpg')} style={styles.background}></Image>
            </View>
            <View style={{backgroundColor:'#3A445D',width:'50%',justifyContent:'center',alignSelf:'center'}}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                paddingHorizontal: 20,
                color : '#fff',
                textAlign: 'center',marginTop: 10
              }}
            >{this.state.name}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                paddingHorizontal: 20,
                color : '#fff',
                textAlign: 'center'
              }}
            >{this.state.st_id}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                paddingHorizontal: 20,
                color : '#fff',
                textAlign: 'center'
              }}
            >{this.state.major}
            </Text>
            </View>
            <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.button} onPress = {()=>this.LogOut()}>
            <Text style={styles.buttonText}>
                            LOGOUT
                          </Text>
        </TouchableOpacity>
        </View>
            
          </View>
      </View>
    </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  background:{
    width: 200,
    height: 200,
  },
  user: {
      fontSize:20,
      marginTop:20,
      fontWeight: 'bold',
  },
  button: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: "#3A445D",
    backgroundColor: "#3A445D",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: 50,
    marginTop: 8,
},
buttonArea: {
  width: "100%",
  alignItems: "center",
},
  input:{
    borderWidth:1,
    borderColor: "black",
    backgroundColor: '#aaced7',
    width: '90%',
    height: 39,
    paddingHorizontal: 20,
    fontSize: 25
  },
  buttonText:{
    fontSize : 23,
    color: 'white'
  },
});
import React, {Component} from 'react';
import {View,RefreshControl,Image,Alert,Text,Button,SafeAreaView,StyleSheet,ScrollView,TouchableOpacity,FlatList,ActivityIndicator} from "react-native";
import axios from 'axios';
import Constants from 'expo-constants'
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';
import { RefreshControlComponent } from 'react-native';


export default class BoardScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      refreshing: false,
    }
  }

  componentDidMount () {
    const {club_id} = this.props.route.params
    return fetch('http://115.85.183.157:3000/list/'+club_id+'/act_board',{method: 'GET'})//get 
    .then((response) => response.json())
    .then((response) => {
      this.setState({
        isLoading: false,
        dataSource: response, //list 형태
        refreshing: false
      })
    })
    .catch((error) => {
      console.log(error)
      this.setState({refreshing: false})
    })
  }
  deleteWrites = (idx) => {
    const {club_id} = this.props.route.params
    Alert.alert(
      "글을 지우겠습니까?",
      "",
      [
        {
          text: "예",
          onPress: () =>{
            fetch('http://115.85.183.157:3000/post/act_board/'+idx,{
              method:'DELETE',
            }).then((response) => response.json()).then((response) => {
              if(response.success){
                fetch('http://115.85.183.157:3000/list/'+club_id+'/act_board',{method: 'GET'})
                .then((response) => response.json())
                .then((response) => {
                  this.setState({
                    dataSource: response,
                  })
                })
                .catch((error) => {
                  console.log(error)
                });
                alert('글을 삭제했습니다.')

            }
            else{
              console.log(idx)
                alert(response.msg);
            }
            })
          }
        },
        {
          text: "아니요",
          style: "cancel"
        }
      ],
      {cancelable: true}
    );
  }
  handleRefresh = (() => {
    const {club_id} = this.props.route.params
    this.setState({refreshing: true})
    fetch('http://115.85.183.157:3000/list/'+club_id+'/act_board',{method: 'GET'})//get 
    .then((response) => response.json())
    .then((response) => {
      this.setState({
        isLoading: false,
        dataSource: response,
        refreshing: false
      })
    })
    .catch((error) => {
      console.log(error)
      this.setState({refreshing: false})
    });
  }
  );
  timeBefore(date) {
    var a = new Date();
    const utc = a.getTime() +(a.getTimezoneOffset()*60*1000); //ㅠㅠ
    const kr_time_diff = 540*60000;

    var now = new Date(utc+(kr_time_diff));  //pc표준 시간대 상관없이 한국 시간으로 변환
    var datee = new Date(date)
    var minus;

    if(now.getFullYear() > datee.getFullYear()){
        minus= now.getFullYear()-datee.getFullYear();
  
        return (minus+"년 전")
    }else if(now.getMonth() > datee.getMonth()){
  
        minus= now.getMonth()-datee.getMonth();
        return (minus+"달 전")
    }else if(now.getDate() > datee.getDate()){

        minus= now.getDate()-datee.getDate();
        return (minus+"일 전")
    }else{
     
        var nowTime = now.getTime();
        var date = datee.getTime();
            sec =parseInt(nowTime - date) / 1000;
            day  = parseInt(sec/60/60/24);
            sec = (sec - (day * 60 * 60 * 24));
            hour = parseInt(sec/60/60);
            sec = (sec - (hour*60*60));
            min = parseInt(sec/60);
            sec = parseInt(sec-(min*60));
            if(hour>0){
                return (hour+"시간 전")
            }else if(min>0){
                return (min+"분 전")
            }else if(sec>0){
                return (sec+"초 전")
            }
    }
}

  
    render(){
      const {user_id} = this.props.route.params
      const {member} = this.props.route.params
      const {club_id} = this.props.route.params
      const renderlist = ({item}) => (
      <View style = {styles.item}> 
        <TouchableOpacity onPress = {()=>this.props.navigation.navigate("ContentPictureScreen",{idx:item.idx,user_id:user_id,member:member})}>
          <Text style={styles.writes}>{item.title}</Text>
          <View style={{justifyContent:'center',alignItems:'center'}}>
          {(((item.img != null) && (item.img != ''))) && 
          <Image source = {{uri:'http://115.85.183.157:3000'+item.img}} style = {styles.image}></Image>}
          </View>
          
          {item.updated == item.created ?
            (<Text style={{textAlign:'center',fontSize:18,marginBottom:10,color:'gray'}}>{this.timeBefore(item.created)}</Text>)
          : <Text style={{textAlign:'center',fontSize:18,marginBottom:10,color:'gray'}}>{this.timeBefore(item.updated)} 수정</Text>}                   
          </TouchableOpacity>
        {(user_id == item.id || member == 'admin') &&  <View style={{flex:1,alignItems:'flex-end' ,justifyContent:"center"}}>
        <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={styles.button}
      onPress = {()=>this.deleteWrites(item.idx)}
      >
      <Text style={{color:'white',fontSize:18,fontWeight: 'bold'}}>삭제</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}
      onPress = {()=>this.props.navigation.navigate("FixPictureBoardScreen",{idx:item.idx})}
      >
      <Text style={{color:'white',fontSize:18,fontWeight: 'bold'}}>수정</Text>
      </TouchableOpacity>
      </View>
      </View>}
        </View>
    )

      if(this.state.isLoading) {
        return (<View>
          <ActivityIndicator />
        </View>         
        )
      }
      else {
        return (
          
          <View style={{flex: 1, backgroundColor:"#ebf4f6",paddingTop: Constants.statusBarHeight}}>
        
          <View>
          <FlatList data={this.state.dataSource} 
          renderItem = {renderlist} 
          keyExtractor = {(item,index) => index.toString()} 
          ListHeaderComponent= {() => (
            <View>
              <Text style={styles.firstsquare}>활 동 게 시 판</Text>
              <View style={styles.settingg}>
              {(member == 'admin') && <TouchableOpacity onPress = {()=>this.props.navigation.navigate("MakingPictureBoardScreen",{user_id:user_id,club_id:club_id})}>
          <Text style={styles.buttonText}>📝 작성</Text>
          </TouchableOpacity>}
              </View>
            </View>
            )}
            stickyHeaderIndices = {[0]}
            refreshing = {this.state.refreshing}
            onRefresh = {this.handleRefresh}
          />

            </View>
          </View>
        )
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
  },
  firstsquare: {
    borderWidth:2,
    borderColor:'#76b0be', 
    backgroundColor:'#76b0be', 
    color:'white',
    textAlign:"center",
    fontSize:25,
    fontWeight: "bold",
  },
    item: {
      borderBottomWidth : 1,
      borderBottomColor : "#a7b4c9"
    },
    settingg: {
      position:'absolute',
      right:20,
      bottom: 5
    },
    settinggg: {
      alignItems:"flex-end" ,
      justifyContent:"flex-end",
      paddingTop: Constants.statusBarHeight,
      marginRight: 10,
      marginBottom: 10
    },
    writes:{
      textAlign:'center',
      fontSize: 25,
      fontWeight: 'bold'
    },
    writess:{
      fontSize: 20,
    },
      buttonText: {
        fontSize : 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'white',
      },
      button:{
        borderWidth: 2,
        borderColor : "#3A445D",
        backgroundColor: "#3A445D",
        opacity:0.7,
        justifyContent: "center",
        alignItems: "center",
        width: "15%"
      },
      image: {
        width:250,
        height: 250,
        resizeMode: 'contain'
    }
  });
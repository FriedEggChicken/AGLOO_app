import React, {Component} from 'react';
import {View,ImageBackground,Alert,Text,Button,StyleSheet,ScrollView,TouchableOpacity,SafeAreaView,FlatList,ActivityIndicator} from "react-native";
import axios from 'axios';
import Constants from 'expo-constants'
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';
import { TextInput } from 'react-native-gesture-handler';

export default class ContentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dataSource: '',
          inputcomment: '',
          ccomment: []
        }
      }

      componentDidMount () {
        const {idx} = this.props.route.params || ''
        return fetch('http://115.85.183.157:3000/post/free_board/'+idx,{method: 'GET'})
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            dataSource: response, //list 형태
          })
        })
        .catch((error) => {
          console.log(error)
        });
      }

      postcontent() {
        const {ccomment} = this.state
        this.setState({ccomment:ccomment.concat('hello')})
      }

    render(){
      const rendercomment = ({item}) => (
        <View>
            <Text>{item}</Text>
        </View>
    )
        return (
          <View style={{flex: 1, backgroundColor:"#aaced7"}}>
          <StickyHeaderFooterScrollView showsVerticalScrollIndicator={false} makeScrollable = {true} renderStickyFooter={() => (
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:5}}>
             <TextInput style={styles.input} placeholder = "댓글" 
             onChangeText={inputcomment => this.setState({inputcomment})}/>
            <TouchableOpacity style = {styles.button} onPress = {()=>{this.postcontent}}>
        <Text style={styles.buttonText}>작성</Text>
        </TouchableOpacity>
        </View>
        )}>
            <View style={styles.setting}>
            <ImageBackground source={require('../../../../assets/pp.png')} style={styles.background}/>
            <Text style={styles.htitle}>{this.state.dataSource.title}</Text>
        <Text style={styles.user}>작성자: {this.state.dataSource.writer}</Text>
        <View style={{marginTop:10,justifyContent:'space-around'}}>
          <View style={{flexDirection:'column'}}>
        <Text>생성: {this.state.dataSource.created} </Text>
        {this.state.dataSource.updated != this.state.dataSource.created && <Text>수정: {this.state.dataSource.updated}</Text>}
        <Text>조회수: {this.state.dataSource.hit} </Text>
        </View>
        </View>
        </View>
        <Text style={styles.hcontent}>{this.state.dataSource.content}</Text>
        <View style={styles.commentbox}>
        {
                        this.state.ccomment.length ?
                        (<FlatList data={this.state.ccomment}
                            renderItem = {rendercomment} keyExtractor = {(item,index) => index.toString()} 
                            />
        
                        ) : <Text style={{fontSize:20,textAlign:'center'}}>댓글이 없습니다</Text>
                    }
        </View>
        </StickyHeaderFooterScrollView>
        </View>
        )
}
}
const styles = StyleSheet.create({
    setting: {
      paddingTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight, //statusbar 안겹치게
      borderWidth:2,
      borderColor:'#76b0be', 
      backgroundColor:'#76b0be', 
    },
    background:{
      width: 100,
      height: 100,
      position:'absolute',
      alignSelf:'flex-end',
      bottom: 10,
      right: 15,
      opacity: 0.5
    },
    user: {
        fontSize:20,
        marginTop:20,
        fontWeight: 'bold',
    },
    htitle: {
      textAlign:'center',
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold',
        borderColor : "#3A445D",
         backgroundColor: "#3A445D",
         color:'white',
         opacity: 0.8
    },
    hcontent: {
        marginTop:15,
        fontSize:17
    },
    input:{
      borderWidth:2,
      borderColor: "gray",
      width: '88%',
      height: 39,
      paddingHorizontal: 20,
      fontSize: 25
    },
    buttonText:{
      fontSize : 23,
      color: 'white'
    },
    button:{
      justifyContent: "center",
      alignItems: "center",
      height:39,
      borderColor : "#3A445D",
    backgroundColor: "#3A445D",
    },
    commentbox:{
      borderColor:'#76b0be', 
      backgroundColor:'#76b0be',
      marginTop: 50
    }
})
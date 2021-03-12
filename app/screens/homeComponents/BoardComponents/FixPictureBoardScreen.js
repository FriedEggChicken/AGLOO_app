import React,{Component} from "react";
import {View,Text,Image,TextInput,Keyboard,FlatList,StyleSheet,Button,TouchableOpacity} from "react-native";
import axios from "axios";
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from "react-native-gesture-handler";

export default class Write extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dataSource: '',
          title: '',
          content: '',
          setSelected: '',
          img: []
        }
      }
      componentDidMount () {
        const {idx} = this.props.route.params
        return fetch('http://115.85.183.157:3000/post/act_board/'+idx,{method: 'GET'})
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            dataSource: response, //list 형태
            setSelected: response.img
          })
        })
        .catch((error) => {
          console.log(error)
        });
      }
      openImage = async() => {
        let permission = await ImagePicker.requestCameraPermissionsAsync();

        if(permission.granted === false){
            return;
        }
        
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result)

        if (!result.cancelled) {
            this.setState({ img: result ,setSelected: ''});
        }
    }

    updateBoard = () => {
      const {idx} = this.props.route.params
      const data = new FormData();
        if(this.state.title == ''){
            this.setState({alarm:'제목을 입력하세요'})
        }
        else if(this.state.content == ""){
            this.setState({alarm:'내용을 입력하세요'})
        }
        else{
            if(this.state.img.length != 0){
                let localUri = this.state.img.uri;
                let filename = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                data.append("img", {
                    uri: localUri,
                    name: filename,
                    type,
                });}
                data.append("title",this.state.title)
                data.append("content",this.state.content)
        fetch('http://115.85.183.157:3000/post/act_board/'+idx,{
            method: 'PATCH',
            body:data,
            headers: {
                "content-type": "multipart/form-data",
            },
        })
        .then((response) => response.json())
        .then((response)=>{
            if(response.success){
                this.props.navigation.navigate("PictureBoardScreen");
            }else{
                alert(response.msg);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
        Keyboard.dismiss();
    };

    render() {

        return(
          <View style={{flex: 1, backgroundColor:"#ebf4f6"}}>
            <ScrollView>
                <View style={styles.setting}>
                    <Text style={styles.topp}>게시글 수정</Text>
                <View>
                    <Text style={{color:'red',alignSelf: 'center'}}>{this.state.alarm}</Text>
                </View>
                {
                        this.state.setSelected !== '' ?
                        (<Image source = {{uri:'http://115.85.183.157:3000'+this.state.setSelected}} style = {styles.image}></Image>
        
                        ) : <Image source = {{uri:this.state.img.uri}} style = {styles.image}></Image>
                    }
                <View style={styles.writingform}>
                    <TextInput style={styles.input} defaultValue={this.state.dataSource.title}
                    onChangeText={title => this.setState({title})}/>
                    <TextInput style={styles.contentinput} defaultValue={this.state.dataSource.content}
                    multiline = {true} 
                    blurOnSubmit={true}
                    onChangeText={content => this.setState({content})}/>
                </View>
                <View style={styles.buttonarea}>
                    <TouchableOpacity
                    style = {styles.button}
                    onPress = {this.updateBoard}
                    >
                        <Text style = {styles.buttonText}>🖍  수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style = {styles.button}
                    onPress = {this.openImage}
                    >
                        <Text style = {styles.buttonText}>🔗  사진</Text>
                    </TouchableOpacity>
                </View>
                </View>
                </ScrollView>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    setting: {
      alignItems :"center",
      paddingTop: Constants.statusBarHeight
    },
    topp: {
      fontSize: 25, 
      borderWidth:2,
      borderColor:'#76b0be', 
      backgroundColor:'#76b0be', 
      width:"100%",
      textAlign: 'center',
      color: 'white',
      fontWeight: "bold",
  },
    writingform: {
        width: '100%',
        alignItems: "center"
    },
    input:{
        borderWidth: 2,
        borderColor: "#484a49",
        borderRadius: 6,
        width: '100%',
        height: 50,
        marginTop: 8,
        paddingHorizontal: 20,
        fontSize: 25
      },
      contentinput:{
        borderWidth: 2,
        borderColor: "#484a49",
        borderRadius: 6,
        width: '100%',
        height: 400,
        marginTop: 8,
        paddingHorizontal: 20,
        fontSize: 20,
        textAlignVertical: 'top'
      },
      button:{
        borderWidth: 2,
        borderColor : "#3A445D",
        backgroundColor: "#3A445D",
        opacity:0.7,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        width: "100%"
      },
      buttonarea:{
        width : '20%',
        alignItems :"center",
        justifyContent: "center",
        flexDirection: "row"
      },
      buttonText: {
        fontSize : 20,
        color:'white',
        textAlign:'center'
      },
      image: {
        width:150,
        height: 150,
        resizeMode: 'contain'
    }
  });